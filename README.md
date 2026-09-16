# 🍳 Cosa Cucino?

Web app che ti suggerisce ricette in base a **cosa hai in casa** e agli **strumenti che usi**, con **calorie** e **tempi** per ogni piatto.

## Come funziona

1. **Cucina** — tocca gli strumenti nella cucina illustrata (fornelli, forno, microonde, friggitrice ad aria, frullatore, tostapane, pentola, padella).
2. **Dispensa** — apri il frigo e scegli gli ingredienti che hai (sale, pepe, olio e acqua si danno per scontati).
3. **Ricette** — vedi cosa puoi cucinare, con tempo, calorie a porzione e difficoltà. Puoi filtrare per tempo e calorie, accettare 1–2 ingredienti mancanti, ordinare o farti sorprendere 🎲.

Le scelte vengono salvate nel browser, così la prossima volta ritrovi la tua cucina.

## Provarla in locale

È un sito statico: niente da installare. Da questa cartella:

```bash
python3 -m http.server 5173
```

poi apri http://localhost:5173

## Pubblicarla online (GitHub Pages)

Dopo aver pubblicato il repository su GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `(root)` → Save**. Dopo un minuto circa l'app sarà su `https://<tuo-utente>.github.io/<nome-repo>/`.

## Scanner scontrini

Nella schermata Spesa c'è **📷 Scansiona uno scontrino**: fotografi lo scontrino e l'app ne
ricava i prezzi. L'OCR ([Tesseract.js](https://tesseract.projectnaptha.com/)) gira **dentro al
browser** in WebAssembly: la foto non viene caricata da nessuna parte e non serve nessuna chiave
API. Alla prima scansione il motore OCR (qualche MB) viene scaricato dalla CDN, poi resta in cache.

L'app riconosce la catena, le righe con prezzo e a quale ingrediente corrispondono (i nomi sugli
scontrini sono abbreviati: "PASSATA POMODORO", "PROSC COTTO", "MOZZ"); tu correggi quello che
serve e salvi. I prezzi dei tuoi scontrini hanno la precedenza su quelli raccolti dai siti e
compaiono nella lista della spesa con l'etichetta "dal tuo scontrino".

## Prezzi dei supermercati

In `data/prezzi.json` ci sono i prezzi di ogni ingrediente nelle varie catene, raccolti dai loro siti pubblici:

| Catena | Cosa otteniamo | Da dove |
|---|---|---|
| **Esselunga** | prezzi di listino e promozioni, catalogo nazionale | l'API che alimenta spesaonline.esselunga.it |
| **Coop** | prezzi di listino e sconti | l'API GraphQL di easycoop.com (Coop Alleanza 3.0) |
| **Lidl** | solo le offerte della settimana, con le date | l'API di ricerca di lidl.it (Lidl non vende alimentari online in Italia) |
| **Conad** | stima, calcolata sulle altre catene | il sito Conad mostra i prezzi solo dopo un controllo anti-bot, che non aggiriamo |

Per aggiornarli:

```bash
pip install -r scraper/requirements.txt && python3 scraper/run.py
```

Opzioni utili: `--solo coop` aggiorna una catena sola, `--catalogo` salva anche i cataloghi
completi in `data/`, `--da-catalogo` rifà solo gli abbinamenti sui cataloghi già salvati
(comodo quando si modificano le regole in `scraper/ingredienti.py`, senza riscaricare nulla).

Su GitHub gira da solo ogni lunedì mattina ([.github/workflows/prezzi.yml](.github/workflows/prezzi.yml))
e committa `data/prezzi.json` se i prezzi sono cambiati.

Gli scraper sono gentili: una richiesta ogni 0,8 secondi, nessun login, nessun dato personale,
solo pagine pubbliche. I prezzi sono indicativi e cambiano per negozio, città e periodo.

## Struttura

```
index.html          pagina + cucina illustrata (SVG)
css/styles.css      stile
js/data-base.js     strumenti e ingredienti
js/recipes-1.js     ricette (primi e secondi)
js/recipes-2.js     ricette (uova, contorni, freddi, colazioni, dolci)
js/app.js           logica: selezione, matching, filtri, dettaglio
js/spesa.js         supermercato, budget, menù e lista della spesa
js/scontrino.js     scanner scontrini (OCR nel browser)
manifest.json       per aggiungerla alla schermata home del telefono
data/prezzi.json    prezzi per ingrediente e catena + offerte della settimana
scraper/            gli script che aggiornano i prezzi
  common.py         sessione HTTP, quantità, normalizzazione
  ingredienti.py    regole per riconoscere gli ingredienti nei cataloghi
  esselunga.py      catalogo per categorie
  coop.py           ricerca GraphQL su EasyCoop
  lidl.py           offerte della settimana
  run.py            mette tutto insieme e scrive data/prezzi.json
```

## Aggiungere una ricetta

Aggiungi un oggetto in `js/recipes-1.js` o `js/recipes-2.js`:

```js
{
  id: 'mia-ricetta', name: 'Nome ricetta', emoji: '🍲',
  time: 20, kcal: 400, servings: 2, difficulty: 'Facile', tags: ['Primo'],
  tools: ['fornelli', ['pentola', 'padella']],   // un array interno = basta uno dei due
  ing: [
    { id: 'pasta', q: '200 g' },
    { id: ['ceci', 'fagioli'], q: '1 barattolo' }, // alternative
    { id: 'basilico', q: 'q.b.', opt: true },      // facoltativo
  ],
  steps: ['Primo passo.', 'Secondo passo.'],
}
```

Gli `id` degli ingredienti e degli strumenti sono in `js/data-base.js`.

> Le calorie sono stime indicative per porzione.
