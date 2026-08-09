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
//  CURRICULUM — A2 → C1, written as a language specification.
//  Every module: the rule as code, the table it collapses to, real examples,
//  and the specific mistakes that cost marks in an exam.
// ============================================================================

export const LEVELS = ["A2", "B1", "B2", "C1"];

export const LEVEL_INFO = {
  A2: { name: "A2 — Grundlagen", blurb: "Cases, tenses, and the sentence bracket. Everything later rests on this." },
  B1: { name: "B1 — Struktur", blurb: "Subordination, Konjunktiv II, passive, relative clauses. Where sentences start to nest." },
  B2: { name: "B2 — Register", blurb: "Indirect speech, participial attributes, connector inventory, nominalisation." },
  C1: { name: "C1 — Präzision", blurb: "Nominal style, passive substitutes, formal connectors, modal particles, text cohesion." },
};

export const MODULES = [
  // ==========================================================  A2  ==========
  {
    id: "kasus",
    level: "A2",
    title: "Die vier Kasus",
    en: "The four cases",
    drills: ["kasus"],
    summary:
      "A German verb is a function and its arguments are labelled by case, not by position. That is why word order can move: the label is glued to the noun, not to the slot.",
    code: `// the verb declares which argument slots it takes
geben( NOM giver, DAT receiver, AKK thing )

  Der Mann  gibt  der Frau  den Schlüssel.
  Den Schlüssel  gibt  der Mann  der Frau.   // same meaning

// case is ASSIGNED, never chosen. Find the assigner first:
assigner = verb | preposition | possession`,
    tables: [
      {
        caption: "Bestimmter Artikel — der-Wörter (dies-, jed-, welch-, jen-, all-)",
        head: ["Kasus", "Maskulin", "Neutrum", "Feminin", "Plural"],
        rows: [
          ["Nominativ", "der", "das", "die", "die"],
          ["Akkusativ", "den", "das", "die", "die"],
          ["Dativ", "dem", "dem", "der", "den + Nomen-n"],
          ["Genitiv", "des + Nomen-s", "des + Nomen-s", "der", "der"],
        ],
        hot: [[1, 1]],
        warm: [[2, 4]],
        note: "The whole Akkusativ row is free — identical to Nominativ except one cell: der → den.",
      },
      {
        caption: "ein-Wörter — ein, kein, mein/dein/sein/ihr/unser/euer",
        head: ["Kasus", "Maskulin", "Neutrum", "Feminin", "Plural (kein-)"],
        rows: [
          ["Nominativ", "ein —", "ein —", "eine", "keine"],
          ["Akkusativ", "einen", "ein —", "eine", "keine"],
          ["Dativ", "einem", "einem", "einer", "keinen"],
          ["Genitiv", "eines", "eines", "einer", "keiner"],
        ],
        hot: [[0, 1], [0, 2], [1, 2]],
        note: "Three naked cells where ein carries no ending at all. They are the entire reason adjective endings exist.",
      },
    ],
    examples: [
      { de: "Der Hund schläft.", en: "The dog is sleeping.", note: "NOM — subject" },
      { de: "Ich sehe den Hund.", en: "I see the dog.", note: "AKK — direct object" },
      { de: "Ich helfe dem Hund.", en: "I'm helping the dog.", note: "DAT — helfen is a Dativ verb" },
      { de: "die Farbe des Hundes", en: "the dog's colour", note: "GEN — possession" },
    ],
    pitfalls: [
      "helfen, danken, gratulieren, folgen, gehören, passen, gefallen, antworten take DATIV, not Akkusativ.",
      "Nominativ also follows sein / werden / bleiben: »Er ist ein guter Freund« — not einen.",
    ],
  },

  {
    id: "adjektiv",
    level: "A2",
    title: "Adjektivendungen",
    en: "Adjective endings",
    drills: ["adjektiv"],
    summary:
      "Learners memorise three 16-cell tables. You need one conditional and two shapes: the case-and-gender signal must be marked exactly once in the noun phrase.",
    code: `function adjektivEndung(artikel, genus, kasus) {
  if (!artikel)               return STARK[genus][kasus];   // nothing there → adjective takes over
  if (artikel.endung === "")  return STARK[genus][kasus];   // "ein", "ein" → naked, adjective covers
  return                             SCHWACH[genus][kasus]; // signal already given → -e or -en
}`,
    tables: [
      {
        caption: "Schwach — nach der / die / das / dies- / jed-",
        head: ["", "Mask", "Neut", "Fem", "Plural"],
        rows: [
          ["NOM", "-e", "-e", "-e", "-en"],
          ["AKK", "-en", "-e", "-e", "-en"],
          ["DAT", "-en", "-en", "-en", "-en"],
          ["GEN", "-en", "-en", "-en", "-en"],
        ],
        hot: [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3]],
        note: "Five cells are -e; everything else is -en. The shape is an L in the top-left corner — the single most valuable thing on this page.",
      },
      {
        caption: "Gemischt — nach ein / kein / mein …",
        head: ["", "Mask", "Neut", "Fem", "Plural"],
        rows: [
          ["NOM", "-er", "-es", "-e", "-en"],
          ["AKK", "-en", "-es", "-e", "-en"],
          ["DAT", "-en", "-en", "-en", "-en"],
          ["GEN", "-en", "-en", "-en", "-en"],
        ],
        hot: [[0, 1], [0, 2], [1, 2]],
        note: "Identical to weak except three cells — exactly the three places where ein was naked. The adjective borrows the missing -er / -es from the der-table.",
      },
      {
        caption: "Stark — ohne Artikel (guter Wein, kaltes Wasser, mit heißem Kaffee)",
        head: ["", "Mask", "Neut", "Fem", "Plural"],
        rows: [
          ["NOM", "-er", "-es", "-e", "-e"],
          ["AKK", "-en", "-es", "-e", "-e"],
          ["DAT", "-em", "-em", "-er", "-en"],
          ["GEN", "-en", "-en", "-er", "-er"],
        ],
        hot: [[3, 1], [3, 2]],
        note: "The der-table with the stems removed: der→-er, das→-es, dem→-em. Only GEN masc/neut breaks the pattern (-en) because the noun already carries the -s.",
      },
    ],
    examples: [
      { de: "der alte Mann → den alten Mann", en: "the old man (NOM → AKK)", note: "weak: -e → -en" },
      { de: "ein alter Mann", en: "an old man", note: "mixed: ein is naked, adjective takes -er" },
      { de: "mit heißem Kaffee", en: "with hot coffee", note: "strong: no article, adjective = dem-ending" },
      { de: "trotz schlechten Wetters", en: "despite bad weather", note: "strong GEN neut → -en, noun carries the -s" },
    ],
    pitfalls: [
      "After viele, wenige, einige, mehrere, andere the adjective is STRONG plural: viele gute Ideen — not guten.",
      "After alle, beide, sämtliche it is WEAK plural: alle guten Ideen.",
      "»etwas / nichts / viel / wenig + Neutrum« takes -es: etwas Neues, nichts Wichtiges.",
    ],
  },

  {
    id: "praep",
    level: "A2",
    title: "Präpositionen als Kasus-Konstanten",
    en: "Prepositions as case constants",
    drills: ["praep"],
    summary:
      "Most prepositions hard-code their case — no thinking required once memorised. Nine of them take a boolean argument.",
    code: `const AKKUSATIV = [ durch, für, gegen, ohne, um, bis, entlang ];
// mnemonic: DOGFUB

const DATIV     = [ aus, außer, bei, mit, nach, seit, von, zu, gegenüber ];
// the nine highest-frequency prepositions in the language — learn these first

const GENITIV   = [ wegen, während, trotz, statt, innerhalb, außerhalb ];

function WECHSEL(prep, bewegung) {   // an auf hinter in neben über unter vor zwischen
  return bewegung ? AKKUSATIV : DATIV;
}`,
    tables: [
      {
        caption: "Wechselpräpositionen — der Test",
        head: ["Frage", "Kasus", "Beispiel"],
        rows: [
          ["wohin? (Grenze überschreiten)", "Akkusativ", "Ich stelle die Lampe auf den Tisch."],
          ["wo? (Aufenthalt)", "Dativ", "Die Lampe steht auf dem Tisch."],
        ],
      },
      {
        caption: "Verschmelzungen — keine neuen Wörter",
        head: ["kurz", "lang", "kurz", "lang"],
        rows: [
          ["im", "in dem", "ins", "in das"],
          ["am", "an dem", "ans", "an das"],
          ["zum", "zu dem", "zur", "zu der"],
          ["beim", "bei dem", "vom", "von dem"],
        ],
        note: "Expand them mentally and the case becomes visible again.",
      },
    ],
    examples: [
      { de: "Ich laufe in dem Park.", en: "I'm running around inside the park.", note: "DAT — no boundary crossed" },
      { de: "Ich laufe in den Park.", en: "I'm running into the park.", note: "AKK — crossing in from outside" },
    ],
    pitfalls: [
      "The test is not »is there movement« — both sentences above have running. It is »does the phrase describe crossing into the place«.",
      "In speech the Genitiv prepositions often take Dativ: »wegen dem Wetter«. Correct in writing is »wegen des Wetters«.",
    ],
  },

  {
    id: "wortstellung",
    level: "A2",
    title: "Satzklammer und Wortstellung",
    en: "The sentence bracket and word order",
    drills: ["ordnung"],
    summary:
      "German syntax has one governing shape: open a bracket, close a bracket. Once you see it, sentence-final verbs stop feeling random.",
    code: `// MAIN CLAUSE — the finite verb is locked to position 2
[ any ONE element ] [ finites Verb ] [ … Mittelfeld … ] [ Rest des Verbs ]

// SUBORDINATE — the conjunction takes the front slot, verb pushed to the end
[ weil / dass / ob / wenn / obwohl ] [ … ] [ Rest ] [ finites Verb ]

// Mittelfeld ordering when nothing is emphasised:
TE-KA-MO-LO = Temporal → Kausal → Modal → Lokal
              (wann?)    (warum?)  (wie?)   (wo/wohin?)
Ich fahre heute wegen der Arbeit mit dem Zug nach Köln.

// two objects: DATIV before AKKUSATIV — unless the accusative is a pronoun
Ich gebe dem Kind das Buch.
Ich gebe es dem Kind.        // pronoun jumps the queue`,
    examples: [
      { de: "Heute fahre ich nach Köln.", en: "Today I'm going to Cologne.", note: "Position 1 is a free slot — the subject slides behind the verb" },
      { de: "…, weil ich gestern einen Film gesehen habe.", en: "…because I saw a film yesterday.", note: "Both verb parts land at the end, finite one last" },
    ],
    pitfalls: [
      "»denn« is coordinating: Ich bleibe, denn ich bin krank. »weil« is subordinating: …, weil ich krank bin.",
      "After deshalb / trotzdem / dennoch the subject moves behind the verb: »Deshalb bleibe ich« — not »Deshalb ich bleibe«.",
      "nicht goes before the element it negates, but after definite time expressions and before the closing bracket.",
    ],
  },

  {
    id: "zeiten",
    level: "A2",
    title: "Zeitformen als Komposition",
    en: "Tenses as composition",
    drills: ["zeiten", "partizip"],
    summary:
      "German barely conjugates for tense. It composes: an auxiliary carries the person and the time, a fixed non-finite form carries the meaning. Two memorised forms per verb yield all six tenses.",
    code: `// memorise exactly two per verb:
Partizip II     essen → gegessen        Präteritum-Stamm  essen → aß

// everything else is composition
Präsens          = stamm + endung
Präteritum       = prät-stamm + endung
Perfekt          = haben/sein[Präsens]    + Partizip II
Plusquamperfekt  = haben/sein[Präteritum] + Partizip II
Futur I          = werden[Präsens]        + Infinitiv
Futur II         = werden[Präsens]        + Partizip II + haben/sein

// haben or sein?
usesSein = keinAkkusativobjekt && (Ortsveränderung || Zustandswechsel)
           || verb in [sein, bleiben, werden]`,
    tables: [
      {
        caption: "Partizip II bilden",
        head: ["Typ", "Regel", "Beispiel"],
        rows: [
          ["schwach", "ge- + Stamm + -t", "machen → gemacht"],
          ["stark", "ge- + veränderter Stamm + -en", "sprechen → gesprochen"],
          ["untrennbares Präfix", "kein ge-", "verstehen → verstanden"],
          ["-ieren", "kein ge-", "studieren → studiert"],
          ["trennbar", "Präfix + ge- + …", "aufstehen → aufgestanden"],
        ],
      },
    ],
    examples: [
      { de: "Ich habe gestern einen Apfel gegessen.", en: "I ate an apple yesterday.", note: "Perfekt — the spoken past" },
      { de: "Er aß einen Apfel.", en: "He ate an apple.", note: "Präteritum — the written past" },
      { de: "Ich war müde. / Wir hatten Zeit.", en: "I was tired. / We had time.", note: "sein, haben and modals use Präteritum even in speech" },
    ],
    pitfalls: [
      "Roughly 95% of verbs take haben, so sein is the list worth learning: gehen, fahren, kommen, fliegen, laufen, aufstehen, einschlafen, sterben, wachsen + sein/bleiben/werden.",
      "Perfekt of modals uses the double infinitive: »Ich habe arbeiten müssen« — not gemusst.",
    ],
  },

  {
    id: "modalverben",
    level: "A2",
    title: "Modalverben",
    en: "Modal verbs",
    drills: ["modal"],
    summary:
      "Six verbs that take an infinitive and push it to the end of the bracket. Irregular in the singular: no ending on ich/er, and a vowel change.",
    code: `Modalverb[Position 2] + … Mittelfeld … + Infinitiv[Ende]

ich/er: kann, muss, darf, soll, will, mag     // no ending, vowel changes
wir/sie: können, müssen, dürfen, sollen, wollen, mögen

// Perfekt uses the DOUBLE INFINITIVE, not the Partizip:
Ich habe arbeiten müssen.      ✓
Ich habe arbeiten gemusst.     ✗`,
    tables: [
      {
        caption: "Präsens",
        head: ["", "können", "müssen", "dürfen", "sollen", "wollen", "mögen"],
        rows: [
          ["ich / er", "kann", "muss", "darf", "soll", "will", "mag"],
          ["du", "kannst", "musst", "darfst", "sollst", "willst", "magst"],
          ["wir / sie", "können", "müssen", "dürfen", "sollen", "wollen", "mögen"],
        ],
      },
    ],
    examples: [
      { de: "Ich muss morgen früh aufstehen.", en: "I have to get up early tomorrow.", note: "Modal 2nd, infinitive last" },
      { de: "Du musst nicht kommen.", en: "You don't have to come.", note: "nicht müssen = no obligation" },
      { de: "Du darfst nicht kommen.", en: "You're not allowed to come.", note: "nicht dürfen = prohibition" },
    ],
    pitfalls: [
      "nicht müssen ≠ nicht dürfen. The English »must not« is nicht dürfen.",
      "möchte is Konjunktiv II of mögen and is the polite »would like«: Ich möchte einen Kaffee.",
    ],
  },

  {
    id: "reflexiv",
    level: "A2",
    title: "Reflexive Verben",
    en: "Reflexive verbs",
    summary:
      "The reflexive pronoun agrees with the subject. It is accusative by default, and dative when there is already a direct object.",
    code: `AKK: mich, dich, sich, uns, euch, sich       // default
DAT: mir,  dir,  sich, uns, euch, sich       // when an AKK object is present

Ich wasche mich.            // AKK — no other object
Ich wasche mir die Hände.   // DAT — "die Hände" is the accusative object`,
    examples: [
      { de: "Ich freue mich auf das Wochenende.", en: "I'm looking forward to the weekend.", note: "sich freuen auf + AKK" },
      { de: "Merk dir das!", en: "Remember that!", note: "sich merken takes Dativ — das is the object" },
    ],
    pitfalls: [
      "sich only exists in the 3rd person (sg + pl) and for Sie. Everywhere else the reflexive is identical to the normal personal pronoun.",
      "Many German reflexives are not reflexive in English: sich erinnern, sich befinden, sich beeilen, sich irren.",
    ],
  },

  {
    id: "komparativ",
    level: "A2",
    title: "Komparativ und Superlativ",
    en: "Comparative and superlative",
    summary:
      "Regular and short: -er and am -sten. Most one-syllable adjectives add an umlaut. The comparative still takes normal adjective endings when it sits in front of a noun.",
    code: `positiv → komparativ (+er) → superlativ (am …sten / der/die/das …ste)

klein  → kleiner   → am kleinsten
alt    → älter     → am ältesten          // umlaut on most 1-syllable adj.
gut    → besser    → am besten            // irregular
viel   → mehr      → am meisten
gern   → lieber    → am liebsten
hoch   → höher     → am höchsten
nah    → näher     → am nächsten

// comparison particles
so … wie   (equal)          Er ist so groß wie ich.
als        (unequal)        Er ist größer als ich.`,
    examples: [
      { de: "ein schnelleres Auto", en: "a faster car", note: "comparative + normal adjective ending" },
      { de: "Je mehr ich lerne, desto sicherer werde ich.", en: "The more I learn, the more confident I get.", note: "je + Verbletzt, desto + Verb an Position 2" },
    ],
    pitfalls: [
      "»größer wie« is wrong — unequal comparison always takes als.",
      "Adjectives ending in -el / -er drop the e: dunkel → dunkler, teuer → teurer.",
    ],
  },

  // ==========================================================  B1  ==========
  {
    id: "genitiv",
    level: "B1",
    title: "Genitiv und Genitivpräpositionen",
    en: "Genitive and genitive prepositions",
    summary:
      "Possession, and the case that signals formal register. Increasingly replaced by von + Dativ in speech — learn it to read and to write, not to chat.",
    code: `des + Nomen-(e)s   (mask/neut)      der + Nomen   (fem/plural)

// one syllable → -es, otherwise -s
des Hauses, des Mannes    ·    des Autos, des Lehrers

const GENITIV_PRÄP = [ wegen, während, trotz, statt, innerhalb, außerhalb,
                       aufgrund, anhand, hinsichtlich, infolge, mangels, zwecks ];`,
    examples: [
      { de: "die Farbe des Hauses", en: "the colour of the house" },
      { de: "während der Sitzung", en: "during the meeting" },
      { de: "aufgrund der neuen Vorschriften", en: "on the basis of the new regulations", note: "C1 register" },
      { de: "Peters Auto / Annas Idee", en: "Peter's car / Anna's idea", note: "Names take -s with no apostrophe" },
    ],
    pitfalls: [
      "No apostrophe on the German genitive-s: »Annas Buch«, not »Anna's Buch«.",
      "Genitive prepositions + a bare plural noun fall back to Dativ: »wegen Umbauarbeiten« (no visible genitive marker).",
    ],
  },

  {
    id: "nebensatz",
    level: "B1",
    title: "Nebensätze und Konnektoren",
    en: "Subordinate clauses and connectors",
    drills: ["konnektor", "ordnung"],
    summary:
      "Three connector classes, three different effects on word order. Getting the class right is worth more than knowing more connectors.",
    code: `class 0  — koordinierend, kein Effekt
         und, aber, denn, oder, sondern
         Ich bleibe zu Hause, denn ich bin krank.

class 1  — Position-1-Adverb: Verb bleibt zweit, Subjekt rutscht dahinter
         deshalb, trotzdem, dennoch, außerdem, folglich, allerdings
         Ich bin krank. Deshalb bleibe ich zu Hause.

class end — subordinierend: finites Verb ans Ende
         weil, dass, ob, wenn, als, obwohl, damit, bevor, nachdem, während
         Ich bleibe zu Hause, weil ich krank bin.`,
    tables: [
      {
        caption: "Die drei Klassen im Vergleich — gleiche Aussage",
        head: ["Klasse", "Konnektor", "Satz"],
        rows: [
          ["0", "denn", "Ich bleibe zu Hause, denn ich bin krank."],
          ["1", "deshalb", "Ich bin krank, deshalb bleibe ich zu Hause."],
          ["end", "weil", "Ich bleibe zu Hause, weil ich krank bin."],
        ],
      },
    ],
    pitfalls: [
      "wenn vs. als: als for a single completed past event — »Als ich in Berlin ankam, …«. wenn for repeated past events and for present/future — »(Immer) wenn ich in Berlin war, besuchte ich das Museum.« Repeated events in the past take wenn, not als.",
      "damit vs. um … zu: damit when the two clauses have different subjects, um … zu when the subject is the same.",
      "The comma before a subordinate clause is obligatory in German.",
    ],
  },

  {
    id: "relativsatz",
    level: "B1",
    title: "Relativsätze",
    en: "Relative clauses",
    drills: ["relativ"],
    summary:
      "The relative pronoun takes its GENDER and NUMBER from the noun it refers to, but its CASE from its own clause. Two different sources — that is the whole difficulty.",
    code: `relativpronomen.genus  = bezugswort.genus     // from outside
relativpronomen.numerus = bezugswort.numerus   // from outside
relativpronomen.kasus  = rolle im NEBENSATZ    // from inside

Der Mann, der dort steht, …          // NOM — he is the subject of the relative clause
Der Mann, den ich kenne, …           // AKK — I know him
Der Mann, dem ich helfe, …           // DAT — helfen governs Dativ
Der Mann, dessen Auto dort steht, …  // GEN — possession`,
    tables: [
      {
        caption: "Relativpronomen — identisch mit der-Tabelle außer GEN und DAT Plural",
        head: ["", "Mask", "Neut", "Fem", "Plural"],
        rows: [
          ["NOM", "der", "das", "die", "die"],
          ["AKK", "den", "das", "die", "die"],
          ["DAT", "dem", "dem", "der", "denen"],
          ["GEN", "dessen", "dessen", "deren", "deren"],
        ],
        hot: [[3, 1], [3, 2], [3, 3], [3, 4]],
        warm: [[2, 4]],
      },
    ],
    examples: [
      { de: "Das ist die Frau, mit der ich gesprochen habe.", en: "That's the woman I spoke with.", note: "Preposition assigns the case: mit + DAT" },
      { de: "Der Kollege, dessen Bericht fehlt, ist krank.", en: "The colleague whose report is missing is ill.", note: "dessen + noun without article" },
      { de: "Alles, was ich weiß, steht im Bericht.", en: "Everything I know is in the report.", note: "was after alles, etwas, nichts, das" },
    ],
    pitfalls: [
      "The preposition must come first: »die Frau, mit der …«, never »die Frau, der ich mit gesprochen habe«.",
      "After dessen / deren the following noun takes NO article: »dessen Bericht«, not »dessen der Bericht«.",
      "Unlike English, the relative pronoun can never be dropped.",
    ],
  },

  {
    id: "konjunktiv2",
    level: "B1",
    title: "Konjunktiv II — Irrealis und Höflichkeit",
    en: "Konjunktiv II — hypotheticals and politeness",
    drills: ["konj2"],
    summary:
      "The form for things that are not the case: hypotheticals, wishes, polite requests, careful advice. Built from the Präteritum stem plus umlaut, or replaced by würde.",
    code: `// real forms — memorise about ten, use würde for the rest
sein   → wäre        haben  → hätte       werden → würde
können → könnte      müssen → müsste      dürfen → dürfte
gehen  → ginge       kommen → käme        wissen → wüsste
lassen → ließe       geben  → gäbe        finden → fände

// everything else:
würde[Präsens] + Infinitiv        Ich würde dir helfen.

// endings on the umlauted stem: -e -est -e -en -et -en`,
    examples: [
      { de: "Wenn ich Zeit hätte, würde ich mitkommen.", en: "If I had time, I'd come along.", note: "wenn-clause with hätte, main clause with würde" },
      { de: "Könnten Sie mir bitte helfen?", en: "Could you help me please?", note: "Politeness — the everyday use" },
      { de: "An deiner Stelle würde ich das anders machen.", en: "In your position I'd do that differently.", note: "Careful advice" },
      { de: "Beinahe wäre ich zu spät gekommen.", en: "I almost arrived late.", note: "beinahe / fast + Konjunktiv II" },
    ],
    pitfalls: [
      "Avoid würde with sein, haben and the modals: »wäre«, not »würde sein«.",
      "Wenn can be dropped, and then the verb comes first: »Hätte ich Zeit, würde ich mitkommen.«",
    ],
  },

  {
    id: "passiv",
    level: "B1",
    title: "Passiv — Grundlagen",
    en: "Passive — the basics",
    drills: ["passiv"],
    summary:
      "The passive removes the agent from the subject slot. It is built the same way every tense is: an auxiliary carries the time, a fixed form carries the meaning.",
    code: `Vorgangspassiv = werden + Partizip II         // the process

Präsens          Das Haus wird gebaut.
Präteritum       Das Haus wurde gebaut.
Perfekt          Das Haus ist gebaut worden.        // worden, NOT geworden
Plusquamperfekt  Das Haus war gebaut worden.
Futur I          Das Haus wird gebaut werden.
mit Modalverb    Das Haus muss gebaut werden.

// the agent, if you need it at all:
von + DATIV   (person/actor)     durch + AKKUSATIV  (means/cause)

Zustandspassiv = sein + Partizip II           // the resulting state
Das Haus ist gebaut.   // it stands finished — not "it is being built"`,
    tables: [
      {
        caption: "Aktiv → Passiv",
        head: ["", "Satz"],
        rows: [
          ["Aktiv", "Der Architekt plant das Haus."],
          ["Passiv", "Das Haus wird (vom Architekten) geplant."],
          ["Regel", "Akkusativobjekt → Subjekt · Subjekt → von + Dativ (oder weg)"],
        ],
      },
    ],
    pitfalls: [
      "The Perfekt passive uses worden, not geworden. »ist gebaut worden«.",
      "Only verbs with an accusative object can form a personal passive. Dativ objects stay Dativ: »Mir wurde geholfen.«",
      "Subjectless passive for general activity: »Hier wird nicht geraucht.« / »Es wird gearbeitet.«",
    ],
  },

  {
    id: "infinitiv-zu",
    level: "B1",
    title: "Infinitiv mit zu",
    en: "Infinitive with zu",
    summary:
      "The German equivalent of the English to-infinitive, plus the three constructions that replace whole subordinate clauses.",
    code: `verb + zu + Infinitiv[Ende]
Ich habe vor, morgen zu kommen.
Es ist wichtig, pünktlich zu sein.

// separable verbs: zu goes INSIDE
aufstehen → aufzustehen      teilnehmen → teilzunehmen

// no zu after: modals, werden, sehen, hören, lassen, bleiben, gehen
Ich lasse das Auto reparieren.     Ich gehe schwimmen.

// helfen / lehren / lernen take BOTH — short: no zu, extended: zu
Er hilft mir tragen.
Er hilft mir, den schweren Schrank zu tragen.

// the three clause-replacers
um … zu      (purpose, same subject)   Ich lerne, um die Prüfung zu bestehen.
ohne … zu    (negative accompaniment)  Er ging, ohne sich zu verabschieden.
(an)statt … zu (substitution)          Statt zu arbeiten, sah er fern.`,
    pitfalls: [
      "um … zu only works when both clauses share a subject. Different subjects require damit.",
      "After modal verbs there is no zu: »Ich muss gehen«, not »Ich muss zu gehen«.",
      "helfen / lehren / lernen are not fixed either way — both »Er hilft mir tragen« and »Er hilft mir, das zu tragen« are standard; zu becomes the norm as the infinitive group grows.",
    ],
  },

  {
    id: "temporal",
    level: "B1",
    title: "Temporalsätze und Plusquamperfekt",
    en: "Temporal clauses and past perfect",
    summary:
      "Time connectors, and the one that forces a tense change: nachdem requires the two clauses to sit one step apart on the timeline.",
    code: `nachdem  → Zeitensprung ist Pflicht
   Nachdem ich gegessen HATTE, ging ich spazieren.   // Plusquam + Prät
   Nachdem ich gegessen HABE, gehe ich spazieren.    // Perfekt + Präsens

bevor / bis   → beide Sätze dieselbe Zeit
während       → Gleichzeitigkeit
seit / seitdem→ Beginn in der Vergangenheit, dauert an
sobald        → unmittelbar danach
als           → EIN Ereignis in der Vergangenheit
wenn          → wiederholt, oder Gegenwart/Zukunft`,
    examples: [
      { de: "Nachdem er den Bericht gelesen hatte, rief er an.", en: "After he had read the report, he called.", note: "Plusquamperfekt → Präteritum" },
      { de: "Seitdem ich in Berlin wohne, spreche ich besser Deutsch.", en: "Since I've lived in Berlin, my German is better.", note: "German uses the present here" },
    ],
    pitfalls: [
      "»Seit ich hier bin« — present tense, not perfect. German marks duration with seit + Präsens where English uses the present perfect.",
      "als is used exactly once per past event; repeated events take wenn or immer wenn.",
    ],
  },

  {
    id: "futur",
    level: "B1",
    title: "Futur I und II",
    en: "Future I and II",
    summary:
      "German rarely needs a future tense — the present plus a time word does the job. Futur I is mostly about intention and assumption.",
    code: `Futur I  = werden[Präsens] + Infinitiv
Futur II = werden[Präsens] + Partizip II + haben/sein

// most common actual use: ASSUMPTION, not future time
Er wird wohl krank sein.          // he's probably ill (now)
Sie wird den Zug verpasst haben.  // she'll have missed the train

// plain future is usually just Präsens:
Morgen fahre ich nach Berlin.     ✓ more natural than "werde fahren"`,
    pitfalls: [
      "Overusing Futur I sounds translated. Native usage prefers Präsens + Zeitangabe for plain future statements.",
    ],
  },

  {
    id: "verbpraep",
    level: "B1",
    title: "Verben mit Präposition · da- und wo-Komposita",
    en: "Verbs with prepositions · da- and wo-compounds",
    drills: ["verbprep"],
    summary:
      "A closed list you simply have to own — the preposition is part of the verb's meaning, and it fixes the case. Then two compound families replace the noun with a pronoun.",
    code: `warten AUF + AKK        denken AN + AKK       sich freuen AUF + AKK
teilnehmen AN + DAT     bestehen AUS + DAT    abhängen VON + DAT

// referring back to a THING → da(r)-compound
Ich warte auf den Bus.  → Ich warte darauf.
Ich denke an den Termin.→ Ich denke daran.

// asking about a THING → wo(r)-compound
Worauf wartest du?      Woran denkst du?

// referring to a PERSON → keep the preposition + pronoun
Ich warte auf ihn.      Auf wen wartest du?

// r is inserted before a vowel: da+auf → darauf, wo+an → woran`,
    pitfalls: [
      "da-/wo-compounds are for things only. For people you keep preposition + pronoun.",
      "The compound also anticipates a following dass-clause: »Ich freue mich darauf, dass du kommst.«",
    ],
  },

  // ==========================================================  B2  ==========
  {
    id: "konjunktiv1",
    level: "B2",
    title: "Konjunktiv I — indirekte Rede",
    en: "Konjunktiv I — reported speech",
    drills: ["konj1"],
    summary:
      "The register of journalism and reports. It marks a statement as someone else's without endorsing it — the grammatical equivalent of quotation marks.",
    code: `Stamm + e            // 3rd person singular is the workhorse
sagen → er sage      haben → er habe      können → er könne
sein  → er sei       (irregular, also: sie seien)

// FALLBACK RULE: if Konjunktiv I looks identical to the Indikativ,
// switch to Konjunktiv II.
sie haben → sie haben (identisch!) → sie hätten   ✓

// tense collapses to three:
Gegenwart      Er sagt, er sei krank.
Vergangenheit  Er sagt, er sei krank gewesen.      // ALL past tenses → one form
Zukunft        Er sagt, er werde kommen.`,
    tables: [
      {
        caption: "Konjunktiv I — sein ist die einzige vollständig eigene Form",
        head: ["", "sein", "haben", "können", "gehen"],
        rows: [
          ["ich", "sei", "hätte*", "könne", "ginge*"],
          ["er/sie", "sei", "habe", "könne", "gehe"],
          ["wir/sie", "seien", "hätten*", "könnten*", "gingen*"],
        ],
        note: "* = Konjunktiv I would be identical to the Indikativ, so Konjunktiv II is used instead.",
      },
    ],
    examples: [
      { de: "Der Minister erklärte, die Lage sei ernst.", en: "The minister stated that the situation was serious.", note: "No dass needed — the Konjunktiv alone marks it" },
      { de: "Sie sagte, sie habe den Bericht bereits gelesen.", en: "She said she had already read the report." },
    ],
    pitfalls: [
      "Reported questions keep their question word and go verb-final: »Er fragte, wann der Zug abfahre.«",
      "Pronouns and time references shift with the perspective: »Ich komme morgen« → »Er sagte, er komme am nächsten Tag.«",
    ],
  },

  {
    id: "n-deklination",
    level: "B2",
    title: "n-Deklination",
    en: "Weak masculine nouns",
    drills: ["ndekl"],
    summary:
      "A closed class of masculine nouns that add -(e)n in every case except the nominative singular. Small list, high visibility — getting it wrong is a marker of B1.",
    code: `if (noun.genus === 'm' && kasus !== 'nom') noun += '(e)n';

// who belongs: masculine nouns ending in -e (Junge, Kollege, Kunde),
// plus -ent, -ant, -ist, -at, -oge, -graf, and Herr, Mensch, Nachbar, Bauer

der Student → den Studenten, dem Studenten, des Studenten
der Junge   → den Jungen,    dem Jungen,    des Jungen

// mixed group: -n in the oblique cases AND -ns in the genitive
der Name → den Namen, dem Namen, des NamenS
also: Gedanke, Glaube, Wille, Friede, Buchstabe`,
    examples: [
      { de: "Ich habe mit dem Kollegen gesprochen.", en: "I spoke with the colleague.", note: "Not »dem Kollege«" },
      { de: "Der Vorschlag des Präsidenten", en: "The president's proposal" },
      { de: "Herrn Müller", en: "Mr Müller", note: "Herr takes -n in the singular and -en in the plural" },
    ],
    pitfalls: [
      "»Ich sehe den Student« is the classic error — it must be den Studenten.",
      "Das Herz is not in this class but is irregular in its own way: des Herzens, dem Herzen.",
    ],
  },

  {
    id: "partizipialattribut",
    level: "B2",
    title: "Partizipialattribute",
    en: "Participial attributes",
    drills: ["partizipattr"],
    summary:
      "A relative clause compressed into an adjective slot. Partizip I is active and ongoing; Partizip II is passive and completed. Recognising them is a reading skill; producing them is a writing skill.",
    code: `Partizip I  = Infinitiv + d        → AKTIV, gleichzeitig
Partizip II                         → PASSIV, abgeschlossen

der schlafende Hund        ← der Hund, der schläft            (aktiv)
der reparierte Wagen       ← der Wagen, der repariert wurde   (passiv)

// Partizip I + zu = passive obligation ("gerundive")
die zu lösende Aufgabe     ← die Aufgabe, die gelöst werden muss

// both still take normal adjective endings`,
    examples: [
      { de: "die steigenden Kosten", en: "the rising costs", note: "Partizip I — active, in progress" },
      { de: "die beschlossenen Maßnahmen", en: "the measures that were decided", note: "Partizip II — passive, completed" },
      { de: "die zu erwartenden Folgen", en: "the consequences to be expected", note: "zu + Partizip I = must/can be …ed" },
    ],
    pitfalls: [
      "Partizip II of an intransitive sein-verb is active, not passive: »der angekommene Zug« = the train that has arrived.",
      "Do not stack more than one long participial attribute per sentence in your own writing — it reads as bureaucratic.",
    ],
  },

  {
    id: "nominalisierung",
    level: "B2",
    title: "Nominalisierung ↔ Verbalisierung",
    en: "Nominal ↔ verbal style",
    drills: ["nominal"],
    summary:
      "The single most testable transformation at B2/C1: turn a subordinate clause into a prepositional phrase, and back. Examiners ask for it in both directions.",
    code: `// clause  ⇄  nominal phrase
weil …        ⇄  wegen + GEN / aufgrund + GEN
obwohl …      ⇄  trotz + GEN
wenn / falls  ⇄  bei + DAT / im Falle + GEN
nachdem …     ⇄  nach + DAT
bevor …       ⇄  vor + DAT
während …     ⇄  während + GEN
damit / um zu ⇄  zu + DAT / zwecks + GEN
ohne dass …   ⇄  ohne + AKK

Weil das Wetter schlecht war, blieben wir zu Hause.
→ Wegen des schlechten Wetters blieben wir zu Hause.`,
    examples: [
      { de: "Trotz der hohen Kosten wurde das Projekt fortgesetzt.", en: "Despite the high costs the project was continued.", note: "← Obwohl die Kosten hoch waren, …" },
      { de: "Bei Regen findet die Veranstaltung drinnen statt.", en: "If it rains the event takes place indoors.", note: "← Wenn es regnet, …" },
    ],
    pitfalls: [
      "Nominal style is compact but heavy. In an exam essay, alternate the two — pure nominal style reads like an official form.",
    ],
  },

  {
    id: "konnektoren-b2",
    level: "B2",
    title: "Zweiteilige Konnektoren",
    en: "Two-part connectors",
    drills: ["paired"],
    summary:
      "Pairs that bind two elements into one relation. They are graded heavily in written exams because they show control of structure, not just vocabulary.",
    code: `entweder … oder            either … or
weder … noch               neither … nor      // ALREADY negative
sowohl … als auch          both … and
nicht nur … sondern auch   not only … but also
zwar … aber                admittedly … but
einerseits … andererseits  on one hand … on the other
je … desto/umso            the … the

// je-clause is SUBORDINATE (verb last), desto-clause has the verb SECOND
Je mehr ich lerne, desto sicherer werde ich.`,
    pitfalls: [
      "weder … noch is already negative — adding nicht or kein double-negates: »Ich habe weder Zeit noch Geld«, not »keine Zeit«.",
      "sowohl … als auch with two singular subjects still takes a plural verb: »Sowohl er als auch sie kommen.«",
    ],
  },

  {
    id: "modal-subjektiv",
    level: "B2",
    title: "Subjektive Modalverben",
    en: "Modal verbs of inference",
    summary:
      "The same six modals, used to grade how certain you are rather than what is permitted. A pure register marker — extremely common in written German, rare in textbooks.",
    code: `objektiv:  Er muss arbeiten.        // obligation
subjektiv: Er muss krank sein.       // I'm certain he is ill

müssen  → nearly certain      Er muss zu Hause sein.
dürfte  → probable, cautious  Er dürfte schon da sein.
können  → possible            Das kann stimmen.
könnte  → possible, weaker    Das könnte stimmen.
mag     → conceded            Das mag sein, aber …
will    → he CLAIMS           Er will nichts gewusst haben.
soll    → others claim        Er soll sehr reich sein.

// past: modal + Partizip II + haben/sein
Er muss den Zug verpasst haben.`,
    examples: [
      { de: "Sie soll die beste Kandidatin sein.", en: "She's said to be the best candidate.", note: "sollen = hearsay" },
      { de: "Er will davon nichts gewusst haben.", en: "He claims to have known nothing about it.", note: "wollen = self-report, sceptical" },
    ],
    pitfalls: [
      "sollen (hearsay) and wollen (self-claim) are easy to swap and completely change who is asserting the claim.",
    ],
  },

  {
    id: "passiv-b2",
    level: "B2",
    title: "Passiv — alle Formen",
    en: "Passive — full paradigm",
    drills: ["passiv"],
    summary:
      "The full passive paradigm including modal and subjectless passives, plus the Vorgangs/Zustand distinction that decides between werden and sein.",
    code: `Vorgangspassiv (werden)   →  the PROCESS
Zustandspassiv (sein)     →  the RESULTING STATE

Die Tür wird geschlossen.   The door is being closed.
Die Tür ist geschlossen.    The door is closed (it is shut).

// with modal, all tenses
Präsens     Das muss gemacht werden.
Präteritum  Das musste gemacht werden.
Perfekt     Das hat gemacht werden müssen.     // rare, but this is the form

// subjectless (activity in general)
Es wird hier viel gearbeitet.  /  Hier wird nicht geraucht.

// dative object keeps its case — it never becomes the subject
Man hilft mir.  →  Mir wird geholfen.   (NOT "Ich werde geholfen")`,
    pitfalls: [
      "»Ich werde geholfen« is wrong. helfen governs Dativ, so the passive is »Mir wird geholfen.«",
      "Verbs without an accusative object (schlafen, gehen, wohnen) form only the subjectless passive.",
    ],
  },

  {
    id: "textkohaesion",
    level: "B2",
    title: "Textkohäsion",
    en: "Text cohesion",
    summary:
      "What separates a B1 text from a B2 one is rarely grammar — it is whether the sentences are visibly attached to each other.",
    code: `1. Pronominal reference     dieser, jener, letzterer, ersterer
2. da-compounds             dadurch, dabei, dazu, demgegenüber, davon
3. Signposting              zunächst, ferner, schließlich, abschließend
4. Text-deictic phrases     wie bereits erwähnt, wie oben dargelegt
5. Theme–rheme order        known information first, new information last`,
    examples: [
      { de: "Dieses Argument überzeugt allerdings nicht vollständig.", en: "This argument is, however, not fully convincing.", note: "dieses points back; allerdings marks the turn" },
      { de: "Damit ist der wichtigste Punkt genannt.", en: "That names the most important point.", note: "da-compound as a bridge" },
    ],
    pitfalls: [
      "Starting three consecutive sentences with Ich is the most common cohesion failure in exam essays. Vary position 1.",
    ],
  },

  // ==========================================================  C1  ==========
  {
    id: "nominalstil",
    level: "C1",
    title: "Nominalstil und Funktionsverbgefüge",
    en: "Nominal style and light-verb constructions",
    drills: ["fvg"],
    summary:
      "The register of academic and official German. A Funktionsverbgefüge splits a verb into a semantically empty verb plus a noun — verbose, but expected in formal writing.",
    code: `Verb  →  Funktionsverb + Nomen
erwägen        → in Betracht ziehen
kritisieren    → Kritik üben an + DAT
bezweifeln     → in Frage stellen
bereitstellen  → zur Verfügung stellen
berücksichtigen→ Rücksicht nehmen auf + AKK
ausdrücken     → zum Ausdruck bringen
beweisen       → unter Beweis stellen
hinnehmen      → in Kauf nehmen`,
    tables: [
      {
        caption: "Häufige Funktionsverbgefüge",
        head: ["Funktionsverbgefüge", "einfaches Verb", "English"],
        rows: [
          ["in Betracht ziehen", "erwägen", "to consider"],
          ["zur Verfügung stellen", "bereitstellen", "to make available"],
          ["in Frage stellen", "bezweifeln", "to call into question"],
          ["in Anspruch nehmen", "beanspruchen", "to make use of"],
          ["Bezug nehmen auf (+A)", "sich beziehen auf", "to refer to"],
          ["Abstand nehmen von (+D)", "verzichten auf", "to refrain from"],
        ],
      },
    ],
    pitfalls: [
      "Fixed collocations — the article is often part of the expression and cannot be changed: »in Frage stellen« (no article), »zur Verfügung stellen« (zur, not zu der).",
    ],
  },

  {
    id: "passiversatz",
    level: "C1",
    title: "Passiversatzformen",
    en: "Passive substitutes",
    drills: ["passiversatz"],
    summary:
      "Four constructions that carry passive meaning without using werden. Recognising them is a reading skill; producing at least two of them is what a C1 essay is graded on.",
    code: `// all four mean: "can/must be done"
sein + zu + Infinitiv     Das Problem ist zu lösen.        (kann/muss gelöst werden)
sich lassen + Infinitiv   Das Problem lässt sich lösen.    (kann gelöst werden)
Adjektiv auf -bar         Das Problem ist lösbar.          (kann gelöst werden)
man + Aktiv               Man kann das Problem lösen.

// also: -lich (verständlich), Reflexiv (Die Tür öffnet sich),
//        bekommen/kriegen-Passiv (Er bekommt das Buch geschenkt)`,
    tables: [
      {
        caption: "Eine Aussage, fünf Formulierungen",
        head: ["Form", "Satz"],
        rows: [
          ["Passiv", "Der Antrag kann online gestellt werden."],
          ["sein + zu", "Der Antrag ist online zu stellen."],
          ["sich lassen", "Der Antrag lässt sich online stellen."],
          ["-bar", "Der Antrag ist online stellbar."],
          ["man", "Man kann den Antrag online stellen."],
        ],
      },
    ],
    pitfalls: [
      "sein + zu can mean either possibility or obligation. Context decides; »Die Rechnung ist bis Freitag zu bezahlen« is obligation.",
    ],
  },

  {
    id: "konjunktiv2-vergangenheit",
    level: "C1",
    title: "Konjunktiv II der Vergangenheit",
    en: "Past Konjunktiv II",
    drills: ["konj2past"],
    summary:
      "The counterfactual past — what would have happened. One form covers all three past tenses, and the modal version has a word-order trap.",
    code: `hätte / wäre + Partizip II

Wenn ich Zeit gehabt hätte, wäre ich gekommen.
Ich hätte dir geholfen, wenn du gefragt hättest.

// with a modal: DOUBLE INFINITIVE, and hätte moves BEFORE the two infinitives
Ich hätte kommen können.
Wenn ich hätte kommen können, …      // ← hätte first, not last!

// regret and reproach
Ich hätte früher anfangen sollen.    I should have started earlier.
Das hättest du sagen müssen.         You should have said that.`,
    examples: [
      { de: "Beinahe wäre der Vertrag gescheitert.", en: "The contract almost fell through." },
      { de: "Wenn er sich rechtzeitig beworben hätte, hätte er die Stelle bekommen.", en: "If he had applied in time he would have got the job." },
    ],
    pitfalls: [
      "In a subordinate clause with a double infinitive, hätte goes BEFORE both infinitives — the one place the finite verb is not last.",
      "»Ich hätte gekonnt« is only correct without a following infinitive. With one it is »hätte … können«.",
    ],
  },

  {
    id: "erweitertes-attribut",
    level: "C1",
    title: "Erweiterte Partizipialattribute",
    en: "Extended participial attributes",
    summary:
      "The construction that makes German academic prose hard to read: a whole clause packed between the article and the noun. You must be able to unpack it, and to build a short one.",
    code: `[ Artikel  … erweitertes Attribut …  Partizip ] Nomen

die [ in den letzten Jahren stark gestiegenen ] Kosten
   ← die Kosten, die in den letzten Jahren stark gestiegen sind

// how to READ it: jump article → noun first, then unpack the middle
1. find the article
2. skip to the noun
3. read the block between them as a relative clause

der [ von der Kommission im Juni vorgelegte ] Bericht
   ← der Bericht, den die Kommission im Juni vorgelegt hat`,
    examples: [
      { de: "die vom Gesetzgeber vorgesehenen Ausnahmen", en: "the exceptions provided for by the legislator", note: "← die Ausnahmen, die der Gesetzgeber vorgesehen hat" },
      { de: "das seit Jahren diskutierte Problem", en: "the problem that has been discussed for years" },
    ],
    pitfalls: [
      "Producing these is optional at C1; understanding them is not. In your own writing, one per paragraph is plenty.",
    ],
  },

  {
    id: "konnektoren-c1",
    level: "C1",
    title: "Formelle Konnektoren",
    en: "Formal connectors",
    drills: ["konnektor"],
    summary:
      "The upper register of connection. Each carries a precise logical relation — using them correctly is the fastest visible jump from B2 to C1.",
    code: `zumal          particularly since   (reinforcing reason)  → Verbletzt
wenngleich     even though (formal)                       → Verbletzt
insofern als   insofar as                                 → Verbletzt
sofern         provided that                              → Verbletzt
indem          by …-ing (means)                           → Verbletzt
ohne dass      without (something happening)              → Verbletzt

somit          thus                                       → Position 1
hingegen       by contrast                                → Position 1
gleichwohl     all the same                               → Position 1
mithin         hence                                      → Position 1
demzufolge     accordingly                                → Position 1
nichtsdestotrotz  nevertheless                            → Position 1`,
    examples: [
      { de: "Der Vorschlag ist abzulehnen, zumal er erhebliche Kosten verursacht.", en: "The proposal should be rejected, particularly since it causes considerable costs." },
      { de: "Die Maßnahme wirkt, indem sie die Nachfrage senkt.", en: "The measure works by reducing demand.", note: "indem = the means" },
    ],
    pitfalls: [
      "indem (means) and während (time/contrast) are frequently confused. indem answers »wie?«, während answers »wann?« or marks contrast.",
    ],
  },

  {
    id: "modalpartikeln",
    level: "C1",
    title: "Modalpartikeln",
    en: "Modal particles",
    drills: ["partikel"],
    summary:
      "Small unstressed words that carry no dictionary meaning but change the speaker's attitude. Using two or three correctly is the difference between correct German and natural German.",
    code: `doch   → contradiction / reminder     Das hast du doch gewusst!
ja     → shared knowledge            Das ist ja klar.
mal    → softens a request           Komm mal her.
eben   → resigned, unchangeable      So ist das eben.
halt   → same as eben (southern)     Dann muss man halt warten.
wohl   → supposition                 Er ist wohl krank.
denn   → friendly interest in Qs     Was machst du denn?
schon  → conceding                   Das stimmt schon, aber …
bloß   → urgency in a wish           Wenn er bloß käme!
ruhig  → reassuring permission       Frag ruhig nach.
etwa   → expects a "no"              Hast du etwa vergessen?`,
    pitfalls: [
      "Modal particles are unstressed and sit in the Mittelfeld, usually right after the subject and pronouns.",
      "Do not use them in a formal written essay — they belong to speech and to informal writing.",
    ],
  },

  {
    id: "schreiben-c1",
    level: "C1",
    title: "Schreiben — Erörterung und formeller Brief",
    en: "Writing — argumentative essay and formal letter",
    summary:
      "At C1 the grammar is assumed. Marks are won on structure, register consistency, and connector variety — the things a checklist can actually enforce.",
    code: `// ERÖRTERUNG — the structure examiners look for
1. Einleitung      Thema einführen + Fragestellung benennen
2. These 1         Behauptung → Begründung → Beispiel
3. These 2         Behauptung → Begründung → Beispiel
4. Gegenposition   Einwand ernst nehmen → entkräften
5. Fazit           eigene Position, begründet, ohne neue Argumente

// the register checklist you can literally tick off
[ ] no contractions from speech (nen, ne, 'ne)
[ ] no modal particles (doch, ja, halt, mal)
[ ] Genitiv where a Genitiv belongs
[ ] at least 3 different subordinating connectors
[ ] at least 1 passive or passive substitute
[ ] at least 1 Konjunktiv II
[ ] position 1 varied — not "Ich" five times`,
    tables: [
      {
        caption: "Register: gesprochen → geschrieben",
        head: ["gesprochen", "geschrieben (C1)"],
        rows: [
          ["weil das Wetter schlecht war", "aufgrund des schlechten Wetters"],
          ["Man kann sagen, dass …", "Es lässt sich festhalten, dass …"],
          ["Ich finde, dass …", "Meines Erachtens …"],
          ["Das ist ein großes Problem.", "Hierbei handelt es sich um eine erhebliche Problematik."],
          ["kriegen", "erhalten / bekommen"],
        ],
      },
    ],
    pitfalls: [
      "A C1 essay that argues only one side loses marks even if the German is flawless — the Gegenposition is part of the task.",
      "Word count matters: under-length is penalised before the content is even read.",
    ],
  },
];

export const MODULE_BY_ID = Object.fromEntries(MODULES.map((m) => [m.id, m]));
export const MODULES_BY_LEVEL = LEVELS.map((lvl) => ({
  level: lvl,
  ...LEVEL_INFO[lvl],
  modules: MODULES.filter((m) => m.level === lvl),
}));
