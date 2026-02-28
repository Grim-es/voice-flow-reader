import { spawn, ChildProcess } from "child_process";
import { TtsEngine } from "./types";

export class DarwinTts implements TtsEngine {
  private process: ChildProcess | null = null;

  async speak(text: string, voice: string, speed: number): Promise<void> {
    text = text.trim();
    if (!text) return;

    const rate = Math.round(speed * 200);
    const args: string[] = [];
    if (voice) {
      args.push("-v", voice);
    }
    args.push("-r", String(rate));

    return new Promise<void>((resolve, reject) => {
      const proc = spawn("say", args);
      this.process = proc;

      // Pipe text via stdin to avoid shell-escaping issues
      proc.stdin.write(text);
      proc.stdin.end();

      proc.on("close", (code) => {
        if (this.process === proc) this.process = null;
        if (code === 0) resolve();
        else reject(new Error(`say exited with code ${code}`));
      });

      proc.on("error", (err) => {
        if (this.process === proc) this.process = null;
        reject(err);
      });
    });
  }

  stop(): void {
    if (this.process) {
      this.process.kill();
      this.process = null;
    }
  }

  async getVoices(): Promise<string[]> {
    return new Promise((resolve) => {
      let output = "";
      const proc = spawn("say", ["-v", "?"]);
      proc.stdout.on("data", (d: Buffer) => (output += d.toString()));
      proc.on("close", () => {
        const voices = output
          .split("\n")
          .map((line) => {
            const match = line.match(/^(.+?)\s{2,}/);
            return match ? match[1].trim() : "";
          })
          .filter(Boolean);
        resolve(voices);
      });
      proc.on("error", () => resolve([]));
    });
  }

  dispose(): void {
    this.stop();
  }
}
