#!/usr/bin/env python3
"""Billbee <-> HLZ-DATA Abgleich (nur lesen und Status setzen, keine Zugangsdaten im Code).

  fetch  [--days 60]      offene Bestellungen aus Billbee als HLZ-DATA-Bestellungen (JSON)
  states ID,ID,...        aktueller Billbee-Status je Bestellung (BillBeeOrderId)
  ship   ID,ID,...        Bestellungen in Billbee auf "Versendet" setzen
  month  YYYY-MM [--out DIR]  Bestellnummern + Datum je SKU fuer stats/etsy und stats/shopify (Dateien in DIR)

Umgebung:
  BILLBEE_KEY            API-Key (Pflicht)
  BILLBEE_USER, BILLBEE_PASS   Login und API-Passwort. Fehlen sie, setzt der Proxy die Anmeldung selbst.
"""
import argparse, base64, json, os, sys, time, urllib.request, urllib.error
from datetime import datetime, timedelta, timezone

BASE = "https://app.billbee.io/api/v1"
OPEN = (1, 2, 3)   # Bestellt, Bestätigt, Zahlung erhalten
SHIPPED = 4


def call(method, path, body=None):
    h = {"X-Billbee-Api-Key": os.environ["BILLBEE_KEY"], "Accept": "application/json", "Content-Type": "application/json"}
    if os.environ.get("BILLBEE_USER") and os.environ.get("BILLBEE_PASS"):
        h["Authorization"] = "Basic " + base64.b64encode(f"{os.environ['BILLBEE_USER']}:{os.environ['BILLBEE_PASS']}".encode()).decode()
    req = urllib.request.Request(BASE + path, data=json.dumps(body).encode() if body is not None else None, headers=h, method=method)
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=40) as r:
                t = r.read().decode()
                return json.loads(t) if t.strip() else {}
        except urllib.error.HTTPError as e:
            if e.code == 429:
                time.sleep(int(e.headers.get("Retry-After", "5")) + 1); continue
            raise SystemExit(f"Billbee {method} {path}: HTTP {e.code} {e.read().decode()[:200]}")
    raise SystemExit("Billbee: zu viele Anfragen")


def app_order(o):
    seller = (o.get("Seller") or {}).get("Platform") or ""
    num = str(o.get("OrderNumber") or o.get("Id") or "")
    digits = "".join(c for c in num if c.isdigit())
    bb = o.get("BillBeeOrderId")
    if seller.lower() == "etsy" and digits: oid, src, no = "etsy-" + digits, "etsy", digits
    elif seller.lower() == "shopify" and digits: oid, src, no = "shop-" + digits, "shopify", "#" + digits
    else: oid, src, no = f"bb-{bb}", "billbee", num
    lines = []
    for it in o.get("OrderItems") or []:
        p = it.get("Product") or {}
        q = it.get("Quantity") or 0
        if q <= 0 or it.get("IsCoupon") or (it.get("TotalPrice") or 0) < 0: continue   # Rabatte und Gutschriften sind keine Ware
        attrs = it.get("Attributes") or []
        variant = " · ".join(f"{a.get('Name')}: {a.get('Value')}" for a in attrs if a.get("Value"))
        lines.append({"sku": p.get("SKU") or "", "title": p.get("Title") or "", "variant": variant, "qty": q, "price": round(((it.get("TotalPrice") or 0) / q), 2), "aid": ""})
    return {"id": oid, "src": src, "no": no, "at": (o.get("CreatedAt") or "")[:10], "shipBy": (o.get("ShipBy") or "")[:10] if o.get("ShipBy") else "",
            "total": round(o.get("TotalCost") or 0, 2), "country": ((o.get("ShippingAddress") or {}).get("CountryISO2") or ""), "status": "offen",
            "manual": False, "lines": lines, "bb": bb, "bbState": o.get("State"),
            "bbShip": " ".join(x for x in [o.get("ShippingProviderName"), o.get("ShippingProviderProductName")] if x)}


def fetch(days):
    since = (datetime.now(timezone.utc) - timedelta(days=days)).strftime("%Y-%m-%d")
    out, seen = [], set()
    for st in OPEN:
        page = 1
        while True:
            d = call("GET", f"/orders?orderStateId={st}&minOrderDate={since}&pageSize=50&page={page}")
            for o in d.get("Data") or []:
                # Gutschriften/Stornos (negativer Betrag) und leere Bestellungen überspringen
                if (o.get("TotalCost") or 0) <= 0: continue
                a = app_order(o)
                if not a["lines"] or a["id"] in seen: continue
                seen.add(a["id"]); out.append(a)
            if page >= (d.get("Paging") or {}).get("TotalPages", 1): break
            page += 1
    return out


def month_numbers(ym, outdir):
    """Alle Bestellungen eines Monats (auch versendete): Bestellnummer + Datum je Artikel-SKU, als Update-Dateien fuer stats/etsy und stats/shopify."""
    y, m = int(ym[:4]), int(ym[5:7]); nxt = f"{y + (m == 12)}-{(m % 12) + 1:02d}-01"
    res = {"etsy": {}, "shopify": {}}; allk = {}; page = 1; n = 0
    while True:
        d = call("GET", f"/orders?minOrderDate={ym}-01&maxOrderDate={nxt}&pageSize=250&page={page}")
        for o in d.get("Data") or []:
            if o.get("State") in (6, 8) or (o.get("TotalCost") or 0) <= 0: continue   # gelöscht, storniert, Gutschriften
            seller = ((o.get("Seller") or {}).get("Platform") or "").lower()
            a = app_order(o); at = (o.get("CreatedAt") or "")[:10]
            if not a["at"].startswith(ym): continue
            n += 1
            for l in a["lines"]:
                key = "-".join(str(l["sku"]).strip().lower().split()).replace("_", "-")
                if not key: continue
                e = allk.setdefault(key, {"q": 0, "n": []}); e["q"] += l["qty"]
                if not any(x.split("|")[0] == a["no"] for x in e["n"]): e["n"].append(f"{a['no']}|{at}")
                if seller not in res: continue
                lst = res[seller].setdefault(key, [])
                t = f"{a['no']}|{at}"
                if not any(x.split("|")[0] == a["no"] for x in lst): lst.append(t)
        if page >= (d.get("Paging") or {}).get("TotalPages", 1): break
        page += 1
    os.makedirs(outdir, exist_ok=True)
    for src, ks in res.items():
        with open(os.path.join(outdir, src + ".json"), "w", encoding="utf-8") as f:
            json.dump({"months": {ym: {"k": {k: {"n": v} for k, v in ks.items()}}}}, f, ensure_ascii=False)
    with open(os.path.join(outdir, "billbee.json"), "w", encoding="utf-8") as f:   # alle Kanäle inkl. Menge: Grundlage für die Rechnung Thomas
        json.dump({"id": "billbee", "months": {ym: {"k": allk, "orders": n}}}, f, ensure_ascii=False)
    return {"orders": n, "etsy_skus": len(res["etsy"]), "shopify_skus": len(res["shopify"]), "dir": outdir}


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("cmd", choices=["fetch", "states", "ship", "month"]); ap.add_argument("ids", nargs="?", default=""); ap.add_argument("--days", type=int, default=60); ap.add_argument("--out", default="stats_out")
    a = ap.parse_args()
    if "BILLBEE_KEY" not in os.environ: sys.exit("BILLBEE_KEY fehlt")
    ids = [x for x in a.ids.split(",") if x.strip()]
    if a.cmd == "month": print(json.dumps(month_numbers(a.ids, a.out), ensure_ascii=False)); return
    if a.cmd == "fetch": print(json.dumps({"orders": fetch(a.days)}, ensure_ascii=False))
    elif a.cmd == "states": print(json.dumps({i: (call("GET", f"/orders/{i}").get("Data") or {}).get("State") for i in ids}))
    else:
        res = {}
        for i in ids:
            call("PUT", f"/orders/{i}/orderstate", {"NewStateId": SHIPPED}); res[i] = "ok"
        print(json.dumps(res))


if __name__ == "__main__":
    main()
