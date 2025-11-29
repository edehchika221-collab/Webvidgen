export enum VideoStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING', // Simulating scraping
  GENERATING = 'GENERATING', // Calling Veo
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface GeneratedVideo {
  id: string;
  url: string;
  videoUrl: string | null;
  audioUrl?: string | null; // For voiceover
  script?: string;          // The generated script
  timestamp: number;
  duration?: number;        // Duration in seconds
  status: VideoStatus;
  aspectRatio: '16:9' | '9:16';
  promptUsed: string;
}

export interface VideoConfig {
  aspectRatio: '16:9' | '9:16';
  style: 'modern' | 'cinematic' | 'minimalist';
}

export interface ScrapedData {
  title: string;
  colors: string[];
  description: string;
}

export const VOICE_OPTIONS = ['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'] as const;
export type VoiceOption = typeof VOICE_OPTIONS[number];

export const LANGUAGE_OPTIONS = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Hindi', 'Portuguese'] as const;
export type LanguageOption = typeof LANGUAGE_OPTIONS[number];