"""Lidl — lidl.it

In Italia Lidl non vende alimentari online: il sito pubblica le offerte della
settimana. Prendiamo quelle, con le date di validità, dalla stessa API che usa
il pulsante "Visualizza altri prodotti".
"""
from __future__ import annotations

import datetime as dt

from common import make_product, make_session, polite_get

API = "https://www.lidl.it/q/api/search"
CATEGORIA_CIBO = "10068374"  # "Cibo e bevande"
PAGE = 48


def _session():
    return make_session({"Accept": "*/*", "Referer": "https://www.lidl.it/c/cibo-e-bevande/s10068374"})


def _date(ts):
    if not ts:
        return None
    try:
        return dt.datetime.utcfromtimestamp(int(ts)).date().isoformat()
    except (TypeError, ValueError):
        return None


def _to_product(item):
    data = (item.get("gridbox") or {}).get("data") or {}
    prezzi = data.get("price") or {}
    prezzo = prezzi.get("price")
    if not prezzo or data.get("category") != "Food":
        return None
    stock = data.get("stockAvailability") or {}
    valido_dal = valido_al = None
    for blocco in (stock.get("badgeInfoV2") or []):
        valido_dal = valido_dal or _date(blocco.get("validFrom"))
    # "1 kg = 3.58 €" -> prezzo al chilo
    unit_price = unit = None
    base = ((prezzi.get("basePrice") or {}).get("text") or "").replace(",", ".")
    if "=" in base:
        sinistra, destra = base.split("=", 1)
        try:
            unit_price = float("".join(c for c in destra if c.isdigit() or c == ".").rstrip("."))
        except ValueError:
            unit_price = None
        sinistra = sinistra.lower()
        unit = "kg" if "kg" in sinistra else ("l" if " l" in sinistra or "1 l" in sinistra else None)
    nome = data.get("fullTitle") or ""
    confezione = (prezzi.get("packaging") or {}).get("text") or ""
    quantity = None
    if unit_price and unit:
        quantity = round(prezzo / unit_price, 4)
    path = data.get("canonicalPath")
    return make_product(
        "lidl", nome, prezzo,
        full_price=prezzi.get("oldPrice"),
        brand=(data.get("brand") or {}).get("name"),
        url="https://www.lidl.it{}".format(path) if path else None,
        image=data.get("image"),
        category="offerte",
        quantity=quantity, unit=unit, unit_price=unit_price,
        valid_from=valido_dal,
    ) if nome else None


def scarica(log=print):
    """Scarica le offerte alimentari della settimana."""
    session = _session()
    prodotti, offset = [], 0
    while True:
        params = {"offset": offset, "fetchsize": PAGE, "locale": "it_IT",
                  "assortment": "IT", "version": "2.1.0", "category.id": CATEGORIA_CIBO}
        data = polite_get(session, API, params=params).json()
        items = data.get("items") or []
        for it in items:
            p = _to_product(it)
            if p:
                prodotti.append(p)
        totale = data.get("numFound") or 0
        offset += PAGE
        log("  offerte scaricate: {}/{}".format(min(offset, totale), totale))
        if offset >= totale or not items:
            break
    return prodotti


if __name__ == "__main__":
    items = scarica()
    print(len(items), "offerte")
    for p in items[:5]:
        print(p)
