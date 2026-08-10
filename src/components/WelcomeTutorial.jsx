// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 Mathias Brunkow Moser

import React from "react";
import {
  IconArrowRight,
  IconBook,
  IconCheckCircle,
  IconClose,
  IconTeacher,
} from "./icons.jsx";

const STEPS = [
  {
    eyebrow: "01 · Verstehen",
    title: "Eine Regel nach der anderen",
    copy: "Der Lernpfad führt dich von A2 bis C1. Jede Lektion erklärt die Regel zuerst an klaren Beispielen.",
    art: "path",
  },
  {
    eyebrow: "02 · Üben",
    title: "Direktes Feedback",
    copy: "Kurze Checkpoints zeigen sofort, was sitzt — und was du noch einmal ansehen solltest.",
    art: "practice",
  },
  {
    eyebrow: "03 · Anwenden",
    title: "Schreiben mit Unterstützung",
    copy: "Wende die Regel in einem eigenen Text an. Frau Müller hilft dir, wenn du nicht weiterkommst.",
    art: "support",
  },
  {
    eyebrow: "04 · KI einrichten",
    title: "Noch ein Schritt für die KI-Hilfe",
    copy: "Für Korrekturen und Frau Müller brauchst du einen eigenen Anthropic API-Key. Du kannst ihn jederzeit in den Einstellungen hinterlegen.",
    art: "api",
  },
  {
    eyebrow: "05 · Loslegen",
    title: "Wie möchtest du lernen?",
    copy: "Folge dem geführten Lernpfad von A2 bis C1 oder erkunde alle Regeln, Drills und Schreibaufgaben frei. Du kannst später jederzeit wechseln.",
    art: "mode",
  },
];

function TutorialArt({ type }) {
  if (type === "mode") {
    return (
      <div className="welcome-art welcome-art-mode" aria-hidden="true">
        <span><b>Lernpfad</b><i>A2 → B1 → B2 → C1</i></span>
        <span><b>Freier Modus</b><i>Alle Bereiche direkt öffnen</i></span>
      </div>
    );
  }

  if (type === "api") {
    return (
      <div className="welcome-art welcome-art-api" aria-hidden="true">
        <span className="welcome-api-label">Anthropic API</span>
        <span className="welcome-api-key"><i>sk-ant-</i>••••••••••••</span>
        <span className="welcome-api-status"><i /> Einrichtung erforderlich</span>
      </div>
    );
  }

  if (type === "practice") {
    return (
      <div className="welcome-art welcome-art-practice" aria-hidden="true">
        <span className="welcome-code"><i>der</i> Hund <b>läuft</b>.</span>
        <span className="welcome-answer"><IconCheckCircle /> Richtig</span>
      </div>
    );
  }

  if (type === "support") {
    return (
      <div className="welcome-art welcome-art-support" aria-hidden="true">
        <span className="welcome-paper"><IconBook /><i /><i /><i /></span>
        <IconArrowRight />
        <span className="welcome-teacher"><IconTeacher /></span>
      </div>
    );
  }

  return (
    <div className="welcome-art welcome-art-path" aria-hidden="true">
      <span><b>A2</b><i /></span>
      <span><b>B1</b><i /></span>
      <span><b>B2</b><i /></span>
      <span><b>C1</b></span>
    </div>
  );
}

export default function WelcomeTutorial({ onClose, onChooseMode }) {
  const [step, setStep] = React.useState(0);
  const dialogRef = React.useRef(null);
  const closeRef = React.useRef(null);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  React.useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="welcome-overlay" role="presentation">
      <section
        ref={dialogRef}
        className="welcome-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        aria-describedby="welcome-copy"
      >
        <button
          ref={closeRef}
          className="welcome-close"
          type="button"
          onClick={onClose}
          aria-label="Einführung überspringen"
          title="Überspringen"
        >
          <IconClose />
        </button>

        <div className="welcome-visual">
          <span className="welcome-brand"><b>Deutsch</b> A2 → C1</span>
          <TutorialArt type={current.art} />
        </div>

        <div className="welcome-content">
          <span className="eyebrow">{current.eyebrow}</span>
          <h1 id="welcome-title">{current.title}</h1>
          <p id="welcome-copy">{current.copy}</p>

          <div className={`welcome-footer${isLast ? " is-choice" : ""}`}>
            <div className="welcome-dots" role="group" aria-label={`Schritt ${step + 1} von ${STEPS.length}`}>
              {STEPS.map((item, index) => (
                <button
                  key={item.eyebrow}
                  type="button"
                  className={index === step ? "is-active" : ""}
                  onClick={() => setStep(index)}
                  aria-label={`Schritt ${index + 1}: ${item.title}`}
                  aria-current={index === step ? "step" : undefined}
                />
              ))}
            </div>

            <div className="welcome-actions">
              {step > 0 && (
                <button className="btn btn-ghost btn-sm" type="button" onClick={() => setStep((n) => n - 1)}>
                  Zurück
                </button>
              )}
              {isLast ? (
                <>
                  <button className="btn btn-ghost btn-sm" type="button" onClick={() => onChooseMode("free")}>
                    Freier Modus
                  </button>
                  <button className="btn btn-sm" type="button" onClick={() => onChooseMode("learning")}>
                    Lernpfad starten
                    <IconArrowRight />
                  </button>
                </>
              ) : (
                <button className="btn btn-sm" type="button" onClick={() => setStep((n) => n + 1)}>
                  Weiter
                  <IconArrowRight />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
