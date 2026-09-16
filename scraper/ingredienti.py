"""Come riconoscere, nei cataloghi dei supermercati, gli ingredienti usati dall'app.

Per ogni ingrediente (stessi id di js/data-base.js):
  q        termine di ricerca da mandare ai siti che hanno una ricerca (Coop, Lidl)
  match    regex: il nome del prodotto deve contenerla
  exclude  regex: se il nome la contiene, il prodotto viene scartato
  unita    unità attesa (kg, l, pz): serve a scartare match assurdi
I confronti avvengono sul nome in minuscolo e senza accenti.
"""

INGREDIENTI = {
    # --- Verdure e erbe ---
    "pomodori":   {"reparti": ["frutta", "verdura"], "q": "pomodori", "match": r"pomodor", "exclude": r"pelat|passat|polpa|concentrat|secch|essiccat|sugo|salsa|succo|conserv|pizza|focacc|insalat", "unita": "kg", "maxQta": 3},
    "cipolla":    {"reparti": ["frutta", "verdura"], "q": "cipolle", "match": r"cipoll", "exclude": r"surgelat|anelli|fritt|sott|agrodolce|zuppa", "unita": "kg"},
    "aglio":      {"reparti": ["frutta", "verdura"], "q": "aglio", "match": r"\baglio\b", "exclude": r"crema|surgelat|olio|sale|polvere|granulat|pesto|senza aglio|senz'aglio|sugo|salsa|macinat", "unita": "kg"},
    "zucchine":   {"reparti": ["frutta", "verdura"], "q": "zucchine", "match": r"zucchin", "exclude": r"surgelat|grigliat|sott|fior|contorno|burger", "unita": "kg"},
    "melanzane":  {"reparti": ["frutta", "verdura"], "q": "melanzane", "match": r"melanzan", "exclude": r"surgelat|grigliat|sott|patate", "unita": "kg"},
    "peperoni":   {"reparti": ["frutta", "verdura"], "q": "peperoni", "match": r"peperon(e|i)\b", "exclude": r"peperoncin|surgelat|sott|grigliat", "unita": "kg"},
    "patate":     {"reparti": ["frutta", "verdura"], "q": "patate", "match": r"patat", "exclude": r"surgelat|patatine|fritt|pure|chips|snack|dolc|fecola|gnocch|croccant|grigliat|contorno|insalat|sfizi", "unita": "kg"},
    "carote":     {"reparti": ["frutta", "verdura"], "q": "carote", "match": r"carot", "exclude": r"surgelat|succo|julienne|baby food|omogeneizz", "unita": "kg"},
    "spinaci":    {"reparti": ["frutta", "verdura"], "q": "spinaci", "match": r"spinac", "exclude": r"surgelat|omogeneizz|burger|crocchett", "unita": "kg"},
    "insalata":   {"reparti": ["frutta", "verdura"], "q": "insalata", "match": r"insalat|lattug|rucola|songino|valerian|misticanz", "exclude": r"pronta|pasta|riso|poke|russa|mare|condita|tonno|chef select|carta delle|bonduelle", "unita": "kg"},
    "funghi":     {"reparti": ["frutta", "verdura"], "q": "funghi champignon", "match": r"funghi|champignon", "exclude": r"surgelat|secch|sott|trifolat|crema|sugo|ragu|salsicc|in olio|aceto|insalata", "unita": "kg"},
    "broccoli":   {"reparti": ["frutta", "verdura"], "q": "broccoli", "match": r"broccol|cime di rapa", "exclude": r"surgelat|omogeneizz|plasmon|pasta|findus", "unita": "kg"},
    "piselli":    {"q": "piselli", "match": r"piselli", "exclude": r"zuppa|omogeneizz|farina|proteine", "unita": "kg"},
    "cetriolo":   {"reparti": ["frutta", "verdura"], "q": "cetrioli", "match": r"cetriol", "exclude": r"sott|aceto|agrodolce", "unita": "kg"},
    "avocado":    {"reparti": ["frutta", "verdura"], "q": "avocado", "match": r"avocado", "exclude": r"guacamole|salsa|olio|surgelat", "unita": "kg"},
    "basilico":   {"reparti": ["frutta", "verdura"], "q": "basilico", "match": r"basilico", "exclude": r"pesto|sugo|salsa|surgelat|pomodor|pizza", "scegli": "prezzo"},
    "prezzemolo": {"reparti": ["frutta", "verdura"], "q": "prezzemolo", "match": r"prezzemolo", "exclude": r"surgelat|salsa|sugo", "scegli": "prezzo"},

    # --- Frutta ---
    "limone":     {"reparti": ["frutta", "verdura"], "q": "limoni", "match": r"limon", "exclude": r"succo|bibita|te |crema|aroma|scorz|surgelat|detersiv", "unita": "kg"},
    "banana":     {"reparti": ["frutta", "verdura"], "q": "banane", "match": r"banan", "exclude": r"chips|essicc|succo|frull|omogeneizz|surgelat", "unita": "kg"},
    "mela":       {"reparti": ["frutta", "verdura"], "q": "mele", "match": r"\bmel(a|e)\b", "exclude": r"succo|purea|aceto|composta|essicc|torta|strudel|omogeneizz", "unita": "kg"},
    "fragole":    {"reparti": ["frutta", "verdura"], "q": "fragole", "match": r"fragol", "exclude": r"santa rosa|yomino|hero|composta|surgelat|confettur|sciroppat|sorbetto|marmellat|formaggio|fruttolo|yomo|merenda|zero grassi|lattosio|uva|bevanda|latte|sciroppo", "entro": 25, "unita": "kg"},

    # --- Uova e latticini ---
    "uova":            {"q": "uova", "match": r"\buova\b", "exclude": r"pasta|albume|liquid|sode|cioccolat|tagliatell|quagli|pasqua", "unita": "pz"},
    "latte":           {"q": "latte", "match": r"^latte|latte (intero|parz|scremato|fresco|uht)", "exclude": r"condensat|cocco|soia|mandorla|avena|riso|bimb|crescita|detergente|corpo|panna|dessert|budino", "unita": "l"},
    "burro":           {"q": "burro", "match": r"\bburro\b", "exclude": r"arachid|cacao|karite|salato|chiarificat|corpo", "unita": "kg"},
    "yogurt":          {"q": "yogurt bianco", "match": r"yogurt", "exclude": r"bere|drink|gelat|soia|cocco", "unita": "kg"},
    "parmigiano":      {"q": "parmigiano reggiano", "match": r"parmigiano reggiano", "exclude": r"crema|snack|fonduta|cremosin|perline|sfizi|con parmigiano|al parmigiano|bocconcin|risotto|sugo|riso|polpett|burger", "unita": "kg", "entro": 25},
    "pecorino":        {"q": "pecorino", "match": r"pecorino", "exclude": r"crema|snack|salsicc|patate", "unita": "kg"},
    "mozzarella":      {"q": "mozzarella", "match": r"mozzarell", "exclude": r"carrozza|pizza gia|surgelat|snack", "unita": "kg"},
    "ricotta":         {"q": "ricotta", "match": r"ricotta", "exclude": r"salata|affumicat|ripien|tortell|ravioli|dolce al", "unita": "kg"},
    "formaggio_fette": {"q": "formaggio a fette", "match": r"(fette|fettine|sottilette|piastrelle).*(formagg|emmental|edamer)|formagg.*fette|sottilette", "exclude": r"grattugiat|spalmabile", "unita": "kg"},

    # --- Carne e pesce ---
    "pollo":            {"q": "petto di pollo", "match": r"(petto|fesa|fusi|coscia|cosce|sovracosc|alette|bocconcini|spiedini|intero).*(pollo|tacchino)|(pollo|tacchino).*(petto|fesa|fusi|cosce|intero|bocconcini)", "exclude": r"surgelat|brodo|dado|wurstel|affettat|sofficette|snack|panat|cotolett|salsa|sugo|insalat|pront|arrost gia|kebab", "unita": "kg"},
    "carne_macinata":   {"q": "carne macinata", "match": r"(carne|bovino|manzo|vitello|suino|maiale|misto|tacchino|pollo|scottona)\s*(macinat|trit)|macinat(o|a)\s*(di\s*)?(bovino|manzo|vitello|suino|maiale|misto|tacchino|pollo|scelto|fresco)|\bmacinato\b", "exclude": r"surgelat|pasta|semola|grano|orzo|caffe|pepe|ragu pront|polpette pront|hamburger gia", "unita": "kg"},
    "salsiccia":        {"q": "salsiccia", "match": r"salsicc|luganega", "exclude": r"secca|stagionat|piccante|snack|surgelat|ragu|sugo|patate|spiedin", "unita": "kg"},
    "pancetta":         {"q": "pancetta", "match": r"pancett|guancial", "exclude": r"arrotolata dolce|snack", "unita": "kg"},
    "prosciutto_cotto": {"q": "prosciutto cotto", "match": r"prosciutto cotto", "exclude": r"crudo|snack|pizza", "unita": "kg"},
    "wurstel":          {"q": "wurstel", "match": r"wurstel|hot dog", "exclude": r"panino|surgelat", "unita": "kg"},
    "tonno":            {"q": "tonno in scatola", "match": r"tonno", "exclude": r"fresco|tranci|surgelat|sugo|insalata|pate|patè|salsa|burger|polpett", "unita": "kg", "entro": 30},
    "salmone":          {"q": "salmone", "match": r"salmone", "exclude": r"affumicat|pate|patè|sugo|insalata|pasta|penne|burger|pollo|philadelphia|formaggio|polpett|frosta|spunti|snack", "entro": 25, "unita": "kg"},
    "gamberi":          {"q": "gamberi", "match": r"gamber|mazzancoll", "exclude": r"sugo|insalata|gyoza|involtin|nuggets|panat|snack|pasta|penne|pennette|ramen|nasello", "entro": 25, "unita": "kg"},

    # --- Dispensa ---
    "pasta":       {"q": "spaghetti", "match": r"spaghetti|penne|fusilli|rigatoni|maccheron|sedanini|mezze manich", "exclude": r"integral|senza glutine|farro|kamut|mais|riso|lenticch|ceci|uovo|all'uovo|fresc|ripien|surgelat|sugo|pront", "unita": "kg"},
    "riso":        {"q": "riso", "match": r"\briso\b", "exclude": r"latte|bevanda|gallett|farina|soffiat|basmati|venere|pront|risotto|integrale|arancini|suppli|insalata|surgelat|budino|dolce", "unita": "kg"},
    "couscous":    {"q": "cous cous", "match": r"cous ?cous", "exclude": r"pront|insalata", "unita": "kg"},
    "pane":        {"q": "pane", "match": r"\bpane\b|panini|ciabatt|rosette|baguette", "exclude": r"grattugiat|carasau|azzimo|tostat|cassetta|surgelat|spezie|hamburger gia", "unita": "kg"},
    "pangrattato": {"q": "pangrattato", "match": r"pangrattato|pan ?grattato|pane grattugiat|panatura|impanatura", "exclude": r"senza glutine|easyglut|riso|mais", "unita": "kg"},
    "farina":      {"q": "farina 00", "match": r"farina", "exclude": r"mais|castagne|mandorl|cocco|riso|ceci|manitoba|integral|senza glutine|pizza pront", "unita": "kg"},
    "zucchero":    {"q": "zucchero", "match": r"zucchero", "exclude": r"velo|canna|dolcificante|vanigliat|gelificante", "unita": "kg"},
    "lievito":     {"q": "lievito", "match": r"lievito", "exclude": r"integrator|scaglie|pizza pront|impasto pront", "scegli": "prezzo"},
    "passata":     {"q": "passata di pomodoro", "match": r"passata|polpa di pomodor|pelati", "exclude": r"sugo|condimento|arrabbiat|basilico gia", "unita": "kg"},
    "ceci":        {"q": "ceci", "match": r"\bceci\b", "exclude": r"farina|pasta|snack|hummus|zuppa", "unita": "kg"},
    "fagioli":     {"q": "fagioli", "match": r"fagiol", "exclude": r"fagiolini|farina|zuppa|pasta", "unita": "kg"},
    "lenticchie":  {"q": "lenticchie", "match": r"lenticch", "exclude": r"farina|pasta|zuppa|burger", "unita": "kg"},
    "avena":       {"q": "fiocchi di avena", "match": r"(fiocchi|farina|crusca|porridge).{0,12}avena|avena.{0,12}(fiocchi|integrali|decorticat)", "exclude": r"bevanda|latte|biscott|barrett|yogurt|pane|snack", "unita": "kg"},
    "cacao":       {"q": "cacao amaro", "match": r"cacao", "exclude": r"burro di|crema|solubile zucchera|bevanda|coppa|panna|torta|frollini|wafer|merenda|latte|snack|nesquik|cereali", "unita": "kg"},
    "miele":       {"q": "miele", "match": r"miele", "exclude": r"caramell|yogurt|cereali|snack", "unita": "kg"},
    "noci":        {"q": "noci", "match": r"\bnoci\b|mandorle|nocciole|anacardi|arachidi", "exclude": r"burro|crema|olio|latte|bevanda|snack|cioccolat|cocco|farina|pesche|pesca|nettarine", "unita": "kg", "entro": 30},
    "olive":       {"q": "olive", "match": r"olive", "exclude": r"olio|pate|patè|crema|snack|pizza|contorno|insalat|focacc|polpo|pesce", "unita": "kg"},
    "capperi":     {"q": "capperi", "match": r"capperi", "exclude": r"pate|patè|crema", "unita": "kg"},

    # --- Spezie ---
    "peperoncino": {"q": "peperoncino", "match": r"peperoncin", "exclude": r"olio|salsa|crema|sott|patatine|snack", "scegli": "prezzo"},
    "origano":     {"q": "origano", "match": r"origano", "exclude": r"olio|salsa|patatine|snack|pizza|sugo", "scegli": "prezzo"},
    "rosmarino":   {"q": "rosmarino", "match": r"rosmarino", "exclude": r"olio|salsa|patatine|snack|focacc|sugo", "scegli": "prezzo"},
    "paprika":     {"q": "paprika", "match": r"paprika", "exclude": r"patatine|snack|salsa|pront|gusto|chips|doppia cottura|patat|pringles|saccoccio|maggi|insaporitore", "scegli": "prezzo"},
    "cannella":    {"q": "cannella", "match": r"cannella", "exclude": r"tisana|te |dolce|brioche|greco|mela e", "scegli": "prezzo"},
}
