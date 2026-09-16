"""Aggiorna data/prezzi.json con i prezzi dei supermercati.

    python3 scraper/run.py            # tutte le catene
    python3 scraper/run.py --solo coop
    python3 scraper/run.py --catalogo # salva anche i cataloghi grezzi

Cosa otteniamo da chi:
  Esselunga  prezzi di listino + promozioni (catalogo online nazionale)
  Coop       prezzi di listino + sconti (EasyCoop, Coop Alleanza 3.0)
  Lidl       offerte della settimana (Lidl non vende alimentari online in Italia)
  Conad      nessun prezzo pubblico: il loro sito li mostra solo dopo aver
             superato un controllo anti-bot, che non aggiriamo. Il prezzo Conad
             è quindi una stima (mediana delle altre catene), marcata come tale.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import re
import statistics
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from common import normalize  # noqa: E402
from ingredienti import INGREDIENTI  # noqa: E402

RADICE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
USCITA = os.path.join(RADICE, "data", "prezzi.json")

CATENE = [
    {"id": "esselunga", "nome": "Esselunga", "fonte": "spesaonline.esselunga.it", "tipo": "prezzi"},
    {"id": "coop", "nome": "Coop", "fonte": "easycoop.com (Coop Alleanza 3.0)", "tipo": "prezzi"},
    {"id": "lidl", "nome": "Lidl", "fonte": "lidl.it", "tipo": "offerte",
     "nota": "Lidl pubblica solo le offerte della settimana"},
    {"id": "conad", "nome": "Conad", "fonte": "stima", "tipo": "stima",
     "nota": "Conad non pubblica i prezzi senza negozio: valore stimato dalle altre catene"},
]


# Roba che non è mai l'ingrediente cercato, in nessuna categoria:
# cibo per animali, piatti pronti, preparati e confezioni regalo.
ESCLUSIONI_GLOBALI = re.compile(
    # cibo per animali
    r"crocchette|per (cani|gatti)|cane adulto|gatto adulto|petfood|kitten|puppy|lettiera|"
    r"purina|friskies|whiskas|felix |monge |almo nature|pedigree|schesir|kitekat|"
    # piatti pronti e prodotti ripieni: l'ingrediente è solo un condimento
    r"piatto pronto|pronti in|sofficini|teneroni|al salto|polpettone|lasagn|cannellon|"
    r"sformato|parmigiana|tramezzin|panino |piadina farcit|sandwich|carpaccio|"
    r"ripien|tortell|ravioli|mezzelune|panzerott|crepes|crêpes|arancin|suppli|"
    r"pizza |pizze |focacc|torta salata|rustic|zuppa|minestr|risotto|insalatissim|"
    r"preparato per|kit per|confezione regalo|cesto|degustazione"
)

# Dolci e latticini dove l'ingrediente è solo un aroma ("yogurt al limone").
# Non valgono per gli ingredienti che sono davvero di quel mondo.
ESCLUSIONI_DOLCI = re.compile(
    r"yogurt|kefir|dessert|budino|gelat|frollini|biscott|merendin|caramell|"
    r"cioccolatin|succo|frullat|smoothie|muesli|barrett|probiotic"
)
ESENTI_DOLCI = {"yogurt", "latte", "zucchero", "miele", "avena"}

# Se il nome comincia con tante altre parole, di solito l'ingrediente è solo un
# contorno del prodotto ("Yogurt con mix cereali e avena").
POSIZIONE_MAX = 45


def trova(prodotti, conf, ing_id=None):
    """I prodotti di una catena che corrispondono a un ingrediente."""
    match = re.compile(conf["match"])
    exclude = re.compile(conf["exclude"]) if conf.get("exclude") else None
    attesa = conf.get("unita")
    entro = conf.get("entro", POSIZIONE_MAX)
    trovati = []
    for p in prodotti:
        nome = normalize(p["nome"])
        m = match.search(nome)
        if not m or m.start() > entro:
            continue
        if exclude and exclude.search(nome):
            continue
        if ESCLUSIONI_GLOBALI.search(nome):
            continue
        if ing_id not in ESENTI_DOLCI and ESCLUSIONI_DOLCI.search(nome):
            continue
        # niente cassette da 6 kg per chi deve cucinare due porzioni
        if conf.get("maxQta") and p.get("quantita") and p["quantita"] > conf["maxQta"]:
            continue
        # frutta e verdura: solo dal banco del fresco, altrimenti vincono
        # marmellate e conserve, che al chilo costano meno
        reparti = conf.get("reparti")
        if reparti and p["catena"] == "esselunga" and p.get("categoria") not in reparti:
            continue
        if attesa and p.get("unita") and p["unita"] != attesa:
            continue
        trovati.append(p)
    return trovati


def migliore(candidati, conf=None):
    """Il più conveniente: prezzo al kg/litro se lo conosciamo, altrimenti prezzo pieno.

    Per spezie ed erbette conta il prezzo della confezione (conf["scegli"] == "prezzo"):
    nessuno compra il rosmarino al chilo.
    """
    if not candidati:
        return None
    if conf and conf.get("scegli") == "prezzo":
        return min(candidati, key=lambda p: p["prezzo"])
    con_unitario = [p for p in candidati if p.get("prezzoUnitario")]
    if con_unitario:
        return min(con_unitario, key=lambda p: p["prezzoUnitario"])
    return min(candidati, key=lambda p: p["prezzo"])


def scheda(p):
    return {
        "nome": p["nome"],
        "marca": p.get("marca"),
        "prezzo": p["prezzo"],
        "prezzoPieno": p.get("prezzoPieno"),
        "inOfferta": p.get("inOfferta", False),
        "sconto": p.get("sconto"),
        "quantita": p.get("quantita"),
        "unita": p.get("unita"),
        "prezzoUnitario": p.get("prezzoUnitario"),
        "url": p.get("url"),
        "validoDal": p.get("validoDal"),
    }


def stima_conad(per_catena):
    """Conad: mediana dei prezzi delle catene che pubblicano i listini."""
    reali = [v for k, v in per_catena.items() if k in ("esselunga", "coop") and v]
    if not reali:
        return None
    prezzo = round(statistics.median([v["prezzo"] for v in reali]), 2)
    unitari = [v["prezzoUnitario"] for v in reali if v.get("prezzoUnitario")]
    riferimento = reali[0]
    return {
        "nome": "Stima su prodotti simili",
        "marca": None,
        "prezzo": prezzo,
        "prezzoPieno": None,
        "inOfferta": False,
        "sconto": None,
        "quantita": riferimento.get("quantita"),
        "unita": riferimento.get("unita"),
        "prezzoUnitario": round(statistics.median(unitari), 2) if unitari else None,
        "url": None,
        "stima": True,
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--solo", nargs="*", help="catene da aggiornare (esselunga coop lidl)")
    ap.add_argument("--catalogo", action="store_true", help="salva anche i cataloghi grezzi")
    ap.add_argument("--da-catalogo", action="store_true",
                    help="riusa i cataloghi già salvati, senza riscaricare nulla")
    args = ap.parse_args()
    volute = set(args.solo) if args.solo else {"esselunga", "coop", "lidl"}

    cataloghi = {}
    if args.da_catalogo:
        for catena in volute:
            percorso = os.path.join(RADICE, "data", "catalogo-{}.json".format(catena))
            if os.path.exists(percorso):
                with open(percorso, encoding="utf-8") as f:
                    cataloghi[catena] = json.load(f)
                print("{}: {} prodotti dal catalogo salvato".format(catena, len(cataloghi[catena])))
            else:
                print("! manca {}".format(os.path.relpath(percorso, RADICE)))
    if "esselunga" in volute and not args.da_catalogo:
        import esselunga
        print("Esselunga…")
        cataloghi["esselunga"] = esselunga.scarica()
    if "coop" in volute and not args.da_catalogo:
        import coop
        print("Coop (EasyCoop)…")
        cataloghi["coop"] = coop.scarica()
    if "lidl" in volute and not args.da_catalogo:
        import lidl
        print("Lidl (offerte della settimana)…")
        cataloghi["lidl"] = lidl.scarica()

    # Se stiamo aggiornando solo una catena, teniamo il resto dal file esistente.
    precedente = {}
    if os.path.exists(USCITA):
        with open(USCITA, encoding="utf-8") as f:
            precedente = json.load(f)

    ingredienti = {}
    for ing_id, conf in INGREDIENTI.items():
        vecchio = (precedente.get("ingredienti") or {}).get(ing_id, {})
        per_catena = {}
        for catena in ("esselunga", "coop", "lidl"):
            if catena in cataloghi:
                scelto = migliore(trova(cataloghi[catena], conf, ing_id), conf)
                if scelto:
                    per_catena[catena] = scheda(scelto)
            elif vecchio.get(catena):
                per_catena[catena] = vecchio[catena]
        conad = stima_conad(per_catena)
        if conad:
            per_catena["conad"] = conad
        if per_catena:
            ingredienti[ing_id] = per_catena

    offerte = {}
    for catena, prodotti in cataloghi.items():
        in_offerta = [scheda(p) for p in prodotti if p.get("inOfferta") or catena == "lidl"]
        in_offerta.sort(key=lambda p: (-(p.get("sconto") or 0), p["prezzo"]))
        offerte[catena] = in_offerta[:120]
    for catena, vecchie in (precedente.get("offerte") or {}).items():
        offerte.setdefault(catena, vecchie)

    risultato = {
        "aggiornato": dt.date.today().isoformat(),
        "catene": CATENE,
        "ingredienti": ingredienti,
        "offerte": offerte,
        "nota": "Prezzi indicativi raccolti dai siti pubblici delle catene; "
                "variano per negozio, città e periodo.",
    }

    os.makedirs(os.path.dirname(USCITA), exist_ok=True)
    with open(USCITA, "w", encoding="utf-8") as f:
        json.dump(risultato, f, ensure_ascii=False, indent=1)

    if args.catalogo:
        for catena, prodotti in cataloghi.items():
            percorso = os.path.join(RADICE, "data", "catalogo-{}.json".format(catena))
            with open(percorso, "w", encoding="utf-8") as f:
                json.dump(prodotti, f, ensure_ascii=False, indent=1)

    coperti = sum(1 for v in ingredienti.values() if any(k != "conad" for k in v))
    print("\nScritto {}".format(os.path.relpath(USCITA, RADICE)))
    print("Ingredienti con almeno un prezzo reale: {}/{}".format(coperti, len(INGREDIENTI)))
    for catena, prodotti in cataloghi.items():
        print("  {}: {} prodotti scaricati".format(catena, len(prodotti)))


if __name__ == "__main__":
    main()
