export type GenMode = "image" | "video";
export type AspectRatio = "1:1" | "9:16" | "16:9" | "4:3" | "3:4";
export type GenStyle = "Cinematic" | "Hyper-Real" | "Macro" | "Concept" | "None";

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
