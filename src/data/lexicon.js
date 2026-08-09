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
//  LEXICON — the raw material the drill engine generates questions from.
//  Everything here is hand-checked; the engine derives forms, it never guesses.
// ============================================================================

export const CASES = [
  { k: "nom", short: "NOM", label: "Nominativ", q: "wer? was?" },
  { k: "akk", short: "AKK", label: "Akkusativ", q: "wen? was?" },
  { k: "dat", short: "DAT", label: "Dativ", q: "wem?" },
  { k: "gen", short: "GEN", label: "Genitiv", q: "wessen?" },
];

export const GENDER_LABEL = { m: "Maskulin", n: "Neutrum", f: "Feminin", p: "Plural" };
export const GENDER_ART = { m: "der", n: "das", f: "die", p: "die" };

// --- article + adjective ending tables --------------------------------------

export const DEF = {
  m: { nom: "der", akk: "den", dat: "dem", gen: "des" },
  n: { nom: "das", akk: "das", dat: "dem", gen: "des" },
  f: { nom: "die", akk: "die", dat: "der", gen: "der" },
  p: { nom: "die", akk: "die", dat: "den", gen: "der" },
};

// ein-word endings; "" marks the three "naked" cells that create weak/mixed split
export const EIN_END = {
  m: { nom: "", akk: "en", dat: "em", gen: "es" },
  n: { nom: "", akk: "", dat: "em", gen: "es" },
  f: { nom: "e", akk: "e", dat: "er", gen: "er" },
  p: { nom: "e", akk: "e", dat: "en", gen: "er" },
};

export const WEAK = {
  m: { nom: "e", akk: "en", dat: "en", gen: "en" },
  n: { nom: "e", akk: "e", dat: "en", gen: "en" },
  f: { nom: "e", akk: "e", dat: "en", gen: "en" },
  p: { nom: "en", akk: "en", dat: "en", gen: "en" },
};

export const STRONG = {
  m: { nom: "er", akk: "en", dat: "em", gen: "en" },
  n: { nom: "es", akk: "es", dat: "em", gen: "en" },
  f: { nom: "e", akk: "e", dat: "er", gen: "er" },
  p: { nom: "e", akk: "e", dat: "en", gen: "er" },
};

// --- nouns ------------------------------------------------------------------
// g: gender · pl: plural · gs: genitive singular · n: n-Deklination (weak masc.)

export const NOUNS = [
  { w: "Mann", g: "m", pl: "Männer", gs: "Mannes", en: "man" },
  { w: "Hund", g: "m", pl: "Hunde", gs: "Hundes", en: "dog" },
  { w: "Tisch", g: "m", pl: "Tische", gs: "Tisches", en: "table" },
  { w: "Schlüssel", g: "m", pl: "Schlüssel", gs: "Schlüssels", en: "key" },
  { w: "Freund", g: "m", pl: "Freunde", gs: "Freundes", en: "friend" },
  { w: "Apfel", g: "m", pl: "Äpfel", gs: "Apfels", en: "apple" },
  { w: "Vertrag", g: "m", pl: "Verträge", gs: "Vertrages", en: "contract" },
  { w: "Antrag", g: "m", pl: "Anträge", gs: "Antrages", en: "application" },
  { w: "Bericht", g: "m", pl: "Berichte", gs: "Berichtes", en: "report" },
  { w: "Kind", g: "n", pl: "Kinder", gs: "Kindes", en: "child" },
  { w: "Buch", g: "n", pl: "Bücher", gs: "Buches", en: "book" },
  { w: "Haus", g: "n", pl: "Häuser", gs: "Hauses", en: "house" },
  { w: "Auto", g: "n", pl: "Autos", gs: "Autos", en: "car" },
  { w: "Fenster", g: "n", pl: "Fenster", gs: "Fensters", en: "window" },
  { w: "Ergebnis", g: "n", pl: "Ergebnisse", gs: "Ergebnisses", en: "result" },
  { w: "Verfahren", g: "n", pl: "Verfahren", gs: "Verfahrens", en: "procedure" },
  { w: "Frau", g: "f", pl: "Frauen", gs: "Frau", en: "woman" },
  { w: "Katze", g: "f", pl: "Katzen", gs: "Katze", en: "cat" },
  { w: "Stadt", g: "f", pl: "Städte", gs: "Stadt", en: "city" },
  { w: "Tür", g: "f", pl: "Türen", gs: "Tür", en: "door" },
  { w: "Lampe", g: "f", pl: "Lampen", gs: "Lampe", en: "lamp" },
  { w: "Schwester", g: "f", pl: "Schwestern", gs: "Schwester", en: "sister" },
  { w: "Entscheidung", g: "f", pl: "Entscheidungen", gs: "Entscheidung", en: "decision" },
  { w: "Voraussetzung", g: "f", pl: "Voraussetzungen", gs: "Voraussetzung", en: "prerequisite" },
];

// n-Deklination: masculine nouns taking -(e)n in every case except NOM singular
export const N_NOUNS = [
  { w: "Junge", g: "m", obl: "Jungen", pl: "Jungen", gs: "Jungen", en: "boy" },
  { w: "Student", g: "m", obl: "Studenten", pl: "Studenten", gs: "Studenten", en: "student" },
  { w: "Kollege", g: "m", obl: "Kollegen", pl: "Kollegen", gs: "Kollegen", en: "colleague" },
  { w: "Kunde", g: "m", obl: "Kunden", pl: "Kunden", gs: "Kunden", en: "customer" },
  { w: "Mensch", g: "m", obl: "Menschen", pl: "Menschen", gs: "Menschen", en: "human being" },
  { w: "Nachbar", g: "m", obl: "Nachbarn", pl: "Nachbarn", gs: "Nachbarn", en: "neighbour" },
  { w: "Präsident", g: "m", obl: "Präsidenten", pl: "Präsidenten", gs: "Präsidenten", en: "president" },
  { w: "Experte", g: "m", obl: "Experten", pl: "Experten", gs: "Experten", en: "expert" },
  // mixed: -n in oblique cases AND -ns in genitive
  { w: "Name", g: "m", obl: "Namen", pl: "Namen", gs: "Namens", en: "name", mixed: true },
  { w: "Gedanke", g: "m", obl: "Gedanken", pl: "Gedanken", gs: "Gedankens", en: "thought", mixed: true },
];

export const ADJECTIVES = [
  "alt", "neu", "klein", "groß", "rot", "jung", "schön", "kalt", "warm", "schnell",
  "wichtig", "schwierig", "günstig", "deutlich", "erheblich",
];

// --- pronouns ---------------------------------------------------------------

export const PRON = ["ich", "du", "er/sie/es", "wir", "ihr", "sie/Sie"];
export const PRON_SHORT = ["ich", "du", "er", "wir", "ihr", "sie"];

export const PERSONAL = {
  nom: ["ich", "du", "er", "wir", "ihr", "sie"],
  akk: ["mich", "dich", "ihn", "uns", "euch", "sie"],
  dat: ["mir", "dir", "ihm", "uns", "euch", "ihnen"],
};
export const REFLEX_AKK = ["mich", "dich", "sich", "uns", "euch", "sich"];
export const REFLEX_DAT = ["mir", "dir", "sich", "uns", "euch", "sich"];

// --- verbs ------------------------------------------------------------------
// pres/prat/k2 are 6-slot arrays: ich, du, er, wir, ihr, sie
// k1_3 = Konjunktiv I, 3rd person singular (indirect speech workhorse)
// sep  = separable prefix · trans = takes an accusative object
// noPassiv = transitive but NOT passivisable — haben, wissen, kennen, besitzen,
//   bekommen, kosten and friends take an accusative object yet form no
//   werden-Passiv. See IDS grammis "Passivfähigkeit bei werden- und sein-Passiv":
//   https://grammis.ids-mannheim.de/systematische-grammatik/1136

export const VERBS = [
  { inf: "machen", en: "to do/make", aux: "haben", pii: "gemacht", type: "weak", trans: true,
    pres: ["mache","machst","macht","machen","macht","machen"],
    prat: ["machte","machtest","machte","machten","machtet","machten"],
    k2: ["würde machen","würdest machen","würde machen","würden machen","würdet machen","würden machen"],
    k1_3: "mache" },
  { inf: "gehen", en: "to go", aux: "sein", pii: "gegangen", type: "strong", trans: false,
    pres: ["gehe","gehst","geht","gehen","geht","gehen"],
    prat: ["ging","gingst","ging","gingen","gingt","gingen"],
    k2: ["ginge","gingest","ginge","gingen","ginget","gingen"], k1_3: "gehe" },
  { inf: "fahren", en: "to drive/travel", aux: "sein", pii: "gefahren", type: "strong", trans: false,
    pres: ["fahre","fährst","fährt","fahren","fahrt","fahren"],
    prat: ["fuhr","fuhrst","fuhr","fuhren","fuhrt","fuhren"],
    k2: ["führe","führest","führe","führen","führet","führen"], k1_3: "fahre" },
  { inf: "sehen", en: "to see", aux: "haben", pii: "gesehen", type: "strong", trans: true,
    pres: ["sehe","siehst","sieht","sehen","seht","sehen"],
    prat: ["sah","sahst","sah","sahen","saht","sahen"],
    k2: ["sähe","sähest","sähe","sähen","sähet","sähen"], k1_3: "sehe" },
  { inf: "essen", en: "to eat", aux: "haben", pii: "gegessen", type: "strong", trans: true,
    pres: ["esse","isst","isst","essen","esst","essen"],
    prat: ["aß","aßest","aß","aßen","aßt","aßen"],
    k2: ["äße","äßest","äße","äßen","äßet","äßen"], k1_3: "esse" },
  { inf: "sprechen", en: "to speak", aux: "haben", pii: "gesprochen", type: "strong", trans: true,
    pres: ["spreche","sprichst","spricht","sprechen","sprecht","sprechen"],
    prat: ["sprach","sprachst","sprach","sprachen","spracht","sprachen"],
    k2: ["spräche","sprächest","spräche","sprächen","sprächet","sprächen"], k1_3: "spreche" },
  { inf: "lesen", en: "to read", aux: "haben", pii: "gelesen", type: "strong", trans: true,
    pres: ["lese","liest","liest","lesen","lest","lesen"],
    prat: ["las","lasest","las","lasen","last","lasen"],
    k2: ["läse","läsest","läse","läsen","läset","läsen"], k1_3: "lese" },
  { inf: "schreiben", en: "to write", aux: "haben", pii: "geschrieben", type: "strong", trans: true,
    pres: ["schreibe","schreibst","schreibt","schreiben","schreibt","schreiben"],
    prat: ["schrieb","schriebst","schrieb","schrieben","schriebt","schrieben"],
    k2: ["schriebe","schriebest","schriebe","schrieben","schriebet","schrieben"], k1_3: "schreibe" },
  { inf: "nehmen", en: "to take", aux: "haben", pii: "genommen", type: "strong", trans: true,
    pres: ["nehme","nimmst","nimmt","nehmen","nehmt","nehmen"],
    prat: ["nahm","nahmst","nahm","nahmen","nahmt","nahmen"],
    k2: ["nähme","nähmest","nähme","nähmen","nähmet","nähmen"], k1_3: "nehme" },
  { inf: "geben", en: "to give", aux: "haben", pii: "gegeben", type: "strong", trans: true,
    pres: ["gebe","gibst","gibt","geben","gebt","geben"],
    prat: ["gab","gabst","gab","gaben","gabt","gaben"],
    k2: ["gäbe","gäbest","gäbe","gäben","gäbet","gäben"], k1_3: "gebe" },
  { inf: "finden", en: "to find", aux: "haben", pii: "gefunden", type: "strong", trans: true,
    pres: ["finde","findest","findet","finden","findet","finden"],
    prat: ["fand","fandest","fand","fanden","fandet","fanden"],
    k2: ["fände","fändest","fände","fänden","fändet","fänden"], k1_3: "finde" },
  { inf: "haben", en: "to have", aux: "haben", pii: "gehabt", type: "mixed", trans: true, noPassiv: true,
    pres: ["habe","hast","hat","haben","habt","haben"],
    prat: ["hatte","hattest","hatte","hatten","hattet","hatten"],
    k2: ["hätte","hättest","hätte","hätten","hättet","hätten"], k1_3: "habe" },
  { inf: "sein", en: "to be", aux: "sein", pii: "gewesen", type: "strong", trans: false,
    pres: ["bin","bist","ist","sind","seid","sind"],
    prat: ["war","warst","war","waren","wart","waren"],
    k2: ["wäre","wärst","wäre","wären","wärt","wären"], k1_3: "sei" },
  { inf: "werden", en: "to become", aux: "sein", pii: "geworden", type: "strong", trans: false,
    pres: ["werde","wirst","wird","werden","werdet","werden"],
    prat: ["wurde","wurdest","wurde","wurden","wurdet","wurden"],
    k2: ["würde","würdest","würde","würden","würdet","würden"], k1_3: "werde" },
  { inf: "arbeiten", en: "to work", aux: "haben", pii: "gearbeitet", type: "weak", trans: false,
    pres: ["arbeite","arbeitest","arbeitet","arbeiten","arbeitet","arbeiten"],
    prat: ["arbeitete","arbeitetest","arbeitete","arbeiteten","arbeitetet","arbeiteten"],
    k2: ["würde arbeiten","würdest arbeiten","würde arbeiten","würden arbeiten","würdet arbeiten","würden arbeiten"],
    k1_3: "arbeite" },
  { inf: "bleiben", en: "to stay", aux: "sein", pii: "geblieben", type: "strong", trans: false,
    pres: ["bleibe","bleibst","bleibt","bleiben","bleibt","bleiben"],
    prat: ["blieb","bliebst","blieb","blieben","bliebt","blieben"],
    k2: ["bliebe","bliebest","bliebe","blieben","bliebet","blieben"], k1_3: "bleibe" },
  { inf: "kommen", en: "to come", aux: "sein", pii: "gekommen", type: "strong", trans: false,
    pres: ["komme","kommst","kommt","kommen","kommt","kommen"],
    prat: ["kam","kamst","kam","kamen","kamt","kamen"],
    k2: ["käme","kämest","käme","kämen","kämet","kämen"], k1_3: "komme" },
  { inf: "verstehen", en: "to understand", aux: "haben", pii: "verstanden", type: "strong", trans: true,
    note: "untrennbares Präfix ver- → kein ge-",
    pres: ["verstehe","verstehst","versteht","verstehen","versteht","verstehen"],
    prat: ["verstand","verstandest","verstand","verstanden","verstandet","verstanden"],
    k2: ["verstünde","verstündest","verstünde","verstünden","verstündet","verstünden"], k1_3: "verstehe" },
  { inf: "studieren", en: "to study", aux: "haben", pii: "studiert", type: "weak", trans: true,
    note: "-ieren → kein ge-",
    pres: ["studiere","studierst","studiert","studieren","studiert","studieren"],
    prat: ["studierte","studiertest","studierte","studierten","studiertet","studierten"],
    k2: ["würde studieren","würdest studieren","würde studieren","würden studieren","würdet studieren","würden studieren"],
    k1_3: "studiere" },
  { inf: "aufstehen", en: "to get up", aux: "sein", pii: "aufgestanden", type: "strong", trans: false,
    sep: "auf", note: "trennbar → ge- rutscht in die Mitte",
    pres: ["stehe","stehst","steht","stehen","steht","stehen"],
    prat: ["stand","standest","stand","standen","standet","standen"],
    k2: ["stünde","stündest","stünde","stünden","stündet","stünden"], k1_3: "stehe" },
  { inf: "anrufen", en: "to call (phone)", aux: "haben", pii: "angerufen", type: "strong", trans: true,
    sep: "an", note: "trennbar",
    pres: ["rufe","rufst","ruft","rufen","ruft","rufen"],
    prat: ["rief","riefst","rief","riefen","rieft","riefen"],
    k2: ["riefe","riefest","riefe","riefen","riefet","riefen"], k1_3: "rufe" },
  { inf: "bringen", en: "to bring", aux: "haben", pii: "gebracht", type: "mixed", trans: true,
    pres: ["bringe","bringst","bringt","bringen","bringt","bringen"],
    prat: ["brachte","brachtest","brachte","brachten","brachtet","brachten"],
    k2: ["brächte","brächtest","brächte","brächten","brächtet","brächten"], k1_3: "bringe" },
  { inf: "denken", en: "to think", aux: "haben", pii: "gedacht", type: "mixed", trans: false,
    pres: ["denke","denkst","denkt","denken","denkt","denken"],
    prat: ["dachte","dachtest","dachte","dachten","dachtet","dachten"],
    k2: ["dächte","dächtest","dächte","dächten","dächtet","dächten"], k1_3: "denke" },
  { inf: "wissen", en: "to know (a fact)", aux: "haben", pii: "gewusst", type: "mixed", trans: true, noPassiv: true,
    pres: ["weiß","weißt","weiß","wissen","wisst","wissen"],
    prat: ["wusste","wusstest","wusste","wussten","wusstet","wussten"],
    k2: ["wüsste","wüsstest","wüsste","wüssten","wüsstet","wüssten"], k1_3: "wisse" },
  { inf: "lassen", en: "to let/have done", aux: "haben", pii: "gelassen", type: "strong", trans: true, noPassiv: true,
    pres: ["lasse","lässt","lässt","lassen","lasst","lassen"],
    prat: ["ließ","ließest","ließ","ließen","ließt","ließen"],
    k2: ["ließe","ließest","ließe","ließen","ließet","ließen"], k1_3: "lasse" },
];

export const MODALS = [
  { inf: "können", en: "can / to be able to", pii: "gekonnt", k1_3: "könne",
    pres: ["kann","kannst","kann","können","könnt","können"],
    prat: ["konnte","konntest","konnte","konnten","konntet","konnten"],
    k2: ["könnte","könntest","könnte","könnten","könntet","könnten"] },
  { inf: "müssen", en: "must / to have to", pii: "gemusst", k1_3: "müsse",
    pres: ["muss","musst","muss","müssen","müsst","müssen"],
    prat: ["musste","musstest","musste","mussten","musstet","mussten"],
    k2: ["müsste","müsstest","müsste","müssten","müsstet","müssten"] },
  { inf: "dürfen", en: "may / to be allowed to", pii: "gedurft", k1_3: "dürfe",
    pres: ["darf","darfst","darf","dürfen","dürft","dürfen"],
    prat: ["durfte","durftest","durfte","durften","durftet","durften"],
    k2: ["dürfte","dürftest","dürfte","dürften","dürftet","dürften"] },
  { inf: "sollen", en: "should / to be supposed to", pii: "gesollt", k1_3: "solle",
    pres: ["soll","sollst","soll","sollen","sollt","sollen"],
    prat: ["sollte","solltest","sollte","sollten","solltet","sollten"],
    k2: ["sollte","solltest","sollte","sollten","solltet","sollten"] },
  { inf: "wollen", en: "to want to", pii: "gewollt", k1_3: "wolle",
    pres: ["will","willst","will","wollen","wollt","wollen"],
    prat: ["wollte","wolltest","wollte","wollten","wolltet","wollten"],
    k2: ["wollte","wolltest","wollte","wollten","wolltet","wollten"] },
  { inf: "mögen", en: "to like", pii: "gemocht", k1_3: "möge",
    pres: ["mag","magst","mag","mögen","mögt","mögen"],
    prat: ["mochte","mochtest","mochte","mochten","mochtet","mochten"],
    k2: ["möchte","möchtest","möchte","möchten","möchtet","möchten"] },
];

// --- prepositions -----------------------------------------------------------

// entlang is deliberately absent: its case depends on its position relative to
// the noun (nachgestellt → Akkusativ, vorangestellt → Genitiv/regional Dativ),
// so it is not a case constant. See R-081 and https://www.duden.de/rechtschreibung/entlang_seitlich_zuseiten
export const PREP_AKK = ["durch", "für", "gegen", "ohne", "um", "bis"];
export const PREP_DAT = ["aus", "außer", "bei", "mit", "nach", "seit", "von", "zu", "gegenüber"];
export const PREP_GEN = ["wegen", "während", "trotz", "statt", "innerhalb", "außerhalb", "aufgrund", "anhand", "hinsichtlich", "infolge", "mangels", "zwecks"];
export const PREP_WECHSEL = ["an", "auf", "hinter", "in", "neben", "über", "unter", "vor", "zwischen"];

export const CONTRACTIONS = [
  ["im", "in dem"], ["ins", "in das"], ["am", "an dem"], ["ans", "an das"],
  ["zum", "zu dem"], ["zur", "zu der"], ["beim", "bei dem"], ["vom", "von dem"],
  ["aufs", "auf das"], ["fürs", "für das"], ["durchs", "durch das"], ["übers", "über das"],
];

// verbs governing a fixed preposition + case — B1/B2 bread and butter
export const VERB_PREP = [
  { v: "warten", p: "auf", c: "akk", ex: "Ich warte auf den Bus.", en: "to wait for" },
  { v: "denken", p: "an", c: "akk", ex: "Ich denke an dich.", en: "to think of" },
  { v: "sich freuen", p: "auf", c: "akk", ex: "Ich freue mich auf den Urlaub.", en: "to look forward to" },
  { v: "sich freuen", p: "über", c: "akk", ex: "Ich freue mich über das Geschenk.", en: "to be glad about" },
  { v: "sich interessieren", p: "für", c: "akk", ex: "Er interessiert sich für Politik.", en: "to be interested in" },
  { v: "sich erinnern", p: "an", c: "akk", ex: "Erinnerst du dich an den Abend?", en: "to remember" },
  { v: "sich kümmern", p: "um", c: "akk", ex: "Sie kümmert sich um das Kind.", en: "to take care of" },
  { v: "bitten", p: "um", c: "akk", ex: "Ich bitte um Geduld.", en: "to ask for" },
  { v: "sich bewerben", p: "um", c: "akk", ex: "Er bewirbt sich um die Stelle.", en: "to apply for" },
  { v: "sich beschäftigen", p: "mit", c: "dat", ex: "Wir beschäftigen uns mit dem Thema.", en: "to deal with" },
  { v: "teilnehmen", p: "an", c: "dat", ex: "Sie nimmt an der Sitzung teil.", en: "to take part in" },
  { v: "gehören", p: "zu", c: "dat", ex: "Das gehört zu den Aufgaben.", en: "to be part of" },
  { v: "bestehen", p: "aus", c: "dat", ex: "Das Team besteht aus fünf Personen.", en: "to consist of" },
  { v: "abhängen", p: "von", c: "dat", ex: "Das hängt vom Wetter ab.", en: "to depend on" },
  { v: "sich handeln", p: "um", c: "akk", ex: "Es handelt sich um einen Fehler.", en: "to be a matter of" },
  { v: "sich verlassen", p: "auf", c: "akk", ex: "Ich verlasse mich auf dich.", en: "to rely on" },
  { v: "achten", p: "auf", c: "akk", ex: "Achte auf die Endungen!", en: "to pay attention to" },
  { v: "leiden", p: "unter", c: "dat", ex: "Er leidet unter dem Stress.", en: "to suffer from" },
  { v: "zweifeln", p: "an", c: "dat", ex: "Ich zweifle an der Aussage.", en: "to doubt" },
  { v: "sich gewöhnen", p: "an", c: "akk", ex: "Man gewöhnt sich an alles.", en: "to get used to" },
];

export const ADJ_PREP = [
  { a: "stolz", p: "auf", c: "akk", en: "proud of" },
  { a: "interessiert", p: "an", c: "dat", en: "interested in" },
  { a: "zufrieden", p: "mit", c: "dat", en: "satisfied with" },
  { a: "verantwortlich", p: "für", c: "akk", en: "responsible for" },
  { a: "abhängig", p: "von", c: "dat", en: "dependent on" },
  { a: "bereit", p: "zu", c: "dat", en: "ready for" },
  { a: "typisch", p: "für", c: "akk", en: "typical of" },
  { a: "böse", p: "auf", c: "akk", en: "angry at" },
];

// --- connectors -------------------------------------------------------------
// pos: 0 = coordinating (no effect) · 1 = position-1 adverbial (verb stays 2nd,
// subject moves behind it) · end = subordinating (finite verb to the end)

export const CONNECTORS = [
  { w: "und", pos: 0, en: "and", level: "A2" },
  { w: "aber", pos: 0, en: "but", level: "A2" },
  { w: "denn", pos: 0, en: "because", level: "A2", note: "Hauptsatzstellung — nicht wie weil!" },
  { w: "oder", pos: 0, en: "or", level: "A2" },
  { w: "sondern", pos: 0, en: "but rather", level: "A2", note: "nur nach einer Verneinung" },
  { w: "weil", pos: "end", en: "because", level: "A2" },
  { w: "dass", pos: "end", en: "that", level: "A2" },
  { w: "wenn", pos: "end", en: "if / whenever", level: "A2" },
  { w: "als", pos: "end", en: "when (single past event)", level: "B1" },
  { w: "ob", pos: "end", en: "whether", level: "A2" },
  { w: "obwohl", pos: "end", en: "although", level: "B1" },
  { w: "damit", pos: "end", en: "so that (purpose)", level: "B1" },
  { w: "bevor", pos: "end", en: "before", level: "B1" },
  { w: "nachdem", pos: "end", en: "after", level: "B1", note: "Zeitenwechsel: Plusquamperfekt + Präteritum" },
  { w: "während", pos: "end", en: "while", level: "B1" },
  { w: "seitdem", pos: "end", en: "since", level: "B1" },
  { w: "falls", pos: "end", en: "in case", level: "B1" },
  { w: "sodass", pos: "end", en: "so that (result)", level: "B2" },
  { w: "indem", pos: "end", en: "by ...-ing", level: "B2" },
  { w: "sofern", pos: "end", en: "provided that", level: "B2" },
  { w: "anstatt dass", pos: "end", en: "instead of", level: "B2" },
  { w: "ohne dass", pos: "end", en: "without", level: "B2" },
  { w: "zumal", pos: "end", en: "particularly since", level: "C1" },
  { w: "wenngleich", pos: "end", en: "even though (formal)", level: "C1" },
  { w: "insofern als", pos: "end", en: "insofar as", level: "C1" },
  { w: "deshalb", pos: 1, en: "therefore", level: "A2" },
  { w: "trotzdem", pos: 1, en: "nevertheless", level: "B1" },
  { w: "dennoch", pos: 1, en: "nonetheless", level: "B2" },
  { w: "deswegen", pos: 1, en: "for that reason", level: "B1" },
  { w: "folglich", pos: 1, en: "consequently", level: "B2" },
  { w: "allerdings", pos: 1, en: "however", level: "B2" },
  { w: "jedoch", pos: 1, en: "however", level: "B2" },
  { w: "außerdem", pos: 1, en: "besides", level: "B1" },
  { w: "zudem", pos: 1, en: "moreover", level: "C1" },
  { w: "somit", pos: 1, en: "thus", level: "C1" },
  { w: "hingegen", pos: 1, en: "by contrast", level: "C1" },
  { w: "gleichwohl", pos: 1, en: "all the same", level: "C1" },
];

export const PAIRED = [
  { w: "entweder … oder", en: "either … or", level: "B1" },
  { w: "weder … noch", en: "neither … nor", level: "B2", note: "schon verneint — kein nicht/kein dazu" },
  { w: "sowohl … als auch", en: "both … and", level: "B2" },
  { w: "nicht nur … sondern auch", en: "not only … but also", level: "B2" },
  { w: "je … desto/umso", en: "the … the", level: "B2", note: "je + Komparativ + Verbletzt, desto + Komparativ + Verb an Position 2" },
  { w: "zwar … aber", en: "admittedly … but", level: "B2" },
  { w: "einerseits … andererseits", en: "on one hand … on the other", level: "B2" },
];

// --- C1 vocabulary of structure --------------------------------------------

export const FVG = [
  { w: "in Betracht ziehen", plain: "erwägen", en: "to consider" },
  { w: "zur Verfügung stellen", plain: "bereitstellen", en: "to make available" },
  { w: "in Frage stellen", plain: "bezweifeln", en: "to call into question" },
  { w: "Rücksicht nehmen auf (+A)", plain: "berücksichtigen", en: "to take into account" },
  { w: "eine Rolle spielen", plain: "wichtig sein", en: "to play a role" },
  { w: "in Kauf nehmen", plain: "hinnehmen", en: "to put up with" },
  { w: "zum Ausdruck bringen", plain: "ausdrücken", en: "to express" },
  { w: "Bezug nehmen auf (+A)", plain: "sich beziehen auf", en: "to refer to" },
  { w: "in Anspruch nehmen", plain: "beanspruchen", en: "to make use of" },
  { w: "unter Beweis stellen", plain: "beweisen", en: "to demonstrate" },
  { w: "in Erwägung ziehen", plain: "erwägen", en: "to take into consideration" },
  { w: "Kritik üben an (+D)", plain: "kritisieren", en: "to criticise" },
  { w: "Abstand nehmen von (+D)", plain: "verzichten auf", en: "to refrain from" },
  { w: "zur Sprache bringen", plain: "ansprechen", en: "to bring up" },
];

export const MODALPARTIKELN = [
  { w: "doch", fn: "Widerspruch / Erinnerung", ex: "Das hast du doch gewusst!", en: "surely / after all" },
  { w: "ja", fn: "geteiltes Wissen", ex: "Das ist ja klar.", en: "as we know" },
  { w: "mal", fn: "macht Aufforderungen weicher", ex: "Komm mal her.", en: "softener" },
  { w: "eben / halt", fn: "Resignation, unabänderlich", ex: "So ist das eben.", en: "just / simply" },
  { w: "wohl", fn: "Vermutung", ex: "Er ist wohl krank.", en: "probably" },
  { w: "denn", fn: "freundliches Interesse in Fragen", ex: "Was machst du denn?", en: "then (in questions)" },
  { w: "schon", fn: "einräumend", ex: "Das stimmt schon, aber …", en: "granted" },
  { w: "bloß / nur", fn: "Dringlichkeit im Wunsch", ex: "Wenn er bloß käme!", en: "only" },
  { w: "ruhig", fn: "beruhigende Erlaubnis", ex: "Frag ruhig nach.", en: "feel free to" },
  { w: "etwa", fn: "erwartet eine Verneinung", ex: "Hast du etwa vergessen?", en: "surely not" },
];

// Redemittel — the phrase bank a C1 exam essay is actually graded on
export const REDEMITTEL = [
  { fn: "Einleitung", items: [
    "In der heutigen Diskussion um … spielt … eine zentrale Rolle.",
    "Der vorliegende Text befasst sich mit der Frage, ob …",
    "Im Folgenden möchte ich der Frage nachgehen, inwiefern …" ] },
  { fn: "Meinung äußern", items: [
    "Meines Erachtens …",
    "Ich vertrete die Auffassung, dass …",
    "Aus meiner Sicht spricht vieles dafür, dass …" ] },
  { fn: "Argument einführen", items: [
    "Ein gewichtiges Argument dafür ist, dass …",
    "Hinzu kommt, dass …",
    "Nicht zuletzt ist zu bedenken, dass …" ] },
  { fn: "Einräumen", items: [
    "Zwar …, dennoch …",
    "Es lässt sich zwar nicht bestreiten, dass …, allerdings …",
    "So berechtigt dieser Einwand auch sein mag, …" ] },
  { fn: "Gegenposition", items: [
    "Dem steht entgegen, dass …",
    "Kritiker wenden hingegen ein, dass …",
    "Andererseits darf nicht übersehen werden, dass …" ] },
  { fn: "Beispiel / Beleg", items: [
    "Dies lässt sich am Beispiel von … verdeutlichen.",
    "Ein anschauliches Beispiel hierfür bietet …",
    "Wie Studien belegen, …" ] },
  { fn: "Schluss", items: [
    "Zusammenfassend lässt sich festhalten, dass …",
    "Abschließend komme ich zu dem Schluss, dass …",
    "Vor diesem Hintergrund plädiere ich dafür, …" ] },
  { fn: "Grafikbeschreibung", items: [
    "Die Grafik gibt Auskunft über …",
    "Auffällig ist, dass … deutlich über/unter … liegt.",
    "Im Zeitraum von … bis … ist ein Anstieg/Rückgang um … Prozentpunkte zu verzeichnen." ] },
  { fn: "Formeller Brief", items: [
    "Sehr geehrte Damen und Herren, / Sehr geehrte Frau …,",
    "Mit Bezug auf Ihr Schreiben vom … möchte ich …",
    "Ich wäre Ihnen sehr verbunden, wenn Sie …",
    "Für Ihre Bemühungen danke ich Ihnen im Voraus. Mit freundlichen Grüßen" ] },
];
