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
  
  // Find index of 'continue' if it exists, to render its cursor
  const continueIndex = availableItems.findIndex(i => i.id === "continue");
  // Find other items
  const otherItems = availableItems.filter(i => i.id !== "continue");
  
  return (
    <div className={styles.menuOverlay}>
      <div className={styles.menuLayout}>
        {/* CONTINUE Panel (White) - Only if hasVisited */}
        {hasVisited && (
          <div className={styles.gbaPanelWhite}>
            <div 
              className={`${styles.menuItem} ${cursorIndex === continueIndex ? styles.menuItemHover : ''}`}
              onClick={() => onSelect?.("continue")}
              onMouseEnter={() => setCursorIndex(continueIndex)}
            >
              <span 
                className={styles.menuCursor} 
                style={{ visibility: cursorIndex === continueIndex ? 'visible' : 'hidden' }}
              >
                ▶
              </span>
              <span className={styles.gbaTitleBlue}>CONTINUE</span>
            </div>
            
            <div className={styles.gbaStatsGrid}>
              <span>PLAYER</span>
              <span>KUSHAL</span>
              
              <span>TIME</span>
              <span>99:59</span>
              
              <span>POKéDEX</span>
              <span>385</span>
              
              <span>BADGES</span>
              <span>8</span>
            </div>
          </div>
        )}

        {/* OTHER OPTIONS Panel (Gray) */}
        <div className={styles.gbaPanelGray}>
          <ul className={styles.menuList}>
            {otherItems.map((item) => {
              // Find its global index for cursor tracking
              const globalIndex = availableItems.findIndex(i => i.id === item.id);
              return (
                <li
                  key={item.id}
                  className={`${styles.menuItem} ${cursorIndex === globalIndex ? styles.menuItemHover : ''}`}
                  onClick={() => onSelect?.(item.id)}
                  onMouseEnter={() => setCursorIndex(globalIndex)}
                >
                  <span 
                    className={styles.menuCursor} 
                    style={{ visibility: cursorIndex === globalIndex ? 'visible' : 'hidden' }}
                  >
                    ▶
                  </span>
                  {item.label}
                </li>
              );
            })}
          </ul>
        </div>
        
      </div>
    </div>
  );
};

export default TitleScreen;
