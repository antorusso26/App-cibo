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

## Struttura

```
index.html          pagina + cucina illustrata (SVG)
css/styles.css      stile
js/data-base.js     strumenti e ingredienti
js/recipes-1.js     ricette (primi e secondi)
js/recipes-2.js     ricette (uova, contorni, freddi, colazioni, dolci)
js/app.js           logica: selezione, matching, filtri, dettaglio
manifest.json       per aggiungerla alla schermata home del telefono
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
