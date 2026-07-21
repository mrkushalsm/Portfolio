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
  { id: "new_game", label: "NEW GAME", alwaysEnabled: true },
  { id: "continue", label: "CONTINUE", alwaysEnabled: false },
  { id: "mystery_gift", label: "MYSTERY GIFT", alwaysEnabled: true },
  { id: "options", label: "OPTIONS", alwaysEnabled: true },
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
        <div className={styles.titleCard}>
          <div>
            <p className={styles.titleText}>{SITE_CONFIG.title}</p>
            <p className={styles.titleSubtext}>{SITE_CONFIG.subtitle}</p>
          </div>
          <p className={styles.pressStart}>▶ PRESS START ◀</p>
          <p className={styles.copyright}>
            © {SITE_CONFIG.copyrightYear} {SITE_CONFIG.title}
          </p>
        </div>
      </div>
    );
  }

  // ── Render: Save-select menu ───────────────────────────────────────────────
  return (
    <div className={styles.titleOverlay}>
      <div className={styles.titleCard}>
        {/* Small title above menu */}
        <p
          className={styles.titleSubtext}
          style={{ marginBottom: 0, letterSpacing: "4px" }}
        >
          {SITE_CONFIG.title}
        </p>

        <div className={styles.menuBox}>
          <p className={styles.menuTitle}>— SELECT —</p>
          <ul className={styles.menuList}>
            {availableItems.map((item, i) => {
              const isDisabled = !item.alwaysEnabled && !hasVisited;
              return (
                <li
                  key={item.id}
                  className={
                    isDisabled ? styles.menuItemDisabled : styles.menuItem
                  }
                  onClick={() => !isDisabled && onSelect?.(item.id)}
                  onMouseEnter={() => !isDisabled && setCursorIndex(i)}
                >
                  {cursorIndex === i && !isDisabled && (
                    <span className={styles.menuCursor}>▶</span>
                  )}
                  {item.label}
                </li>
              );
            })}
          </ul>
          <p className={styles.copyright} style={{ marginTop: 16 }}>
            © {SITE_CONFIG.copyrightYear} {SITE_CONFIG.title}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TitleScreen;
