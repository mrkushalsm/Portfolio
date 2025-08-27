// Color extraction utility for generating gradients from images
export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
}

// Predefined color palettes for each project based on their images
// These are manually curated to match the neutral-900 theme of the about page
export const projectColorPalettes: ColorPalette[] = [
  // Weather App - Subtle blue/gray tones
  {
    primary: "#0f172a", // slate-900
    secondary: "#1e293b", // slate-800
    accent: "#334155", // slate-700
    gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)"
  },
  // Portfolio Website - Dark gray/neutral tones
  {
    primary: "#171717", // neutral-900
    secondary: "#262626", // neutral-800
    accent: "#404040", // neutral-700
    gradient: "linear-gradient(135deg, #171717 0%, #262626 50%, #404040 100%)"
  },
  // Armed Forces Welfare Management System - Dark green/gray tones
  {
    primary: "#c2410c", // Darker orange (orange-700)
    secondary: "#166534", // Darker green (green-800)
    accent: "#6b7280", // Dark gray instead of white
    gradient: "linear-gradient(135deg, #c2410c 0%, #166534 50%, #6b7280 100%)"
  },
  // Smart Attendance Tracker App - Dark red/gray tones
  {
    primary: "#0f0f23", // Very dark blue-gray
    secondary: "#1a1a2e", // Dark blue-gray
    accent: "#16213e", // Muted blue-gray
    gradient: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)"
  },
  // Mangalore Bus Routes Finder - Dark indigo/gray tones
  {
    primary: "#0369a1", // Darker blue (sky-700)
    secondary: "#1e40af", // Darker blue (blue-800)
    accent: "#334155", // Dark slate instead of bright blue
    gradient: "linear-gradient(135deg, #0369a1 10%, #1e40af 50%, #334155 100%)"
  },
  // Earn Easy - Dark brown/gray tones
  {
    primary: "#1c1917", // stone-900
    secondary: "#292524", // stone-800
    accent: "#44403c", // stone-700
    gradient: "linear-gradient(135deg, #1c1917 0%, #292524 50%, #44403c 100%)"
  }
];

// Fallback gradients if we need more projects - all dark and neutral
export const fallbackGradients: string[] = [
  "linear-gradient(135deg, #374151 0%, #4b5563 50%, #6b7280 100%)", // Gray
  "linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%)", // Darker gray
  "linear-gradient(135deg, #111827 0%, #1f2937 50%, #374151 100%)", // Very dark gray
];

export function getProjectGradient(index: number): string {
  if (index < projectColorPalettes.length) {
    return projectColorPalettes[index].gradient;
  }
  return fallbackGradients[index % fallbackGradients.length];
}

export function getProjectColors(index: number): ColorPalette {
  if (index < projectColorPalettes.length) {
    return projectColorPalettes[index];
  }
  // Return a fallback palette
  return {
    primary: "#374151",
    secondary: "#6b7280", 
    accent: "#9ca3af",
    gradient: fallbackGradients[index % fallbackGradients.length]
  };
}
