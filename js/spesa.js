/* Schermata "Spesa": scegli supermercato e quanto vuoi spendere,
   l'app propone un menù e la lista della spesa che sta nel budget.
   I prezzi arrivano da data/prezzi.json (vedi cartella scraper/). */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const escapeHtml = s => String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const euro = n => n.toFixed(2).replace('.', ',') + ' €';

  const RIPIEGO = ['esselunga', 'coop', 'conad', 'lidl']; // se la catena scelta non ha quel prodotto
  const STORE_KEY = 'cosa-cucino-spesa';

  let DATI = null;
  let caricamento = null;
  const scelte = { catena: 'esselunga', min: 15, max: 35, persone: 2, pasti: 5 };

  // ---------- Dati ----------
  function carica() {
    if (caricamento) return caricamento;
    caricamento = fetch('data/prezzi.json')
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(d => (DATI = d))
      .catch(() => null);
    return caricamento;
  }

  function prezzoDi(ingId, catena) {
    const riga = DATI && DATI.ingredienti[ingId];
    if (!riga) return null;
    if (riga[catena]) return { ...riga[catena], catena, esatto: true };
    for (const alt of RIPIEGO) {
      if (riga[alt]) return { ...riga[alt], catena: alt, esatto: false };
    }
    return null;
  }

  // Un ingrediente della ricetta può avere alternative: prendiamo la più economica.
  function prezzoIngrediente(id, catena) {
    const ids = Array.isArray(id) ? id : [id];
    const opzioni = ids.map(x => {
      const p = prezzoDi(x, catena);
      return p && { ...p, ingId: x };
    }).filter(Boolean);
    if (!opzioni.length) return null;
    return opzioni.sort((a, b) => a.prezzo - b.prezzo)[0];
  }

  // ---------- Il piano ----------
  function pianifica() {
    const api = window.CosaCucino;
    const dispensa = api.state.pantry;
    const candidate = RECIPES
      .map(r => api.evaluate(r))
      .filter(m => m.toolsOk)
      .map(m => m.r);

    const carrello = new Map();   // ingrediente -> prodotto da comprare
    const menu = [];
    let totale = 0;
    const senzaPrezzo = new Set();

    const daComprare = r => {
      const nuovi = [];
      for (const i of r.ing) {
        if (i.opt) continue;
        const ids = Array.isArray(i.id) ? i.id : [i.id];
        if (ids.some(x => dispensa.has(x))) continue;          // ce l'hai già
        if (ids.some(x => carrello.has(x))) continue;          // già nel carrello
        const p = prezzoIngrediente(i.id, scelte.catena);
        if (!p) { senzaPrezzo.add(ids[0]); continue; }
        nuovi.push({ ...p, qtaRicetta: i.q });
      }
      return nuovi;
    };

    while (menu.length < scelte.pasti) {
      let migliore = null;
      for (const r of candidate) {
        if (menu.some(m => m.r.id === r.id)) continue;
        const nuovi = daComprare(r);
        const costo = nuovi.reduce((s, p) => s + p.prezzo, 0);
        if (totale + costo > scelte.max) continue;
        // preferiamo le ricette che costano poco a porzione e che riusano
        // quello che c'è già nel carrello
        const porzioni = Math.max(1, Math.min(r.servings, scelte.persone));
        const punteggio = (costo + 0.2) / porzioni;
        if (!migliore || punteggio < migliore.punteggio) migliore = { r, nuovi, costo, punteggio };
      }
      if (!migliore) break;
      migliore.nuovi.forEach(p => carrello.set(p.ingId, p));
      totale += migliore.costo;
      menu.push({ r: migliore.r, costo: migliore.costo });
    }

    return { menu, carrello, totale, senzaPrezzo: [...senzaPrezzo] };
  }

  // ---------- Interfaccia ----------
  function renderCatene() {
    const catene = (DATI && DATI.catene) || [];
    $('#catene').innerHTML = catene.map(c => {
      const etichetta = c.tipo === 'prezzi' ? 'prezzi reali'
        : c.tipo === 'offerte' ? 'solo offerte' : 'prezzi stimati';
      return `<button class="catena ${scelte.catena === c.id ? 'on' : ''}" data-catena="${c.id}">
        <b>${escapeHtml(c.nome)}</b><small>${etichetta}</small></button>`;
    }).join('');
  }

  function aggiornaBudget() {
    const min = $('#budget-min'), max = $('#budget-max');
    if (+min.value > +max.value) {
      if (document.activeElement === min) max.value = min.value;
      else min.value = max.value;
    }
    scelte.min = +min.value;
    scelte.max = +max.value;
    $('#budget-label').textContent = `${scelte.min} € – ${scelte.max} €`;
    salva();
  }

  function salva() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(scelte)); } catch { /* ignora */ }
  }

  function ripristina() {
    try {
      const s = JSON.parse(localStorage.getItem(STORE_KEY));
      if (s) Object.assign(scelte, s);
    } catch { /* ignora */ }
    $('#budget-min').value = scelte.min;
    $('#budget-max').value = scelte.max;
    $('#persone').value = scelte.persone;
    $('#pasti').value = scelte.pasti;
    $('#budget-label').textContent = `${scelte.min} € – ${scelte.max} €`;
  }

  function renderPiano() {
    const api = window.CosaCucino;
    const box = $('#piano');
    if (!DATI) {
      box.innerHTML = `<div class="empty-state"><div class="big">📡</div>
        <h3>Prezzi non disponibili</h3>
        <p>Non riesco a leggere <code>data/prezzi.json</code>. Se hai aperto il file
        direttamente col doppio clic, serve un piccolo server: <code>python3 -m http.server</code>.</p></div>`;
      return;
    }
    const { menu, carrello, totale, senzaPrezzo } = pianifica();
    if (!menu.length) {
      box.innerHTML = `<div class="empty-state"><div class="big">😅</div>
        <h3>Con ${euro(scelte.max)} non ci sto dentro</h3>
        <p>Alza un po' il budget massimo, oppure seleziona più strumenti nella cucina:
        con più strumenti posso proporti ricette più economiche.</p></div>`;
      return;
    }

    const catena = DATI.catene.find(c => c.id === scelte.catena) || {};
    const porzioni = menu.reduce((s, m) => s + Math.min(m.r.servings, scelte.persone), 0);
    const perPasto = totale / menu.length;
    const dentro = totale >= scelte.min && totale <= scelte.max;
    const percentuale = Math.min(100, Math.round(100 * totale / scelte.max));

    const lista = [...carrello.values()].sort((a, b) => b.prezzo - a.prezzo);
    const offerte = lista.filter(p => p.inOfferta);

    box.innerHTML = `
      <div class="totale-box ${dentro ? 'ok' : 'sotto'}">
        <div>
          <div class="totale-cifra">${euro(totale)}</div>
          <div class="totale-nota">${menu.length} pasti · ${euro(perPasto)} a pasto ·
            ${euro(totale / Math.max(1, porzioni))} a porzione</div>
        </div>
        <div class="barra-budget" title="Budget ${scelte.min}–${scelte.max} €">
          <i style="width:${percentuale}%"></i>
          <span class="tacca" style="left:${Math.min(100, 100 * scelte.min / scelte.max)}%"></span>
        </div>
        <div class="totale-nota">Prezzi ${catena.tipo === 'stima' ? 'stimati' : 'di'} ${escapeHtml(catena.nome || '')} ·
          aggiornati il ${new Date(DATI.aggiornato).toLocaleDateString('it-IT')}</div>
      </div>

      ${offerte.length ? `<div class="offerte-box">🏷️ <b>In offerta questa settimana:</b>
        ${offerte.map(o => `${escapeHtml(o.nome)} (−${o.sconto}%)`).join(' · ')}</div>` : ''}

      <h3 class="sezione">🍽️ Il menù</h3>
      <div class="results">
        ${menu.map(m => `<article class="card" tabindex="0" role="button" data-id="${m.r.id}">
          <div class="card-top">
            <div class="card-emoji">${m.r.emoji}</div>
            <div><h3>${escapeHtml(m.r.name)}</h3>
              <div class="tags">${m.r.tags.join(' · ')}</div></div>
          </div>
          <div class="stats">
            <span class="stat time">⏱ ${api.fmtTime(m.r.time)}</span>
            <span class="stat kcal">🔥 ${m.r.kcal} kcal</span>
            <span class="stat spesa">🛒 ${m.costo ? euro(m.costo) : 'ce l’hai già'}</span>
          </div>
        </article>`).join('')}
      </div>

      <h3 class="sezione">🧾 Lista della spesa <small>${lista.length} prodotti</small></h3>
      <ul class="lista-spesa">
        ${lista.map(p => `<li>
          <label><input type="checkbox" /> <span class="emo">${api.ingEmoji(p.ingId)}</span>
            <span class="prodotto">${escapeHtml(p.nome)}
              ${p.inOfferta ? `<span class="badge-offerta">−${p.sconto}%</span>` : ''}
              ${p.esatto ? '' : '<span class="badge-stima">prezzo di un\'altra catena</span>'}
              ${p.stima ? '<span class="badge-stima">stima</span>' : ''}
            </span></label>
          <span class="prezzo">${euro(p.prezzo)}</span>
        </li>`).join('')}
      </ul>
      ${senzaPrezzo.length ? `<p class="note">Senza prezzo (aggiungili a occhio):
        ${senzaPrezzo.map(id => escapeHtml(api.ingName(id))).join(', ')}.</p>` : ''}
      <p class="note">${escapeHtml(DATI.nota || '')} Le confezioni bastano di solito per più ricette.</p>`;

    box.querySelectorAll('.card').forEach(c => {
      const apri = () => api.openRecipe(c.dataset.id);
      c.addEventListener('click', apri);
      c.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); apri(); }
      });
    });
  }

  async function mostra() {
    await carica();
    renderCatene();
    if (!$('#piano').innerHTML.trim()) renderPiano();
  }

  function init() {
    ripristina();
    $('#catene').addEventListener('click', e => {
      const b = e.target.closest('[data-catena]');
      if (!b) return;
      scelte.catena = b.dataset.catena;
      renderCatene();
      salva();
      renderPiano();
    });
    $('#budget-min').addEventListener('input', aggiornaBudget);
    $('#budget-max').addEventListener('input', aggiornaBudget);
    ['persone', 'pasti'].forEach(id => {
      $('#' + id).addEventListener('change', e => {
        scelte[id] = Math.max(1, +e.target.value || 1);
        e.target.value = scelte[id];
        salva();
      });
    });
    $('#btn-piano').addEventListener('click', async () => {
      await carica();
      renderPiano();
      $('#piano').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  window.SPESA = { mostra };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
