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
    speaker: "elite2",
    text: "My name is [REDACTED]!\n And people call me-",
  },
  {
    speaker: "elite2",
    text: "One of the Elite 4!",
  },
  {
    speaker: "elite2",
    text: "This world is inhabited by...\n Well no one other than me and this weird guy over here!",
    triggerAction: "WALK_TO_DESK",
  },
  {
    speaker: "elite2",
    text: "He builds apps... \nHe builds websites.",
  },
  {
    speaker: "elite2",
    text: "But most of the time he's\nbusy fixing his PC.",
  },
  {
    speaker: "elite2",
    text: "Let's meet our \"developer\"...\nthis is Kushal!",
    showExclamation: true,
  },
  {
    speaker: "kushal",
    text: "...\nWhy are you disturbing me?\nI'm in the middle of something.",
  },
  {
    speaker: "elite2",
    text: "I can see that.\nStaring at the same screen for 4 hours.",
  },
  {
    speaker: "kushal",
    text: "Four?\nIt's just been 5 minutes since it's boot.",
  },
  {
    speaker: "elite2",
    text: "Well then, I interrupted you\nat the perfect time.",
  },
  {
    speaker: "kushal",
    text: "There is no perfect time.",
  },
  {
    speaker: "elite2",
    text: "You were fixing a bug,\nweren't you?",
  },
  {
    speaker: "kushal",
    text: "I was.\nPC crashed, so rebooting it.",
  },
  {
    speaker: "elite2",
    text: "That's usually how these stories go.",
  },
  {
    speaker: "elite2",
    text: "For some, PROJECTS are companions.\nFor others, puzzles to be solved-",
  },
  {
    speaker: "kushal",
    text: "You're really bad at this aren't you?",
  },
  {
    speaker: "elite2",
    text: "At least I didn't crash my PC.",
  },
  {
    speaker: "kushal",
    text: "You've lost the plot\nabout three dialogues ago.",
  },
  {
    speaker: "elite2",
    text: "Hey-",
  },
  {
    speaker: "kushal",
    text: "At least can I introduce\nmyself properly?",
  },
  {
    speaker: "elite2",
    text: "No that's my jo-",
  },
  {
    speaker: "kushal",
    text: "Anyways\nI'll take over from here.",
  },
  {
    speaker: "kushal",
    text: "Would you like to check out\nmy portfolio?",
    pose: "POINTING",
  },
];

// ── Continue path: one-liner before the PC overlay appears ─────────────────
export const CONTINUE_DIALOGUE = [
  {
    speaker: "kushal",
    text: "1 item was deposited...\njust kidding, welcome back!",
  },
];
