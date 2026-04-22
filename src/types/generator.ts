export type GenMode = "image" | "video";
export type AspectRatio = "1:1" | "9:16" | "16:9" | "4:3" | "3:4";
export type GenStyle = "Cinematic" | "Hyper-Real" | "Vibrant" | "Anime" | "3D Render" | "Cyberpunk" | "Oil Painting" | "Noir" | "Pop Art" | "Sketch" | "Double Exposure" | "Concept" | "None";

export interface GenResult {
  type: GenMode;
  url: string;
  prompt: string;
  script?: string;
}

export interface GenStatus {
  loading: boolean;
  progress: number;
  message: string;
}
