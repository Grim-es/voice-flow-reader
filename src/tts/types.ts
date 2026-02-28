export interface TtsEngine {
  speak(text: string, voice: string, speed: number): Promise<void>;
  stop(): void;
  getVoices(): Promise<string[]>;
  dispose(): void;
}
