// Strumenti selezionabili nella cucina illustrata
window.TOOLS = [
  { id: 'fornelli',    name: 'Fornelli',            emoji: '🔥', quip: 'Fiamma accesa! Si comincia a fare sul serio 🔥' },
  { id: 'pentola',     name: 'Pentola',             emoji: '🍲', quip: 'Pentola pronta: la pasta ringrazia 🍝' },
  { id: 'padella',     name: 'Padella',             emoji: '🍳', quip: 'Padella in posizione, sfrigolio in arrivo!' },
  { id: 'forno',       name: 'Forno',               emoji: '♨️', quip: 'Forno a 180°... odore di casa della nonna 👵' },
  { id: 'microonde',   name: 'Microonde',           emoji: '📡', quip: 'Ding! Il microonde è nel team ⚡' },
  { id: 'friggitrice', name: 'Friggitrice ad aria', emoji: '🌪️', quip: 'Croccante senza sensi di colpa 😎' },
  { id: 'frullatore',  name: 'Frullatore',          emoji: '🌀', quip: 'Vrrrrrr! Frulliamo tutto 🌀' },
  { id: 'tostapane',   name: 'Tostapane',           emoji: '🍞', quip: 'Pop! Toast dorato in arrivo 🍞' },
];

// Si danno per scontati: sale, pepe, olio, acqua
window.CATEGORIES = [
  { id: 'verdure',   name: 'Verdure & erbe',  emoji: '🥦' },
  { id: 'frutta',    name: 'Frutta',          emoji: '🍎' },
  { id: 'latticini', name: 'Uova & latticini', emoji: '🥚' },
  { id: 'carne',     name: 'Carne & pesce',   emoji: '🍗' },
  { id: 'dispensa',  name: 'Dispensa',        emoji: '🥫' },
  { id: 'spezie',    name: 'Spezie',          emoji: '🌶️' },
];

window.INGREDIENTS = [
  // Verdure & erbe
  { id: 'pomodori',   name: 'Pomodori',      emoji: '🍅', cat: 'verdure' },
  { id: 'cipolla',    name: 'Cipolla',       emoji: '🧅', cat: 'verdure' },
  { id: 'aglio',      name: 'Aglio',         emoji: '🧄', cat: 'verdure' },
  { id: 'zucchine',   name: 'Zucchine',      emoji: '🥒', cat: 'verdure' },
  { id: 'melanzane',  name: 'Melanzane',     emoji: '🍆', cat: 'verdure' },
  { id: 'peperoni',   name: 'Peperoni',      emoji: '🫑', cat: 'verdure' },
  { id: 'patate',     name: 'Patate',        emoji: '🥔', cat: 'verdure' },
  { id: 'carote',     name: 'Carote',        emoji: '🥕', cat: 'verdure' },
  { id: 'spinaci',    name: 'Spinaci',       emoji: '🥬', cat: 'verdure' },
  { id: 'insalata',   name: 'Insalata',      emoji: '🥗', cat: 'verdure' },
  { id: 'funghi',     name: 'Funghi',        emoji: '🍄', cat: 'verdure' },
  { id: 'broccoli',   name: 'Broccoli',      emoji: '🥦', cat: 'verdure' },
  { id: 'piselli',    name: 'Piselli',       emoji: '🫛', cat: 'verdure' },
  { id: 'cetriolo',   name: 'Cetriolo',      emoji: '🥒', cat: 'verdure' },
  { id: 'avocado',    name: 'Avocado',       emoji: '🥑', cat: 'verdure' },
  { id: 'basilico',   name: 'Basilico',      emoji: '🌿', cat: 'verdure' },
  { id: 'prezzemolo', name: 'Prezzemolo',    emoji: '🌱', cat: 'verdure' },

  // Frutta
  { id: 'limone',     name: 'Limone',        emoji: '🍋', cat: 'frutta' },
  { id: 'banana',     name: 'Banana',        emoji: '🍌', cat: 'frutta' },
  { id: 'mela',       name: 'Mela',          emoji: '🍎', cat: 'frutta' },
  { id: 'fragole',    name: 'Fragole',       emoji: '🍓', cat: 'frutta' },

  // Uova & latticini
  { id: 'uova',            name: 'Uova',             emoji: '🥚', cat: 'latticini' },
  { id: 'latte',           name: 'Latte',            emoji: '🥛', cat: 'latticini' },
  { id: 'burro',           name: 'Burro',            emoji: '🧈', cat: 'latticini' },
  { id: 'yogurt',          name: 'Yogurt',           emoji: '🥣', cat: 'latticini' },
  { id: 'parmigiano',      name: 'Parmigiano',       emoji: '🧀', cat: 'latticini' },
  { id: 'pecorino',        name: 'Pecorino',         emoji: '🧀', cat: 'latticini' },
  { id: 'mozzarella',      name: 'Mozzarella',       emoji: '⚪', cat: 'latticini' },
  { id: 'ricotta',         name: 'Ricotta',          emoji: '🍚', cat: 'latticini' },
  { id: 'formaggio_fette', name: 'Formaggio a fette', emoji: '🟨', cat: 'latticini' },

  // Carne & pesce
  { id: 'pollo',            name: 'Pollo',            emoji: '🍗', cat: 'carne' },
  { id: 'carne_macinata',   name: 'Carne macinata',   emoji: '🥩', cat: 'carne' },
  { id: 'salsiccia',        name: 'Salsiccia',        emoji: '🍖', cat: 'carne' },
  { id: 'pancetta',         name: 'Pancetta/guanciale', emoji: '🥓', cat: 'carne' },
  { id: 'prosciutto_cotto', name: 'Prosciutto cotto', emoji: '🥪', cat: 'carne' },
  { id: 'wurstel',          name: 'Würstel',          emoji: '🌭', cat: 'carne' },
  { id: 'tonno',            name: 'Tonno in scatola', emoji: '🐟', cat: 'carne' },
  { id: 'salmone',          name: 'Salmone',          emoji: '🍣', cat: 'carne' },
  { id: 'gamberi',          name: 'Gamberi',          emoji: '🦐', cat: 'carne' },

  // Dispensa
  { id: 'pasta',       name: 'Pasta',          emoji: '🍝', cat: 'dispensa' },
  { id: 'riso',        name: 'Riso',           emoji: '🍚', cat: 'dispensa' },
  { id: 'couscous',    name: 'Cous cous',      emoji: '🥘', cat: 'dispensa' },
  { id: 'pane',        name: 'Pane',           emoji: '🍞', cat: 'dispensa' },
  { id: 'pangrattato', name: 'Pangrattato',    emoji: '🥖', cat: 'dispensa' },
  { id: 'farina',      name: 'Farina',         emoji: '🌾', cat: 'dispensa' },
  { id: 'zucchero',    name: 'Zucchero',       emoji: '🍬', cat: 'dispensa' },
  { id: 'lievito',     name: 'Lievito',        emoji: '🫙', cat: 'dispensa' },
  { id: 'passata',     name: 'Passata di pomodoro', emoji: '🥫', cat: 'dispensa' },
  { id: 'ceci',        name: 'Ceci',           emoji: '🫘', cat: 'dispensa' },
  { id: 'fagioli',     name: 'Fagioli',        emoji: '🫘', cat: 'dispensa' },
  { id: 'lenticchie',  name: 'Lenticchie',     emoji: '🟤', cat: 'dispensa' },
  { id: 'avena',       name: "Fiocchi d'avena", emoji: '🌾', cat: 'dispensa' },
  { id: 'cacao',       name: 'Cacao',          emoji: '🍫', cat: 'dispensa' },
  { id: 'miele',       name: 'Miele',          emoji: '🍯', cat: 'dispensa' },
  { id: 'noci',        name: 'Frutta secca',   emoji: '🥜', cat: 'dispensa' },
  { id: 'olive',       name: 'Olive',          emoji: '🫒', cat: 'dispensa' },
  { id: 'capperi',     name: 'Capperi',        emoji: '🟢', cat: 'dispensa' },

  // Spezie
  { id: 'peperoncino', name: 'Peperoncino', emoji: '🌶️', cat: 'spezie' },
  { id: 'origano',     name: 'Origano',     emoji: '🍃', cat: 'spezie' },
  { id: 'rosmarino',   name: 'Rosmarino',   emoji: '🌿', cat: 'spezie' },
  { id: 'paprika',     name: 'Paprika',     emoji: '🔴', cat: 'spezie' },
  { id: 'cannella',    name: 'Cannella',    emoji: '🪵', cat: 'spezie' },
];

// Selezione rapida "ce l'hanno quasi tutti"
window.COMMON_INGREDIENTS = ['uova', 'pasta', 'riso', 'aglio', 'cipolla', 'passata', 'parmigiano', 'latte', 'burro', 'farina', 'zucchero', 'pane', 'patate'];
