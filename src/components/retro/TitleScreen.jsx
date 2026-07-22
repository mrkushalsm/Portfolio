"use client";
/**
 * TitleScreen
 * ─────────────────────────────────────────────────────────────────────────────
 * GBA-style title screen overlaid on top of the 3D room.
 * Phase 1: "PRESS START" blinking → any key/click
 * Phase 2: Save-select menu (NEW GAME, CONTINUE, MYSTERY GIFT, OPTIONS)
 *
 * Props:
 *   hasVisited  — boolean, enables CONTINUE option
 *   onSelect    — (choice: 'new_game' | 'continue' | 'mystery_gift' | 'options') => void
 */

import React, { useState, useEffect, useCallback } from "react";
import { SITE_CONFIG } from "../../config";
import styles from "./retro.module.css";

const MENU_ITEMS = [
  { id: "continue", label: "CONTINUE", alwaysEnabled: false },
  { id: "new_game", label: "NEW GAME", alwaysEnabled: true },
];

const TitleScreen = ({ hasVisited, onSelect }) => {
  // phase: 'splash' | 'menu'
  const [phase, setPhase] = useState("splash");
  const [cursorIndex, setCursorIndex] = useState(0);

  // Available items based on hasVisited flag
  const availableItems = MENU_ITEMS.filter(
    (item) => item.alwaysEnabled || hasVisited
  );

  // ── Advance from splash to menu ────────────────────────────────────────────
  const enterMenu = useCallback(() => {
    setPhase("menu");
  }, []);

  useEffect(() => {
    if (phase !== "splash") return;
    const handleKey = (e) => {
      if (
        e.key === " " ||
        e.key === "Enter" ||
        e.key === "z" ||
        e.key === "Z"
      ) {
        e.preventDefault();
        enterMenu();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [phase, enterMenu]);

  // ── Menu keyboard navigation ───────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "menu") return;

    const handleKey = (e) => {
      if (e.key === "ArrowDown") {
        setCursorIndex((prev) => (prev + 1) % availableItems.length);
      } else if (e.key === "ArrowUp") {
        setCursorIndex(
          (prev) => (prev - 1 + availableItems.length) % availableItems.length
        );
      } else if (e.key === "Enter" || e.key === "z" || e.key === "Z") {
        e.preventDefault();
        onSelect?.(availableItems[cursorIndex].id);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [phase, cursorIndex, availableItems, onSelect]);

  // ── Render: Splash ─────────────────────────────────────────────────────────
  if (phase === "splash") {
    return (
      <div className={styles.titleOverlay} onClick={enterMenu}>
        <div className={styles.gbaTopBar}></div>
        <div className={styles.titleCard} style={{ zIndex: 2 }}>
          <div>
            <p className={styles.titleText}>{SITE_CONFIG.title}</p>
            <p className={styles.titleSubtext}>
              {SITE_CONFIG.subtitle} VERSION 3.0
            </p>
          </div>
          <p className={styles.pressStart}>PRESS START</p>
          <p className={styles.copyright} style={{ color: '#fff', textShadow: '1px 1px 0 #000' }}>
            © {SITE_CONFIG.copyrightYear} {SITE_CONFIG.title}
          </p>
        </div>
        <div className={styles.gbaBottomBar}></div>
      </div>
    );
  }

  // ── Render: Save-select menu ───────────────────────────────────────────────
  return (
    <div className={styles.menuOverlay}>
      <div className={styles.menuLayout}>
        {availableItems.map((item, index) => {
          const isSelected = cursorIndex === index;
          const isContinue = item.id === "continue";

          return (
            <div
              key={item.id}
              className={`${styles.gbaPanelCard} ${
                isSelected ? styles.gbaPanelActive : styles.gbaPanelInactive
              }`}
              onClick={() => onSelect?.(item.id)}
              onMouseEnter={() => setCursorIndex(index)}
            >
              <div className={styles.menuItem}>
                <span
                  className={styles.menuCursor}
                  style={{ visibility: isSelected ? "visible" : "hidden" }}
                >
                  ▶
                </span>
                <span className={isSelected ? styles.gbaTitleBlue : styles.gbaTitleGray}>
                  {item.label}
                </span>
              </div>

              {isContinue && (
                <div
                  className={`${styles.gbaStatsGrid} ${
                    isSelected ? styles.statsBlue : styles.statsGray
                  }`}
                >
                  <span>PLAYER</span>
                  <span>KUSHAL</span>

                  <span>TIME</span>
                  <span>99:59</span>

                  <span>POKéDEX</span>
                  <span>385</span>

                  <span>BADGES</span>
                  <span>8</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TitleScreen;
