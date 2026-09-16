(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  const ING = Object.fromEntries(INGREDIENTS.map(i => [i.id, i]));
  const TOOL = Object.fromEntries(TOOLS.map(t => [t.id, t]));
  const STEPS = ['cucina', 'dispensa', 'ricette', 'spesa'];
  const STORE_KEY = 'cosa-cucino-v1';

  const state = {
    step: 'cucina',
    tools: new Set(),
    pantry: new Set(),
    maxTime: 150,
    maxKcal: 800,
    maxMissing: 0,
    sort: 'match',
  };

  // ---------- Persistenza ----------
  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY));
      if (!saved) return;
      state.tools = new Set((saved.tools || []).filter(id => TOOL[id]));
      state.pantry = new Set((saved.pantry || []).filter(id => ING[id]));
    } catch { /* storage non disponibile */ }
  }
  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ tools: [...state.tools], pantry: [...state.pantry] }));
    } catch { /* ignora */ }
  }

  // ---------- Utility ----------
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
  }
  function say(msg) {
    const s = $('#speech');
    s.textContent = msg;
    s.classList.remove('pop');
    void s.offsetWidth;
    s.classList.add('pop');
  }
  const ingName = id => Array.isArray(id) ? id.map(x => ING[x]?.name.toLowerCase()).join(' o ') : ING[id]?.name;
  const ingEmoji = id => ING[Array.isArray(id) ? id[0] : id]?.emoji || '•';
  const hasIng = id => Array.isArray(id) ? id.some(x => state.pantry.has(x)) : state.pantry.has(id);
  const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ---------- Navigazione ----------
  function goTo(step) {
    state.step = step;
    $$('.step').forEach(s => s.classList.toggle('active', s.id === `step-${step}`));
    $$('.step-btn').forEach(b => b.classList.toggle('active', b.dataset.step === step));
    const next = $('#btn-next');
    next.textContent = step === 'cucina' ? 'Apri il frigo →'
      : step === 'dispensa' ? 'Trova ricette 🍽️'
      : step === 'ricette' ? 'Fai la spesa 🛒' : '← Ingredienti';
    if (step === 'ricette') renderResults();
    if (step === 'spesa' && window.SPESA) window.SPESA.mostra();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ---------- Step 1: strumenti ----------
  function toggleTool(id) {
    const on = !state.tools.has(id);
    on ? state.tools.add(id) : state.tools.delete(id);
    const g = $(`.tool[data-tool="${id}"]`);
    g.classList.toggle('on', on);
    g.classList.remove('bounce'); void g.getBBox(); g.classList.add('bounce');
    say(on ? TOOL[id].quip : `Ok, niente ${TOOL[id].name.toLowerCase()} 👌`);
    // Pentola/padella senza fornelli: suggerimento amichevole
    if (on && (id === 'pentola' || id === 'padella') && !state.tools.has('fornelli')) {
      setTimeout(() => toast('Psst… ricordati di accendere anche i fornelli 🔥'), 600);
    }
    renderToolChips();
    updateSummary();
    save();
  }

  function renderToolChips() {
    $('#tool-chips').innerHTML = TOOLS.map(t =>
      `<button class="chip ${state.tools.has(t.id) ? 'on' : ''}" data-tool="${t.id}" aria-pressed="${state.tools.has(t.id)}">
        <span class="emo">${t.emoji}</span>${t.name}</button>`).join('');
  }

  function initKitchen() {
    $$('.tool').forEach(g => {
      g.classList.toggle('on', state.tools.has(g.dataset.tool));
      g.addEventListener('click', () => toggleTool(g.dataset.tool));
      g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleTool(g.dataset.tool); } });
      g.addEventListener('animationend', () => g.classList.remove('bounce'));
    });
    const fridge = $('#fridge');
    const openFridge = () => {
      fridge.classList.remove('wiggle'); void fridge.getBBox(); fridge.classList.add('wiggle');
      setTimeout(() => goTo('dispensa'), 350);
    };
    fridge.addEventListener('click', openFridge);
    fridge.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFridge(); } });
    $('#tool-chips').addEventListener('click', e => {
      const b = e.target.closest('[data-tool]');
      if (b) toggleTool(b.dataset.tool);
    });
    renderToolChips();
  }

  // ---------- Step 2: ingredienti ----------
  function renderIngredients() {
    const q = $('#ing-search').value.trim().toLowerCase();
    $('#ingredient-groups').innerHTML = CATEGORIES.map(c => {
      const items = INGREDIENTS.filter(i => i.cat === c.id && (!q || i.name.toLowerCase().includes(q)));
      const count = INGREDIENTS.filter(i => i.cat === c.id && state.pantry.has(i.id)).length;
      return `<div class="ing-group ${items.length ? '' : 'empty'}">
        <h3>${c.emoji} ${c.name} ${count ? `<small>· ${count} selezionati</small>` : ''}</h3>
        <div class="chips">${items.map(i =>
          `<button class="chip ${state.pantry.has(i.id) ? 'on' : ''}" data-ing="${i.id}" aria-pressed="${state.pantry.has(i.id)}">
            <span class="emo">${i.emoji}</span>${i.name}</button>`).join('')}
        </div></div>`;
    }).join('');
  }

  function initPantry() {
    $('#ingredient-groups').addEventListener('click', e => {
      const b = e.target.closest('[data-ing]');
      if (!b) return;
      const id = b.dataset.ing;
      state.pantry.has(id) ? state.pantry.delete(id) : state.pantry.add(id);
      renderIngredients();
      updateSummary();
      save();
    });
    $('#ing-search').addEventListener('input', renderIngredients);
    $('#btn-common').addEventListener('click', () => {
      COMMON_INGREDIENTS.forEach(id => state.pantry.add(id));
      renderIngredients(); updateSummary(); save();
      toast('Aggiunte le basi che ci sono in ogni casa ✨');
    });
    $('#btn-clear').addEventListener('click', () => {
      state.pantry.clear();
      renderIngredients(); updateSummary(); save();
      toast('Frigo svuotato 🧹 (solo nell’app, tranquillo)');
    });
    renderIngredients();
  }

  // ---------- Matching ricette ----------
  function evaluate(r) {
    const toolsOk = r.tools.every(group => (Array.isArray(group) ? group : [group]).some(t => state.tools.has(t)));
    const required = r.ing.filter(i => !i.opt);
    const missing = required.filter(i => !hasIng(i.id));
    const optHave = r.ing.filter(i => i.opt && hasIng(i.id)).length;
    const score = required.length ? (required.length - missing.length) / required.length : 1;
    return { r, toolsOk, missing, optHave, score };
  }

  function matchingRecipes() {
    return RECIPES.map(evaluate)
      .filter(m => m.toolsOk && m.missing.length <= state.maxMissing && m.r.time <= state.maxTime && m.r.kcal <= state.maxKcal)
      .filter(m => m.score > 0) // almeno un ingrediente principale in casa
      .sort((a, b) => {
        if (a.missing.length !== b.missing.length) return a.missing.length - b.missing.length;
        if (state.sort === 'time') return a.r.time - b.r.time;
        if (state.sort === 'kcal') return a.r.kcal - b.r.kcal;
        return b.score - a.score || b.optHave - a.optHave || a.r.time - b.r.time;
      });
  }

  const fmtTime = m => m < 60 ? `${m} min` : `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60}` : ''}`;
  const toolsLabel = r => r.tools.length
    ? r.tools.map(g => (Array.isArray(g) ? g : [g]).map(t => TOOL[t].emoji).join('/')).join(' ')
    : '🙌 niente';

  function renderResults() {
    const list = matchingRecipes();
    const box = $('#results');
    $('#results-summary').textContent = list.length
      ? `${list.length} ${list.length === 1 ? 'ricetta trovata' : 'ricette trovate'} con ${state.tools.size} strumenti e ${state.pantry.size} ingredienti.`
      : '';

    if (!list.length) {
      const noIng = state.pantry.size === 0;
      box.innerHTML = `<div class="empty-state">
        <div class="big">${noIng ? '🧺' : '🤔'}</div>
        <h3>${noIng ? 'Il frigo è vuoto!' : 'Nessuna ricetta con questi filtri'}</h3>
        <p>${noIng
          ? 'Seleziona qualche ingrediente in dispensa e ti mostro cosa cucinare.'
          : 'Prova ad accettare 1–2 ingredienti mancanti, allargare tempo e calorie, o aggiungere uno strumento.'}</p>
        <button class="btn primary" data-go="${noIng ? 'dispensa' : 'missing'}">${noIng ? 'Vai alla dispensa' : 'Mostra anche con 2 mancanti'}</button>
      </div>`;
      return;
    }

    box.innerHTML = list.map((m, i) => {
      const r = m.r;
      return `<article class="card" tabindex="0" role="button" data-id="${r.id}" style="animation-delay:${Math.min(i, 12) * 35}ms">
        <div class="card-top">
          <div class="card-emoji">${r.emoji}</div>
          <div><h3>${escapeHtml(r.name)}</h3><div class="tags">${r.tags.join(' · ')} · ${toolsLabel(r)}</div></div>
        </div>
        <div class="stats">
          <span class="stat time">⏱ ${fmtTime(r.time)}</span>
          <span class="stat kcal">🔥 ${r.kcal} kcal</span>
          <span class="stat diff">${r.difficulty}</span>
        </div>
        <div class="match" title="Ingredienti principali che hai"><i style="width:${Math.round(m.score * 100)}%"></i></div>
        ${m.missing.length
          ? `<div class="missing">🛒 Ti manca: ${m.missing.map(x => ingName(x.id)).join(', ')}</div>`
          : `<div class="ok">✅ Hai tutto il necessario!</div>`}
      </article>`;
    }).join('');
  }

  function initFilters() {
    const time = $('#f-time'), kcal = $('#f-kcal');
    const syncLabels = () => {
      $('#time-val').textContent = +time.value >= 150 ? 'qualsiasi' : fmtTime(+time.value);
      $('#kcal-val').textContent = +kcal.value >= 800 ? 'qualsiasi' : `${kcal.value} kcal`;
    };
    time.addEventListener('input', () => { state.maxTime = +time.value >= 150 ? Infinity : +time.value; syncLabels(); renderResults(); });
    kcal.addEventListener('input', () => { state.maxKcal = +kcal.value >= 800 ? Infinity : +kcal.value; syncLabels(); renderResults(); });
    state.maxTime = Infinity; state.maxKcal = Infinity;
    syncLabels();

    $('#f-missing').addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      setMissing(+b.dataset.v);
    });
    $('#f-sort').addEventListener('change', e => { state.sort = e.target.value; renderResults(); });

    $('#results').addEventListener('click', e => {
      const go = e.target.closest('[data-go]');
      if (go) return go.dataset.go === 'missing' ? setMissing(2) : goTo(go.dataset.go);
      const card = e.target.closest('.card');
      if (card) openRecipe(card.dataset.id);
    });
    $('#results').addEventListener('keydown', e => {
      const card = e.target.closest('.card');
      if (card && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openRecipe(card.dataset.id); }
    });

    $('#btn-surprise').addEventListener('click', () => {
      const list = matchingRecipes();
      const pool = list.filter(m => !m.missing.length);
      const pick = (pool.length ? pool : list)[Math.floor(Math.random() * (pool.length || list.length))];
      if (!pick) return toast('Niente da estrarre… aggiungi qualche ingrediente 🎲');
      toast(`🎲 Stasera si mangia: ${pick.r.name}!`);
      openRecipe(pick.r.id);
    });
  }

  function setMissing(v) {
    state.maxMissing = v;
    $$('#f-missing button').forEach(x => x.classList.toggle('on', +x.dataset.v === v));
    renderResults();
  }

  // ---------- Dettaglio ricetta ----------
  function openRecipe(id) {
    const r = RECIPES.find(x => x.id === id);
    const m = evaluate(r);
    $('#modal-content').innerHTML = `
      <div class="modal-head">
        <button class="modal-close" aria-label="Chiudi">✕</button>
        <div class="big-emoji">${r.emoji}</div>
        <h2 id="modal-title">${escapeHtml(r.name)}</h2>
        <div class="stats">
          <span class="stat time">⏱ ${fmtTime(r.time)}</span>
          <span class="stat kcal">🔥 ${r.kcal} kcal / porzione</span>
          <span class="stat">🍽️ ${r.servings} ${r.servings === 1 ? 'porzione' : 'porzioni'}</span>
          <span class="stat diff">${r.difficulty}</span>
        </div>
      </div>
      <div class="modal-body">
        <h3>🧰 Strumenti</h3>
        <div>${r.tools.length ? r.tools.map(g => (Array.isArray(g) ? g : [g]).map(t => `${TOOL[t].emoji} ${TOOL[t].name}`).join(' <i>oppure</i> ')).join(' · ') : '🙌 Nessuno: niente fornelli!'}</div>
        <h3>🥕 Ingredienti</h3>
        <ul class="ing-list">
          ${r.ing.map(i => {
            const have = hasIng(i.id);
            return `<li class="${have ? 'have' : i.opt ? '' : 'miss'}">
              <span>${have ? '✅' : i.opt ? '➕' : '🛒'}</span>
              <span>${ingEmoji(i.id)} ${ingName(i.id)} ${i.opt ? '<span class="optl">facoltativo</span>' : ''}</span>
              <span class="q">${escapeHtml(i.q)}</span></li>`;
          }).join('')}
          <li><span>🧂</span><span>Sale, pepe, olio</span><span class="q">q.b.</span></li>
        </ul>
        ${m.missing.length ? `<p class="missing">Ti manca: ${m.missing.map(x => ingName(x.id)).join(', ')}. Aggiungilo alla lista della spesa!</p>` : ''}
        <h3>👩‍🍳 Preparazione</h3>
        <ol class="steps-list">${r.steps.map(s => `<li><span>${escapeHtml(s)}</span></li>`).join('')}</ol>
        <p class="note">Le calorie sono una stima indicativa per porzione e variano in base a dosi e marche.</p>
      </div>`;
    const dlg = $('#recipe-modal');
    dlg.showModal();
    $('.modal-close', dlg).addEventListener('click', () => dlg.close());
  }

  function initModal() {
    const dlg = $('#recipe-modal');
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  }

  // ---------- Riepilogo & barra ----------
  function updateSummary() {
    const ready = RECIPES.map(evaluate).filter(m => m.toolsOk && !m.missing.length && m.score > 0).length;
    $('#summary').innerHTML = `🧰 <b>${state.tools.size}</b> · 🥕 <b>${state.pantry.size}</b> · 🍽️ <b>${ready}</b> pronte`;
  }

  function init() {
    load();
    initKitchen();
    initPantry();
    initFilters();
    initModal();
    $$('.step-btn').forEach(b => b.addEventListener('click', () => goTo(b.dataset.step)));
    $('#btn-next').addEventListener('click', () => {
      const i = STEPS.indexOf(state.step);
      goTo(state.step === 'spesa' ? 'dispensa' : STEPS[i + 1]);
    });
    updateSummary();
    // Quello che serve alla schermata Spesa (js/spesa.js)
    window.CosaCucino = { state, evaluate, openRecipe, toast, goTo, fmtTime, ingName, ingEmoji, hasIng,
      salvaStato() { save(); renderIngredients(); updateSummary(); } };
    if (state.tools.size) say('Bentornato! Ho ricordato i tuoi strumenti 😄');
  }

  init();
})();
