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
import { INTRO_DIALOGUE, CONTINUE_DIALOGUE } from "../content/dialogue";
import TitleScreen from "../components/retro/TitleScreen";
import DialogueBox from "../components/retro/DialogueBox";
import styles from "../components/retro/retro.module.css";

import ComputerOverlay from "../components/retro/ComputerOverlay";
const RoomScene = dynamic(() => import("../components/retro/RoomScene"), { ssr: false });

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
// Path Recorder UI (On-Screen Controller & JSON Exporter)
// ─────────────────────────────────────────────────────────────────────────────
const PathRecorderUI = () => {
  const [recording, setRecording] = useState(false);
  const [keyframes, setKeyframes] = useState([]);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    let interval = null;
    if (recording) {
      interval = setInterval(() => {
        if (typeof window !== "undefined" && window.__RECORD_CAM__) {
          const frame = window.__RECORD_CAM__();
          if (frame) {
            setKeyframes((prev) => [...prev, frame]);
          }
        }
      }, 150);
    }
    return () => clearInterval(interval);
  }, [recording]);

  const handleStart = () => {
    setKeyframes([]);
    setShowResult(false);
    setRecording(true);
  };

  const handleStop = () => {
    setRecording(false);
    setShowResult(true);
  };

  return (
    <div style={{ position: "fixed", top: 16, left: 16, zIndex: 99999, pointerEvents: "auto" }}>
      {!recording ? (
        <button
          onClick={handleStart}
          style={{
            background: "#e53e3e",
            color: "#fff",
            padding: "10px 16px",
            fontSize: "12px",
            fontWeight: "bold",
            borderRadius: "6px",
            border: "2px solid #fff",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
            fontFamily: "monospace",
          }}
        >
          🔴 START RECORDING PATH
        </button>
      ) : (
        <button
          onClick={handleStop}
          style={{
            background: "#dd6b20",
            color: "#fff",
            padding: "10px 16px",
            fontSize: "12px",
            fontWeight: "bold",
            borderRadius: "6px",
            border: "2px solid #fff",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
            fontFamily: "monospace",
          }}
        >
          ⏹️ STOP RECORDING ({keyframes.length} frames)
        </button>
      )}

      {showResult && (
        <div
          style={{
            marginTop: 10,
            background: "#1a202c",
            color: "#4ade80",
            padding: 14,
            borderRadius: 8,
            width: 340,
            boxShadow: "0 10px 25px rgba(0,0,0,0.8)",
            border: "1px solid #4a5568",
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: 6, color: "#fff", fontSize: "12px", fontFamily: "monospace" }}>
            📋 RECORDED PATH ({keyframes.length} frames):
          </div>
          <textarea
            readOnly
            rows={8}
            style={{
              width: "100%",
              background: "#0d1117",
              color: "#4ade80",
              fontFamily: "monospace",
              fontSize: "10px",
              padding: 6,
              borderRadius: 4,
              border: "1px solid #30363d",
              resize: "vertical",
            }}
            value={JSON.stringify(keyframes, null, 2)}
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(keyframes, null, 2));
              alert("Copied path JSON to clipboard!");
            }}
            style={{
              marginTop: 6,
              width: "100%",
              background: "#3182ce",
              color: "#fff",
              padding: "8px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "12px",
            }}
          >
            📋 COPY JSON TO CLIPBOARD
          </button>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
const RetroShell = () => {
  // If navigated from shutdown, skip title and enter FPS mode immediately
  const isFromShutdown =
    typeof window !== "undefined" && window.location.search.includes("from=shutdown");

  const [gameState, setGameState]   = useState(isFromShutdown ? "exploring" : "title");
  const [introPhase, setIntroPhase] = useState("START"); // 'START' | 'WALKING' | 'AT_DESK'
  const [kushalPose, setKushalPose] = useState("IDLE"); // 'IDLE' | 'TALKING' | 'POINTING'
  const [showExclamation, setShowExclamation] = useState(false);
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
      setIntroPhase("START");
      setKushalPose("IDLE");
      setShowExclamation(false);
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

  // ── Track dialogue line advancement ──────────────────────────────────────
  const handleLineChange = useCallback((lineIdx, currentLine) => {
    if (currentLine?.triggerAction === "WALK_TO_DESK") {
      setIntroPhase("WALKING");
    }

    if (currentLine?.showExclamation) {
      setShowExclamation(true);
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.12);
      } catch {}
    } else {
      setShowExclamation(false);
    }

    if (currentLine?.pose) {
      setKushalPose(currentLine.pose);
    } else if (currentLine?.speaker === "kushal") {
      setKushalPose("TALKING");
    }
  }, []);

  // ── Dialogue complete → cutscene ─────────────────────────────────────────
  const handleDialogueComplete = useCallback(() => {
    setKushalPose("IDLE"); // Return back to monitor position naturally!
    setShowExclamation(false);
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
          introPhase={introPhase}
          kushalPose={kushalPose}
          showExclamation={showExclamation}
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
          onLineChange={handleLineChange}
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
