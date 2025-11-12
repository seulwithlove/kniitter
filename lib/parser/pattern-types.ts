// Project Card Color System for Knit Pattern Reader
// Simple color palette to visually differentiate projects

export interface ProjectColor {
  name: string;
  bg: string;
  bgDark: string;
  text: string;
  textDark: string;
}

// Array of colors to cycle through for projects
export const PROJECT_COLORS: ProjectColor[] = [
  {
    name: "blue",
    bg: "#ADD8E6",
    bgDark: "#5B9BB3",
    text: "#1e5a7a",
    textDark: "#b3d9e9",
  },
  {
    name: "purple",
    bg: "#DA70D6",
    bgDark: "#9B4D9F",
    text: "#7a3e7e",
    textDark: "#e0a3e4",
  },
  {
    name: "orange",
    bg: "#FF8C42",
    bgDark: "#CC6F35",
    text: "#b85e1e",
    textDark: "#ffb380",
  },
  {
    name: "pink",
    bg: "#E6B3E6",
    bgDark: "#B889B8",
    text: "#a65ea6",
    textDark: "#f0d0f0",
  },
  {
    name: "mint",
    bg: "#B2E8D8",
    bgDark: "#7FB8A8",
    text: "#4a9b85",
    textDark: "#c0f0e0",
  },
  {
    name: "beige",
    bg: "#F5E6D3",
    bgDark: "#C4B6A4",
    text: "#8a7a64",
    textDark: "#f0e8dc",
  },
];

// Get color for a project based on its ID (cycles through colors)
export function getProjectColor(projectId: number): ProjectColor {
  return PROJECT_COLORS[projectId % PROJECT_COLORS.length];
}
