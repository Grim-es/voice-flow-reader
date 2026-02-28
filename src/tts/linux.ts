import { spawn, execFile, ChildProcess } from "child_process";
import { TtsEngine } from "./types";

type LinuxCmd = "espeak-ng" | "espeak" | "spd-say";

export class LinuxTts implements TtsEngine {
  private process: ChildProcess | null = null;
  private command: LinuxCmd | null = null;
  private detected = false;

  private async detect(): Promise<LinuxCmd> {
    if (this.command) return this.command;

    for (const cmd of ["espeak-ng", "espeak", "spd-say"] as LinuxCmd[]) {
      if (await commandExists(cmd)) {
        this.command = cmd;
        this.detected = true;
        return cmd;
      }
    }
    throw new Error("No TTS engine found. Install espeak-ng: sudo apt install espeak-ng");
  }

  async speak(text: string, voice: string, speed: number): Promise<void> {
    text = text.trim();
    if (!text) return;

    const cmd = await this.detect();

    return new Promise<void>((resolve, reject) => {
      let proc: ChildProcess;

      if (cmd === "espeak-ng" || cmd === "espeak") {
        const wpm = Math.round(speed * 175);
        const args = ["--stdin", "-s", String(wpm)];
        if (voice) args.push("-v", voice);
        proc = spawn(cmd, args);
        proc.stdin!.write(text);
        proc.stdin!.end();
      } else {
        // spd-say: no stdin support, pass text as argument
        const wpm = Math.round(speed * 175);
        const args = ["-r", String(wpm - 175)]; // spd-say rate is relative
        if (voice) args.push("-l", voice);
        args.push("--wait", "--", text);
        proc = spawn(cmd, args);
      }

      this.process = proc;

      proc.on("close", (code) => {
        if (this.process === proc) this.process = null;
        if (code === 0) resolve();
        else reject(new Error(`${cmd} exited with code ${code}`));
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
    // spd-say may leave speech-dispatcher running
    if (this.command === "spd-say") {
      try {
        spawn("spd-say", ["-S"]);
      } catch {
        // ignore
      }
    }
  }

  async getVoices(): Promise<string[]> {
    const cmd = await this.detect().catch(() => null);
    if (!cmd) return [];

    if (cmd === "espeak-ng" || cmd === "espeak") {
      return new Promise((resolve) => {
        let output = "";
        const proc = spawn(cmd, ["--voices"]);
        proc.stdout.on("data", (d: Buffer) => (output += d.toString()));
        proc.on("close", () => {
          const voices = output
            .split("\n")
            .slice(1) // skip header
            .map((line) => {
              const parts = line.trim().split(/\s+/);
              // format: Pty Language Age/Gender VoiceName ...
              return parts[3] || "";
            })
            .filter(Boolean);
          resolve([...new Set(voices)]);
        });
        proc.on("error", () => resolve([]));
      });
    }

    return ["en", "ru", "de", "fr", "es", "it", "pt", "zh", "ja", "ko"];
  }

  dispose(): void {
    this.stop();
  }
}

function commandExists(cmd: string): Promise<boolean> {
  return new Promise((resolve) => {
    execFile("which", [cmd], (err) => resolve(!err));
  });
}
