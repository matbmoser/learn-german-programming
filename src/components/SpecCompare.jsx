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

import React from "react";
import { SecHead } from "./ui.jsx";

// ---------------------------------------------------------------------------
//  §8 Sprachvergleich — German next to Spanish and Portuguese.
//  Every rule above exists in the Romance pair too, just built with different
//  parts. Four click-to-compare tools, each closing with the same three-line
//  verdict: Gleich (the underlying idea) · Anders (how it's built) ·
//  Achtung (where the surface similarity actually misleads you).
// ---------------------------------------------------------------------------

function Note({ kind, children }) {
  const cls = "law" + (kind === "same" ? " cmp-same" : kind === "watch" ? " cmp-watch" : "");
  const lbl = kind === "same" ? "Gleich" : kind === "watch" ? "Achtung" : "Anders";
  return (
    <div className={cls}>
      <span className="eyebrow">{lbl}</span>
      <p>{children}</p>
    </div>
  );
}

// token = string (plain) or { t, c } — c colours it like the case system: "nom" | "akk" | "dat" | "gen" | undefined (bold, uncoloured)
function Toks({ toks }) {
  return toks.map((tok, i) =>
    typeof tok === "string" ? (
      <React.Fragment key={i}>{tok}</React.Fragment>
    ) : (
      <b key={i} className={tok.c ? "c-" + tok.c : undefined}>{tok.t}</b>
    )
  );
}

// ---------------------------------------------------------------------------
//  Tool 1 — Genus: the same noun, three genders (or two, or none that agree)
// ---------------------------------------------------------------------------
const GENDER_CMP = [
  { id: "sonne", en: "sun",
    de: { art: "die", g: "f", w: "Sonne" }, es: { art: "el", g: "m", w: "sol" }, pt: { art: "o", g: "m", w: "sol" } },
  { id: "mond", en: "moon",
    de: { art: "der", g: "m", w: "Mond" }, es: { art: "la", g: "f", w: "luna" }, pt: { art: "a", g: "f", w: "lua" } },
  { id: "wasser", en: "water",
    de: { art: "das", g: "n", w: "Wasser" }, es: { art: "el", g: "f", w: "agua" }, pt: { art: "a", g: "f", w: "água" },
    note: "el agua ist trotz „el“ grammatisch feminin — Spanisch stellt „el“ nur vor betontes a- (el agua fría). Portugiesisch kennt diese Regel nicht: a água, ganz regulär." },
  { id: "milch", en: "milk",
    de: { art: "die", g: "f", w: "Milch" }, es: { art: "la", g: "f", w: "leche" }, pt: { art: "o", g: "m", w: "leite" },
    note: "o leite ist maskulin — die Endung -e sagt im Portugiesischen nichts über das Genus." },
  { id: "tisch", en: "table",
    de: { art: "der", g: "m", w: "Tisch" }, es: { art: "la", g: "f", w: "mesa" }, pt: { art: "a", g: "f", w: "mesa" } },
  { id: "bruecke", en: "bridge",
    de: { art: "die", g: "f", w: "Brücke" }, es: { art: "el", g: "m", w: "puente" }, pt: { art: "a", g: "f", w: "ponte" } },
  { id: "buch", en: "book",
    de: { art: "das", g: "n", w: "Buch" }, es: { art: "el", g: "m", w: "libro" }, pt: { art: "o", g: "m", w: "livro" } },
  { id: "problem", en: "problem",
    de: { art: "das", g: "n", w: "Problem" }, es: { art: "el", g: "m", w: "problema" }, pt: { art: "o", g: "m", w: "problema" },
    note: "-ma-Wörter griechischen Ursprungs sind im Spanischen und Portugiesischen maskulin, obwohl sie auf -a enden — dieselbe Art Ausnahme wie die deutschen Endungsregeln in §2." },
  { id: "blume", en: "flower",
    de: { art: "die", g: "f", w: "Blume" }, es: { art: "la", g: "f", w: "flor" }, pt: { art: "a", g: "f", w: "flor" } },
  { id: "auto", en: "car",
    de: { art: "das", g: "n", w: "Auto" }, es: { art: "el", g: "m", w: "coche" }, pt: { art: "o", g: "m", w: "carro" } },
];

// German is compared against each Romance language separately: it can agree
// with one and not the other, and the old version collapsed every such case
// into "all three differ" (wrong for e.g. Milch de/es and Brücke de/pt).
// A German neuter has no counterpart at all, so it can never "agree".
function genderVerdict(e) {
  const de = e.de.g === "n" ? null : e.de.g;
  const romanceAgree = e.es.g === e.pt.g;

  if (romanceAgree) {
    if (de === e.es.g) return "Alle drei stimmen überein.";
    return de
      ? "Spanisch und Portugiesisch stimmen überein — Deutsch weicht ab."
      : "Spanisch und Portugiesisch stimmen überein — das deutsche Neutrum hat dort kein Gegenstück.";
  }
  if (de && de === e.es.g) return "Deutsch und Spanisch stimmen überein — Portugiesisch weicht ab.";
  if (de && de === e.pt.g) return "Deutsch und Portugiesisch stimmen überein — Spanisch weicht ab.";
  return "Alle drei weichen untereinander ab.";
}

function GenderCompare() {
  const [id, setId] = React.useState("sonne");
  const e = GENDER_CMP.find((x) => x.id === id);

  return (
    <div className="spec-tool">
      <div className="tool-head">
        <span className="eyebrow">Genus im Vergleich · dasselbe Wort, drei Spalten</span>
      </div>
      <div className="tool-body">
        <div className="chips" role="group" aria-label="Nomen">
          {GENDER_CMP.map((x) => (
            <button key={x.id} type="button" className="chip" aria-pressed={id === x.id} onClick={() => setId(x.id)}>
              {x.de.w}
            </button>
          ))}
        </div>

        <div className="cmp-cols" style={{ marginTop: "var(--s4)" }}>
          <div className="cmp-col cmp-de">
            <div className="cmp-col-head"><span className="cmp-tag">Deutsch</span></div>
            <div className={"cmp-phrase g-" + e.de.g}>{e.de.art} {e.de.w}</div>
          </div>
          <div className="cmp-col cmp-es">
            <div className="cmp-col-head"><span className="cmp-tag">Español</span></div>
            <div className={"cmp-phrase g-" + (e.es.g === "m" ? "m" : "f")}>{e.es.art} {e.es.w}</div>
          </div>
          <div className="cmp-col cmp-pt">
            <div className="cmp-col-head"><span className="cmp-tag">Português</span></div>
            <div className={"cmp-phrase g-" + (e.pt.g === "m" ? "m" : "f")}>{e.pt.art} {e.pt.w}</div>
          </div>
        </div>

        <div className="trace">
          <span className="step">
            <span className="lbl">Vergleich</span>
            <span className="arrow">→ </span>
            {genderVerdict(e)} <span className="why">· {e.en}</span>
          </span>
        </div>
        {e.note && <p className="cmp-aside">{e.note}</p>}

        <Note kind="same">
          Alle drei Sprachen ordnen jedem Nomen ein festes Genus zu, und Artikel wie Adjektive müssen sich danach richten — das Konzept „grammatisches Geschlecht“ ist identisch.
        </Note>
        <Note kind="diff">
          Deutsch hat drei Genera, Spanisch und Portugiesisch nur zwei. Jedes deutsche Neutrum landet im Romanischen zwangsläufig bei maskulin oder feminin — nach keiner Regel, die man ableiten könnte.
        </Note>
        <Note kind="watch">
          Verlass dich nie auf das Genus aus dem Spanischen oder Portugiesischen, auch nicht bei Wörtern, die fast gleich aussehen: <span className="mono">der Mond</span> ist maskulin, <span className="mono">la luna / a lua</span> feminin — und umgekehrt bei <span className="mono">die Sonne</span> / <span className="mono">el sol / o sol</span>. Jedes Nomen einzeln nachschlagen.
        </Note>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
//  Tool 2 — Kasus vs. Objektpronomen: same distinction, different machinery
// ---------------------------------------------------------------------------
const OBJECT_CMP = [
  {
    id: "geben", label: "geben · dar · dar", en: "to give",
    de: {
      full: ["Ich gebe ", { t: "dem Kind", c: "dat" }, " ", { t: "das Buch", c: "akk" }, "."],
      pron: ["Ich gebe ", { t: "es", c: "akk" }, " ", { t: "ihm", c: "dat" }, "."],
    },
    es: {
      full: [{ t: "Le", c: "dat" }, " doy ", { t: "el libro", c: "akk" }, " ", { t: "al niño", c: "dat" }, "."],
      pron: [{ t: "Se", c: "dat" }, " ", { t: "lo", c: "akk" }, " doy."],
    },
    pt: {
      full: ["Dou ", { t: "o livro", c: "akk" }, " ", { t: "ao menino", c: "dat" }, "."],
      pron: ["Dou-", { t: "lho", c: "dat" }, "."],
    },
    same: "geben/dar/dar verlangen in allen drei Sprachen zwei verschiedene Objekte: einen Empfänger und eine Sache. Die Unterscheidung direktes vs. indirektes Objekt existiert überall.",
    diff: "Deutsch zeigt die Rolle am Artikel (dem vs. das) — jedes Mal, bei jedem Nomen. Spanisch/Portugiesisch lassen das Nomen unverändert und markieren die Rolle nur am Pronomen bzw. mit „a“.",
    watch: "Ersetzt du beide Objekte durch Pronomen, drehen sich die Sprachen gegeneinander: Deutsch sagt Akkusativ vor Dativ (es ihm), Spanisch und Portugiesisch sagen Dativ vor Akkusativ (se lo · lho = lhe + o).",
  },
  {
    id: "helfen", label: "helfen · ayudar · ajudar", en: "to help",
    de: {
      full: ["Ich helfe ", { t: "dem Mann", c: "dat" }, "."],
      pron: ["Ich helfe ", { t: "ihm", c: "dat" }, "."],
    },
    es: {
      full: ["Ayudo ", { t: "al hombre", c: "akk" }, "."],
      pron: [{ t: "Lo", c: "akk" }, " ayudo."],
    },
    pt: {
      full: ["Ajudo ", { t: "o homem", c: "akk" }, "."],
      pron: ["Ajudo-", { t: "o", c: "akk" }, "."],
    },
    same: "In jeder der drei Sprachen hat helfen/ayudar/ajudar genau ein Objekt — nur welche Art von Objekt das ist, unterscheidet sich.",
    diff: "Deutsch behandelt helfen als Dativ-Verb: „dem Mann“, nicht „den Mann“. Spanisch und Portugiesisch behandeln ayudar/ajudar als ganz normales Akkusativ-Verb mit direktem Objekt.",
    watch: "Das ist der klassische Übertragungsfehler: „*Ich helfe den Mann“ statt „Ich helfe dem Mann“. Es gibt keine Regel, die verrät, welche deutschen Verben Dativ statt Akkusativ verlangen — nur eine Liste zum Lernen.",
  },
  {
    id: "sehen", label: "sehen · ver · ver", en: "to see",
    de: {
      full: ["Ich sehe ", { t: "den Mann", c: "akk" }, "."],
      pron: ["Ich sehe ", { t: "ihn", c: "akk" }, "."],
    },
    es: {
      full: ["Veo ", { t: "al hombre", c: "akk" }, "."],
      pron: [{ t: "Lo", c: "akk" }, " veo."],
    },
    pt: {
      full: ["Vejo ", { t: "o homem", c: "akk" }, "."],
      pron: ["Vejo-", { t: "o", c: "akk" }, "."],
    },
    same: "sehen/ver/ver nehmen in allen drei Sprachen ein direktes Objekt — Akkusativ in Deutsch entspricht genau dem, was Spanisch/Portugiesisch als direktes Objekt behandeln.",
    diff: "Kein Unterschied im Prinzip. Die einzige Baustelle ist wieder die Form: Kasus am Artikel gegen Klitikon/„a“ am Objekt.",
    watch: "Hier funktioniert die Übertragung aus dem Spanischen oder Portugiesischen tatsächlich problemlos — das ist die Ausnahme, nicht die Regel, also verlass dich nicht darauf bei jedem neuen Verb.",
  },
];

function ObjectCompare() {
  const [id, setId] = React.useState("geben");
  const s = OBJECT_CMP.find((x) => x.id === id);

  return (
    <div className="spec-tool">
      <div className="tool-head">
        <span className="eyebrow">Kasus vs. Objektpronomen · gleiche Rolle, andere Bauteile</span>
      </div>
      <div className="tool-body">
        <div className="chips" role="group" aria-label="Verb">
          {OBJECT_CMP.map((x) => (
            <button key={x.id} type="button" className="chip" aria-pressed={id === x.id} onClick={() => setId(x.id)}>
              {x.label}
            </button>
          ))}
        </div>

        <div style={{ marginTop: "var(--s4)" }}>
          <span className="eyebrow">Volle Nominalphrase</span>
          <div className="cmp-rows" style={{ marginTop: "var(--s2)" }}>
            <div className="cmp-row cmp-de"><span className="cmp-tag">DE</span><span className="cmp-sent"><Toks toks={s.de.full} /></span></div>
            <div className="cmp-row cmp-es"><span className="cmp-tag">ES</span><span className="cmp-sent"><Toks toks={s.es.full} /></span></div>
            <div className="cmp-row cmp-pt"><span className="cmp-tag">PT</span><span className="cmp-sent"><Toks toks={s.pt.full} /></span></div>
          </div>
        </div>

        <div style={{ marginTop: "var(--s3)" }}>
          <span className="eyebrow">Nur Pronomen</span>
          <div className="cmp-rows" style={{ marginTop: "var(--s2)" }}>
            <div className="cmp-row cmp-de"><span className="cmp-tag">DE</span><span className="cmp-sent"><Toks toks={s.de.pron} /></span></div>
            <div className="cmp-row cmp-es"><span className="cmp-tag">ES</span><span className="cmp-sent"><Toks toks={s.es.pron} /></span></div>
            <div className="cmp-row cmp-pt"><span className="cmp-tag">PT</span><span className="cmp-sent"><Toks toks={s.pt.pron} /></span></div>
          </div>
        </div>

        <p className="cmp-aside" style={{ marginTop: "var(--s3)" }}>
          <b className="c-akk">orange</b> = direktes Objekt (Akkusativ) · <b className="c-dat">violett</b> = indirektes Objekt (Dativ) — dieselbe Farbe über alle drei Sprachen hinweg, weil es dieselbe Rolle ist.
        </p>

        <Note kind="same">{s.same}</Note>
        <Note kind="diff">{s.diff}</Note>
        <Note kind="watch">{s.watch}</Note>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
//  Tool 3 — Wortstellung: the bracket vs. the unsplit verb
// ---------------------------------------------------------------------------
const WORDORDER_CMP = {
  main: {
    label: "Hauptsatz",
    // All three front the time adverbial, so the rows are actually comparable;
    // the German subject slides behind the finite verb, which is the point.
    de: ["Gestern ", { t: "hat", c: "nom" }, " er einen Brief ", { t: "geschrieben", c: "akk" }, "."],
    es: ["Ayer él ", { t: "escribió", c: "nom" }, " una carta."],
    pt: ["Ontem ele ", { t: "escreveu", c: "nom" }, " uma carta."],
    same: "Grundwortstellung ist in allen drei Sprachen Subjekt–Verb–Objekt, und „gestern/ayer/ontem“ darf in allen dreien ganz vorne stehen.",
    diff: "Deutsch teilt das Verb in zwei Teile: das konjugierte Hilfsverb steht auf Position 2, der Rest (hier das Partizip) wandert ans Satzende. Spanisch und Portugiesisch halten das Verb immer zusammen.",
    watch: "Im Hauptsatz ist die Lücke noch harmlos — aber gewöhne dir das Muster schon hier an, denn im Nebensatz wird sie zur Falle (siehe rechts).",
  },
  sub: {
    label: "Nebensatz",
    // The participle stays marked here too — otherwise you cannot see that it
    // held still while the finite verb travelled past it to the end.
    de: ["…, weil er gestern einen Brief ", { t: "geschrieben", c: "akk" }, " ", { t: "hat", c: "nom" }, "."],
    es: ["…, porque él ", { t: "escribió", c: "nom" }, " una carta ayer."],
    pt: ["…, porque ele ", { t: "escreveu", c: "nom" }, " uma carta ontem."],
    same: "weil/porque/porque leiten in allen drei Sprachen einen Nebensatz ein, ohne die Wortstellung großartig zu verändern.",
    diff: "Im deutschen Nebensatz rutscht auch das konjugierte Verb ans Ende, hinter das Partizip. Spanisch und Portugiesisch ändern nach porque praktisch nichts.",
    watch: "Das ist die eigentliche Falle: rom. Sprachgefühl will das Verb früh aussprechen. Im deutschen Nebensatz muss der ganze Satz im Kopf fertig sein, bevor das letzte Verb kommt — sonst fehlt am Ende die Zeitform.",
  },
};

function WordOrderCompare() {
  const [kind, setKind] = React.useState("main");
  const w = WORDORDER_CMP[kind];

  return (
    <div className="spec-tool">
      <div className="tool-head">
        <span className="eyebrow">Wortstellung · die Klammer gegen das zusammenbleibende Verb</span>
        <div className="seg" role="group" aria-label="Satzart">
          <button type="button" aria-pressed={kind === "main"} onClick={() => setKind("main")}>Hauptsatz</button>
          <button type="button" aria-pressed={kind === "sub"} onClick={() => setKind("sub")}>Nebensatz</button>
        </div>
      </div>
      <div className="tool-body">
        <div className="cmp-rows">
          <div className="cmp-row cmp-de"><span className="cmp-tag">DE</span><span className="cmp-sent"><Toks toks={w.de} /></span></div>
          <div className="cmp-row cmp-es"><span className="cmp-tag">ES</span><span className="cmp-sent"><Toks toks={w.es} /></span></div>
          <div className="cmp-row cmp-pt"><span className="cmp-tag">PT</span><span className="cmp-sent"><Toks toks={w.pt} /></span></div>
        </div>
        <p className="cmp-aside" style={{ marginTop: "var(--s3)" }}>
          <b className="c-nom">blau</b> = finites Verb · <b className="c-akk">orange</b> = Partizip, also der nicht-finite Rest — dieselbe Zuordnung wie in §6 und §7.
          Spanisch und Portugiesisch haben hier nur ein Verb, deshalb nur eine Farbe. Wechsel zwischen Haupt- und Nebensatz: im Deutschen bleibt{" "}
          <b className="c-akk">orange</b> stehen und <b className="c-nom">blau</b> wandert daran vorbei ans Satzende — bei den anderen beiden bewegt sich nichts.
        </p>

        <Note kind="same">{w.same}</Note>
        <Note kind="diff">{w.diff}</Note>
        <Note kind="watch">{w.watch}</Note>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
//  Tool 4 — Perfekt-Hilfsverb: haben/sein vs. a single, unswitching auxiliary
// ---------------------------------------------------------------------------
const PERFECT_CMP = [
  { id: "gehen", en: "to go", aux: "sein",
    de: [{ t: "bin" }, { t: "gegangen" }], es: [{ t: "he" }, { t: "ido" }], pt: "fui" },
  { id: "essen", en: "to eat", aux: "haben",
    de: [{ t: "habe" }, { t: "gegessen" }], es: [{ t: "he" }, { t: "comido" }], pt: "comi" },
  { id: "sehen", en: "to see", aux: "haben",
    de: [{ t: "habe" }, { t: "gesehen" }], es: [{ t: "he" }, { t: "visto" }], pt: "vi" },
  { id: "kommen", en: "to come", aux: "sein",
    de: [{ t: "bin" }, { t: "gekommen" }], es: [{ t: "he" }, { t: "venido" }], pt: "vim" },
];

function PerfectAuxCompare() {
  const [id, setId] = React.useState("gehen");
  const v = PERFECT_CMP.find((x) => x.id === id);

  return (
    <div className="spec-tool">
      <div className="tool-head">
        <span className="eyebrow">Perfekt-Hilfsverb · haben/sein gegen ein Hilfsverb, das nie wechselt</span>
      </div>
      <div className="tool-body">
        <div className="chips" role="group" aria-label="Verb">
          {PERFECT_CMP.map((x) => (
            <button key={x.id} type="button" className="chip" aria-pressed={id === x.id} onClick={() => setId(x.id)}>
              {x.id}
            </button>
          ))}
        </div>

        <div className="cmp-cols" style={{ marginTop: "var(--s4)" }}>
          <div className="cmp-col cmp-de">
            <div className="cmp-col-head"><span className="cmp-tag">Deutsch</span></div>
            <div className="cmp-phrase">ich <Toks toks={[{ t: v.de[0].t, c: "nom" }, " ", { t: v.de[1].t, c: "akk" }]} /></div>
          </div>
          <div className="cmp-col cmp-es">
            <div className="cmp-col-head"><span className="cmp-tag">Español</span></div>
            <div className="cmp-phrase">(yo) <Toks toks={[{ t: v.es[0].t, c: "nom" }, " ", { t: v.es[1].t, c: "akk" }]} /></div>
          </div>
          <div className="cmp-col cmp-pt">
            <div className="cmp-col-head"><span className="cmp-tag">Português</span></div>
            <div className="cmp-phrase">(eu) <b className="c-nom">{v.pt}</b></div>
          </div>
        </div>
        <p className="cmp-aside">
          Hier bedeutet <b className="c-nom">blau</b> Hilfsverb bzw. finites Verb und <b className="c-akk">orange</b> Partizip —{" "}
          <em>nicht</em> Dativ/Akkusativ wie im Tool oben. Verbteile und Kasus teilen sich die Palette, aber nie innerhalb desselben Beispiels.
          Portugiesisch nutzt hier die einfache Vergangenheit, nicht die Konstruktion mit <span className="mono">ter</span> — siehe Achtung unten.
        </p>

        <Note kind="same">
          Die Bauweise Hilfsverb + Partizip ist praktisch identisch mit dem spanischen Pretérito perfecto compuesto: <span className="mono">haben ≈ haber</span>. „Ich habe gegessen“ ist fast wortwörtlich „he comido“.
        </Note>
        <Note kind="diff">
          {v.aux === "sein"
            ? <>{v.id} gehört zur kleinen Gruppe von Bewegungs- und Zustandsverben, die im Deutschen <span className="mono">sein</span> statt <span className="mono">haben</span> nehmen. Spanisch und Portugiesisch kennen diesen Wechsel nicht — es gibt immer nur ein Hilfsverb (haber/ter).</>
            : <>{v.id} nimmt wie die meisten deutschen Verben (~95 %) <span className="mono">haben</span> — der Normalfall, und er deckt sich mit haber/ter, die ebenfalls nie wechseln.</>}
        </Note>
        <Note kind="watch">
          Das portugiesische Muster <span className="mono">ter + Partizip</span> sieht identisch aus, bedeutet aber etwas anderes: eine wiederholte oder andauernde Handlung
          (<span className="mono">tenho comido bem</span> = „ich esse in letzter Zeit gut“), kein einzelnes Ereignis in der Vergangenheit. Für ein einmaliges Ereignis — genau das, was das deutsche Perfekt ausdrückt — greift Portugiesisch zur einfachen Vergangenheit (<span className="mono">{v.pt}</span>), nicht zur Verbindung mit ter.
        </Note>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

export default function CompareSection() {
  return (
    <section className="sec">
      <SecHead
        anchor="vergleich"
        num="§8"
        title="German through a Spanish/Portuguese lens"
        sub="Every rule above exists in Spanish and Portuguese too — just built with different parts. Gender survives, case doesn't, and the verb keeps very different manners. Side by side, the real distance is smaller than it feels, and the traps sit exactly where the surface looks most similar."
      />

      <pre className="code" aria-label="What carries over, what doesn't">
        <span className="cm">{"// dieselbe Idee, andere Bauteile — vier Stellen, an denen es zählt\n\n"}</span>
        <span className="kw">Genus</span>{"          Deutsch: 3 Genera, an Artikel + Adjektiv     "}<span className="cm">{"// der/die/das"}</span>{"\n"}
        {"               "}Span./Port.: 2 Genera, an Artikel + Adjektiv{"    "}<span className="cm">{"// el/la · o/a"}</span>{"\n\n"}
        <span className="kw">Objekt</span>{"         Deutsch: Kasus am Artikel (jedes Nomen)         "}<span className="cm">{"// dem Kind, das Buch"}</span>{"\n"}
        {"               "}Span./Port.: Klitikon + „a“, Nomen bleibt gleich{"  "}<span className="cm">{"// le doy el libro"}</span>{"\n\n"}
        <span className="kw">Wortstellung</span>{"   Deutsch: Verb-Klammer — Rest wandert ans Ende     "}<span className="cm">{"// … geschrieben hat"}</span>{"\n"}
        {"               "}Span./Port.: Verb bleibt immer zusammen{"          "}<span className="cm">{"// escribió, escreveu"}</span>{"\n\n"}
        <span className="kw">Perfekt</span>{"        Deutsch: haben ODER sein, je nach Verb          "}<span className="cm">{"// bin gegangen, habe gegessen"}</span>{"\n"}
        {"               "}Span.: immer haber · Port.: meist einfache Vergangenheit{"\n"}
      </pre>

      <GenderCompare />
      <ObjectCompare />
      <WordOrderCompare />
      <PerfectAuxCompare />
    </section>
  );
}
