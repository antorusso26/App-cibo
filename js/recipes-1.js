// Ricette — primi e piatti principali.
// tools: ogni elemento è un gruppo; basta averne UNO del gruppo (es. ['forno','friggitrice']).
// ing: id può essere un array di alternative; opt:true = facoltativo.
// kcal: stima per porzione.
window.RECIPES = (window.RECIPES || []).concat([
  {
    id: 'aglio-olio', name: 'Spaghetti aglio, olio e peperoncino', emoji: '🍝',
    time: 15, kcal: 520, servings: 2, difficulty: 'Facile', tags: ['Primo', 'Veloce'],
    tools: ['fornelli', 'pentola', 'padella'],
    ing: [
      { id: 'pasta', q: '200 g' }, { id: 'aglio', q: '2 spicchi' },
      { id: 'peperoncino', q: 'q.b.', opt: true }, { id: 'prezzemolo', q: 'un ciuffo', opt: true },
    ],
    steps: [
      'Cuoci la pasta in abbondante acqua salata.',
      "Intanto scalda 4 cucchiai d'olio in padella con l'aglio a fettine e il peperoncino, a fuoco basso: l'aglio deve dorare, non bruciare.",
      "Scola la pasta al dente tenendo un mestolo d'acqua di cottura.",
      "Salta la pasta in padella con un po' d'acqua di cottura finché si crea una cremina. Prezzemolo e via!",
    ],
  },
  {
    id: 'pasta-pomodoro', name: 'Pasta al pomodoro e basilico', emoji: '🍅',
    time: 20, kcal: 480, servings: 2, difficulty: 'Facile', tags: ['Primo', 'Vegetariano'],
    tools: ['fornelli', 'pentola', 'padella'],
    ing: [
      { id: 'pasta', q: '200 g' }, { id: 'passata', q: '300 g' },
      { id: ['aglio', 'cipolla'], q: '1 spicchio / ½ cipolla' },
      { id: 'basilico', q: 'qualche foglia', opt: true }, { id: 'parmigiano', q: 'q.b.', opt: true },
    ],
    steps: [
      "Soffriggi l'aglio (o la cipolla tritata) in un filo d'olio.",
      'Aggiungi la passata, sala e cuoci 10–15 minuti a fuoco medio.',
      'Nel frattempo cuoci la pasta in acqua salata.',
      'Scola, manteca nel sugo con basilico fresco e una pioggia di parmigiano.',
    ],
  },
  {
    id: 'carbonara', name: 'Carbonara', emoji: '🥓',
    time: 20, kcal: 680, servings: 2, difficulty: 'Media', tags: ['Primo', 'Classico'],
    tools: ['fornelli', 'pentola', 'padella'],
    ing: [
      { id: 'pasta', q: '200 g' }, { id: 'uova', q: '3 tuorli + 1 uovo' },
      { id: 'pancetta', q: '120 g' }, { id: ['pecorino', 'parmigiano'], q: '60 g' },
    ],
    steps: [
      'Rosola la pancetta a cubetti in padella senza olio finché è croccante.',
      'Sbatti tuorli e uovo con il formaggio grattugiato e tanto pepe.',
      'Cuoci la pasta, scolala al dente e versala nella padella (a fuoco spento!).',
      "Aggiungi la crema d'uovo e un goccio d'acqua di cottura, mescola veloce finché diventa cremosa.",
    ],
  },
  {
    id: 'pasta-tonno', name: 'Spaghetti al tonno', emoji: '🐟',
    time: 20, kcal: 560, servings: 2, difficulty: 'Facile', tags: ['Primo', 'Dispensa'],
    tools: ['fornelli', 'pentola', 'padella'],
    ing: [
      { id: 'pasta', q: '200 g' }, { id: 'tonno', q: '1 scatoletta' }, { id: 'passata', q: '250 g' },
      { id: 'aglio', q: '1 spicchio' }, { id: 'capperi', q: '1 cucchiaio', opt: true },
      { id: 'olive', q: 'una manciata', opt: true },
    ],
    steps: [
      "Soffriggi l'aglio, aggiungi il tonno sgocciolato e sgranalo con la forchetta.",
      'Unisci passata, capperi e olive; cuoci 10 minuti.',
      'Cuoci la pasta e saltala nel sugo.',
    ],
  },
  {
    id: 'pasta-ceci', name: 'Pasta e ceci', emoji: '🫘',
    time: 30, kcal: 510, servings: 2, difficulty: 'Facile', tags: ['Primo', 'Vegano'],
    tools: ['fornelli', 'pentola'],
    ing: [
      { id: 'pasta', q: '150 g (corta)' }, { id: ['ceci', 'fagioli'], q: '1 barattolo' },
      { id: 'aglio', q: '1 spicchio' }, { id: 'rosmarino', q: '1 rametto', opt: true },
      { id: 'passata', q: '2 cucchiai', opt: true },
    ],
    steps: [
      "In pentola soffriggi aglio e rosmarino nell'olio.",
      "Aggiungi i legumi sgocciolati e la passata, poi circa 700 ml d'acqua calda.",
      'Frulla o schiaccia metà dei legumi per renderla cremosa.',
      'Butta la pasta direttamente dentro e cuoci mescolando, aggiungendo acqua se serve.',
    ],
  },
  {
    id: 'pasta-zucchine-gamberi', name: 'Pasta zucchine e gamberi', emoji: '🦐',
    time: 25, kcal: 540, servings: 2, difficulty: 'Media', tags: ['Primo', 'Pesce'],
    tools: ['fornelli', 'pentola', 'padella'],
    ing: [
      { id: 'pasta', q: '200 g' }, { id: 'zucchine', q: '2' }, { id: 'gamberi', q: '200 g' },
      { id: 'aglio', q: '1 spicchio' }, { id: 'prezzemolo', q: 'q.b.', opt: true },
    ],
    steps: [
      "Taglia le zucchine a rondelle e saltale in padella con olio e aglio per 8 minuti.",
      'Aggiungi i gamberi sgusciati e cuoci 2–3 minuti.',
      'Cuoci la pasta, scolala e mantecala in padella con prezzemolo.',
    ],
  },
  {
    id: 'pasta-salsiccia-broccoli', name: 'Pasta salsiccia e broccoli', emoji: '🥦',
    time: 30, kcal: 650, servings: 2, difficulty: 'Facile', tags: ['Primo'],
    tools: ['fornelli', 'pentola', 'padella'],
    ing: [
      { id: 'pasta', q: '200 g' }, { id: 'broccoli', q: '300 g' }, { id: 'salsiccia', q: '200 g' },
      { id: 'aglio', q: '1 spicchio' }, { id: 'peperoncino', q: 'q.b.', opt: true },
    ],
    steps: [
      'Lessa le cimette di broccoli 5 minuti in acqua salata, poi usa la stessa acqua per la pasta.',
      'Sbriciola la salsiccia in padella con aglio e rosolala.',
      'Aggiungi i broccoli e schiacciali un po’.',
      'Scola la pasta al dente e saltala con il condimento.',
    ],
  },
  {
    id: 'pasta-forno', name: 'Pasta al forno', emoji: '🧀',
    time: 50, kcal: 690, servings: 4, difficulty: 'Media', tags: ['Primo', 'Domenica'],
    tools: ['fornelli', 'pentola', 'forno'],
    ing: [
      { id: 'pasta', q: '350 g' }, { id: 'passata', q: '500 g' }, { id: 'mozzarella', q: '250 g' },
      { id: 'parmigiano', q: '60 g' }, { id: 'carne_macinata', q: '250 g', opt: true },
      { id: 'cipolla', q: '½', opt: true },
    ],
    steps: [
      'Prepara un sugo con cipolla, (carne macinata) e passata: 20 minuti.',
      'Cuoci la pasta a metà cottura e condiscila con il sugo.',
      'In una teglia alterna pasta, mozzarella a cubetti e parmigiano.',
      'Inforna a 200° per 20 minuti, finché fa la crosticina.',
    ],
  },
  {
    id: 'risotto-funghi', name: 'Risotto ai funghi', emoji: '🍄',
    time: 35, kcal: 480, servings: 2, difficulty: 'Media', tags: ['Primo', 'Vegetariano'],
    tools: ['fornelli', 'pentola'],
    ing: [
      { id: 'riso', q: '160 g' }, { id: 'funghi', q: '250 g' }, { id: 'cipolla', q: '½' },
      { id: 'burro', q: '20 g' }, { id: 'parmigiano', q: '40 g' },
      { id: 'prezzemolo', q: 'q.b.', opt: true },
    ],
    steps: [
      'Soffriggi la cipolla tritata, aggiungi i funghi a pezzi e cuoci 5 minuti.',
      'Tosta il riso 2 minuti, poi aggiungi acqua calda salata (o brodo) un mestolo alla volta.',
      'Dopo circa 17 minuti spegni e manteca con burro e parmigiano.',
    ],
  },
  {
    id: 'riso-saltato', name: 'Riso saltato con verdure e uova', emoji: '🍚',
    time: 25, kcal: 450, servings: 2, difficulty: 'Facile', tags: ['Unico', 'Svuotafrigo'],
    tools: ['fornelli', 'pentola', 'padella'],
    ing: [
      { id: 'riso', q: '160 g' }, { id: 'uova', q: '2' },
      { id: ['carote', 'piselli', 'zucchine', 'peperoni'], q: 'verdure a scelta' },
      { id: 'cipolla', q: '½', opt: true },
    ],
    steps: [
      'Lessa il riso e scolalo (meglio se avanzato dal giorno prima!).',
      'In padella bella calda salta le verdure a cubetti con un filo d’olio.',
      'Sposta le verdure di lato, strapazza le uova, poi unisci il riso.',
      'Salta tutto a fuoco vivo per 3 minuti. Se hai salsa di soia, aggiungila.',
    ],
  },
  {
    id: 'couscous-verdure', name: 'Cous cous con verdure', emoji: '🥘',
    time: 20, kcal: 380, servings: 2, difficulty: 'Facile', tags: ['Unico', 'Vegano'],
    tools: ['fornelli', 'padella'],
    ing: [
      { id: 'couscous', q: '150 g' }, { id: ['zucchine', 'peperoni', 'melanzane'], q: '2 verdure' },
      { id: 'ceci', q: '½ barattolo', opt: true }, { id: 'limone', q: '½', opt: true },
    ],
    steps: [
      'Metti il cous cous in una ciotola con un filo d’olio e sale, copri con pari volume di acqua bollente e lascia riposare 5 minuti.',
      'Salta le verdure a cubetti in padella per 10 minuti.',
      'Sgrana il cous cous con la forchetta e mescola con verdure, ceci e succo di limone.',
    ],
  },
  {
    id: 'pollo-patate', name: 'Pollo al forno con patate', emoji: '🍗',
    time: 60, kcal: 590, servings: 2, difficulty: 'Facile', tags: ['Secondo', 'Classico'],
    tools: ['forno'],
    ing: [
      { id: 'pollo', q: '4 cosce' }, { id: 'patate', q: '4' },
      { id: 'rosmarino', q: '2 rametti', opt: true }, { id: 'aglio', q: '2 spicchi', opt: true },
    ],
    steps: [
      'Taglia le patate a spicchi e mettile in teglia con il pollo.',
      'Condisci con olio, sale, pepe, rosmarino e aglio in camicia. Mescola bene con le mani.',
      'Inforna a 200° per 50 minuti, girando a metà cottura.',
    ],
  },
  {
    id: 'pollo-croccante', name: 'Pollo croccante impanato', emoji: '🍗',
    time: 25, kcal: 390, servings: 2, difficulty: 'Facile', tags: ['Secondo', 'Croccante'],
    tools: [['friggitrice', 'forno']],
    ing: [
      { id: 'pollo', q: '300 g (petto)' }, { id: 'uova', q: '1' }, { id: 'pangrattato', q: '80 g' },
      { id: 'paprika', q: '1 cucchiaino', opt: true },
    ],
    steps: [
      'Taglia il pollo a straccetti o bocconcini.',
      'Passali nell’uovo sbattuto e poi nel pangrattato mescolato a sale e paprika.',
      'Spruzza un filo d’olio e cuoci in friggitrice ad aria a 200° per 12–15 minuti (o in forno a 220° per 20), girando a metà.',
    ],
  },
  {
    id: 'polpette-sugo', name: 'Polpette al sugo', emoji: '🧆',
    time: 45, kcal: 520, servings: 3, difficulty: 'Media', tags: ['Secondo', 'Comfort'],
    tools: ['fornelli', ['padella', 'pentola']],
    ing: [
      { id: 'carne_macinata', q: '400 g' }, { id: 'uova', q: '1' },
      { id: ['pangrattato', 'pane'], q: '60 g' }, { id: 'parmigiano', q: '40 g' },
      { id: 'passata', q: '500 g' }, { id: 'basilico', q: 'q.b.', opt: true },
    ],
    steps: [
      'Impasta carne, uovo, pangrattato (o pane ammollato nel latte), parmigiano e sale.',
      'Forma delle polpette grandi come una noce.',
      'Scalda la passata con un filo d’olio, aggiungi le polpette crude e cuoci coperto 25 minuti a fuoco dolce.',
    ],
  },
  {
    id: 'hamburger', name: 'Hamburger fatto in casa', emoji: '🍔',
    time: 20, kcal: 620, servings: 2, difficulty: 'Facile', tags: ['Secondo', 'Street food'],
    tools: ['fornelli', 'padella'],
    ing: [
      { id: 'carne_macinata', q: '300 g' }, { id: 'pane', q: '2 panini' },
      { id: 'formaggio_fette', q: '2 fette', opt: true }, { id: 'insalata', q: 'qualche foglia', opt: true },
      { id: 'pomodori', q: '1', opt: true },
    ],
    steps: [
      'Forma 2 hamburger schiacciati, sala solo all’esterno.',
      'Cuocili in padella rovente 3–4 minuti per lato. Aggiungi il formaggio sopra nell’ultimo minuto con coperchio.',
      'Tosta i panini e componi con insalata e pomodoro.',
    ],
  },
  {
    id: 'salmone-limone', name: 'Salmone al limone', emoji: '🍣',
    time: 20, kcal: 420, servings: 2, difficulty: 'Facile', tags: ['Secondo', 'Pesce', 'Leggero'],
    tools: [['forno', 'friggitrice']],
    ing: [
      { id: 'salmone', q: '2 tranci' }, { id: 'limone', q: '1' },
      { id: 'prezzemolo', q: 'q.b.', opt: true },
    ],
    steps: [
      'Metti i tranci su carta forno con olio, sale, pepe e fettine di limone.',
      'Cuoci in forno a 200° per 15 minuti (o in friggitrice a 180° per 10).',
      'Finisci con prezzemolo e succo di limone fresco.',
    ],
  },
  {
    id: 'parmigiana', name: 'Parmigiana di melanzane', emoji: '🍆',
    time: 75, kcal: 480, servings: 4, difficulty: 'Impegnativa', tags: ['Secondo', 'Vegetariano', 'Domenica'],
    tools: ['forno', 'fornelli', 'padella'],
    ing: [
      { id: 'melanzane', q: '2 grandi' }, { id: 'passata', q: '500 g' }, { id: 'mozzarella', q: '250 g' },
      { id: 'parmigiano', q: '80 g' }, { id: 'basilico', q: 'q.b.', opt: true },
    ],
    steps: [
      'Taglia le melanzane a fette e grigliale o friggile in padella.',
      'Cuoci la passata 10 minuti con olio, sale e basilico.',
      'In teglia alterna sugo, melanzane, mozzarella e parmigiano, per 3–4 strati.',
      'Inforna a 190° per 35 minuti. Lasciala riposare 10 minuti prima di tagliarla.',
    ],
  },
  {
    id: 'lenticchie', name: 'Lenticchie in umido', emoji: '🥣',
    time: 40, kcal: 330, servings: 2, difficulty: 'Facile', tags: ['Unico', 'Vegano'],
    tools: ['fornelli', 'pentola'],
    ing: [
      { id: 'lenticchie', q: '200 g (o 1 barattolo)' }, { id: 'cipolla', q: '½' },
      { id: 'carote', q: '1', opt: true }, { id: 'passata', q: '3 cucchiai', opt: true },
      { id: 'rosmarino', q: '1 rametto', opt: true },
    ],
    steps: [
      'Soffriggi cipolla e carota tritate.',
      'Aggiungi lenticchie, passata e acqua a coprire.',
      'Cuoci 30 minuti (10 se in barattolo), aggiusta di sale. Ottime con crostini di pane.',
    ],
  },
  {
    id: 'pizza', name: 'Pizza margherita fatta in casa', emoji: '🍕',
    time: 150, kcal: 780, servings: 2, difficulty: 'Media', tags: ['Unico', 'Weekend'],
    tools: ['forno'],
    ing: [
      { id: 'farina', q: '300 g' }, { id: 'lievito', q: '4 g secco' }, { id: 'passata', q: '200 g' },
      { id: 'mozzarella', q: '200 g' }, { id: 'basilico', q: 'q.b.', opt: true },
      { id: 'origano', q: 'q.b.', opt: true },
    ],
    steps: [
      'Impasta farina, lievito, 190 ml d’acqua tiepida, sale e un filo d’olio per 10 minuti.',
      'Lascia lievitare coperto per 2 ore (deve raddoppiare).',
      'Stendi in teglia oliata, condisci con passata, sale e olio.',
      'Inforna al massimo (250°) per 10 minuti, aggiungi la mozzarella e altri 5–7 minuti.',
    ],
  },
]);
