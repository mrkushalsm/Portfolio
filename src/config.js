/**
 * Site Configuration
 * ─────────────────────────────────────────────────────────────────────────────
 * Edit this file to customise the shell's content and appearance.
 * All editable content lives here — nothing is hardcoded in components.
 */

export const SITE_CONFIG = {
  title: "KUSHAL SM",
  subtitle: "PORTFOLIO",
  copyrightYear: new Date().getFullYear(),

  // Reserved — will be used by the NES → friend's-portfolio redirect (next pass)
  friendPortfolioUrl: "",

  /**
   * Retro UI Theme Palettes
   * ─────────────────────────────────────────────────────────────────────────
   * Each theme exposes CSS custom-property overrides applied on the
   * `.retro-ui` root wrapper. Only retro UI elements consume these vars;
   * the desktop portfolio keeps its own Tailwind/DaisyUI styles.
   */
  themes: [
    {
      id: "default",
      name: "DEFAULT",
      vars: {
        "--retro-bg": "#000000",
        "--retro-text": "#ffffff",
        "--retro-border": "#cccccc",
        "--retro-accent": "#ffff00",
        "--retro-muted": "#888888",
        "--retro-cursor": "#ffffff",
        "--retro-overlay-bg": "rgba(0,0,0,0.75)",
        "--retro-box-bg": "rgba(0,0,0,0.92)",
      },
    },
    {
      id: "gba",
      name: "GBA",
      vars: {
        "--retro-bg": "#081820",
        "--retro-text": "#88c070",
        "--retro-border": "#346856",
        "--retro-accent": "#c8a850",
        "--retro-muted": "#4a7850",
        "--retro-cursor": "#e8d8a0",
        "--retro-overlay-bg": "rgba(8,24,32,0.82)",
        "--retro-box-bg": "rgba(8,24,32,0.96)",
      },
    },
    {
      id: "gbc",
      name: "GBC",
      vars: {
        "--retro-bg": "#1a1c2c",
        "--retro-text": "#c0cbdc",
        "--retro-border": "#5a6988",
        "--retro-accent": "#8fbcbb",
        "--retro-muted": "#454976",
        "--retro-cursor": "#f07070",
        "--retro-overlay-bg": "rgba(26,28,44,0.82)",
        "--retro-box-bg": "rgba(26,28,44,0.96)",
      },
    },
  ],
};
