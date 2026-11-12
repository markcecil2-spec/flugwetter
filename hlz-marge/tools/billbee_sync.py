#!/usr/bin/env python3
"""Billbee <-> HLZ-Dashboard Abgleich (nur lesen und Status setzen, keine Zugangsdaten im Code).

  fetch  [--days 60]      offene Bestellungen aus Billbee als HLZ-Dashboard-Bestellungen (JSON)
  states ID,ID,...        aktueller Billbee-Status je Bestellung (BillBeeOrderId)
  ship   ID,ID,...        Bestellungen in Billbee auf "Versendet" setzen

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


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("cmd", choices=["fetch", "states", "ship"]); ap.add_argument("ids", nargs="?", default=""); ap.add_argument("--days", type=int, default=60)
    a = ap.parse_args()
    if "BILLBEE_KEY" not in os.environ: sys.exit("BILLBEE_KEY fehlt")
    ids = [x for x in a.ids.split(",") if x.strip()]
    if a.cmd == "fetch": print(json.dumps({"orders": fetch(a.days)}, ensure_ascii=False))
    elif a.cmd == "states": print(json.dumps({i: (call("GET", f"/orders/{i}").get("Data") or {}).get("State") for i in ids}))
    else:
        res = {}
        for i in ids:
            call("PUT", f"/orders/{i}/orderstate", {"NewStateId": SHIPPED}); res[i] = "ok"
        print(json.dumps(res))


if __name__ == "__main__":
    main()
