// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 Mathias Brunkow Moser
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.
//
// This file was generated with AI assistance (Claude Code, Anthropic).

// ============================================================================
//  RULEBOOK — A complete enumeration of German grammar rules, A2 → C1.
//  Each rule has a unique ID, category, CEFR level, a concise rule statement,
//  examples, and known exceptions. Organised from foundational morphology
//  up to C1 register conventions.
// ============================================================================

export const RULE_CATEGORIES = [
  { id: "nomen",    label: "Nomen & Artikel",       en: "Nouns & Articles" },
  { id: "adjektiv", label: "Adjektive",              en: "Adjectives" },
  { id: "verb",     label: "Verben & Zeitformen",    en: "Verbs & Tenses" },
  { id: "syntax",   label: "Satzbau",                en: "Sentence Structure" },
  { id: "praep",    label: "Präpositionen & Kasus",  en: "Prepositions & Cases" },
  { id: "konj",     label: "Konjunktiv",             en: "Subjunctive" },
  { id: "passiv",   label: "Passiv & Ersatzformen",  en: "Passive & Substitutes" },
  { id: "register", label: "Register & Nominalstil", en: "Register & Nominal Style" },
];

// Rule shape:
// id        — unique code "R-NNN"
// category  — key from RULE_CATEGORIES
// level     — "A2" | "B1" | "B2" | "C1"
// title     — German rule name
// en        — English name
// rule      — the rule stated as concise pseudocode / formula
// examples  — [{ de, en, note? }]
// exceptions — string[] (optional)
// seeAlso   — string[] of rule IDs (optional)

export const RULES = [

  // ====================================================== NOMEN & ARTIKEL ===

  {
    id: "R-001",
    category: "nomen",
    level: "A2",
    title: "Grammatisches Geschlecht",
    en: "Grammatical gender",
    rule:
`// Gender is a syntactic property of the noun — not its meaning.
// Memorise: der / das / die with every new noun.

der  — Maskulin    (der Mann, der Tisch, der Computer)
das  — Neutrum     (das Kind, das Haus, das System)
die  — Feminin     (die Frau, die Lampe, die Information)

// Reliable suffix cues:
-ung            → die   (Wohnung, Entscheidung, Zeitung)
-heit / -keit   → die   (Freiheit, Sicherheit, Möglichkeit)
-schaft         → die   (Gesellschaft, Freundschaft)
-tion / -ik     → die   (Situation, Politik, Musik)
-er (agent)     → der   (Lehrer, Fahrer, Computer)
-chen / -lein   → das   (Mädchen, Städtchen)
-ment           → das   (Instrument, Dokument, Argument)
-nis            → das or die — memorise individually`,
    examples: [
      { de: "die Entscheidung, die Sicherheit, die Politik", en: "Feminine by suffix -ung / -heit / -ik", note: "-ung is always feminine" },
      { de: "das Mädchen", en: "the girl", note: "-chen → always neuter, regardless of biological sex" },
    ],
    exceptions: [
      "das Mädchen is grammatically neuter even though it refers to a girl.",
      "das Ereignis (neut) but die Kenntnis (fem) — -nis is not reliable; memorise individually.",
    ],
  },

  {
    id: "R-002",
    category: "nomen",
    level: "A2",
    title: "Pluralbildung",
    en: "Plural formation",
    rule:
`// Five main plural types — always memorise plural with the noun.

Type   Marker   Example singular → plural
—      (none)   das Fenster → die Fenster
-e     + e      der Tisch   → die Tische
-n     + n/en   die Lampe   → die Lampen
-er    + er      das Kind    → die Kinder   (often + umlaut)
-s     + s       das Auto    → die Autos    (loanwords)

// Most masc/neut monosyllables with a/o/u add umlaut:
der Mann → die Männer      das Haus → die Häuser`,
    examples: [
      { de: "das Buch → die Bücher", en: "book → books", note: "Type -er + umlaut" },
      { de: "die Frau → die Frauen", en: "woman → women", note: "Type -n" },
      { de: "der Schlüssel → die Schlüssel", en: "key → keys", note: "Type — (no change)" },
    ],
  },

  {
    id: "R-003",
    category: "nomen",
    level: "A2",
    title: "n-Deklination (schwache Maskulina)",
    en: "Weak masculine nouns",
    rule:
`// Certain masculine nouns take -(e)n in EVERY case except NOM singular.

Kasus    Singular         Plural
NOM      der Student      die Studenten
AKK      den Studenten    die Studenten
DAT      dem Studenten    den Studenten
GEN      des Studenten    der Studenten

// Membership: masc nouns ending in -e,  living beings with certain
// suffixes, Greek/Latin -ant/-ent/-ist/-at/-nom/-graph:
der Junge, der Mensch, der Herr*, der Kollege,
der Student, der Jurist, der Assistent, der Elefant`,
    examples: [
      { de: "Ich sehe den Studenten.", en: "I see the student.", note: "AKK — n-Deklination" },
      { de: "die Meinung des Kollegen", en: "the colleague's opinion", note: "GEN — n-Deklination" },
    ],
    exceptions: [
      "der Herr → des Herrn (not des Herren) in GEN singular.",
      "der Name, der Buchstabe, der Wille → mixed: add -n in all cases except NOM sg, GEN sg adds -ns (des Namens).",
    ],
    seeAlso: ["R-005"],
  },

  {
    id: "R-004",
    category: "nomen",
    level: "A2",
    title: "Genitiv Singular — Nomenendung",
    en: "Genitive singular noun ending",
    rule:
`// Masculine and neuter add -(e)s in GEN singular.
// Feminine and plural: no ending on the noun itself.

m/n one syllable  → -(e)s    des Hauses, des Mannes, des Buches
m/n polysyllable  → -s       des Lehrers, des Autos, des Vertrages
f                 → —        der Frau, der Stadt, der Meinung
pl                → —        der Frauen, der Kinder`,
    examples: [
      { de: "die Farbe des Hauses", en: "the colour of the house", note: "one-syllable neut → -es" },
      { de: "der Name des Lehrers", en: "the teacher's name", note: "polysyllable masc → -s" },
    ],
  },

  {
    id: "R-005",
    category: "nomen",
    level: "A2",
    title: "Dativ Plural",
    en: "Dative plural",
    rule:
`// ALL nouns add -n in DAT plural, UNLESS the plural already ends in -n or -s.

die Kinder  → den Kindern    (add -n)
die Männer  → den Männern    (add -n)
die Lampen  → den Lampen     (already -n → no addition)
die Autos   → den Autos      (ends -s → no addition)`,
    examples: [
      { de: "Ich helfe den Kindern.", en: "I'm helping the children.", note: "DAT pl: Kinder + n" },
      { de: "mit den Autos", en: "with the cars", note: "DAT pl: Autos — no addition" },
    ],
  },

  {
    id: "R-006",
    category: "nomen",
    level: "A2",
    title: "Bestimmter Artikel — der-Wörter",
    en: "Definite article and der-words",
    rule:
`// der-words: der, dieser, jeder, welcher, jener, solcher, aller
// All share one ending table.

         Mask       Neut       Fem        Plural
NOM      der        das        die        die
AKK      den        das        die        die
DAT      dem        dem        der        den
GEN      des        des        der        der

// Hot cells: Mask AKK (der → den); DAT Plural (noun adds -n)`,
    examples: [
      { de: "Ich sehe den Mann.", en: "I see the man.", note: "Mask AKK: der → den" },
      { de: "mit diesem Buch", en: "with this book", note: "dieser follows the same table" },
    ],
  },

  {
    id: "R-007",
    category: "nomen",
    level: "A2",
    title: "Unbestimmter Artikel — ein-Wörter",
    en: "Indefinite article and ein-words",
    rule:
`// ein-words: ein, kein, mein, dein, sein, ihr, unser, euer, Ihr
// Three cells are NAKED (no ending) — this is why strong adjective endings exist.

         Mask      Neut      Fem       Plural (kein-)
NOM      ein —     ein —     eine      keine
AKK      einen     ein —     eine      keine
DAT      einem     einem     einer     keinen
GEN      eines     eines     einer     keiner

// — marks the three naked cells: Mask NOM, Neut NOM, Neut AKK`,
    examples: [
      { de: "Ein Mann kommt.", en: "A man is coming.", note: "Mask NOM — naked cell" },
      { de: "Ich habe kein Geld.", en: "I have no money.", note: "Neut AKK — naked cell" },
    ],
    seeAlso: ["R-020", "R-022"],
  },

  {
    id: "R-008",
    category: "nomen",
    level: "A2",
    title: "Personalpronomen",
    en: "Personal pronouns",
    rule:
`// Inflect for case; replace a noun and agree with it in gender and number.

         NOM    AKK     DAT
ich      ich    mich    mir
du       du     dich    dir
er       er     ihn     ihm
sie (f)  sie    sie     ihr
es       es     es      ihm
wir      wir    uns     uns
ihr      ihr    euch    euch
sie/Sie  sie    sie     ihnen`,
    examples: [
      { de: "Ich gebe ihm das Buch.", en: "I give him the book.", note: "DAT pronoun — masculine" },
      { de: "Hast du es gesehen?", en: "Have you seen it?", note: "es for any neuter noun" },
    ],
  },

  // ======================================================== ADJEKTIVE ===

  {
    id: "R-020",
    category: "adjektiv",
    level: "A2",
    title: "Adjektivdeklination — schwach",
    en: "Weak adjective endings (after der-words)",
    rule:
`// The der-word already carries the case signal → adjective uses the minimal ending.
// Shape: -e in 5 cells (top-left L), -en everywhere else.

         Mask   Neut   Fem    Plural
NOM      -e     -e     -e     -en
AKK      -en    -e     -e     -en
DAT      -en    -en    -en    -en
GEN      -en    -en    -en    -en`,
    examples: [
      { de: "der alte Mann", en: "the old man", note: "Mask NOM → -e" },
      { de: "die alten Männer", en: "the old men", note: "Plural NOM/AKK → -en" },
      { de: "mit dem alten Mann", en: "with the old man", note: "Mask DAT → -en" },
    ],
    seeAlso: ["R-021", "R-022"],
  },

  {
    id: "R-021",
    category: "adjektiv",
    level: "A2",
    title: "Adjektivdeklination — gemischt",
    en: "Mixed adjective endings (after ein-words)",
    rule:
`// After an ein-word, the adjective fills the three naked cells with strong endings;
// everywhere else it uses -en.

         Mask   Neut   Fem    Plural
NOM      -er    -es    -e     -en
AKK      -en    -es    -e     -en
DAT      -en    -en    -en    -en
GEN      -en    -en    -en    -en

// Decision: does the preceding word already show the case signal?
//   No  → adjective borrows the strong ending (like the der-table, minus 'd').
//   Yes → adjective uses -en.`,
    examples: [
      { de: "ein alter Mann", en: "an old man", note: "Mask NOM — naked → -er" },
      { de: "ein neues Auto", en: "a new car", note: "Neut NOM — naked → -es" },
      { de: "keine alten Männer", en: "no old men", note: "Plural — keine carries signal → -en" },
    ],
    seeAlso: ["R-020", "R-022"],
  },

  {
    id: "R-022",
    category: "adjektiv",
    level: "A2",
    title: "Adjektivdeklination — stark",
    en: "Strong adjective endings (no article)",
    rule:
`// Without any article the adjective alone must carry case and gender.
// It mirrors the der-table endings with the leading 'd' removed.

         Mask   Neut   Fem    Plural
NOM      -er    -es    -e     -e
AKK      -en    -es    -e     -e
DAT      -em    -em    -er    -en
GEN      -en    -en    -er    -er

// Exception: GEN masc/neut → -en (not -es) because the noun already has -(e)s`,
    examples: [
      { de: "guter Wein", en: "good wine", note: "Mask NOM, no article → -er" },
      { de: "mit frischem Brot", en: "with fresh bread", note: "Neut DAT → -em" },
      { de: "trotz schlechten Wetters", en: "despite bad weather", note: "Neut GEN → -en; noun carries the -s" },
    ],
    exceptions: [
      "After viele, wenige, einige, mehrere, andere → strong plural: viele gute Ideen.",
      "After alle, beide, sämtliche → weak plural: alle guten Ideen.",
      "etwas / nichts / viel / wenig + neuter noun → -es: etwas Neues, nichts Wichtiges.",
    ],
    seeAlso: ["R-020", "R-021"],
  },

  {
    id: "R-023",
    category: "adjektiv",
    level: "A2",
    title: "Komparativ",
    en: "Comparative",
    rule:
`// Komparativ = Positiv + -er; attributive forms still take adjective endings.
// Most one-syllable adjectives with a/o/u add umlaut.

schnell → schneller   groß → größer     alt → älter
jung    → jünger      gut  → besser     viel → mehr
gern    → lieber      hoch → höher      nah → näher

// Comparison particles:
so … wie   (equal)       Er ist so groß wie ich.
als        (unequal)     Er ist größer als ich.

// Attributive: komparativ + normal adjective ending
ein schnelleres Auto, der ältere Bruder`,
    examples: [
      { de: "Das Haus ist größer als die Wohnung.", en: "The house is bigger than the flat.", note: "Unequal → als" },
      { de: "ein schnelleres Auto", en: "a faster car", note: "Comparative + adjective ending" },
      { de: "Je mehr ich lerne, desto sicherer werde ich.", en: "The more I learn, the more confident I get." },
    ],
    exceptions: [
      "Never »größer wie« — unequal comparison requires als.",
      "Adjectives ending in -el/-er drop the -e: dunkel → dunkler, teuer → teurer.",
    ],
  },

  {
    id: "R-024",
    category: "adjektiv",
    level: "A2",
    title: "Superlativ",
    en: "Superlative",
    rule:
`// Predicative:  am + Positiv + -(e)sten
// Attributive:  der/die/das + Positiv + -(e)sten + adjective ending

schnell → am schnellsten → der schnellste
alt     → am ältesten   → der älteste
groß    → am größten    → der größte
gut     → am besten     → der beste
viel    → am meisten    → die meisten
hoch    → am höchsten   → der höchste

// -e- inserted before -sten when stem ends in -d/-t/-s/-ß/-z:
laut → am lautesten`,
    examples: [
      { de: "Er ist am schnellsten.", en: "He is the fastest.", note: "Predicative superlative" },
      { de: "der schnellste Läufer", en: "the fastest runner", note: "Attributive superlative" },
    ],
  },

  // ======================================================== VERBEN & ZEITFORMEN ===

  {
    id: "R-030",
    category: "verb",
    level: "A2",
    title: "Schwache Verben — Präsens",
    en: "Weak verbs — present tense",
    rule:
`// Regular: stem + ending; stem never changes.
machen: ich mache, du machst, er/sie/es macht,
        wir machen, ihr macht, sie/Sie machen

// Stems ending in -d/-t/-m/-n (where not preceded by l/r): insert -e-
du arbeit-e-st, er arbeit-e-t, ihr arbeit-e-t
du öffn-e-st, er öffn-e-t`,
    examples: [
      { de: "Er arbeitet täglich.", en: "He works every day.", note: "-e- inserted for pronounceability" },
    ],
  },

  {
    id: "R-031",
    category: "verb",
    level: "A2",
    title: "Starke Verben — Vokalwechsel Präsens",
    en: "Strong verbs — stem vowel change in present tense",
    rule:
`// ~200 strong verbs change their stem vowel in du/er/sie/es forms only.

e → i     geben: er gibt     nehmen: er nimmt    sprechen: er spricht
e → ie    lesen: er liest    sehen: er sieht     empfehlen: er empfiehlt
a → ä     fahren: er fährt   tragen: er trägt    lassen: er lässt
au → äu   laufen: er läuft`,
    examples: [
      { de: "Er gibt mir das Buch.", en: "He gives me the book.", note: "geben: e → i in 3rd sg" },
      { de: "Sie liest jeden Abend.", en: "She reads every evening.", note: "lesen: e → ie in 3rd sg" },
    ],
  },

  {
    id: "R-032",
    category: "verb",
    level: "A2",
    title: "Trennbare Verben",
    en: "Separable verbs",
    rule:
`// The stressed prefix separates in main clauses; it moves to the clause end.

aufstehen:   Ich stehe um 7 Uhr auf.
anrufen:     Er ruft mich jeden Tag an.

// Imperative: prefix to end
Ruf mich bitte an!

// Subordinate clauses: no separation — verb goes to end as one word
…, weil sie früh aufsteht.

// Infinitive with zu: zu inserts between prefix and stem
Er hat vor, früh auf-zu-stehen.`,
    examples: [
      { de: "Ich rufe dich morgen an.", en: "I'll call you tomorrow.", note: "anrufen — prefix to end" },
      { de: "…, weil er mitkommt.", en: "…because he is coming along.", note: "Subordinate — no split" },
    ],
    seeAlso: ["R-038"],
  },

  {
    id: "R-033",
    category: "verb",
    level: "A2",
    title: "Untrennbare Verben",
    en: "Inseparable verbs",
    rule:
`// Prefixes be-, ge-, er-, ver-, zer-, ent-, emp-, miss- are NEVER separated.
// These verbs also take NO ge- in Partizip II.

be-    bezahlen  → bezahlt     (ich bezahle die Rechnung)
ver-   verstehen → verstanden  (er versteht das)
er-    erklären  → erklärt     (sie erklärt es)
ent-   entscheiden → entschieden
emp-   empfehlen → empfohlen`,
    examples: [
      { de: "Er hat die Aufgabe erklärt.", en: "He explained the task.", note: "erklären → erklärt (no ge-)" },
      { de: "Das verstehe ich nicht.", en: "I don't understand that.", note: "verstehen — inseparable, no split" },
    ],
  },

  {
    id: "R-034",
    category: "verb",
    level: "A2",
    title: "Modalverben — Präsens",
    en: "Modal verbs — present tense",
    rule:
`// Six modals; irregular singular (no -st/-t on er/sie/es; vowel change).
// Structure: modal at position 2, dependent bare infinitive at clause end.

         können  müssen  dürfen  sollen  wollen  mögen
ich/er   kann    muss    darf    soll    will    mag
du       kannst  musst   darfst  sollst  willst  magst
wir/sie  können  müssen  dürfen  sollen  wollen  mögen

// möchte = Konjunktiv II of mögen → polite "would like" (very common)
// sollen = obligation from outside (someone else requires it)
// wollen = own intention`,
    examples: [
      { de: "Ich muss morgen früh aufstehen.", en: "I have to get up early tomorrow.", note: "müssen — obligation" },
      { de: "Du darfst nicht rauchen.", en: "You're not allowed to smoke.", note: "dürfen (negated) — prohibition" },
    ],
    exceptions: [
      "nicht müssen ≠ nicht dürfen: »Du musst nicht kommen« = no obligation; »Du darfst nicht kommen« = prohibition.",
    ],
    seeAlso: ["R-035"],
  },

  {
    id: "R-035",
    category: "verb",
    level: "A2",
    title: "Modalverben — Präteritum",
    en: "Modal verbs — simple past",
    rule:
`// Modals use Präteritum in everyday speech — not Perfekt.
// Form: infinitive minus umlaut + Präteritum endings (ich/er: no ending)

können → konnte    müssen → musste    dürfen → durfte
sollen → sollte    wollen → wollte    mögen  → mochte

// Perfekt of modals → double infinitive (NOT Partizip II)
Ich habe kommen müssen.   ✓
Ich habe gemusst kommen.  ✗`,
    examples: [
      { de: "Ich konnte nicht kommen.", en: "I wasn't able to come.", note: "Preferred past tense for modals" },
      { de: "Sie hat arbeiten müssen.", en: "She had to work.", note: "Perfekt — double infinitive" },
    ],
    seeAlso: ["R-034"],
  },

  {
    id: "R-036",
    category: "verb",
    level: "A2",
    title: "Partizip II — Bildung",
    en: "Past participle — formation",
    rule:
`// Memorise two forms per verb: infinitive and Partizip II.

Type                Pattern              Example
schwach             ge + Stamm + t       machen → gemacht
schwach -d/-t       ge + Stamm + et      arbeiten → gearbeitet
stark               ge + new stem + en   schreiben → geschrieben
untrennbar prefix   NO ge-               verstehen → verstanden
-ieren              NO ge-               studieren → studiert
trennbar            Präfix + ge + …      aufstehen → aufgestanden

// Partizip II is invariable when used with haben/sein in Perfekt.
// It inflects like an adjective when used attributively.`,
    examples: [
      { de: "Ich habe den Brief geschrieben.", en: "I wrote the letter.", note: "Stark — no adjective ending in Perfekt" },
      { de: "der geschriebene Brief", en: "the written letter", note: "Attributive — takes adjective ending" },
    ],
    seeAlso: ["R-052"],
  },

  {
    id: "R-037",
    category: "verb",
    level: "B1",
    title: "Partizip I — Bildung und Gebrauch",
    en: "Present participle — formation and use",
    rule:
`// Partizip I = Infinitiv + d   (schlafen → schlafend)
// Primarily attributive; inflects like a normal adjective.
// Meaning: simultaneous, active action.

das schlafende Kind       (the sleeping child)
die steigende Temperatur  (the rising temperature)

// Adverbial use (invariable):
Sie kam lächelnd herein.  (She entered smiling.)`,
    examples: [
      { de: "die wachsende Zahl der Studenten", en: "the growing number of students", note: "Partizip I attributiv — + adjective ending" },
    ],
    seeAlso: ["R-101"],
  },

  {
    id: "R-038",
    category: "verb",
    level: "B1",
    title: "Infinitiv mit zu",
    en: "Infinitive with zu",
    rule:
`// Required after many verbs, adjectives, and nouns.
// zu goes directly before the infinitive; inserts between prefix and stem for trennbare.

Common triggers: versuchen, vergessen, hoffen, vorhaben, beginnen,
versprechen, empfehlen, bitten, aufhören, beschließen, sich freuen,
es ist wichtig/schwierig/möglich, der Versuch, die Absicht

Er versucht, pünktlich zu kommen.
Er hat vor, früh auf|zu|stehen.    // trennbar: auf-zu-stehen

// Purpose: um … zu     (same subject)
Ich lerne Deutsch, um in Deutschland zu arbeiten.
// Manner: ohne … zu, anstatt … zu`,
    examples: [
      { de: "Er fährt nach Berlin, um seinen Bruder zu besuchen.", en: "He goes to Berlin to visit his brother.", note: "um...zu — purpose" },
      { de: "Sie geht, ohne sich zu verabschieden.", en: "She leaves without saying goodbye.", note: "ohne...zu" },
    ],
    exceptions: [
      "helfen, lehren, lernen, sehen, hören, lassen, bleiben + infinitive WITHOUT zu (see R-039).",
    ],
    seeAlso: ["R-032", "R-039"],
  },

  {
    id: "R-039",
    category: "verb",
    level: "B1",
    title: "Infinitiv ohne zu",
    en: "Bare infinitive after certain verbs",
    rule:
`// These verbs take a bare infinitive — no zu — like the modals.

lassen    Er lässt das Auto reparieren.    (has it repaired / lets it be repaired)
sehen     Ich sehe ihn kommen.
hören     Wir hören sie singen.
bleiben   Er bleibt stehen.
gehen     Sie geht schwimmen.
helfen    Kannst du mir tragen helfen?

// Perfekt → double infinitive (NOT Partizip)
Ich habe ihn kommen sehen.     ✓
Ich habe ihn kommen gesehen.   ✗ (only in very colloquial speech)`,
    examples: [
      { de: "Ich lasse mir die Haare schneiden.", en: "I'm getting my hair cut.", note: "lassen — bare infinitive" },
      { de: "Ich habe sie singen hören.", en: "I heard her singing.", note: "Perfekt → double infinitive" },
    ],
    seeAlso: ["R-034", "R-038"],
  },

  {
    id: "R-040",
    category: "verb",
    level: "A2",
    title: "Reflexive Verben",
    en: "Reflexive verbs",
    rule:
`// Reflexive pronoun agrees with subject.
// AKK by default; DAT when there is already a direct accusative object.

AKK: mich, dich, sich, uns, euch, sich
DAT: mir,  dir,  sich, uns, euch, sich     // sich is the same in both

Ich wasche mich.            // AKK — no other object
Ich wasche mir die Hände.   // DAT — "die Hände" is the AKK object

// Many German reflexives are not reflexive in English:
sich erinnern, sich befinden, sich beeilen, sich irren, sich freuen`,
    examples: [
      { de: "Ich freue mich auf das Wochenende.", en: "I'm looking forward to the weekend.", note: "sich freuen auf + AKK" },
      { de: "Merk dir das!", en: "Remember that!", note: "sich merken — DAT; das is the AKK object" },
    ],
  },

  {
    id: "R-050",
    category: "verb",
    level: "A2",
    title: "Präsens — Gebrauch",
    en: "Present tense — usage",
    rule:
`// German Präsens covers all English present forms plus the near future.

Present simple:      Ich lese täglich.        I read daily.
Present progressive: Ich lese gerade.         I am reading now.
Near future:         Wir kommen morgen.       We're coming tomorrow.
Historical present:  1989 fällt die Mauer.

// No progressive aspect: context or adverb (gerade, jetzt) marks ongoing action.`,
    examples: [
      { de: "Ich komme morgen.", en: "I'm coming tomorrow.", note: "Präsens for definite future plans" },
    ],
  },

  {
    id: "R-051",
    category: "verb",
    level: "A2",
    title: "Präteritum",
    en: "Simple past",
    rule:
`// Weak: Stamm + te + ending; strong: Ablaut (vowel change) + ending.
// ich/er/sie/es form has NO ending — same as the bare Präteritum stem.

Weak:   machen → machte     arbeiten → arbeitete
Strong: schreiben → schrieb    gehen → ging    kommen → kam
        fahren → fuhr       sehen → sah     geben → gab

// Register: Präteritum = written narrative, distance in time.
// sein, haben, and all modals → Präteritum even in speech.
// Everything else → Perfekt in speech, Präteritum in writing.`,
    examples: [
      { de: "Er kam spät an.", en: "He arrived late.", note: "Preferred in written narrative" },
      { de: "Ich hatte keine Zeit.", en: "I had no time.", note: "haben → Präteritum even in speech" },
    ],
    seeAlso: ["R-052"],
  },

  {
    id: "R-052",
    category: "verb",
    level: "A2",
    title: "Perfekt — haben oder sein",
    en: "Perfect — formation and haben/sein",
    rule:
`// haben or sein as auxiliary + Partizip II at clause end.

useSein = intransitive AND (change of location OR change of state)
          OR verb in { sein, bleiben, werden, begegnen, folgen, passieren, gelingen }

// sein verbs (learn this list):
gehen, kommen, fahren, fliegen, laufen, rennen,
ankommen, abfahren, einschlafen, aufwachen, sterben, werden, bleiben

// Everything else → haben`,
    examples: [
      { de: "Ich habe den Brief geschrieben.", en: "I wrote the letter.", note: "haben — transitive" },
      { de: "Er ist nach Berlin gefahren.", en: "He went to Berlin.", note: "sein — change of location" },
      { de: "Sie ist eingeschlafen.", en: "She fell asleep.", note: "sein — change of state" },
    ],
    exceptions: [
      "fahren/fliegen/segeln take sein for travel to destinations, haben when driving the vehicle around: »Er hat das Auto gefahren.«",
    ],
    seeAlso: ["R-051", "R-036"],
  },

  {
    id: "R-053",
    category: "verb",
    level: "B1",
    title: "Plusquamperfekt",
    en: "Past perfect (pluperfect)",
    rule:
`// hatte/war [Präteritum form] + Partizip II
// Marks an action completed BEFORE a past reference point.

sein-Verbs:   war  + Partizip II
haben-Verbs:  hatte + Partizip II

Nachdem er gegessen hatte, ging er schlafen.
Als wir ankamen, war er bereits abgereist.

// Trigger words: nachdem, als, bevor (sometimes), sobald`,
    examples: [
      { de: "Nachdem sie gegessen hatte, lernte sie noch eine Stunde.", en: "After she had eaten, she studied for another hour." },
    ],
    seeAlso: ["R-052", "R-070"],
  },

  {
    id: "R-054",
    category: "verb",
    level: "B1",
    title: "Futur I und Futur II",
    en: "Future I and Future II",
    rule:
`// Futur I:  werden[Präsens] + Infinitiv — prediction, intention, assumption
// Futur II: werden[Präsens] + Partizip II + haben/sein — completed future

Futur I:   Er wird morgen kommen.
Futur II:  Bis morgen wird er angekommen sein.

// In practice, Präsens + temporal adverb replaces Futur I in most speech.
// Futur II is common for assumptions about past events:
Er wird das vergessen haben.  (He has probably forgotten that.)`,
    examples: [
      { de: "Das wird nicht einfach sein.", en: "That won't be easy.", note: "Futur I — prediction" },
      { de: "Sie wird das Buch schon gelesen haben.", en: "She will have already read the book.", note: "Futur II — completed assumption" },
    ],
  },

  // ======================================================== SATZBAU ===

  {
    id: "R-060",
    category: "syntax",
    level: "A2",
    title: "Verbzweitstellung im Hauptsatz",
    en: "Verb-second word order in main clauses",
    rule:
`// The finite (conjugated) verb is ALWAYS in position 2 in declarative main clauses.
// Position 1 is a free slot: any single element can stand there.

[ 1 element ] [ Verb ] [ Subjekt if not P1 ] [ Mittelfeld ] [ Verbende ]

Ich        gehe   morgen    ins Kino.
Morgen     gehe   ich       ins Kino.     // inversion — subject moves to pos. 3
Ins Kino   gehe   ich       morgen.       // fronting for emphasis`,
    examples: [
      { de: "Heute fahre ich nach München.", en: "Today I'm going to Munich.", note: "Temporal element at pos. 1 → inversion" },
    ],
    seeAlso: ["R-062", "R-063"],
  },

  {
    id: "R-061",
    category: "syntax",
    level: "A2",
    title: "Verberststellung — Fragen und Imperativ",
    en: "Verb-first position — questions and imperatives",
    rule:
`// Yes/no question: finite verb first, subject second.
// W-question: W-word first, verb second, subject third.
// Imperative: finite verb first; du/ihr forms have no subject pronoun.

Ja/Nein:  Kommt   er    morgen?
W-Frage:  Wann   kommt  er?
Imperativ: Komm!  (du)   Kommt!  (ihr)   Kommen Sie!  (Sie)`,
    examples: [
      { de: "Hast du Zeit?", en: "Do you have time?", note: "Yes/no — verb first" },
      { de: "Mach das bitte!", en: "Please do that!", note: "du-Imperativ — no pronoun" },
    ],
  },

  {
    id: "R-062",
    category: "syntax",
    level: "A2",
    title: "Verbendstellung im Nebensatz",
    en: "Verb-final word order in subordinate clauses",
    rule:
`// In any subordinate clause the FINITE verb goes to the END.
// With multiple verb parts: finite verb is last.

…, weil    er       krank     ist.
…, weil    er       krank     gewesen ist.    // Perfekt: sein last
…, weil    er       kommen    muss.           // modal last
…, weil    er       kommen    hat müssen.     // Perfekt of modal: müssen last

// Conjunction can be dropped if verb moves to position 1:
→ NOT possible; verb-end is obligatory when conjunction is present.`,
    examples: [
      { de: "Ich weiß, dass er krank ist.", en: "I know that he is ill." },
      { de: "…, weil er nicht kommen konnte.", en: "…because he couldn't come.", note: "Modal Präteritum — konnte last" },
    ],
    seeAlso: ["R-060", "R-068"],
  },

  {
    id: "R-063",
    category: "syntax",
    level: "A2",
    title: "Die Satzklammer",
    en: "The sentence bracket",
    rule:
`// In main clauses: finite verb (pos. 2) + non-finite verb (clause end) form a bracket.
// The Mittelfeld sits between them.

Ich   habe   gestern meinen Freund   angerufen.
      ^P2                            ^bracket-end

// In subordinate clauses the bracket collapses: finite verb comes last.
…, weil ich gestern meinen Freund angerufen habe.

// Adverbials always stay inside the bracket.`,
    examples: [
      { de: "Er wird das Buch morgen zurückgeben.", en: "He will return the book tomorrow.", note: "wird…zurückgeben — bracket" },
    ],
    seeAlso: ["R-060", "R-062"],
  },

  {
    id: "R-064",
    category: "syntax",
    level: "A2",
    title: "TE-KA-MO-LO im Mittelfeld",
    en: "Adverbial ordering in the Mittelfeld",
    rule:
`// Default (neutral focus) ordering inside the bracket:
// Temporal → Kausal → Modal → Lokal
//  wann?      warum?   wie?    wo?/wohin?

Ich fahre  heute          wegen der Arbeit   mit dem Zug   nach Köln.
           TE             KA                 MO            LO

// Moving an element out of this order signals contrast or emphasis.`,
    examples: [
      { de: "Er lernt täglich allein in der Bibliothek.", en: "He studies daily, alone in the library.", note: "TE (täglich) → MO (allein) → LO" },
    ],
  },

  {
    id: "R-065",
    category: "syntax",
    level: "A2",
    title: "Objekt-Reihenfolge — DAT vor AKK",
    en: "Object order — dative before accusative",
    rule:
`// Both objects are nouns:      DAT first, then AKK.
// AKK object is a pronoun:     pronoun jumps before the DAT noun.
// Both objects are pronouns:   AKK before DAT.

noun-noun:   Ich gebe   dem Kind    das Buch.
noun-pron:   Ich gebe   es          dem Kind.     // AKK pronoun first
pron-noun:   Ich gebe   ihm         das Buch.
pron-pron:   Ich gebe   es          ihm.          // AKK before DAT`,
    examples: [
      { de: "Gib dem Lehrer den Brief!", en: "Give the teacher the letter!", note: "Both nouns: DAT → AKK" },
      { de: "Gib ihn dem Lehrer!", en: "Give it to the teacher!", note: "AKK pronoun jumps to first position" },
    ],
  },

  {
    id: "R-066",
    category: "syntax",
    level: "A2",
    title: "Negation mit nicht",
    en: "Negation with nicht",
    rule:
`// nicht negates a verb phrase or a specific element.

// Verb-phrase negation: nicht before the bracket end
Ich gehe heute nicht ins Kino.
Ich kann das nicht machen.

// Element negation: nicht immediately before the target element
Nicht ich habe das getan, sondern er.
Das ist nicht sein Hund, sondern meiner.

// nicht after: definite direct objects, definite time adverbs
Ich habe das Buch nicht gelesen.   (NOT: Ich habe nicht das Buch gelesen — unless contrasted)`,
    examples: [
      { de: "Er kommt heute nicht.", en: "He's not coming today.", note: "Verb-phrase negation — nicht at end" },
    ],
    seeAlso: ["R-067"],
  },

  {
    id: "R-067",
    category: "syntax",
    level: "A2",
    title: "Negation mit kein",
    en: "Negation with kein",
    rule:
`// kein replaces ein or a zero article in a noun phrase; inflects like ein.
// »nicht ein« is WRONG — always use kein.

Ich habe einen Hund.  → Ich habe keinen Hund.      (AKK masc)
Er hat Zeit.          → Er hat keine Zeit.          (zero article)
Das ist ein Problem.  → Das ist kein Problem.       (pred NOM neut)`,
    examples: [
      { de: "Ich habe keine Zeit.", en: "I have no time.", note: "Zero article → kein" },
    ],
    seeAlso: ["R-066"],
  },

  // ======================================================== KONNEKTOREN ===

  {
    id: "R-068",
    category: "syntax",
    level: "A2",
    title: "Konnektoren Klasse 0 — koordinierend",
    en: "Coordinating conjunctions (no word-order effect)",
    rule:
`// Join two main clauses; each clause keeps its own verb at position 2.
und, aber, denn, oder, sondern (after a negative clause)

Ich bin müde, aber  ich muss noch arbeiten.
Ich bleibe,   denn  ich bin krank.
Ich komme nicht, sondern  ich gehe nach Hause.

// denn ≠ weil: denn is coordinating (V2 follows); weil is subordinating (V-end).`,
    examples: [
      { de: "Er ist krank, aber er geht trotzdem zur Arbeit.", en: "He is ill, but he goes to work anyway." },
    ],
    seeAlso: ["R-069", "R-070"],
  },

  {
    id: "R-069",
    category: "syntax",
    level: "B1",
    title: "Konnektoren Klasse 1 — Adverbien",
    en: "Adverbial connectors (verb-second with inversion)",
    rule:
`// These stand at position 1 of the second clause → verb stays pos. 2, subject moves to 3.

deshalb, deswegen, daher        (therefore)
trotzdem, dennoch               (nevertheless)
außerdem                        (moreover)
allerdings                      (however / though)
dann, danach                    (then / afterwards)
folglich                        (consequently)
nämlich  ← stays at pos. 3!    (namely / you see)

Ich bin krank. Deshalb  bleibe  ich  zu Hause.
               pos.1    V2      subj`,
    examples: [
      { de: "Sie hatte keine Zeit. Trotzdem kam sie.", en: "She had no time. Nevertheless she came.", note: "trotzdem — inversion" },
    ],
    exceptions: [
      "nämlich NEVER takes position 1: »Ich bleibe zu Hause. Ich bin nämlich krank.«",
    ],
    seeAlso: ["R-068", "R-070"],
  },

  {
    id: "R-070",
    category: "syntax",
    level: "B1",
    title: "Konnektoren Klasse end — subordinierend",
    en: "Subordinating conjunctions (verb to end)",
    rule:
`// Introduce a subordinate clause; finite verb goes to the END.

Kausal:        weil, da
Konzessiv:     obwohl, obgleich
Temporal:      als (single past event), wenn (recurring/present/future),
               während, bevor, nachdem, bis, seit(dem), sobald
Konditional:   wenn, falls, sofern
Final:         damit (different subjects)
Konsekutiv:    sodass, so…dass
Modal:         indem, dadurch dass
Adversativ:    während (adversative)

Ich bleibe zu Hause, weil  ich  krank  bin.
                                       ^^^  finite verb last`,
    examples: [
      { de: "Ich lerne, damit mein Deutsch besser wird.", en: "I study so that my German improves.", note: "damit — different subjects → subordinate" },
      { de: "Obwohl er müde war, arbeitete er weiter.", en: "Although tired, he kept working.", note: "Obwohl-clause first → inversion in main clause" },
    ],
    seeAlso: ["R-062", "R-068", "R-069"],
  },

  {
    id: "R-071",
    category: "syntax",
    level: "B1",
    title: "Relativsätze",
    en: "Relative clauses",
    rule:
`// Relative pronoun: gender/number from ANTECEDENT; case from its role in the relative clause.
// Identical to der-table except DAT plural (denen) and GEN (dessen/deren).

         Mask     Neut     Fem      Plural
NOM      der      das      die      die
AKK      den      das      die      die
DAT      dem      dem      der      denen
GEN      dessen   dessen   deren    deren

// Preposition comes BEFORE the relative pronoun.
die Frau, mit der ich gesprochen habe.   ✓
die Frau, der ich mit gesprochen habe.  ✗

// was after: alles, etwas, nichts, das, or an entire clause.
Alles, was du sagst, stimmt.`,
    examples: [
      { de: "Das Buch, das ich lese, ist interessant.", en: "The book I'm reading is interesting.", note: "Neut NOM" },
      { de: "Der Kollege, dessen Bericht fehlt, ist krank.", en: "The colleague whose report is missing is ill.", note: "GEN — dessen + noun, NO article" },
    ],
    seeAlso: ["R-062"],
  },

  {
    id: "R-072",
    category: "syntax",
    level: "B1",
    title: "Indirekter Fragesatz",
    en: "Indirect questions",
    rule:
`// Embedded questions use subordinate word order (V-end).
// Yes/no question → introduced by ob.
// W-question → introduced by the same W-word.

Direct:   Wann kommt er?       →  Ich frage mich, wann er kommt.
Direct:   Kommt er?            →  Ich weiß nicht, ob er kommt.
Direct:   Warum hat er gelogen? →  Sie fragt, warum er gelogen hat.`,
    examples: [
      { de: "Er fragte, ob ich Zeit hätte.", en: "He asked whether I had time.", note: "ob — yes/no indirect question" },
    ],
    seeAlso: ["R-062", "R-070"],
  },

  // ======================================================== PRÄPOSITIONEN & KASUS ===

  {
    id: "R-080",
    category: "praep",
    level: "A2",
    title: "Kasus-Zuweisung durch Verben",
    en: "Case assigned by verbs",
    rule:
`// Most verbs: NOM (subject) + AKK (direct object).
// Dativ verbs take a DAT object instead of AKK — no accusative object.

// Must-learn Dativ verbs:
helfen, danken, antworten, folgen, gehören, gefallen, passen,
fehlen, gratulieren, vertrauen, begegnen, zuhören, widersprechen,
glauben (person), schaden, nützen, ähneln`,
    examples: [
      { de: "Ich helfe dem Kind.", en: "I'm helping the child.", note: "helfen → DAT" },
      { de: "Das Buch gefällt mir.", en: "I like the book.", note: "gefallen → DAT subject is the book" },
    ],
  },

  {
    id: "R-081",
    category: "praep",
    level: "A2",
    title: "Präpositionen mit Akkusativ",
    en: "Accusative-only prepositions",
    rule:
`// Always Akkusativ — no exceptions:
durch   für   gegen   ohne   um   bis   entlang (follows noun)

// Mnemonic: DOGFUB-e (Durch Ohne Gegen Für Um Bis Entlang)

durch den Park     für meinen Vater     gegen den Wind
ohne einen Mantel  um das Haus          bis nächsten Montag

// bis often pairs with another prep: bis zum Bahnhof, bis nächsten Dienstag`,
    examples: [
      { de: "Ich kaufe ein Geschenk für meinen Bruder.", en: "I'm buying a gift for my brother.", note: "für → AKK" },
      { de: "Wir gehen durch den Wald.", en: "We're going through the forest.", note: "durch → AKK" },
    ],
    seeAlso: ["R-082", "R-083"],
  },

  {
    id: "R-082",
    category: "praep",
    level: "A2",
    title: "Präpositionen mit Dativ",
    en: "Dative-only prepositions",
    rule:
`// Always Dativ — no exceptions:
aus  außer  bei  mit  nach  seit  von  zu  gegenüber

aus dem Haus     bei meiner Mutter    mit dem Zug
nach der Arbeit  seit einem Jahr      von dem Arzt (vom)
zu dem Bahnhof (zum)   gegenüber dem Eingang

// Contractions: im=in dem, am=an dem, zum=zu dem, zur=zu der,
//               beim=bei dem, vom=von dem`,
    examples: [
      { de: "Ich fahre mit dem Bus.", en: "I'm going by bus.", note: "mit → DAT" },
      { de: "Seit drei Jahren lerne ich Deutsch.", en: "I've been learning German for three years.", note: "seit → DAT" },
    ],
    seeAlso: ["R-081", "R-083"],
  },

  {
    id: "R-083",
    category: "praep",
    level: "A2",
    title: "Wechselpräpositionen",
    en: "Two-way prepositions",
    rule:
`// an auf hinter in neben über unter vor zwischen
// AKK → wohin? (crossing a boundary, directed movement INTO the place)
// DAT → wo?    (location, state of being in the place)

wohin? (AKK):   Ich stelle die Lampe auf den Tisch.
wo?    (DAT):   Die Lampe steht auf dem Tisch.

// The test is NOT "is there movement":
Ich laufe in dem Park.  (DAT — running around inside)
Ich laufe in den Park.  (AKK — crossing from outside in)`,
    examples: [
      { de: "Das Buch liegt auf dem Tisch.", en: "The book is on the table.", note: "wo? → DAT (liegen)" },
      { de: "Ich lege das Buch auf den Tisch.", en: "I put the book on the table.", note: "wohin? → AKK (legen)" },
    ],
    seeAlso: ["R-081", "R-082"],
  },

  {
    id: "R-084",
    category: "praep",
    level: "B1",
    title: "Genitivpräpositionen",
    en: "Genitive prepositions",
    rule:
`// Formal register; increasingly replaced by von + DAT in speech.

wegen, während, trotz, statt/anstatt, innerhalb, außerhalb,
aufgrund, anhand, hinsichtlich, infolge, mangels, zwecks,
anlässlich, mithilfe, zugunsten, zulasten

wegen des Regens             (because of the rain)
während der Sitzung          (during the meeting)
trotz des schlechten Wetters (despite the bad weather)
aufgrund der neuen Vorschriften (due to the new regulations)

// Bare plural + Genitiv prep often falls back to Dativ:
wegen Umbauarbeiten   (no visible Genitiv marker on plural)`,
    examples: [
      { de: "Trotz des Regens gingen wir spazieren.", en: "Despite the rain we went for a walk." },
    ],
  },

  {
    id: "R-085",
    category: "praep",
    level: "B1",
    title: "Präpositionalverben",
    en: "Prepositional verbs (fixed prepositions)",
    rule:
`// Many verbs require a specific preposition with a fixed case.

auf + AKK: warten auf, hoffen auf, sich freuen auf, achten auf, hinweisen auf
über + AKK: sprechen über, sich freuen über, nachdenken über, berichten über
an + AKK:  glauben an, denken an, sich erinnern an
an + DAT:  teilnehmen an, arbeiten an, zweifeln an
für + AKK: sich interessieren für, danken für, sorgen für
von + DAT: sprechen von, abhängen von, träumen von, überzeugen von
mit + DAT: beginnen mit, aufhören mit, einverstanden sein mit`,
    examples: [
      { de: "Ich warte auf den Bus.", en: "I'm waiting for the bus.", note: "warten auf + AKK" },
    ],
    seeAlso: ["R-086"],
  },

  {
    id: "R-086",
    category: "praep",
    level: "B1",
    title: "Präpositionaladverbien (da(r)-/wo(r)-)",
    en: "Prepositional adverbs",
    rule:
`// Refer back to a prepositional complement:
// Person  → preposition + personal pronoun    Ich denke an ihn.
// Thing   → da(r) + preposition               Ich denke daran.
// W-question → wo(r) + preposition            Worauf wartest du?

// If preposition starts with a vowel: dar- / wor- (not da- / wo-)
darauf, daran, darin, darüber, darunter
worüber, worauf, woran, wofür

// Introduce clausal complements:
Ich warte darauf, dass er kommt.
Er freut sich darüber, dass es geklappt hat.`,
    examples: [
      { de: "Wofür interessierst du dich?", en: "What are you interested in?", note: "wofür — thing question" },
      { de: "Ich denke daran.", en: "I'm thinking about it.", note: "daran — refers to a thing" },
    ],
    seeAlso: ["R-085"],
  },

  // ======================================================== KONJUNKTIV ===

  {
    id: "R-087",
    category: "konj",
    level: "B1",
    title: "Konjunktiv II — Bildung",
    en: "Konjunktiv II — formation",
    rule:
`// Formed from the Präteritum stem + umlaut (where possible) + endings.
// For most verbs use würde + Infinitiv to avoid forms identical to Präteritum.

// Memorise real KII forms for these ~12:
sein → wäre      haben → hätte     werden → würde
können → könnte  müssen → müsste   dürfen → dürfte   mögen → möchte
sollen → sollte  wollen → wollte   wissen → wüsste
gehen → ginge    kommen → käme     geben → gäbe   lassen → ließe

// Endings: -e  -est  -e  -en  -et  -en
// Do NOT use würde with sein/haben/modals → use the real form above.`,
    examples: [
      { de: "Wenn ich Zeit hätte, würde ich mitkommen.", en: "If I had time, I'd come along.", note: "hätte (real KII) + würde" },
    ],
    seeAlso: ["R-088", "R-089"],
  },

  {
    id: "R-088",
    category: "konj",
    level: "B1",
    title: "Konjunktiv II — Gebrauch",
    en: "Konjunktiv II — uses",
    rule:
`// 1. Hypotheticals / conditionals (unreal if-clauses)
Wenn ich mehr Geld hätte, würde ich verreisen.

// 2. Polite requests
Könnten Sie mir bitte helfen?
Würden Sie das bitte wiederholen?
Ich hätte gerne einen Kaffee.

// 3. Wishes
Wenn er doch käme!     Ich wünschte, er wäre hier.

// 4. Cautious advice / suggestion
An deiner Stelle würde ich das nicht machen.

// 5. Near-miss (beinahe / fast + KII)
Beinahe wäre ich gestürzt.

// wenn can be dropped → verb moves to position 1:
Hätte ich Zeit, würde ich kommen. (= Wenn ich Zeit hätte, …)`,
    examples: [
      { de: "Könnten Sie das bitte wiederholen?", en: "Could you please repeat that?", note: "Politeness — most common everyday use" },
    ],
    seeAlso: ["R-087", "R-089"],
  },

  {
    id: "R-089",
    category: "konj",
    level: "B2",
    title: "Konjunktiv II der Vergangenheit",
    en: "Past Konjunktiv II (unfulfilled past conditions)",
    rule:
`// wäre/hätte [KII Präteritum] + Partizip II
// Expresses a past condition that did NOT happen.

wenn-clause: KII-aux + Partizip II
main clause: KII-aux + Partizip II

Wenn er früher gekommen wäre, hätte er sie noch getroffen.
Ich hätte das nicht getan.
Er wäre nicht gegangen, wenn er das gewusst hätte.`,
    examples: [
      { de: "Wenn ich das gewusst hätte, wäre ich nicht gegangen.", en: "If I had known that, I wouldn't have gone." },
    ],
    seeAlso: ["R-087", "R-088"],
  },

  {
    id: "R-090",
    category: "konj",
    level: "B2",
    title: "Konjunktiv I — Bildung",
    en: "Konjunktiv I — formation",
    rule:
`// Built from infinitive stem + KI endings: -e  -(e)st  -e  -en  -(e)t  -en
// sein is irregular: sei, sei(e)st, sei, seien, seiet, seien

sprechen KI: er spreche   ✓ (≠ indicative »spricht«)
kommen  KI: er komme     ✓
haben   KI: er habe      ✓ (≠ indicative »hat«)
machen  KI: sie machen   ✗ (= indicative → use KII: sie machten)

// KI perfect: KI of sein/haben + Partizip II
Er habe das Buch gelesen.   (he reportedly has/had read the book)`,
    examples: [
      { de: "Er sagte, er sei krank.", en: "He said he was ill.", note: "KI present — er sei" },
    ],
    seeAlso: ["R-091"],
  },

  {
    id: "R-091",
    category: "konj",
    level: "B2",
    title: "Konjunktiv I — Indirekte Rede",
    en: "Konjunktiv I — reported speech",
    rule:
`// German marks reported speech with KI to show the writer is not endorsing the claim.

Direct:    Er sagt: »Ich bin krank.«
Reported:  Er sagt, er sei krank.           // KI
           Er sagt, (dass) er krank sei.    // dass optional; verb-end if used

// Tense shift in indirect speech:
Direct Präsens    → KI Präsens    (ist  → sei)
Direct Perfekt    → KI Perfekt    (hat gesagt → habe gesagt)
Direct Präteritum → KI Perfekt    (sagte → habe gesagt)
Direct Futur I    → KI Futur I    (wird → werde)

// Fallback when KI = indicative → use KII or würde`,
    examples: [
      { de: "Der Zeuge sagte, er habe das Auto nicht gesehen.", en: "The witness said he hadn't seen the car.", note: "KI Perfekt — indirect speech" },
    ],
    seeAlso: ["R-090"],
  },

  // ======================================================== PASSIV ===

  {
    id: "R-092",
    category: "passiv",
    level: "B1",
    title: "Vorgangspassiv — werden + Partizip II",
    en: "Process passive",
    rule:
`// Removes / de-emphasises the agent; focuses on the action.
// werden carries the tense; Partizip II is invariable.

Präsens:          Das Haus wird gebaut.
Präteritum:       Das Haus wurde gebaut.
Perfekt:          Das Haus ist gebaut worden.   // NOT: geworden
Plusquamperfekt:  Das Haus war gebaut worden.
Futur I:          Das Haus wird gebaut werden.

// Agent (by whom) → von + DAT:
Das Haus wird von den Arbeitern gebaut.`,
    examples: [
      { de: "Der Brief wurde gestern geschrieben.", en: "The letter was written yesterday.", note: "Präteritum Passiv" },
      { de: "Das Formular muss ausgefüllt werden.", en: "The form must be filled in.", note: "Modal + Passiv" },
    ],
    seeAlso: ["R-093", "R-094", "R-096"],
  },

  {
    id: "R-093",
    category: "passiv",
    level: "B1",
    title: "Zustandspassiv — sein + Partizip II",
    en: "Stative passive",
    rule:
`// Describes a state (result of a completed process), NOT the process itself.

Das Fenster wird geöffnet.  (Vorgangspassiv — someone is opening it now)
Das Fenster ist geöffnet.   (Zustandspassiv — it is in an open state)

Das Büro ist um 9 Uhr geöffnet.    The office is open at 9 o'clock.
Die Aufgabe ist erledigt.          The task is done.`,
    examples: [
      { de: "Das Geschäft ist geschlossen.", en: "The shop is closed.", note: "Zustandspassiv — resulting state" },
    ],
    seeAlso: ["R-092"],
  },

  {
    id: "R-094",
    category: "passiv",
    level: "B2",
    title: "Unpersönliches Passiv",
    en: "Subjectless (impersonal) passive",
    rule:
`// Intransitive verbs can form a passive with no grammatical subject.
// es fills position 1 if nothing else is there; it drops when pos. 1 is taken.

Es wird hier viel gearbeitet.
Hier wird viel gearbeitet.      (es drops)
Es wurde gefeiert.              There was celebrating.

// Common in notices and formal instructions:
Hier wird nicht geraucht.
Es wird darum gebeten, die Türen zu schließen.`,
    examples: [
      { de: "Auf der Party wurde laut gelacht.", en: "There was loud laughter at the party.", note: "Impersonal passive — intransitive verb" },
    ],
    seeAlso: ["R-092"],
  },

  {
    id: "R-095",
    category: "passiv",
    level: "B1",
    title: "Passiv mit Modalverben",
    en: "Passive with modal verbs",
    rule:
`// Modal at position 2, werden-Infinitiv + Partizip II at clause end.

Das Problem muss gelöst werden.
Der Antrag kann eingereicht werden.
Die Fehler sollen korrigiert werden.

// Subordinate clause: … dass das Problem gelöst werden muss. (modal last)`,
    examples: [
      { de: "Die Rechnung muss bezahlt werden.", en: "The invoice must be paid." },
    ],
    seeAlso: ["R-092", "R-096"],
  },

  {
    id: "R-096",
    category: "passiv",
    level: "B2",
    title: "Passiversatz — sein + zu-Infinitiv",
    en: "Passive substitute — sein + zu-infinitive",
    rule:
`// Expresses necessity or possibility; passive-equivalent in form.
// sein + zu + Infinitiv  ≈  muss/kann + Passiv

Das Problem ist zu lösen.           = muss/kann gelöst werden
Der Antrag ist bis Freitag einzureichen.
Der Fehler ist leicht zu beheben.   (possibility)

// With leicht/schwer/kaum → possibility (kann);
// without qualification → necessity (muss).`,
    examples: [
      { de: "Das ist nicht zu übersehen.", en: "That cannot be overlooked.", note: "Possibility: nicht zu übersehen = lässt sich nicht übersehen" },
    ],
    seeAlso: ["R-092", "R-097"],
  },

  {
    id: "R-097",
    category: "passiv",
    level: "B2",
    title: "Passiversatz — lassen + sich + Infinitiv",
    en: "Passive substitute — lassen + sich",
    rule:
`// Expresses possibility — the thing CAN be done.
// lassen sich + Infinitiv  ≈  kann + Passiv

Das lässt sich ändern.              = Das kann geändert werden.
Das Problem lässt sich nicht lösen. = cannot be solved.

// Always reflexive (sich); active form, passive meaning.
// Preferred over Passiv in formal German when possibility is meant.`,
    examples: [
      { de: "Die Kosten lassen sich reduzieren.", en: "The costs can be reduced.", note: "Preferred in business German" },
    ],
    seeAlso: ["R-096"],
  },

  // ======================================================== REGISTER & NOMINALSTIL ===

  {
    id: "R-099",
    category: "register",
    level: "B2",
    title: "Nominalisierung",
    en: "Nominalization",
    rule:
`// Converting verbs/adjectives into nouns — the hallmark of formal German.

Infinitive → das Nomen (neuter, capitalised):
  Das Lesen fällt mir leicht.    nach dem Kochen

-ung suffix (most productive):
  entscheiden → die Entscheidung
  erhöhen     → die Erhöhung
  entwickeln  → die Entwicklung

Other patterns:
  scheitern  → das Scheitern
  sicher     → die Sicherheit
  möglich    → die Möglichkeit

// Advantage: noun phrase can carry rich modification (adjectives, Genitiv).`,
    examples: [
      { de: "Die Erhöhung der Preise führte zu Beschwerden.", en: "The increase in prices led to complaints.", note: "Nominalization enables noun-phrase expansion" },
    ],
    seeAlso: ["R-100", "R-101"],
  },

  {
    id: "R-100",
    category: "register",
    level: "C1",
    title: "Funktionsverbgefüge",
    en: "Light-verb constructions",
    rule:
`// A semantically "light" verb + prepositional/accusative noun phrase replaces a single verb.
// Common in formal, legal, and administrative writing.

eine Entscheidung treffen           = entscheiden
in Frage stellen                    = bezweifeln
in Kraft treten                     = gültig werden
zur Verfügung stellen               = bereitstellen
Rücksicht nehmen auf + AKK          = berücksichtigen
unter Druck setzen                  = unter Druck setzen / zwingen
in Betrieb nehmen                   = anlaufen lassen
zum Ausdruck bringen                = ausdrücken
in Anspruch nehmen                  = beanspruchen`,
    examples: [
      { de: "Das Gesetz tritt am 1. Januar in Kraft.", en: "The law enters into force on 1 January.", note: "in Kraft treten — formal for »gelten«" },
      { de: "Die Behörde hat eine Entscheidung getroffen.", en: "The authority has made a decision.", note: "eine Entscheidung treffen = entscheiden" },
    ],
    seeAlso: ["R-099"],
  },

  {
    id: "R-101",
    category: "register",
    level: "C1",
    title: "Erweiterte Partizipialattribute",
    en: "Extended participial attributes",
    rule:
`// A Partizip phrase (+ modifiers) between the article and the noun — compresses a relative clause.

Relative clause:   die Maßnahmen, die von der Regierung beschlossen wurden
Participial attr.: die von der Regierung beschlossenen Maßnahmen

// Build: article → [modifiers + Partizip I/II + adjective ending] → noun
das in letzter Zeit stark gestiegene Interesse

// Partizip II = passive / completed action: beschlossene, vorgestellte
// Partizip I  = active / simultaneous:     steigende, wachsende`,
    examples: [
      { de: "die in der Sitzung vorgestellten Ergebnisse", en: "the results presented in the meeting", note: "Partizip II — passive meaning" },
      { de: "die stetig wachsende Nachfrage", en: "the steadily growing demand", note: "Partizip I — simultaneous action" },
    ],
    seeAlso: ["R-036", "R-037", "R-099"],
  },

  {
    id: "R-102",
    category: "register",
    level: "B2",
    title: "Modalpartikeln",
    en: "Modal particles",
    rule:
`// Unstressed particles that modulate the speaker's attitude.
// Invariable; live in the Mittelfeld; almost never in formal writing.

doch   contradiction / reminder / encouragement
       Das stimmt doch nicht.   Komm doch mit!
ja     shared knowledge / mild surprise / warning
       Das weißt du ja.   Das ist ja interessant!
mal    softener for requests
       Komm mal her.   Schau mal!
eigentlich  digression / polite probing
       Was machst du eigentlich beruflich?
halt/eben   resignation — "it's just how it is"
       Das ist halt so.   Das ist eben schwierig.
wohl   epistemic probability (assumption)
       Er ist wohl krank.
schon  concession / reassurance
       Das geht schon.   Schon möglich.`,
    examples: [
      { de: "Er ist wohl nicht zu Hause.", en: "He's probably not home.", note: "wohl — probability" },
      { de: "Das machst du doch.", en: "You are doing that, right? / Of course you are.", note: "doch — reminder / contradiction" },
    ],
  },

  {
    id: "R-103",
    category: "register",
    level: "C1",
    title: "Formelle Konnektoren",
    en: "Formal connectors",
    rule:
`// Higher-register alternatives to common subordinators and adverbs.

Konzessiv:   wenngleich, obschon, gleichwohl, wohingegen
Kausal:      zumal (especially since), angesichts + GEN, da (more formal than weil)
Konsekutiv:  folglich, demzufolge, infolgedessen
Adversativ:  demgegenüber, hingegen
Einschränkend: insofern, insoweit, inwiefern
Generalisierung: grundsätzlich, prinzipiell, im Allgemeinen

// These belong in written essays and formal correspondence.
// In speech they sound stilted.`,
    examples: [
      { de: "Zumal die Kosten gestiegen sind, ist eine Erhöhung der Preise unvermeidlich.", en: "Especially since costs have risen, a price increase is unavoidable.", note: "zumal — formal causal" },
      { de: "Die Maßnahme ist grundsätzlich sinnvoll, wenngleich die Umsetzung schwierig bleibt.", en: "The measure is fundamentally sensible, even though implementation remains difficult.", note: "wenngleich — formal concessive" },
    ],
    seeAlso: ["R-068", "R-069", "R-070"],
  },

  {
    id: "R-104",
    category: "register",
    level: "B2",
    title: "Zweiteilige Konnektoren",
    en: "Correlative connectors",
    rule:
`// Two-part connectors that frame both members of a pair.

sowohl … als auch          both X and Y
weder … noch               neither X nor Y
entweder … oder            either X or Y
zwar … aber                admittedly X, but Y
nicht nur … sondern auch   not only X but also Y
einerseits … andererseits  on the one hand … on the other
je … desto/umso            the more … the more

// Word order: if the connector introduces a main clause → V2 applies.
Weder konnte er kommen, noch konnte er absagen.`,
    examples: [
      { de: "Das Projekt ist sowohl technisch als auch finanziell anspruchsvoll.", en: "The project is both technically and financially demanding." },
      { de: "Je mehr er lernt, desto sicherer wird er.", en: "The more he learns, the more confident he gets." },
    ],
  },

  {
    id: "R-105",
    category: "register",
    level: "B1",
    title: "Infinitivkonstruktionen — um/ohne/anstatt",
    en: "Purposive and circumstantial infinitive clauses",
    rule:
`// Used when MAIN CLAUSE and infinitive clause share the same subject.
// If subjects differ → use damit / ohne dass / anstatt dass instead.

um … zu         purpose:     Ich lerne, um den Test zu bestehen.
ohne … zu       manner:      Er antwortete, ohne nachzudenken.
anstatt … zu    alternative: Sie schläft, anstatt zu arbeiten.
(an)statt … zu  replaces:    Er rief an, anstatt zu schreiben.

// Different subjects → subordinate clause:
Ich erkläre es, damit er es versteht.  (not: *damit zu verstehen)`,
    examples: [
      { de: "Sie trainiert täglich, um den Marathon zu laufen.", en: "She trains daily in order to run the marathon.", note: "um...zu — same subject" },
    ],
    seeAlso: ["R-038", "R-070"],
  },
];

// -------------------------------------------------- derived lookup helpers

export const RULES_BY_CATEGORY = RULE_CATEGORIES.map((cat) => ({
  ...cat,
  rules: RULES.filter((r) => r.category === cat.id),
}));

export const RULE_BY_ID = Object.fromEntries(RULES.map((r) => [r.id, r]));

export const RULES_BY_LEVEL = {
  A2: RULES.filter((r) => r.level === "A2"),
  B1: RULES.filter((r) => r.level === "B1"),
  B2: RULES.filter((r) => r.level === "B2"),
  C1: RULES.filter((r) => r.level === "C1"),
};
