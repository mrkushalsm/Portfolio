"use client";
/**
 * ComputerOverlay
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders the existing desktop portfolio inside a fixed overlay aligned to the
 * monitor screen in the 3D scene.
 *
 * There is NO "Back to Room" button — exit is handled by the desktop portfolio's
 * own Shutdown option (which navigates to /?from=shutdown, caught by RetroShell).
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  CALIBRATION — adjust the four constants below to align with the monitor  │
 * │  Camera locked at: PC_POS = { x: -3.60, y: 0.32, z: -1.907 }           │
 * │                                                                          │
 * │  From the screenshot, the monitor's cyan-outlined CRT face sits in the   │
 * │  right-center of the viewport. These values are the starting calibration. │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ═══════════════════════════════════════════════════════════════════════════
// CALIBRATION CONSTANTS — adjust these to fit inside the monitor's black screen
// Camera: PC_POS = { x: -4.337, y: 0.320, z: -1.907 }, FOV: 65
// ═══════════════════════════════════════════════════════════════════════════
const OVERLAY_LEFT   = "1%";
const OVERLAY_TOP    = "1%";
const OVERLAY_WIDTH  = "98%";
const OVERLAY_HEIGHT = "98%";

import React, { useEffect } from "react";

/**
 * Props:
 *   isContinue — if true, play a boot chime when mounted
 */
const ComputerOverlay = ({ isContinue }) => {
  // ── Synthesised PC-boot chime (Continue path) ────────────────────────────
  useEffect(() => {
    if (!isContinue) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const playBeep = (freq, startTime, duration, vol = 0.2) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(vol, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      playBeep(261.6, ctx.currentTime,        0.15);
      playBeep(329.6, ctx.currentTime + 0.17, 0.15);
      playBeep(392.0, ctx.currentTime + 0.34, 0.25);
    } catch {
      // Web Audio not available
    }
  }, [isContinue]);

  return (
    <div
      style={{
        position: "fixed",
        left:   OVERLAY_LEFT,
        top:    OVERLAY_TOP,
        width:  OVERLAY_WIDTH,
        height: OVERLAY_HEIGHT,
        zIndex: 30,
        overflow: "hidden",
        borderRadius: "2px",
        // Inset shadow reinforces depth / monitor depth illusion
        boxShadow: "inset 0 0 24px rgba(0,0,0,0.5), 0 0 0 2px rgba(0,0,0,0.8)",
      }}
    >
      {/* Desktop portfolio iframe — runs /boot which then goes to /desktop */}
      <iframe
        src="/boot"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          position: "relative",
        }}
        title="Portfolio Desktop"
      />

      {/* Subtle CRT scanline overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 3px)",
          pointerEvents: "none",
          zIndex: 50,
        }}
      />
    </div>
  );
};

export default ComputerOverlay;
