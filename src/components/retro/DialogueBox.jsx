"use client";
/**
 * DialogueBox
 * ─────────────────────────────────────────────────────────────────────────────
 * Classic Pokémon-style dialogue box anchored to the bottom of the screen.
 * - Typewriter effect (configurable speed)
 * - Click/Space/Enter → skip typing → advance line → call onComplete
 * - Whole sequence can be dismissed with "SKIP" button
 */

import React, { useState, useEffect, useCallback } from "react";
import styles from "./retro.module.css";

const CHAR_DELAY_MS = 28; // Milliseconds per character

const DialogueBox = ({ lines = [], onComplete, onSkip }) => {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDone, setIsDone] = useState(false); // current line fully typed

  const fullText = lines[lineIndex] ?? "";

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

  // ── Reset when lines change ────────────────────────────────────────────────
  useEffect(() => {
    setDisplayed("");
    setCharIndex(0);
    setIsDone(false);
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
