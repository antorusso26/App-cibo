"""Utilità condivise dagli scraper: sessione HTTP educata e normalizzazione prodotti."""
from __future__ import annotations

import re
import time
import unicodedata

import requests

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36")

# Pausa fra una richiesta e l'altra: non tempestiamo di richieste i siti.
DELAY = 0.8


def make_session(extra_headers=None):
    s = requests.Session()
    s.headers.update({"User-Agent": UA, "Accept-Language": "it-IT,it;q=0.9"})
    if extra_headers:
        s.headers.update(extra_headers)
    return s


def polite_get(session, url, **kwargs):
    time.sleep(DELAY)
    r = session.get(url, timeout=30, **kwargs)
    r.raise_for_status()
    return r


def polite_post(session, url, **kwargs):
    time.sleep(DELAY)
    r = session.post(url, timeout=30, **kwargs)
    r.raise_for_status()
    return r


def normalize(text):
    """Minuscolo e senza accenti, per confronti robusti."""
    if not text:
        return ""
    text = unicodedata.normalize("NFD", str(text))
    text = "".join(c for c in text if unicodedata.category(c) != "Mn")
    return text.lower().strip()


_QTY_PATTERNS = [
    # 4x125 g, 3 x 0,75 l
    (re.compile(r"(\d+)\s*[x×]\s*(\d+(?:[.,]\d+)?)\s*(kg|g|gr|grammi|l|lt|litri|ml|cl)\b"), "multi"),
    (re.compile(r"(\d+(?:[.,]\d+)?)\s*(kg|g|gr|grammi|l|lt|litri|ml|cl)\b"), "single"),
    # Coop scrive l'unità prima del numero: "G 300", "Kg 1", "Ml 500"
    (re.compile(r"\b(kg|gr|g|ml|cl|lt|l)\s*(\d+(?:[.,]\d+)?)\b"), "reversed"),
    (re.compile(r"(\d+)\s*(pz|pezzi|uova|bustine|capsule|fette|rotoli)\b"), "pieces"),
]

_TO_KG = {"kg": 1.0, "g": 0.001, "gr": 0.001, "grammi": 0.001}
_TO_L = {"l": 1.0, "lt": 1.0, "litri": 1.0, "ml": 0.001, "cl": 0.01}


def parse_quantity(name):
    """Estrae la quantità dal nome prodotto. Ritorna (valore, unita) con unita in kg/l/pz."""
    text = normalize(name).replace("°", " ")
    for pattern, kind in _QTY_PATTERNS:
        for m in pattern.finditer(text):
            value, unit = _from_match(m, kind)
            if value:  # "Tipo 00 Kg 1" non deve diventare 0 kg
                return value, unit
    return None, None


def _from_match(m, kind):
    if kind == "pieces":
        return float(m.group(1)), "pz"
    if kind == "multi":
        count = float(m.group(1))
        value = float(m.group(2).replace(",", "."))
        unit = m.group(3)
    elif kind == "reversed":
        count = 1.0
        unit = m.group(1)
        value = float(m.group(2).replace(",", "."))
    else:
        count = 1.0
        value = float(m.group(1).replace(",", "."))
        unit = m.group(2)
    if unit in _TO_KG:
        return round(count * value * _TO_KG[unit], 4), "kg"
    if unit in _TO_L:
        return round(count * value * _TO_L[unit], 4), "l"
    return None, None


def unit_price(price, quantity, unit):
    if not price or not quantity or quantity <= 0 or unit not in ("kg", "l", "pz"):
        return None
    return round(price / quantity, 2)


def make_product(chain, name, price, **kw):
    """Struttura comune a tutte le catene."""
    quantity = kw.get("quantity")
    unit = kw.get("unit")
    if quantity is None:
        quantity, unit = parse_quantity(name)
    item = {
        "catena": chain,
        "nome": name.strip(),
        "marca": (kw.get("brand") or "").strip() or None,
        "prezzo": round(float(price), 2),
        "prezzoPieno": round(float(kw["full_price"]), 2) if kw.get("full_price") else None,
        "quantita": quantity,
        "unita": unit,
        "prezzoUnitario": kw.get("unit_price") or unit_price(price, quantity, unit),
        "url": kw.get("url"),
        "immagine": kw.get("image"),
        "barcode": kw.get("barcode"),
        "categoria": kw.get("category"),
        "validoDal": kw.get("valid_from"),
        "validoAl": kw.get("valid_to"),
    }
    item["inOfferta"] = bool(item["prezzoPieno"] and item["prezzoPieno"] > item["prezzo"])
    if item["inOfferta"]:
        item["sconto"] = round(100 * (1 - item["prezzo"] / item["prezzoPieno"]))
    return item
