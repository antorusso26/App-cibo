/* Scanner scontrini: legge la foto di uno scontrino e ne ricava i prezzi.
   L'OCR gira tutto nel browser (Tesseract.js in WebAssembly): la foto non
   viene caricata da nessuna parte. I prezzi riconosciuti diventano i "tuoi"
   prezzi e hanno la precedenza su quelli raccolti dai siti delle catene. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const CDN = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';
  const STORE_KEY = 'cosa-cucino-scontrini';
  const euro = n => n.toFixed(2).replace('.', ',') + ' €';

  // Sugli scontrini i nomi sono abbreviati e in stampatello: qui le forme
  // più comuni, in aggiunta al nome normale dell'ingrediente.
  const SINONIMI = {
    pasta: ['spaghett', 'penne', 'fusilli', 'rigatoni', 'maccheron', 'past'],
    riso: ['riso'],
    pane: ['pane', 'panini', 'rosette', 'ciabatt', 'baguette'],
    pangrattato: ['pangratt', 'pan gratt'],
    farina: ['farina'],
    zucchero: ['zucchero', 'zucch'],
    lievito: ['lievito'],
    passata: ['passata', 'pelati', 'polpa pom', 'pomodoro pelat'],
    uova: ['uova', 'uovo'],
    latte: ['latte'],
    burro: ['burro'],
    yogurt: ['yogurt', 'yoghurt'],
    parmigiano: ['parmigiano', 'parm regg', 'grana'],
    pecorino: ['pecorino'],
    mozzarella: ['mozzarella', 'mozz'],
    ricotta: ['ricotta'],
    formaggio_fette: ['sottilette', 'formaggio fette', 'fettine form'],
    pollo: ['pollo', 'tacchino', 'petto poll'],
    carne_macinata: ['macinat', 'trita', 'bovino mac'],
    salsiccia: ['salsicc', 'luganega'],
    pancetta: ['pancetta', 'guanciale'],
    prosciutto_cotto: ['prosc cotto', 'prosciutto cotto', 'pr cotto'],
    wurstel: ['wurstel', 'würstel'],
    tonno: ['tonno'],
    salmone: ['salmone'],
    gamberi: ['gamber', 'mazzancoll'],
    pomodori: ['pomodor', 'pomod', 'datterin', 'ciliegin'],
    cipolla: ['cipoll'],
    aglio: ['aglio'],
    zucchine: ['zucchin'],
    melanzane: ['melanzan'],
    peperoni: ['peperon'],
    patate: ['patate', 'patata'],
    carote: ['carot'],
    spinaci: ['spinac'],
    insalata: ['insalat', 'lattug', 'rucola'],
    funghi: ['funghi', 'champignon'],
    broccoli: ['broccol'],
    piselli: ['piselli'],
    cetriolo: ['cetriol'],
    avocado: ['avocado'],
    basilico: ['basilico'],
    prezzemolo: ['prezzemolo'],
    limone: ['limon'],
    banana: ['banan'],
    mela: ['mele', 'mela'],
    fragole: ['fragol'],
    ceci: ['ceci'],
    fagioli: ['fagiol'],
    lenticchie: ['lenticch'],
    avena: ['avena', 'fiocchi'],
    couscous: ['cous cous', 'couscous'],
    cacao: ['cacao'],
    miele: ['miele'],
    noci: ['noci', 'mandorle', 'nocciole', 'arachidi'],
    olive: ['olive'],
    capperi: ['capperi'],
    peperoncino: ['peperoncin'],
    origano: ['origano'],
    rosmarino: ['rosmarino'],
    paprika: ['paprika'],
    cannella: ['cannella'],
  };

  // Righe che non sono prodotti
  const NON_PRODOTTI = /totale|subtotal|contant|resto|iva |imposta|carta|bancomat|pagament|punti|sconto fid|arrotond|documento|scontrino|cassa|operatore|grazie|arrivederci|numero|codice|partita|telefono|www|importo|pezzi|articoli/i;

  const CATENE_NOTE = {
    esselunga: /esselunga/i, conad: /conad/i, coop: /\bcoop\b|ipercoop|easycoop/i,
    lidl: /lidl/i, carrefour: /carrefour/i, eurospin: /eurospin/i, penny: /penny/i, md: /\bmd\b/i,
  };

  let tesseractPronto = null;
  let righeLette = [];

  const normalizza = t => (t || '').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();

  // ---------- Prezzi salvati ----------
  function salvati() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch { return {}; }
  }
  function salva(prezzi) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(prezzi)); } catch { /* ignora */ }
  }
  function prezzoUtente(ingId) {
    const p = salvati()[ingId];
    return p ? { ...p, daScontrino: true } : null;
  }

  // ---------- Preparazione immagine ----------
  // Ridimensiona, porta in bianco e nero e aumenta il contrasto: su una foto
  // di scontrino l'OCR ci prende molto di più.
  function preparaImmagine(file) {
    return new Promise((risolvi, rifiuta) => {
      const img = new Image();
      img.onload = () => {
        const maxLato = 1600;
        const scala = Math.min(1, maxLato / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scala);
        canvas.height = Math.round(img.height * scala);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dati = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const px = dati.data;
        let somma = 0;
        for (let i = 0; i < px.length; i += 4) {
          const g = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
          px[i] = px[i + 1] = px[i + 2] = g;
          somma += g;
        }
        const media = somma / (px.length / 4);
        for (let i = 0; i < px.length; i += 4) {
          // contrasto attorno alla luminosità media della foto
          const v = px[i] < media - 12 ? Math.max(0, px[i] - 40) : Math.min(255, px[i] + 40);
          px[i] = px[i + 1] = px[i + 2] = v;
        }
        ctx.putImageData(dati, 0, 0);
        URL.revokeObjectURL(img.src);
        canvas.toBlob(b => b ? risolvi(b) : rifiuta(new Error('canvas')), 'image/png');
      };
      img.onerror = () => rifiuta(new Error('Immagine non leggibile'));
      img.src = URL.createObjectURL(file);
    });
  }

  // ---------- OCR ----------
  function caricaTesseract() {
    if (tesseractPronto) return tesseractPronto;
    tesseractPronto = new Promise((risolvi, rifiuta) => {
      const s = document.createElement('script');
      s.src = CDN;
      s.onload = () => risolvi(window.Tesseract);
      s.onerror = () => rifiuta(new Error('Non riesco a scaricare il motore OCR'));
      document.head.appendChild(s);
    });
    return tesseractPronto;
  }

  async function leggi(file, onProgresso) {
    const Tesseract = await caricaTesseract();
    const immagine = await preparaImmagine(file);
    const { data } = await Tesseract.recognize(immagine, 'ita', {
      logger: m => {
        if (m.status === 'recognizing text') onProgresso(0.2 + 0.8 * m.progress, 'Leggo lo scontrino…');
        else if (m.status.includes('loading')) onProgresso(0.1, 'Scarico il motore OCR (solo la prima volta)…');
      },
    });
    return data.text || '';
  }

  // ---------- Interpretazione ----------
  function riconosciIngrediente(descrizione) {
    const testo = normalizza(descrizione);
    let migliore = null;
    for (const ing of INGREDIENTS) {
      const chiavi = [normalizza(ing.name), ...(SINONIMI[ing.id] || [])];
      for (const k of chiavi) {
        if (k.length < 3) continue;
        const dove = testo.indexOf(k);
        if (dove < 0) continue;
        // vince la parola più lunga; a parità, quella che compare per prima
        // ("PASSATA POMODORO" è passata, non pomodori)
        if (!migliore || k.length > migliore.lung ||
            (k.length === migliore.lung && dove < migliore.dove)) {
          migliore = { id: ing.id, lung: k.length, dove };
        }
      }
    }
    return migliore && migliore.id;
  }

  function interpreta(testo) {
    const righe = testo.split('\n').map(r => r.trim()).filter(Boolean);
    const catena = Object.keys(CATENE_NOTE).find(c => CATENE_NOTE[c].test(testo)) || null;
    const prodotti = [];
    for (const riga of righe) {
      if (NON_PRODOTTI.test(riga)) continue;
      // "DESCRIZIONE ......  1,29" (a volte con € o una lettera di reparto in fondo)
      const m = riga.match(/^(.{3,}?)[\s.:]*(\d{1,3})[.,](\d{2})\s*(?:€|eur)?\s*[A-Za-z]?$/);
      if (!m) continue;
      const descrizione = m[1].replace(/[*x#]+$/i, '').replace(/\s{2,}/g, ' ').trim();
      const prezzo = parseFloat(m[2] + '.' + m[3]);
      if (!descrizione || prezzo <= 0 || prezzo > 200) continue;
      if (/^\d+$/.test(descrizione.replace(/\s/g, ''))) continue;
      prodotti.push({ descrizione, prezzo, ingrediente: riconosciIngrediente(descrizione) });
    }
    return { catena, prodotti };
  }

  // ---------- Interfaccia ----------
  function opzioniIngredienti(selezionato) {
    const gruppi = CATEGORIES.map(c => {
      const voci = INGREDIENTS.filter(i => i.cat === c.id).map(i =>
        `<option value="${i.id}" ${i.id === selezionato ? 'selected' : ''}>${i.emoji} ${i.name}</option>`).join('');
      return `<optgroup label="${c.emoji} ${c.name}">${voci}</optgroup>`;
    }).join('');
    return `<option value="">— non è un ingrediente —</option>${gruppi}`;
  }

  function mostraRisultato({ catena, prodotti }) {
    righeLette = prodotti;
    const corpo = $('#scontrino-corpo');
    if (!prodotti.length) {
      corpo.innerHTML = `<div class="scontrino-vuoto">
        <p>😕 Non ho trovato prezzi in questa foto.</p>
        <p class="note">Consigli: scontrino ben disteso, luce buona, foto dall'alto e ravvicinata.
        Puoi anche fotografare solo la parte con i prodotti.</p></div>`;
      return;
    }
    const riconosciuti = prodotti.filter(p => p.ingrediente).length;
    corpo.innerHTML = `
      <p class="scontrino-esito">Trovate <b>${prodotti.length}</b> righe${catena ? ` · scontrino <b>${catena}</b>` : ''} ·
        <b>${riconosciuti}</b> collegate a un ingrediente. Controlla e correggi se serve.</p>
      <ul class="righe-scontrino">
        ${prodotti.map((p, i) => `<li>
          <div class="riga-testa">
            <span class="riga-desc">${p.descrizione}</span>
            <span class="riga-prezzo">${euro(p.prezzo)}</span>
          </div>
          <select data-riga="${i}" class="riga-select">${opzioniIngredienti(p.ingrediente)}</select>
        </li>`).join('')}
      </ul>
      <label class="riga-check"><input type="checkbox" id="aggiungi-dispensa" checked>
        Aggiungi questi ingredienti alla mia dispensa</label>
      <button class="btn primary grande" id="btn-salva-scontrino">Salva i prezzi 💾</button>`;

    corpo.querySelectorAll('.riga-select').forEach(sel => {
      sel.addEventListener('change', e => { righeLette[+e.target.dataset.riga].ingrediente = e.target.value || null; });
    });
    $('#btn-salva-scontrino').addEventListener('click', () => salvaRighe(catena));
  }

  function salvaRighe(catena) {
    const api = window.CosaCucino;
    const prezzi = salvati();
    const oggi = new Date().toISOString().slice(0, 10);
    let n = 0;
    for (const p of righeLette) {
      if (!p.ingrediente) continue;
      prezzi[p.ingrediente] = { nome: p.descrizione, prezzo: p.prezzo, data: oggi, catena };
      if ($('#aggiungi-dispensa').checked) api.state.pantry.add(p.ingrediente);
      n++;
    }
    salva(prezzi);
    api.salvaStato();
    api.toast(n ? `Salvati ${n} prezzi dal tuo scontrino 🧾` : 'Nessuna riga collegata a un ingrediente');
    $('#scontrino-modal').close();
    if (window.SPESA) window.SPESA.aggiorna();
  }

  function apri() {
    $('#scontrino-corpo').innerHTML = `
      <p>Fotografa lo scontrino (o scegli una foto già scattata): leggo i prezzi
        <b>qui sul tuo dispositivo</b>, la foto non viene inviata a nessuno.</p>
      <label class="carica-foto">
        <input type="file" accept="image/*" capture="environment" id="foto-scontrino" hidden>
        <span>📷 Scegli o scatta la foto</span>
      </label>`;
    $('#foto-scontrino').addEventListener('change', async e => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const corpo = $('#scontrino-corpo');
      corpo.innerHTML = `<div class="ocr-stato">
        <div class="ocr-emoji">🧾</div>
        <p id="ocr-testo">Preparo la foto…</p>
        <div class="barra-ocr"><i id="ocr-barra" style="width:5%"></i></div>
        <p class="note">La prima volta scarico il motore OCR (qualche MB), poi resta in memoria.</p>
      </div>`;
      try {
        const testo = await leggi(file, (p, msg) => {
          const barra = $('#ocr-barra'); const t = $('#ocr-testo');
          if (barra) barra.style.width = Math.round(p * 100) + '%';
          if (t && msg) t.textContent = msg;
        });
        mostraRisultato(interpreta(testo));
      } catch (err) {
        corpo.innerHTML = `<div class="scontrino-vuoto"><p>😕 ${err.message}</p>
          <p class="note">Se sei offline il motore OCR non si può scaricare: riprova con la rete attiva.</p></div>`;
      }
    });
    $('#scontrino-modal').showModal();
  }

  // `interpreta` è esposto anche per poterlo provare senza fotografare nulla
  window.SCONTRINI = { apri, prezzoUtente, salvati, interpreta };

  function init() {
    const dlg = $('#scontrino-modal');
    if (!dlg) return;
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
    $('#scontrino-chiudi').addEventListener('click', () => dlg.close());
    document.querySelectorAll('[data-apri-scontrino]').forEach(b => b.addEventListener('click', apri));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
