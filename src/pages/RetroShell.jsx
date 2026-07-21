"use client";
/**
 * RetroShell — main orchestrator
 * ─────────────────────────────────────────────────────────────────────────────
 * State machine:
 *   'title'      → PRESS START; 3D room orbits in background
 *   'dialogue'   → (New Game) Prof Oak intro; room visible at bed camera
 *   'cutscene'   → camera flies bed → PC; skippable
 *   'pc_locked'  → desktop overlay visible; camera locked
 *   'exploring'  → FPS mode: PointerLock + WASD + crosshair
 *
 * Exit from PC:
 *   The desktop portfolio's Shutdown button → router.push('/?from=shutdown')
 *   RetroShell catches that URL param and starts in 'exploring' mode directly.
 *
 * Continue path: skips dialogue + cutscene, goes straight to pc_locked.
 */

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { SITE_CONFIG } from "../config";
import { INTRO_DIALOGUE, CONTINUE_DIALOGUE, MYSTERY_GIFT_DIALOGUE } from "../content/dialogue";
import TitleScreen from "../components/retro/TitleScreen";
import DialogueBox from "../components/retro/DialogueBox";
import styles from "../components/retro/retro.module.css";

// Dynamic imports — Canvas/Three.js must not run server-side
const RoomScene = dynamic(() => import("../components/retro/RoomScene"), { ssr: false });
const ComputerOverlay = dynamic(() => import("../components/retro/ComputerOverlay"), { ssr: false });

const VISITED_KEY = "retro_shell_visited";

// ─────────────────────────────────────────────────────────────────────────────
// Options modal
// ─────────────────────────────────────────────────────────────────────────────
const OptionsModal = ({ currentThemeId, onThemeChange, onClose }) => (
  <div className={styles.modal}>
    <div className={styles.modalBox}>
      <p className={styles.modalTitle}>─ OPTIONS ─</p>
      <p className={styles.modalText}>THEME:</p>
      <div className={styles.themeRow}>
        {SITE_CONFIG.themes.map((theme) => (
          <button
            key={theme.id}
            className={theme.id === currentThemeId ? styles.themeSwatchActive : styles.themeSwatch}
            style={{
              background:  theme.vars["--retro-bg"],
              color:       theme.vars["--retro-text"],
              borderColor: theme.id === currentThemeId
                ? theme.vars["--retro-accent"]
                : theme.vars["--retro-border"],
            }}
            onClick={() => onThemeChange(theme)}
          >
            {theme.name}
          </button>
        ))}
      </div>
      <button className={styles.modalClose} onClick={onClose}>▶ CLOSE</button>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Mystery Gift modal
// ─────────────────────────────────────────────────────────────────────────────
const MysteryGiftModal = ({ onClose }) => (
  <div className={styles.modal}>
    <div className={styles.modalBox}>
      <p className={styles.modalTitle}>✉ MYSTERY GIFT</p>
      <p className={styles.modalText}>{MYSTERY_GIFT_DIALOGUE.join("\n\n")}</p>
      <a
        className={styles.modalButton}
        href="/C/Users/Kushal/Documents/Resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
      >
        ▶ VIEW RÉSUMÉ
      </a>
      <button className={styles.modalButton} style={{ marginTop: 8 }} onClick={onClose}>
        ▶ CLOSE
      </button>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Crosshair — shown in FPS exploring mode
// ─────────────────────────────────────────────────────────────────────────────
const Crosshair = () => (
  <div
    style={{
      pointerEvents: "none",
      position: "fixed",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 40,
    }}
  >
    <div style={{ width: 6, height: 6, background: "white", borderRadius: "50%", opacity: 0.7 }} />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
const RetroShell = () => {
  // If navigated from shutdown, skip title and enter FPS mode immediately
  const isFromShutdown =
    typeof window !== "undefined" && window.location.search.includes("from=shutdown");

  const [gameState, setGameState]   = useState(isFromShutdown ? "exploring" : "title");
  const [isContinuePath, setIsContinuePath] = useState(false);
  const [hasVisited, setHasVisited] = useState(false);
  const [showModal, setShowModal]   = useState(null); // 'options' | 'mystery_gift' | null
  const [theme, setTheme]           = useState(SITE_CONFIG.themes[0]);

  // ── Read visited flag + clean up URL ────────────────────────────────────
  useEffect(() => {
    try { setHasVisited(!!localStorage.getItem(VISITED_KEY)); } catch {}
    if (isFromShutdown) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Listen for Shutdown from iframe ────────────────────────────────────────
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === "RETRO_SHUTDOWN") {
        setGameState("exploring");
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // ── Apply theme CSS vars inline ──────────────────────────────────────────
  const themeStyle = Object.fromEntries(Object.entries(theme.vars));

  // ── Menu selection ───────────────────────────────────────────────────────
  const handleMenuSelect = useCallback((choice) => {
    if (choice === "new_game") {
      setIsContinuePath(false);
      setGameState("dialogue");
    } else if (choice === "continue") {
      setIsContinuePath(true);
      setGameState("pc_locked");
      try { localStorage.setItem(VISITED_KEY, "1"); } catch {}
    } else if (choice === "mystery_gift") {
      setShowModal("mystery_gift");
    } else if (choice === "options") {
      setShowModal("options");
    }
  }, []);

  // ── Dialogue complete → cutscene ─────────────────────────────────────────
  const handleDialogueComplete = useCallback(() => {
    setGameState("cutscene");
  }, []);

  // ── Cutscene complete → pc_locked ────────────────────────────────────────
  const handleCutsceneComplete = useCallback(() => {
    setGameState("pc_locked");
    try { localStorage.setItem(VISITED_KEY, "1"); } catch {}
    setHasVisited(true);
  }, []);

  return (
    <div className={`retro-ui ${styles.shell}`} style={themeStyle}>

      {/* ── 3D Canvas (always mounted after initial load) ──────────────── */}
      <div className={styles.canvasWrapper}>
        <RoomScene
          gameState={gameState}
          onCutsceneComplete={handleCutsceneComplete}
          onInteractComputer={() => setGameState("cutscene")}
        />
      </div>

      {/* ── Title Screen ────────────────────────────────────────────────── */}
      {gameState === "title" && (
        <TitleScreen hasVisited={hasVisited} onSelect={handleMenuSelect} />
      )}

      {/* ── Intro Dialogue (New Game) ────────────────────────────────────── */}
      {gameState === "dialogue" && (
        <DialogueBox
          lines={INTRO_DIALOGUE}
          onComplete={handleDialogueComplete}
          onSkip={handleDialogueComplete}
        />
      )}

      {/* ── Cutscene SKIP button ─────────────────────────────────────────── */}
      {gameState === "cutscene" && (
        <button
          className={styles.cutsceneSkip}
          onClick={handleCutsceneComplete}
        >
          SKIP <span className={styles.skipArrow}>▶</span>
        </button>
      )}

      {/* ── Continue path: one-liner mini-dialogue before overlay ─────────── */}
      {gameState === "pc_locked" && isContinuePath && (
        <DialogueBox
          lines={CONTINUE_DIALOGUE}
          onComplete={() => setIsContinuePath(false)}
          onSkip={() => setIsContinuePath(false)}
        />
      )}

      {/* ── Desktop Portfolio Overlay ────────────────────────────────────── */}
      {gameState === "pc_locked" && !isContinuePath && (
        <ComputerOverlay isContinue={false} />
      )}

      {/* ── FPS Crosshair (exploring mode) ───────────────────────────────── */}
      {gameState === "exploring" && <Crosshair />}

      {/* ── FPS tip: click to lock pointer ───────────────────────────────── */}
      {gameState === "exploring" && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "var(--font-press-start), monospace",
            fontSize: "clamp(8px, 1vw, 12px)",
            color: "#2860d8",
            background: "#f8f8f8",
            border: "3px solid #7090b8",
            borderRadius: "16px",
            boxShadow: "0 0 0 2px #383838, inset 0 0 0 2px #383838, 0 8px 16px rgba(0,0,0,0.4)",
            padding: "10px 20px",
            letterSpacing: 1,
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          CLICK TO LOOK <span className={styles.dialogueBall}>●</span> WASD TO MOVE <span className={styles.dialogueBall}>●</span> ESC TO RELEASE
        </div>
      )}

      {/* ── Modals ──────────────────────────────────────────────────────── */}
      {showModal === "options" && (
        <OptionsModal
          currentThemeId={theme.id}
          onThemeChange={(t) => setTheme(t)}
          onClose={() => setShowModal(null)}
        />
      )}
      {showModal === "mystery_gift" && (
        <MysteryGiftModal onClose={() => setShowModal(null)} />
      )}
    </div>
  );
};

export default RetroShell;
