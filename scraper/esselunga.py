"""Esselunga — spesaonline.esselunga.it

Il sito è una SPA che legge i dati da /commerce/resources: chiediamo gli stessi
dati, una categoria alla volta. Prezzi "generali" (nessun negozio selezionato).
"""
from __future__ import annotations

from common import make_product, make_session, polite_get, polite_post

BASE = "https://spesaonline.esselunga.it/commerce/resources"
PAGE = 100

# Categorie alimentari utili per gli ingredienti dell'app (id del menu del sito).
CATEGORIE = {
    "frutta": 600000001047175,
    "verdura": 600000001047177,
    "latte-yogurt-uova": 600000001047248,
    "formaggi": 600000001047244,
    "salumi": 600000001047246,
    "pasta-riso-sughi": 600000001047712,
    "pollo-e-tacchino": 600000001045643,
    "bovino-e-vitello": 600000001045605,
    "suino-e-salsicce": 600000001045647,
    "carne": 300000001002007,
    "pesce": 300000001002027,
    "pesce-surgelato": 300000001002079,
    "tonno-naturale": 300000001002443,
    "tonno-olio": 300000001002444,
    "pesce-e-carne-in-scatola": 300000001002442,
    "pane-e-panini": 300000001002051,
    "pane-a-fette": 300000001002052,
    "pane-grattugiato": 300000001002059,
    "farina": 300000001002437,
    "farina-pizza": 300000001002439,
    "zucchero": 600000001047700,
    "cacao-e-zucchero": 600000001047665,
    "lievito": 600000001035440,
    "miele": 600000001047654,
    "olive": 300000001002418,
    "capperi": 300000001002422,
    "spezie-e-aromi": 300000001002518,
    "funghi": 300000001002419,
    "legumi-secchi": 300000001002531,
    "legumi-in-scatola": 300000001002532,
    "passate": 600000001047765,
    "pelati": 600000001047768,
    "avena": 300000001021053,
    "frutta-secca": 600000001047201,
    "verdura-surgelata": 300000001002077,
}


def _session():
    # Senza sessione il sito richiede questo header, altrimenti risponde 401.
    return make_session({"Accept": "application/json", "X-PAGE-PATH": "supermercato"})


def _product_set_ids(session, menu_id):
    menu = polite_get(session, "{}/menu/{}".format(BASE, menu_id)).json()
    return [m["pk"]["productSetId"] for m in menu.get("menuItemProductSets", [])]


def _fetch_page(session, menu_id, set_ids, start):
    body = {"productSetIds": set_ids, "start": start, "length": PAGE,
            "filters": [], "menuItemId": menu_id}
    return polite_post(session, "{}/displayable/productset".format(BASE), json=body).json()


def _to_product(entity, categoria):
    price = entity.get("discountedPrice") or entity.get("price")
    if not price:
        return None
    full = entity.get("price")
    code = entity.get("code")
    slug = entity.get("sanitizeDescription") or ""
    url = ("https://spesaonline.esselunga.it/commerce/nav/supermercato/store/prodotto/{}/{}"
           .format(code, slug)) if code else None
    # "1,89 € / kg" -> prezzo unitario e unità, senza doverlo ricavare dal nome
    quantity = unit = unit_price = None
    label = (entity.get("label") or "").replace("\xa0", " ").strip()
    if "/" in label:
        left, right = label.split("/", 1)
        try:
            unit_price = float(left.replace("€", "").strip().replace(".", "").replace(",", "."))
        except ValueError:
            unit_price = None
        right = right.strip().lower()
        # "0,04 € / g" va riportato al chilo, altrimenti i confronti impazziscono
        fattori = {"kg": ("kg", 1), "g": ("kg", 1000), "gr": ("kg", 1000),
                   "l": ("l", 1), "lt": ("l", 1), "ml": ("l", 1000), "cl": ("l", 100),
                   "pz": ("pz", 1)}
        if right in fattori and unit_price:
            unit, fattore = fattori[right]
            unit_price = round(unit_price * fattore, 2)
        else:
            unit = unit_price = None
    if unit_price and unit and price:
        quantity = round(price / unit_price, 4)
    return make_product(
        "esselunga", entity.get("description") or "", price,
        full_price=full if full and full > price else None,
        brand=entity.get("brand"), url=url, image=entity.get("imageURL"),
        barcode=entity.get("barcode"), category=categoria,
        quantity=quantity, unit=unit, unit_price=unit_price,
    )


def scarica(log=print):
    """Scarica il catalogo alimentare. Ritorna una lista di prodotti normalizzati."""
    session = _session()
    prodotti = []
    for categoria, menu_id in CATEGORIE.items():
        try:
            set_ids = _product_set_ids(session, menu_id)
            if not set_ids:
                log("  ! {}: nessun set di prodotti".format(categoria))
                continue
            start, totale = 0, None
            while True:
                data = _fetch_page(session, menu_id, set_ids, start)
                entities = data.get("entities") or []
                totale = data.get("rowCount", len(entities))
                for e in entities:
                    p = _to_product(e, categoria)
                    if p:
                        prodotti.append(p)
                start += PAGE
                if start >= totale or not entities:
                    break
            log("  {}: {} prodotti".format(categoria, totale))
        except Exception as exc:  # una categoria rotta non deve fermare tutto
            log("  ! {}: {}".format(categoria, exc))
    # Lo stesso prodotto può stare in più categorie
    unici = {}
    for p in prodotti:
        unici.setdefault(p.get("barcode") or p["nome"], p)
    return list(unici.values())


if __name__ == "__main__":
    items = scarica()
    print(len(items), "prodotti")
    for p in items[:5]:
        print(p)
