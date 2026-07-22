/**
 * Dialogue Content
 * ─────────────────────────────────────────────────────────────────────────────
 * Edit this file to change any on-screen text.
 * Each entry is an object with:
 *   text    — The dialogue string (use "\n" for line breaks).
 *   speaker — "elite2" | "kushal" | null (no portrait)
 *
 * SPEAKER_SPRITES maps each speaker ID to their portrait image path.
 */

// ── Speaker Sprite Mapping ─────────────────────────────────────────────────
export const SPEAKER_SPRITES = {
  elite2: "/assets/sprites/elite2/sprite_0000.png",
  kushal: "/assets/sprites/kushal/sprite_0000.png",
};

// ── New Game: Intro — back-and-forth between the Prof and Kushal ───────────
export const INTRO_DIALOGUE = [
  {
    speaker: "elite2",
    text: "Hello there!\nWelcome to my world!",
  },
  {
    speaker: "kushal",
    text: "...\nWhy are you disturbing me?",
  },
  {
    speaker: "elite2",
    text: "My name is [REDACTED]!\nPeople call me the Portfolio Prof!",
  },
  {
    speaker: "kushal",
    text: "I was literally in the middle\nof something important.",
  },
  {
    speaker: "elite2",
    text: "This world is inhabited by creators\ncalled DEVELOPERS!",
  },
  {
    speaker: "kushal",
    text: "Yes, I know. I AM one.\nCan we please get to the point?",
  },
  {
    speaker: "elite2",
    text: "For some, PROJECTS are companions.\nFor others, puzzles to be solved.",
  },
  {
    speaker: "elite2",
    text: "Your very own PORTFOLIO legend\nis about to unfold!",
  },
  {
    speaker: "kushal",
    text: "Fine. Fine.\nLet's just get this over with.",
  },
];

// ── Continue path: one-liner before the PC overlay appears ─────────────────
export const CONTINUE_DIALOGUE = [
  {
    speaker: "kushal",
    text: "1 item was deposited...\njust kidding, welcome back!",
  },
];

// ── Mystery Gift path ──────────────────────────────────────────────────────
export const MYSTERY_GIFT_DIALOGUE = [
  "You received a Mystery Gift!",
  "Check back later for more updates.",
];
