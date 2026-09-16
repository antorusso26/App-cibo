"""Coop — easycoop.com (la spesa online di Coop Alleanza 3.0)

Il sito espone una normale API GraphQL di Magento: chiediamo i prodotti che
servono con una ricerca per parola chiave, un ingrediente alla volta.
"""
from __future__ import annotations

from common import make_product, make_session, polite_post
from ingredienti import INGREDIENTI

ENDPOINT = "https://www.easycoop.com/graphql"
PAGE = 40

QUERY = """
query Cerca($q: String!, $page: Int!, $size: Int!) {
  products(search: $q, pageSize: $size, currentPage: $page) {
    total_count
    items {
      sku
      name
      url_key
      small_image { url }
      price_range {
        minimum_price {
          regular_price { value }
          final_price { value }
          discount { percent_off }
        }
      }
    }
  }
}
"""


def _session():
    return make_session({"Content-Type": "application/json", "Store": "c_901"})


def _to_product(item, categoria):
    prezzi = (item.get("price_range") or {}).get("minimum_price") or {}
    final = (prezzi.get("final_price") or {}).get("value")
    regular = (prezzi.get("regular_price") or {}).get("value")
    if not final:
        return None
    url_key = item.get("url_key")
    return make_product(
        "coop", item.get("name") or "", final,
        full_price=regular if regular and regular > final else None,
        url="https://www.easycoop.com/{}.html".format(url_key) if url_key else None,
        image=((item.get("small_image") or {}).get("url")),
        category=categoria,
    )


def scarica(log=print, ingredienti=None):
    """Cerca su Coop i prodotti per ogni ingrediente configurato."""
    session = _session()
    ingredienti = ingredienti or INGREDIENTI
    prodotti = []
    for ing_id, conf in ingredienti.items():
        termine = conf.get("q") or ing_id
        try:
            body = {"query": QUERY, "variables": {"q": termine, "page": 1, "size": PAGE}}
            data = polite_post(session, ENDPOINT, json=body).json()
            items = (((data.get("data") or {}).get("products") or {}).get("items")) or []
            for it in items:
                p = _to_product(it, ing_id)
                if p:
                    prodotti.append(p)
            log("  {}: {} risultati per '{}'".format(ing_id, len(items), termine))
        except Exception as exc:
            log("  ! {}: {}".format(ing_id, exc))
    unici = {}
    for p in prodotti:
        unici.setdefault(p["nome"], p)
    return list(unici.values())


if __name__ == "__main__":
    items = scarica()
    print(len(items), "prodotti")
    for p in items[:5]:
        print(p)
