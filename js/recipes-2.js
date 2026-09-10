// Ricette — uova, contorni, piatti freddi, colazioni e dolci.
window.RECIPES = (window.RECIPES || []).concat([
  {
    id: 'frittata-zucchine', name: 'Frittata di zucchine', emoji: '🍳',
    time: 20, kcal: 320, servings: 2, difficulty: 'Facile', tags: ['Secondo', 'Vegetariano'],
    tools: ['fornelli', 'padella'],
    ing: [
      { id: 'uova', q: '4' }, { id: 'zucchine', q: '2' },
      { id: 'parmigiano', q: '30 g', opt: true }, { id: 'cipolla', q: '½', opt: true },
    ],
    steps: [
      'Taglia le zucchine a rondelle sottili e cuocile in padella con olio (e cipolla) per 8 minuti.',
      'Sbatti le uova con parmigiano, sale e pepe, versale sulle zucchine.',
      'Cuoci coperto a fuoco basso 6–7 minuti, gira aiutandoti con un piatto e cuoci altri 2 minuti.',
    ],
  },
  {
    id: 'uova-strapazzate', name: 'Uova strapazzate cremose', emoji: '🥚',
    time: 5, kcal: 230, servings: 1, difficulty: 'Facile', tags: ['Colazione', 'Veloce'],
    tools: ['fornelli', 'padella'],
    ing: [
      { id: 'uova', q: '2' }, { id: 'burro', q: '1 noce', opt: true }, { id: 'latte', q: '1 cucchiaio', opt: true },
    ],
    steps: [
      'Sbatti le uova con latte e un pizzico di sale.',
      'Sciogli il burro in padella a fuoco basso e versa le uova.',
      'Mescola piano con una spatola e togli dal fuoco quando sono ancora morbide e lucide.',
    ],
  },
  {
    id: 'omelette', name: 'Omelette prosciutto e formaggio', emoji: '🥞',
    time: 10, kcal: 380, servings: 1, difficulty: 'Facile', tags: ['Secondo', 'Veloce'],
    tools: ['fornelli', 'padella'],
    ing: [
      { id: 'uova', q: '2' }, { id: 'prosciutto_cotto', q: '2 fette' },
      { id: ['formaggio_fette', 'mozzarella'], q: '1–2 fette' },
    ],
    steps: [
      'Sbatti le uova con sale e versale in padella calda unta.',
      'Quando la base si rapprende, metti prosciutto e formaggio su metà.',
      'Chiudi a mezzaluna, 1 minuto per lato e servi filante.',
    ],
  },
  {
    id: 'toast', name: 'Toast prosciutto e formaggio', emoji: '🥪',
    time: 5, kcal: 330, servings: 1, difficulty: 'Facile', tags: ['Spuntino', 'Veloce'],
    tools: [['tostapane', 'padella', 'forno']],
    ing: [
      { id: 'pane', q: '2 fette' }, { id: 'prosciutto_cotto', q: '2 fette' },
      { id: ['formaggio_fette', 'mozzarella'], q: '1–2 fette' },
    ],
    steps: [
      'Farcisci il pane con prosciutto e formaggio.',
      'Tosta finché il pane è dorato e il formaggio fila (tostapane con pinza, padella o forno).',
    ],
  },
  {
    id: 'avocado-toast', name: 'Avocado toast con uovo', emoji: '🥑',
    time: 15, kcal: 390, servings: 1, difficulty: 'Facile', tags: ['Colazione', 'Brunch'],
    tools: [['tostapane', 'padella', 'forno']],
    ing: [
      { id: 'pane', q: '2 fette' }, { id: 'avocado', q: '½' },
      { id: 'uova', q: '1', opt: true }, { id: 'limone', q: 'qualche goccia', opt: true },
      { id: 'peperoncino', q: 'un pizzico', opt: true },
    ],
    steps: [
      'Tosta il pane.',
      'Schiaccia l’avocado con limone, sale e pepe e spalmalo sul pane.',
      'Se hai l’uovo: fallo all’occhio di bue o in camicia e appoggialo sopra. Peperoncino a piacere.',
    ],
  },
  {
    id: 'bruschette', name: 'Bruschette al pomodoro', emoji: '🍅',
    time: 10, kcal: 250, servings: 2, difficulty: 'Facile', tags: ['Antipasto', 'Vegano'],
    tools: [['tostapane', 'forno', 'padella']],
    ing: [
      { id: 'pane', q: '4 fette' }, { id: 'pomodori', q: '2' },
      { id: 'aglio', q: '1 spicchio', opt: true }, { id: 'basilico', q: 'q.b.', opt: true },
      { id: 'origano', q: 'q.b.', opt: true },
    ],
    steps: [
      'Taglia i pomodori a cubetti e condiscili con olio, sale, basilico o origano.',
      'Tosta il pane e strofinaci sopra l’aglio.',
      'Distribuisci i pomodori sul pane appena prima di servire.',
    ],
  },
  {
    id: 'caprese', name: 'Insalata caprese', emoji: '🥗',
    time: 10, kcal: 350, servings: 2, difficulty: 'Facile', tags: ['Freddo', 'Vegetariano', 'Senza cottura'],
    tools: [],
    ing: [
      { id: 'pomodori', q: '2 grandi' }, { id: 'mozzarella', q: '250 g' },
      { id: 'basilico', q: 'qualche foglia', opt: true }, { id: 'origano', q: 'q.b.', opt: true },
    ],
    steps: [
      'Taglia pomodori e mozzarella a fette.',
      'Alternali nel piatto, condisci con olio, sale e basilico. Fine, goditela!',
    ],
  },
  {
    id: 'insalata-ceci-tonno', name: 'Insalata di ceci e tonno', emoji: '🫘',
    time: 10, kcal: 420, servings: 2, difficulty: 'Facile', tags: ['Freddo', 'Proteico', 'Senza cottura'],
    tools: [],
    ing: [
      { id: 'ceci', q: '1 barattolo' }, { id: 'tonno', q: '1 scatoletta' },
      { id: 'pomodori', q: '1', opt: true }, { id: 'cipolla', q: '¼', opt: true },
      { id: 'cetriolo', q: '½', opt: true }, { id: 'limone', q: '½', opt: true },
    ],
    steps: [
      'Sciacqua i ceci e sgocciola il tonno.',
      'Unisci con le verdure a cubetti.',
      'Condisci con olio, sale e limone. Perfetta da portare in ufficio.',
    ],
  },
  {
    id: 'guacamole', name: 'Guacamole', emoji: '🥑',
    time: 10, kcal: 240, servings: 2, difficulty: 'Facile', tags: ['Antipasto', 'Vegano', 'Senza cottura'],
    tools: [],
    ing: [
      { id: 'avocado', q: '2 maturi' }, { id: 'limone', q: '½' },
      { id: 'pomodori', q: '1', opt: true }, { id: 'cipolla', q: '¼', opt: true },
      { id: 'peperoncino', q: 'q.b.', opt: true },
    ],
    steps: [
      'Schiaccia la polpa di avocado con una forchetta.',
      'Aggiungi succo di limone, sale, pomodoro e cipolla tritati finissimi.',
      'Servi subito con pane tostato o verdure crude.',
    ],
  },
  {
    id: 'hummus', name: 'Hummus di ceci', emoji: '🫘',
    time: 10, kcal: 280, servings: 3, difficulty: 'Facile', tags: ['Antipasto', 'Vegano'],
    tools: ['frullatore'],
    ing: [
      { id: 'ceci', q: '1 barattolo' }, { id: 'limone', q: '½' },
      { id: 'aglio', q: '½ spicchio', opt: true }, { id: 'paprika', q: 'un pizzico', opt: true },
    ],
    steps: [
      'Frulla i ceci sgocciolati con limone, aglio, 3 cucchiai d’olio, sale e un po’ d’acqua fredda.',
      'Continua finché è liscio e cremoso.',
      'Servi con un filo d’olio e paprika sopra.',
    ],
  },
  {
    id: 'vellutata', name: 'Vellutata di carote e patate', emoji: '🥕',
    time: 35, kcal: 190, servings: 2, difficulty: 'Facile', tags: ['Primo', 'Leggero', 'Vegano'],
    tools: ['fornelli', 'pentola', 'frullatore'],
    ing: [
      { id: 'carote', q: '4' }, { id: 'patate', q: '2' }, { id: 'cipolla', q: '½' },
      { id: 'rosmarino', q: 'q.b.', opt: true },
    ],
    steps: [
      'Taglia tutto a pezzi e soffriggi la cipolla in pentola.',
      'Aggiungi carote e patate, copri d’acqua salata e cuoci 25 minuti.',
      'Frulla fino a ottenere una crema liscia. Filo d’olio a crudo.',
    ],
  },
  {
    id: 'peperonata', name: 'Peperonata', emoji: '🫑',
    time: 40, kcal: 180, servings: 2, difficulty: 'Facile', tags: ['Contorno', 'Vegano'],
    tools: ['fornelli', 'padella'],
    ing: [
      { id: 'peperoni', q: '3' }, { id: 'cipolla', q: '1' },
      { id: ['pomodori', 'passata'], q: '2 / 200 g' },
    ],
    steps: [
      'Taglia peperoni e cipolla a listarelle.',
      'Stufali in padella con olio per 10 minuti, poi aggiungi il pomodoro.',
      'Cuoci coperto 25 minuti a fuoco medio, aggiusta di sale.',
    ],
  },
  {
    id: 'funghi-trifolati', name: 'Funghi trifolati', emoji: '🍄',
    time: 20, kcal: 110, servings: 2, difficulty: 'Facile', tags: ['Contorno', 'Leggero'],
    tools: ['fornelli', 'padella'],
    ing: [
      { id: 'funghi', q: '400 g' }, { id: 'aglio', q: '1 spicchio' },
      { id: 'prezzemolo', q: 'un ciuffo', opt: true },
    ],
    steps: [
      'Pulisci i funghi con un panno e affettali.',
      'Rosolali a fuoco vivo con olio e aglio per 10–12 minuti.',
      'Sala solo alla fine e aggiungi il prezzemolo tritato.',
    ],
  },
  {
    id: 'patatine-air', name: 'Patatine croccanti', emoji: '🍟',
    time: 25, kcal: 220, servings: 2, difficulty: 'Facile', tags: ['Contorno', 'Croccante'],
    tools: [['friggitrice', 'forno']],
    ing: [
      { id: 'patate', q: '3' }, { id: 'rosmarino', q: 'q.b.', opt: true }, { id: 'paprika', q: 'q.b.', opt: true },
    ],
    steps: [
      'Taglia le patate a bastoncini e lasciale 10 minuti in acqua fredda. Asciugale benissimo.',
      'Condisci con 1 cucchiaio d’olio, sale e spezie.',
      'Friggitrice ad aria a 200° per 18–20 minuti scuotendo a metà (o forno a 220° per 30).',
    ],
  },
  {
    id: 'wurstel-patate', name: 'Würstel e patate', emoji: '🌭',
    time: 25, kcal: 480, servings: 2, difficulty: 'Facile', tags: ['Secondo', 'Comfort'],
    tools: [['friggitrice', 'forno']],
    ing: [
      { id: 'wurstel', q: '4' }, { id: 'patate', q: '3' }, { id: 'rosmarino', q: 'q.b.', opt: true },
    ],
    steps: [
      'Taglia le patate a cubetti e condiscile con olio, sale e rosmarino.',
      'Cuoci 12 minuti a 200° in friggitrice (20 in forno).',
      'Aggiungi i würstel a rondelle e cuoci altri 8 minuti.',
    ],
  },
  {
    id: 'patata-microonde', name: 'Patata ripiena al microonde', emoji: '🥔',
    time: 12, kcal: 310, servings: 1, difficulty: 'Facile', tags: ['Veloce', 'Comfort'],
    tools: ['microonde'],
    ing: [
      { id: 'patate', q: '1 grande' },
      { id: ['formaggio_fette', 'mozzarella', 'parmigiano'], q: 'q.b.' },
      { id: 'burro', q: '1 noce', opt: true }, { id: 'prosciutto_cotto', q: '1 fetta', opt: true },
    ],
    steps: [
      'Bucherella la patata con la forchetta e cuocila al microonde 8–10 minuti alla massima potenza, girandola a metà.',
      'Aprila, schiaccia un po’ la polpa con burro e sale.',
      'Aggiungi formaggio (e prosciutto) e ancora 1 minuto di microonde.',
    ],
  },
  {
    id: 'smoothie-banana-fragole', name: 'Smoothie banana e fragole', emoji: '🍓',
    time: 5, kcal: 210, servings: 1, difficulty: 'Facile', tags: ['Colazione', 'Bevanda'],
    tools: ['frullatore'],
    ing: [
      { id: 'banana', q: '1' }, { id: 'fragole', q: '6–8' }, { id: ['yogurt', 'latte'], q: '150 g' },
      { id: 'miele', q: '1 cucchiaino', opt: true },
    ],
    steps: [
      'Metti tutto nel frullatore (frutta congelata = smoothie più cremoso).',
      'Frulla 30–60 secondi e bevilo subito.',
    ],
  },
  {
    id: 'smoothie-verde', name: 'Smoothie verde', emoji: '🥬',
    time: 5, kcal: 190, servings: 1, difficulty: 'Facile', tags: ['Colazione', 'Bevanda', 'Leggero'],
    tools: ['frullatore'],
    ing: [
      { id: 'spinaci', q: 'una manciata' }, { id: 'banana', q: '1' },
      { id: 'mela', q: '½', opt: true }, { id: ['yogurt', 'latte'], q: '150 ml', opt: true },
    ],
    steps: [
      'Frulla spinaci, banana e mela con yogurt o latte (o acqua).',
      'Aggiungi ghiaccio se ti piace fresco. Non sa di spinaci, promesso 🤞',
    ],
  },
  {
    id: 'yogurt-bowl', name: 'Yogurt bowl', emoji: '🥣',
    time: 5, kcal: 280, servings: 1, difficulty: 'Facile', tags: ['Colazione', 'Senza cottura'],
    tools: [],
    ing: [
      { id: 'yogurt', q: '170 g' }, { id: ['banana', 'fragole', 'mela'], q: 'frutta a scelta' },
      { id: 'miele', q: '1 cucchiaino', opt: true }, { id: ['avena', 'noci'], q: '1 cucchiaio', opt: true },
    ],
    steps: [
      'Versa lo yogurt in una ciotola.',
      'Aggiungi la frutta a pezzi, avena o frutta secca e un filo di miele.',
    ],
  },
  {
    id: 'porridge', name: 'Porridge d’avena', emoji: '🌾',
    time: 5, kcal: 300, servings: 1, difficulty: 'Facile', tags: ['Colazione', 'Comfort'],
    tools: [['microonde', 'fornelli']],
    ing: [
      { id: 'avena', q: '40 g' }, { id: 'latte', q: '200 ml' },
      { id: 'banana', q: '½', opt: true }, { id: 'miele', q: '1 cucchiaino', opt: true },
      { id: 'cannella', q: 'un pizzico', opt: true },
    ],
    steps: [
      'Mescola avena e latte in una tazza grande (o pentolino).',
      'Microonde 2 minuti mescolando a metà (o 5 minuti sul fuoco).',
      'Guarnisci con banana, miele e cannella.',
    ],
  },
  {
    id: 'pancake', name: 'Pancake soffici', emoji: '🥞',
    time: 20, kcal: 350, servings: 2, difficulty: 'Facile', tags: ['Colazione', 'Dolce'],
    tools: ['fornelli', 'padella'],
    ing: [
      { id: 'farina', q: '125 g' }, { id: 'uova', q: '1' }, { id: 'latte', q: '150 ml' },
      { id: 'zucchero', q: '1 cucchiaio' }, { id: 'lievito', q: '1 cucchiaino', opt: true },
      { id: 'burro', q: '15 g', opt: true }, { id: 'miele', q: 'per servire', opt: true },
    ],
    steps: [
      'Mescola farina, zucchero e lievito; a parte sbatti uovo, latte e burro fuso.',
      'Unisci i due composti senza mescolare troppo (qualche grumo va bene).',
      'Cuoci un mestolino alla volta in padella unta: gira quando compaiono le bollicine.',
    ],
  },
  {
    id: 'mug-cake', name: 'Mug cake al cioccolato', emoji: '☕',
    time: 5, kcal: 380, servings: 1, difficulty: 'Facile', tags: ['Dolce', 'Veloce'],
    tools: ['microonde'],
    ing: [
      { id: 'farina', q: '4 cucchiai' }, { id: 'zucchero', q: '3 cucchiai' }, { id: 'cacao', q: '2 cucchiai' },
      { id: 'latte', q: '4 cucchiai' }, { id: 'uova', q: '1', opt: true }, { id: 'lievito', q: '1 pizzico', opt: true },
    ],
    steps: [
      'In una tazza grande mescola farina, zucchero, cacao e lievito.',
      'Aggiungi latte, 2 cucchiai d’olio (e l’uovo) e mescola bene.',
      'Microonde 70–90 secondi alla massima potenza. Mangiala calda!',
    ],
  },
  {
    id: 'torta-mele', name: 'Torta di mele', emoji: '🍎',
    time: 60, kcal: 320, servings: 8, difficulty: 'Media', tags: ['Dolce', 'Merenda'],
    tools: ['forno'],
    ing: [
      { id: 'farina', q: '250 g' }, { id: 'uova', q: '3' }, { id: 'zucchero', q: '150 g' },
      { id: 'mela', q: '3' }, { id: 'lievito', q: '1 bustina' }, { id: ['burro', 'latte'], q: '100 g' },
      { id: 'cannella', q: 'un pizzico', opt: true }, { id: 'limone', q: 'scorza', opt: true },
    ],
    steps: [
      'Monta uova e zucchero finché diventano chiari e spumosi.',
      'Aggiungi burro fuso (o latte + 50 ml d’olio), poi farina e lievito setacciati.',
      'Unisci 2 mele a cubetti, versa in stampo e decora con la terza a fettine.',
      'Inforna a 180° per 40–45 minuti. Prova stecchino!',
    ],
  },
  {
    id: 'banana-bread', name: 'Banana bread', emoji: '🍌',
    time: 70, kcal: 290, servings: 8, difficulty: 'Facile', tags: ['Dolce', 'Colazione', 'Antispreco'],
    tools: ['forno'],
    ing: [
      { id: 'banana', q: '3 molto mature' }, { id: 'farina', q: '220 g' }, { id: 'uova', q: '2' },
      { id: 'zucchero', q: '100 g' }, { id: 'burro', q: '80 g' }, { id: 'lievito', q: '1 cucchiaino' },
      { id: ['noci', 'cacao'], q: 'una manciata', opt: true },
    ],
    steps: [
      'Schiaccia le banane e mescolale con burro fuso, uova e zucchero.',
      'Aggiungi farina, lievito e un pizzico di sale, poi le noci.',
      'Versa in uno stampo da plumcake e inforna a 175° per 50 minuti.',
    ],
  },
]);
