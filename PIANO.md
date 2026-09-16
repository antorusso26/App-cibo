# Cosa Cucino? — Da web app a servizio

## Context

Sito statico vanilla, ora a 4 schermate (Cucina → Dispensa → Ricette → Spesa), 43 ricette, 62 ingredienti, 8 strumenti. Obiettivo: un **servizio da vendere** — ricette su misura di quello che hai in casa e di **come vuoi mangiare**, con la spesa che si chiude leggendo lo scontrino e i prezzi reali dei supermercati integrati.

**Cosa esiste già (verificato):**

- **Scraper prezzi, fatto e funzionante.** `scraper/` con Esselunga, Coop, Lidl + stima Conad; `data/prezzi.json` (216 KB) copre **62/62 ingredienti con almeno un prezzo reale**, più 360 offerte. Aggiornamento automatico ogni lunedì via GitHub Actions. Le incertezze sono già etichettate onestamente in UI ("stima", "prezzo di un'altra catena", "solo offerte").
- **Schermata Spesa** (`js/spesa.js`): scegli catena e budget da–a, l'app compone un menù dentro il budget e la lista della spesa. Con un modello di costo corretto — le confezioni si comprano una volta sola, quindi una ricetta che riusa ciò che è già nel carrello costa quasi zero in più.
- **API interna esposta**: `window.CosaCucino = { state, evaluate, openRecipe, toast, goTo, fmtTime, ingName, ingEmoji, hasIng, salvaStato }` — la base giusta per costruirci sopra.
- **OCR scontrini**: in lavorazione in un'altra sessione. Qui non si implementa: si definisce il **contratto** perché i due pezzi si incastrino (§ III.6).

**Le decisioni prese che governano il resto:**

1. **Niente dati sanitari, niente nutrizionisti, per ora.** Non esiste un "piano alimentare": esiste **"Come voglio mangiare"** — light, normale, ciccioso, proteico, più eventuali obiettivi di macro. È una preferenza, non una prescrizione. Conseguenza: si esce quasi certamente dal regime art. 9 GDPR, e tutto gira lato client su `localStorage`, senza account e senza costi.
2. **Il tono è un asset.** "Ciccioso" accanto a "Croccante senza sensi di colpa 😎" è coerente e dice all'utente che l'app non lo giudica — l'opposto esatto di ogni app di dieta.

---

## Parte I — Il prodotto oggi

### Il difetto di fondo: input grande, output minuscolo

L'app chiede di dichiarare l'intero inventario di casa e restituisce pochissimo. Misurato sul dataset reale:

| Scenario | Ricette con 0 mancanti |
|---|---|
| Pulsante "✨ Le basi" (13 ingr.) + 4 strumenti tipici | **5** |
| "Le basi" + tutti e 8 gli strumenti | **6** |
| 5 ingredienti + fornelli/pentola/padella | **1** |
| Dispensa ricca (25 ingr.) + tutti gli strumenti | 18 su 43 |

Il percorso felice suggerito dall'app stessa produce cinque ricette, due delle quali sono patatine e pancake. **Nessun abbonamento regge su un motore che risponde cinque volte** — ed è il problema numero uno, prima di ogni monetizzazione.

Cause: `maxMissing = 0` di default (`js/app.js:16`, filtro a `:165`) nasconde l'informazione più motivante che l'app possiede ("ti manca solo il parmigiano"); 7 ricette richiedono **sia** pentola **sia** padella come gruppi AND separati e restano invisibili senza spiegazione; il 27% del selettore ingredienti (17 voci su 62, `ricotta` inclusa) non sblocca praticamente nulla.

**Con la schermata Spesa il funnel è peggiorato, non migliorato**: il percorso a freddo è ora di 4 schermate prima di qualsiasi valore. La Spesa è una buona funzione messa nel posto sbagliato del flusso.

### Il difetto che uccide la retention: l'inventario decade

Gli strumenti sono un dato **stabile** (li imposti una volta nella vita), gli ingredienti sono **volatili** (li mangi). `js/app.js:31` li persiste allo stesso identico modo. Al secondo accesso l'app riparte dalla cucina illustrata — schermata che non serve mai più — e la dispensa di settimana scorsa ormai mente: dice "✅ Hai tutto il necessario!" per un piatto i cui ingredienti sono finiti da giorni.

È il punto in cui muore ogni app "cucina con quello che hai". È anche esattamente ciò che scontrino + "ho cucinato" risolvono: vedi § III.5.

### Falle di fiducia

1. **"Hai tutto il necessario" può essere falso.** `hasIng` (`js/app.js:53`) verifica la presenza, mai la quantità: un uovo "soddisfa" i 4 della frittata. Alcuni passi citano ingredienti non dichiarati in `ing` (salsa di soia in `riso-saltato`, latte in `polpette-sugo`, ghiaccio in `smoothie-verde`) e attrezzature mai chieste (teglia, carta forno, stampo).
2. **Il tempo mescola unità diverse.** `time: 150` per la pizza include 2 ore di lievitazione; `time: 15` per aglio e olio sono 15 minuti di lavoro vero. "Ordina per più veloci" confronta grandezze incommensurabili.
3. **Le calorie sono stime scritte a mano**, esposte come dato primario, e i macronutrienti non esistono affatto. Con "Come voglio mangiare" questo passa da imbarazzante a bloccante: vedi § III.1.
4. **Nessun filtro allergeni né esclusioni.** Nessuno dei 28 tag esistenti è filtrabile.
5. **Nessuna immagine.** Nella griglia 🍝 identifica quattro piatti di pasta diversi.

### Difetti concreti di usabilità e accessibilità

| Dove | Problema |
|---|---|
| `index.html:41` | SVG `viewBox 800×460`: su 360px i target diventano 22–35px contro i 44 minimi. L'interazione principale è inusabile sul dispositivo dove l'app vive. |
| `index.html:99-203` | I gruppi `.tool` hanno `role="button"` ma mai `aria-pressed` (i chip sì, `js/app.js:89` e `:123`). Lo stato dell'illustrazione è solo colore. |
| `js/app.js:115-127` | Ogni click in dispensa rigenera tutto l'`innerHTML`: il bottone premuto viene distrutto, il focus salta su `<body>`. Tastiera impraticabile. |
| `js/app.js:61`, `:323` | Il bottone primario in fondo cambia testo per step ma su Ricette porta **indietro**. Con la quarta schermata la logica `STEPS[i+1]` va rivista comunque. |
| `js/app.js:168-169` | L'ordinamento per mancanti precede sempre il criterio scelto: con `maxMissing > 0`, "Più veloci" non ordina per tempo. L'etichetta mente. |
| `js/app.js:31` | Filtri, ordinamento e scelte non vengono persistiti (la Spesa invece salva le sue in `cosa-cucino-spesa`: due sistemi diversi). |
| `js/app.js:145` | "🧹 Svuota" cancella tutta la dispensa senza conferma né undo. |
| `js/app.js:51` + usi | `ingName()` non passa da `escapeHtml`. Innocuo oggi, buco XSS appena l'utente può inserire testo — cioè dalla Fase 1. |
| `css/styles.css` | Il fumetto usa `nowrap` + ellipsis: su mobile le battute si troncano. Nessun dark mode. Nessun wake lock in cottura. |
| tutto | **Nessun service worker.** Il manifest invita a installare l'app, i font vengono da Google Fonts, e ora c'è anche `data/prezzi.json` da 216 KB scaricato a runtime: l'app installata non funziona senza rete, e su rete mobile pesa. |
| `manifest.json` | Solo icona SVG data-URI: mancano PNG 192/512 e `maskable`. |
| — | `servings` fisso, nessun ricalcolo quantità. Nessuna ricerca per nome ricetta. Nessun test, nessun lint, nessuna validazione del dataset: `RECIPES` si concatena su `window` senza controllo di unicità degli id. |

---

## Parte II — Il business

### La linea da non superare

- **Nessuna promessa di dimagrimento, nessun linguaggio clinico.** "Ciccioso" è un modo di mangiare; "perdi 5 kg" è una promessa sanitaria e cambia il regime normativo dell'intero prodotto.
- **Niente peso, altezza, età obbligatori.** I preset funzionano senza.
- **Le esclusioni alimentari sono il punto sensibile.** "Senza glutine" rivela potenzialmente una condizione: finché resta in `localStorage` il rischio è minimo; quando salirà su un server con un account, va trattata con cura.
- **Nessuna pubblicità basata su come l'utente vuole mangiare.** Le offerte si agganciano a **prodotto e ricetta**, mai al profilo. È anche una promessa scrivibile in home.

### I motori di ricavo, e la sequenza

Senza i nutrizionisti manca il canale che sarebbe arrivato al fatturato per primo. Va messo in conto: **il primo ricavo arriva più tardi**, e questo cambia cosa conviene costruire prima.

| Motore | Chi paga | Tempo al primo euro | Nota |
|---|---|---|---|
| **Affiliazione spesa online** | la catena, a commissione | il più breve | Lo scraper ha già gli URL prodotto di Esselunga: il ponte verso il carrello è a portata. Candidato numero uno al primo ricavo. |
| **Premium consumer** | l'utente | 1–2 anni | Richiede che scontrino, pianificatore e AI siano davvero buoni. |
| **Retail media / offerte** | catene e brand | anni | Tesi giusta, ma nessuna catena negozia con un'app da 5.000 utenti. |

### Il fossato

Non le ricette — Giallo Zafferano le ha già, e migliori. Il fossato è **lo stato**: la dispensa viva, lo storico degli scontrini, la tabella alias prodotto→ingrediente che migliora a ogni conferma di ogni utente, i prezzi storici, i dati nutrizionali strutturati. Dati che si accumulano e che un concorrente deve ricostruire da zero. **Ogni scelta di prodotto dovrebbe chiedersi se alimenta questo stato.**

---

## Parte III — I sistemi

### 1. Il livello dati nutrizionali (il prerequisito di tutto)

L'investimento a leva più alta: un solo lavoro di dati sblocca sei funzioni oggi impossibili — i modi di mangiare, il target macro, le sostituzioni, le calorie verificabili, le porzioni ricalcolate, e il **costo per porzione** (che i prezzi rendono già calcolabile ma che senza quantità strutturate resta approssimativo).

**a) Composizione per ingrediente** — kcal, proteine, carboidrati, grassi, fibre per 100 g, su 62 ingredienti. Fonte: **CREA — Tabelle di composizione degli alimenti** (USDA FoodData Central come fallback). Con la fonte citata in app il numero diventa verificabile invece che inventato. Stesso passaggio: **allergeni** e **gruppo alimentare** (proteine animali / pesce / legumi / cereali / verdure / frutta / latticini / grassi) come campi strutturati.

**b) Conversione delle quantità** — oggi `q` è testo libero (`'200 g'`, `'2 spicchi'`, `'1 barattolo'`, `'q.b.'`, `'4 cosce'`, `'½'`). Va portato a `{n, u}` più una tabella di pesi medi. Circa 30 regole, tutte note:

- grammi e ml: diretti
- pezzi con peso medio: uovo 55 g, spicchio d'aglio 3 g, cipolla media 150 g, patata media 180 g, panino 70 g, fetta di pane 30 g, trancio di salmone 140 g, coscia di pollo 120 g
- misure casalinghe: cucchiaio 15 g (10 g se olio), cucchiaino 5 g, noce di burro 12 g, manciata 25 g, pizzico 0,5 g
- contenitori: barattolo di legumi sgocciolato 240 g, scatoletta di tonno 80 g, bustina di lievito 16 g
- vaghe (`q.b.`, `a scelta`, `per servire`): escluse dal calcolo, ma **marcate come tali, mai contate zero in silenzio**

**Bonus immediato**: con `{n, u}` più `prezzoUnitario` già presente in `prezzi.json`, il costo diventa **per quantità realmente usata** invece che per confezione intera — l'ottimizzatore di spesa passa da stima a numero vero.

### 2. "Come voglio mangiare"

Non un piano alimentare: una preferenza. Tre livelli, ognuno opzionale, ognuno utile da solo.

**Livello 1 — i modi.** Una domanda, quattro bottoni grossi, saltabile. Default Normale, l'app funziona senza toccare nulla.

- 🥗 **Light** · 🍽️ **Normale** · 🧈 **Ciccioso** · 💪 **Proteico**

**Il punto tecnico che conta: i modi pesano, non escludono.** Un filtro rigido su "light" svuoterebbe la lista — e sappiamo quanto è fragile il catalogo. Sono **profili di punteggio** che riordinano e mettono in evidenza senza togliere nulla:

- *Light*: premia bassa densità calorica (kcal/100 g) e quota di verdure, penalizza fritture e grassi aggiunti
- *Ciccioso*: premia densità calorica, formaggi, condimenti, tag `Comfort`
- *Proteico*: premia grammi di proteine per porzione e rapporto proteine/kcal

**Livello 2 — i dettagli**: obiettivo macro giornaliero (abilita § III.3); **"cosa non mangio"** (senza glutine, senza lattosio, vegetariano, vegano, no pesce, allergie) — questi sì, **vincoli rigidi mai negoziabili da nessun altro meccanismo**; tempo disponibile.

**Livello 3 — la giornata**: barra dei macro e suggerimenti, solo se è stato impostato un obiettivo numerico.

### 3. Il pianificatore a obiettivo ("oggi 90 g di proteine")

- **Barra della giornata** (l'uso quotidiano, il più importante): macro che si riempiono man mano che segni cosa hai mangiato. *"Ti mancano 35 g di proteine e 400 kcal → ecco 3 cene che ti ci portano, con quello che hai."* È il gancio che fa riaprire l'app ogni giorno.
- **Componi la giornata** dai target · **La settimana**, con lista della spesa in uscita.

**Come risolverlo.** Selezione a somma vincolata, ma **niente solver esatto**: produce soluzioni assurde (400 g di parmigiano per centrare le proteine). Greedy con ricerca locale gira in millisecondi lato client e permette di penalizzare l'innaturale. **`js/spesa.js:74-122` fa già esattamente questo per il budget** — greedy poi scambi migliorativi verso un obiettivo. Lo stesso scheletro si generalizza da "una dimensione, gli euro" a "n dimensioni, i macro": è codice da estendere, non da scrivere.

Vincoli: target **con tolleranze**, mai uguaglianze; struttura del pasto; dispensa e strumenti reali; esclusioni rigide; **varietà**; tempo per fascia oraria.

**La leva chiave è la porzione, non la ricetta.** Il modo naturale per centrare 90 g non è cambiare piatto ma aggiustare la dose: 150 g di pollo invece di 120. Scala continua tra 0,5× e 2×.

**Quando l'obiettivo è irraggiungibile** — capiterà spesso — non fallire: *"con quello che hai arrivi a 62 g; con 200 g di pollo ci arrivi"*. E quel pollo finisce in lista della spesa, dove incontra le offerte.

### 4. Il motore delle sostituzioni

*"Non hai la ricotta → usa 100 g di yogurt greco."* Un motore, tre usi: dentro una ricetta quando manca un ingrediente; dentro il pianificatore quando manca poco al target; più avanti dentro il piano di un professionista con i suoi permessi.

- **Per gruppo alimentare, mai trasversale.** Una proteina non si sostituisce con un carboidrato.
- **Si tiene fisso il macro dominante, riscalando la quantità**: 150 g di merluzzo (≈27 g proteine) → ≈115 g di pollo.
- **Tolleranze** su kcal (±15%) e altri macro; fuori tolleranza è "simile", non "equivalente", e va detto con parole diverse.
- **Vincoli rigidi**: allergeni ed esclusioni non si violano mai.
- **Plausibilità culinaria**: 27 g di proteine si ottengono anche con 90 g di parmigiano, ma non è una cena.
- **Ordinamento**: prima ciò che è **in dispensa**, poi ciò che è **in offerta** (i prezzi ci sono già), poi il resto. Una funzione risolve insieme "non ce l'ho" e "costa troppo".
- **Niente AI**: aritmetica deterministica sulla tabella CREA.

### 5. Il bilancio della dispensa

**Sostituire il booleano `pantry: Set<id>` con uno stato a confidenza**: quantità stimata, data dell'ultimo evento, origine (scontrino / manuale / lista spuntata), confidenza che decade secondo la deperibilità (fresco 3–7 gg, frigo 2–3 settimane, dispensa mesi).

Tre livelli, e il linguaggio dell'app cambia di conseguenza — è ciò che rende onesta la spunta verde:

`sicuro` → "**Hai tutto**" · `probabile` → "**Dovresti avere tutto**" · `esaurito` → entra in lista della spesa

**In entrata**: scontrino, lista spuntata, aggiunta manuale. **In uscita**: "ho cucinato questa" sottrae le quantità scalate per le porzioni.

**Svuotare la dispensa** — mai in silenzio, ma a costo bassissimo:

- **Controllo dispensa**: quando N voci scendono sotto soglia, un check da 20 secondi sui **soli elementi incerti** — tap = c'è ancora, swipe = finito. Mai la lista intera da 62 voci.
- **Azioni rapide**: "svuota i freschi", "sono stato via una settimana", "ho fatto le pulizie" (con undo).
- **Scarico automatico al cucinare**, il caso più frequente, che non costa un tap.
- **Antispreco**: spingere le ricette che consumano ciò che sta per scadere. La funzione più utile, il miglior gancio di retention e il messaggio di marketing più forte — e con i prezzi si può quantificare: *"hai salvato 4,30 € di cibo questa settimana"*.

### 6. Scontrino → dispensa: il contratto con l'altra sessione

L'OCR si sviluppa altrove. Qui serve definire l'incastro, e c'è **un'occasione di riuso che vale segnalare subito**.

**`scraper/ingredienti.py` è già un matcher nome-prodotto → `ingrediente_id`**: 62 regex `match`/`exclude` calibrate a mano, più `common.py:normalize`. È lo stesso identico problema che ha l'OCR. E il catalogo scaricato (`--catalogo` salva `data/catalogo-*.json`) è un **corpus di nomi prodotto reali per ingrediente**: la forma estesa di ciò che sullo scontrino appare abbreviato. **La dizionario per il matching degli scontrini esiste già**: l'altra sessione non deve ricostruirlo.

Resta da aggiungere un solo strato: l'espansione delle abbreviazioni (`PT CRUD S/GL` → `prosciutto crudo senza glutine`), perché le regex attuali lavorano su nomi completi.

**Il contratto.** Il modulo OCR restituisce, e nient'altro:

```
{ righe: [ { testoOriginale, quantita, unita, prezzo,
             ingredienteId | null, confidenza: 0..1 } ],
  negozio, catena | null, data, totale }
```

Regole non negoziabili su cui i due pezzi devono concordare:
- `ingredienteId` appartiene al vocabolario di `js/data-base.js` — **stessa fonte di verità** di ricette e prezzi.
- `null` è una risposta legittima e frequente: mai inventare un match.
- **Nessuna scrittura in dispensa senza conferma dell'utente.** L'OCR propone, la schermata di conferma decide.
- Ogni conferma dell'utente arricchisce la **tabella alias globale e anonima** (`testoScontrino → ingredienteId`): è l'effetto di rete e l'asset difendibile: il centesimo utente che compra "PHILADELPHIA 175G" non conferma più nulla.
- **Privacy**: lo scontrino contiene alcol, farmaci, prodotti che rivelano condizioni di salute. Conservare solo le righe alimentari mappate, scartare il resto in elaborazione, non conservare l'immagine oltre l'elaborazione salvo consenso esplicito e a termine.

**Bonus**: lo scontrino porta anche i **prezzi realmente pagati**, per negozio e per data. È il dato che lo scraper non può avere e che nel tempo rende le stime molto più precise.

### 7. Prezzi e offerte — fatto, con tre cose da sistemare

Lo scraper funziona ed è scritto bene: esclusioni ragionate (cibo per animali, piatti pronti, "yogurt al limone" quando cerchi il limone), scelta del più conveniente per prezzo unitario, fallback su altre catene, stima Conad dichiarata. 62/62 ingredienti coperti.

**Da sistemare, in ordine di gravità:**

1. **`aggiornato` mente quando lo scraper fallisce.** `run.py:221` scrive `dt.date.today()` incondizionatamente, mentre i valori vecchi vengono conservati (`:204`). Se una catena cambia sito e il parser restituisce zero prodotti, l'app continuerà a mostrare *"prezzi aggiornati il …"* con la data di oggi su dati di settimane prima. È esattamente il rischio "offerta scaduta distrugge la fiducia", in forma di codice. **Fix**: marcare la freschezza per singola voce (`vistoIl`), non solo globalmente, e mostrare in UI la meno fresca.
2. **Il fallimento è silenzioso.** Il workflow committa solo se il file cambia, quindi uno scraper rotto non fa rumore. **Fix**: far fallire il job se la copertura scende sotto soglia (es. meno di 50 ingredienti con prezzo reale non stimato) o se una catena restituisce zero prodotti.
3. **216 KB scaricati a runtime**, di cui buona parte sono 360 offerte che servono solo in una sezione. **Fix**: separare `prezzi.json` da `offerte.json`, mettere il primo nel precache del service worker e caricare il secondo su richiesta.

**Cosa sblocca già oggi, senza scrivere nulla di nuovo:** il costo di ogni ricetta, il costo per porzione, "cosa conviene cucinare questa settimana", e — con gli URL prodotto Esselunga già presenti nei dati — il ponte verso il carrello online, cioè il ricavo più raggiungibile.

**Nota legale, da tenere in mente senza allarmismi**: sono cataloghi pubblici, l'uso è di confronto, e l'app dichiara già l'incertezza. Restano validi: rispetto di `robots.txt`, rate limit bassi, nessuna rivendita del dato grezzo, e la consapevolezza che in UE esiste il diritto *sui generis* sulle banche dati. È un bootstrap ottimo, non un asset su cui fondare la valutazione dell'azienda.

### 8. Lista della spesa unificata

Una sola lista, da quattro sorgenti, deduplicata: ricette scelte, la settimana pianificata, **gap dell'obiettivo macro**, aggiunte manuali. Raggruppata per **reparto** (si cammina per corsie, non per piatto), quantità sommate, offerte accanto a ogni voce. In uscita: spunta manuale, **esportazione verso il carrello online**, o chiusura automatica leggendo lo scontrino al ritorno.

Oggi `js/spesa.js` genera già la lista, ma ordinata per prezzo e legata al menù proposto: va promossa a entità autonoma e persistente.

### 9. Premium

**Non mettere a pagamento la risposta principale.** "Cosa cucino con quello che ho" è il motore di acquisizione.

**Free** — ricettario, ricerca per ingredienti, i modi di mangiare, esclusioni, dispensa manuale, lista della spesa, prezzi e offerte, sostituzioni dentro una ricetta, barra macro del giorno, 1 scansione scontrino al mese.

**Premium (~4,99 €/mese)** — la settimana generata sugli obiettivi con porzioni ricalcolate; ricette AI illimitate; scontrini illimitati e dispensa che si aggiorna da sola; scadenze e antispreco quantificato in euro; **ottimizzatore di spesa** (*"questa settimana ti costa 47 €; cambiando due ricette scendi a 38 €"* — ripaga l'abbonamento da sola); storico, modalità cottura, sync, niente pubblicità.

Economia unitaria: a spanne un utente premium attivo resta ben sotto l'euro al mese di costo AI, ma va **misurato con i numeri veri prima di fissare i prezzi**, con tetti rigidi sul tier free.

---

## Parte IV — Brief per Claude Design

> Sezione autonoma, pensata per essere passata così com'è a Claude Design.

### Cosa stiamo progettando

**"Cosa Cucino?"** — app mobile (PWA) che risponde a una domanda: *cosa mangio stasera con quello che ho in casa*. In più: quanto costa, quanto ci metto, e quanto mi avvicina a come voglio mangiare.

**Chi la usa**: persone normali, in piedi davanti al frigo, con una mano sola, spesso di fretta o già stanche. Non cuochi, non appassionati di nutrizione. Una minoranza motivata conta i macro.

**Il problema da risolvere visivamente**: oggi è un wizard a 4 passi che chiede molto prima di dare qualcosa. Deve diventare un **motore di risposte**: si apre e si vede subito cosa cucinare.

### Voce e personalità

Giocosa ma non infantile. L'app dà del tu, scherza ("Fiamma accesa! Si comincia a fare sul serio 🔥", "Croccante senza sensi di colpa 😎") e **non giudica mai** cosa mangi: uno dei modi si chiama **Ciccioso** e deve sembrare una scelta legittima quanto *Light*. Non deve somigliare né a un'app medica né a un'app di dieta.

Insieme a questo però convivono **dati precisi**: euro, grammi, calorie, percentuali di sconto. La sfida di design è tenere insieme calore e precisione senza che diventi un cruscotto.

### Sistema esistente da cui partire

- Colori: `--tomato #FF6B4A` (primario), `--basil #3BAA6E` (conferma/positivo), `--yolk #FFC93C` (accento), fondo `#FFF8EE`, inchiostro `#2B2320`
- Font: **Fredoka** (titoli) + **Nunito** (testo)
- Forme morbide, raggi 14–24px, ombre calde, ombre "solide" sotto i bottoni
- **Asset da conservare**: l'illustrazione SVG della cucina (fornelli, forno, frigo, microonde…) con animazioni allo stato attivo. È la personalità del prodotto. Va **spostata** da schermata d'ingresso a impostazione visitata una volta, ma non perduta.

Il sistema può essere evoluto, ma consapevolmente: se cambia, deve restare caldo e non clinico.

### Schermate da disegnare

1. **Home / Risposta** — la ricerca ingredienti con chip suggerite e risultati **a scaglioni**: "Puoi farlo ora" → "Ti manca 1 cosa" → "Ti manca poco". È la schermata più importante: va disegnata per prima e deve funzionare anche con zero input.
2. **Card ricetta** (componente critico) — deve reggere: nome, emoji o futura foto, tempo attivo, kcal, macro, costo stimato, quanto match hai, eventuale badge offerta. **Il rischio è l'illeggibilità**: serve una gerarchia severa e probabilmente livelli di dettaglio progressivi.
3. **Scheda ricetta completa** — ingredienti con stato (ce l'hai / ti manca / facoltativo), sostituzioni proposte, passi, costo, valori nutrizionali.
4. **Modalità cottura** — un passo alla volta, schermo attivo, mani sporche: testo grande, target enormi, niente interazioni fini.
5. **Dispensa** — griglia di ingredienti con **stato a tre livelli** (sicuro / probabile / esaurito): serve un linguaggio visivo per la *confidenza*, non un booleano. Più il **"controllo dispensa"**: check rapido sui soli elementi incerti, tap = c'è, swipe = finito.
6. **Come voglio mangiare** — i quattro modi come scelta grande e leggera (Light / Normale / Ciccioso / Proteico), più esclusioni alimentari e obiettivo macro opzionale.
7. **Barra della giornata** — macro che si riempiono, con il gancio "ti mancano 35 g di proteine → 3 cene che ti ci portano". Va progettata sia come componente compatto persistente sia come vista estesa.
8. **Spesa** — menù nel budget + lista della spesa per reparto + offerte. Esiste già, va ridisegnata: oggi la lista è ordinata per prezzo e le etichette di incertezza ("stima", "prezzo di un'altra catena") sono badge testuali da sistemare.
9. **Conferma scontrino** — le righe lette dall'OCR in tre gruppi: riconosciute, incerte, sconosciute. Obiettivo: **3–4 tap e hai finito**.
10. **La mia cucina** — gli strumenti, con l'illustrazione SVG e i chip testuali come controllo primario.

### Stati da progettare esplicitamente

Sono la parte che di solito viene dimenticata ed è dove questo prodotto vive o muore:

- **Primo accesso, zero dati** — deve mostrare valore prima di chiedere qualsiasi cosa
- **Pochi risultati** e **nessun risultato** — mai un muro: sempre la via d'uscita più vicina
- **"Ti manca una cosa sola"** — è l'informazione più motivante dell'app e merita un trattamento visivo dedicato
- **Obiettivo irraggiungibile** — *"con quello che hai arrivi a 62 g; con 200 g di pollo ci arrivi"*
- **Dati incerti** — prezzo stimato, prezzo di un'altra catena, ingrediente "probabilmente" in dispensa, calorie approssimate. **Serve una grammatica visiva unica e coerente per l'incertezza**, usata ovunque: è ciò che rende l'app onesta invece che millantatrice.
- **Offline** e **prezzi vecchi**
- **Errore di lettura scontrino**

### Vincoli non negoziabili

- **Mobile first, una mano, in cucina**: target ≥44px, testo leggibile a mezzo metro, niente hover come unico segnale
- **Dark mode obbligatorio** (si cucina di sera)
- **Accessibilità**: stato mai comunicato dal solo colore, focus visibile, contrasti AA
- **Niente foto ricette per ora**: il design deve reggere senza immagini **e** prevedere dove andranno quando arriveranno
- **Niente linguaggio sanitario o promesse di dimagrimento** in nessuna microcopy

### Cosa serve indietro

Artboard mobile delle 10 schermate più gli stati principali, e un **design system**: colore (chiaro e scuro), tipografia, spaziatura, e i componenti ricorrenti — chip ingrediente, card ricetta, badge di incertezza, barra macro, riga lista spesa, scaglione di risultati.

---

## Parte V — Roadmap

### Fase 0 — Igiene (1 sessione)

- `js/app.js`: `maxMissing` default a `1` (`:16`); rispettare `state.sort` (`:168-169`); persistere filtri e unificare i due sistemi di salvataggio (`:31` vs `cosa-cucino-spesa`); rivedere la logica del bottone in fondo ora che gli step sono 4 (`:61`, `:323`); undo su "Svuota" (`:145`); `escapeHtml` su `ingName()` (`:51`).
- `js/app.js:115-127`: togglare la sola `class` del chip premuto invece di rigenerare l'`innerHTML`, così il focus sopravvive.
- `index.html`: `aria-pressed` sui gruppi `.tool`. `css/styles.css`: via `nowrap` dal fumetto.
- **Dati ricette**: allentare i 7 gruppi `pentola` + `padella` in `['fornelli', ['pentola','padella']]`; dichiarare in `ing` gli ingredienti citati nei passi; togliere o usare `ricotta`.
- **Scraper**: freschezza per voce (`vistoIl`) invece della sola data globale; guardia di copertura che fa fallire il workflow; split `prezzi.json` / `offerte.json`.
- **`tools/validate.mjs`**: id univoci, riferimenti esistenti, ingredienti orfani, ingredienti citati nei passi ma assenti da `ing`, **e copertura prezzi**. Base in `scratchpad/analyze.py`.

### Fase 1 — Il prodotto (ancora statico)

1. **Home = ricerca ingredienti** con risultati live. Riusare `matchingRecipes()` e `renderResults()`: la logica di matching è buona, cambia cosa la alimenta.
2. **Risultati a scaglioni**, che sostituiscono il filtro `#f-missing` e lo stato vuoto.
3. **Strumenti fuori dal percorso**, pre-selezionati per default; l'SVG diventa "La mia cucina".
4. **Il livello dati nutrizionali** (§ III.1) — il lavoro più importante della fase.
5. `timeActive` / `timeTotal`; calorie calcolate con fonte; filtro per momento del pasto; **esclusioni alimentari** rigide.
6. **Offline reale**: service worker, font self-hosted, `prezzi.json` in precache, icone PNG.
7. Dark mode, wake lock, porzioni ricalcolabili.

### Fase 2 — "Come voglio mangiare" (ancora senza backend)

I quattro modi come profili di punteggio; barra macro della giornata; componi la giornata; motore delle sostituzioni nella forma base — **estendendo lo scheletro greedy+scambi già in `js/spesa.js:74-122`**. Tutto su `localStorage`: **lanciabile senza account, senza database, senza costi ricorrenti.** È il momento di verificare se il posizionamento regge prima di spendere sul backend.

### Fase 3 — Il loop (qui nasce il backend)

Dispensa a confidenza; "ho cucinato" → scarico; lista della spesa autonoma e persistente; **integrazione dell'OCR secondo il contratto § III.6**; tabella alias condivisa; account, sync, export e cancellazione.

### Fase 4 — Ricavi, nell'ordine

1. **Affiliazione sul carrello online** — gli URL prodotto ci sono già. Il ricavo raggiungibile senza scala.
2. **Premium consumer**. Ricette AI con `claude-opus-5` via endpoint serverless e structured outputs; **in implementazione ricaricare la skill `claude-api` e leggere `typescript/claude-api/`** — non a memoria. Guardrail: solo ingredienti dichiarati più i basics, con validazione server che **rifiuta** l'output fuori vincolo; ogni ricetta generata etichettata e mai mescolata in silenzio con quelle curate; nessuna affermazione su allergeni o macro se non ricalcolata dalla tabella CREA; rate limit e tetto di spesa. Le ricette generate che gli utenti cucinano diventano candidate per il catalogo curato: così si supera il tetto delle 43 senza scriverle a mano.
3. **Offerte** come inventario pubblicitario, quando i numeri esistono.
4. **Nutrizionisti**, se e quando.

---

## Verifica

**La metrica che governa tutto.** Riadattare `scratchpad/analyze.py` a script di regressione e misurare, sugli stessi quattro scenari, quante ricette l'utente vede *effettivamente* (contando gli scaglioni). Obiettivo: **nessuno scenario realistico sotto le 10 ricette visibili**, e almeno un risultato utile con soli 2 ingredienti.

- `node tools/validate.mjs` pulito: id, riferimenti, orfani, ingredienti citati nei passi, copertura prezzi.
- **Scraper**: simulare una catena che restituisce zero prodotti → il workflow deve **fallire**, e l'app non deve mai mostrare una data di aggiornamento più recente del dato reale.
- **Dati nutrizionali**: per 10 ricette campione, macro entro ±15% di una verifica manuale su fonte CREA. Ogni `q` non convertibile è marcato, mai contato zero in silenzio.
- **I modi**: passare da Normale a Light **non riduce mai** il numero di ricette mostrate. Test che fallisce se un modo si comporta da filtro.
- **Esclusioni**: nessuna ricetta con un ingrediente escluso compare mai, in nessuna sezione, in nessun suggerimento, in nessuna sostituzione. Zero eccezioni.
- **Pianificatore**: su 20 combinazioni realistiche, il piano resta entro le tolleranze, non ripete lo stesso ingrediente principale più di due volte al giorno, non propone porzioni fuori da 0,5×–2×, e **quando l'obiettivo è irraggiungibile lo dice indicando cosa manca**.
- **Sostituzioni**: su 30 coppie, nessuna attraversa il gruppo alimentare, nessuna viola un'esclusione, nessuna propone porzioni implausibili.
- **Scontrino**: su 20 scontrini reali di catene diverse, ≥80% delle righe alimentari mappate al primo tentativo, e **zero** scritture in dispensa senza conferma.
- **Mobile reale** (non DevTools): target ≥44px; "apro → 2 ingredienti → vedo una ricetta" in meno di 15 secondi e 5 tap.
- **Tastiera e screen reader**: attraversare dispensa e risultati senza perdere il focus.
- **Offline**: PWA installata, modalità aereo, aprire una ricetta e la lista della spesa. Tutto funziona, font compresi.
- **Dispensa nel tempo**: popolare, chiudere, riaprire dopo giorni. L'app non deve mai affermare con certezza ciò che non può sapere.
- **Linguaggio**: revisione di tutte le stringhe a caccia di promesse sanitarie o di dimagrimento. Nessuna deve esistere.
- **AI**: su 20 generazioni, zero ricette con ingredienti non dichiarati; ogni ricetta etichettata; rate limit che rifiuta.
