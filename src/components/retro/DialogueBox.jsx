"use client";
/**
 * DialogueBox
 * ─────────────────────────────────────────────────────────────────────────────
 * Classic Pokémon-style dialogue box anchored to the bottom of the screen.
 * - Supports speaker-based dialogue objects: { text, speaker }
 * - Shows speaker portrait above the box (left for elite2, right for kushal)
 * - Typewriter effect (configurable speed)
 * - Click/Space/Enter → skip typing → advance line → call onComplete
 * - Whole sequence can be dismissed with "SKIP" button
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import styles from "./retro.module.css";
import { SPEAKER_SPRITES } from "../../content/dialogue";

const CHAR_DELAY_MS = 28; // Milliseconds per character

const DialogueBox = ({ lines = [], onComplete, onSkip, onLineChange }) => {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDone, setIsDone] = useState(false); // current line fully typed
  const [portraitVisible, setPortraitVisible] = useState(false);
  const prevSpeakerRef = useRef(null);

  // Normalise each line — support both plain strings and speaker objects
  const normaliseLine = (line) =>
    typeof line === "string" ? { text: line, speaker: null } : line;

  const currentLine = normaliseLine(lines[lineIndex] ?? "");
  const fullText = currentLine.text ?? "";
  const speaker = currentLine.speaker ?? null;
  const portraitSrc = speaker ? SPEAKER_SPRITES[speaker] ?? null : null;
  // Determine which side the portrait sits on
  const portraitSide = speaker === "kushal" ? "right" : "left";

  // ── Portrait slide-in animation when speaker changes ────────────────────────
  useEffect(() => {
    if (speaker !== prevSpeakerRef.current) {
      setPortraitVisible(false);
      const timer = setTimeout(() => setPortraitVisible(true), 80);
      prevSpeakerRef.current = speaker;
      return () => clearTimeout(timer);
    } else {
      setPortraitVisible(true);
    }
  }, [speaker]);

  // ── Typewriter tick ────────────────────────────────────────────────────────
  useEffect(() => {
    if (charIndex >= fullText.length) {
      setIsDone(true);
      return;
    }
    setIsDone(false);
    const timer = setTimeout(() => {
      setDisplayed((prev) => prev + fullText[charIndex]);
      setCharIndex((prev) => prev + 1);
    }, CHAR_DELAY_MS);
    return () => clearTimeout(timer);
  }, [charIndex, fullText]);

  // ── Reset when line index changes ─────────────────────────────────────────
  useEffect(() => {
    setDisplayed("");
    setCharIndex(0);
    setIsDone(false);
    onLineChange?.(lineIndex, currentLine);
  }, [lineIndex]);

  // ── Advance handler ────────────────────────────────────────────────────────
  const handleAdvance = useCallback(() => {
    if (!isDone) {
      // Skip typing — jump to end of current line
      setDisplayed(fullText);
      setCharIndex(fullText.length);
    } else if (lineIndex < lines.length - 1) {
      // Move to next line
      setLineIndex((prev) => prev + 1);
    } else {
      // All lines done
      onComplete?.();
    }
  }, [isDone, fullText, lineIndex, lines.length, onComplete]);

  // ── Keyboard listener ──────────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === " " || e.key === "Enter" || e.key === "z" || e.key === "Z") {
        e.preventDefault();
        handleAdvance();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleAdvance]);

  return (
    <div className={styles.dialogueOverlay}>
      {/* ── Speaker Portrait ──────────────────────────────────────────────── */}
      {portraitSrc && (
        <div
          className={[
            styles.speakerPortraitContainer,
            portraitSide === "right"
              ? styles.speakerPortraitRight
              : styles.speakerPortraitLeft,
            portraitVisible ? styles.speakerPortraitVisible : "",
          ].join(" ")}
        >
          <img
            src={portraitSrc}
            alt={speaker}
            className={styles.speakerPortrait}
            draggable={false}
          />
        </div>
      )}

      {/* ── Dialogue Box ──────────────────────────────────────────────────── */}
      <div className={styles.dialogueBox} onClick={handleAdvance}>
        <p className={styles.dialogueText}>
          {displayed}{isDone && lineIndex < lines.length - 1 && <span className={styles.dialogueArrow}> ▼</span>}{isDone && lineIndex === lines.length - 1 && <span className={styles.dialogueArrow}> ■</span>}
        </p>
        <button
          className={styles.dialogueSkip}
          onClick={(e) => {
            e.stopPropagation();
            onSkip?.();
          }}
        >
          SKIP <span className={styles.skipArrow}>▶</span>
        </button>
      </div>
    </div>
  );
};

export default DialogueBox;
