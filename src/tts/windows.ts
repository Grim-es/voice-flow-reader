import { spawn, ChildProcess } from "child_process";
import { TtsEngine } from "./types";

export class WindowsTts implements TtsEngine {
  private process: ChildProcess | null = null;

  async speak(text: string, voice: string, speed: number): Promise<void> {
    text = text.trim();
    if (!text) return;

    // Build PowerShell script
    const escaped = text.replace(/'/g, "''");
    const rate = Math.max(-10, Math.min(10, Math.round((speed - 1) * 10)));

    const script = [
      "Add-Type -AssemblyName System.Speech;",
      "$s = New-Object System.Speech.Synthesis.SpeechSynthesizer;",
      voice ? `$s.SelectVoice('${voice.replace(/'/g, "''")}');` : "",
      `$s.Rate = ${rate};`,
      `$s.Speak('${escaped}');`,
      "$s.Dispose();",
    ].join("\n");

    // Encode as UTF-16LE → Base64 for -EncodedCommand
    const buf = Buffer.from(script, "utf16le");
    const encoded = buf.toString("base64");

    return new Promise<void>((resolve, reject) => {
      const proc = spawn("powershell.exe", [
        "-NoProfile",
        "-NonInteractive",
        "-EncodedCommand",
        encoded,
      ]);

      this.process = proc;

      proc.on("close", (code) => {
        if (this.process === proc) this.process = null;
        if (code === 0) resolve();
        else reject(new Error(`powershell exited with code ${code}`));
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
    const script =
      "Add-Type -AssemblyName System.Speech;" +
      "(New-Object System.Speech.Synthesis.SpeechSynthesizer)" +
      ".GetInstalledVoices()" +
      "| ForEach-Object { $_.VoiceInfo.Name }";
    const buf = Buffer.from(script, "utf16le");
    const encoded = buf.toString("base64");

    return new Promise((resolve) => {
      let output = "";
      const proc = spawn("powershell.exe", [
        "-NoProfile",
        "-NonInteractive",
        "-EncodedCommand",
        encoded,
      ]);
      proc.stdout.on("data", (d: Buffer) => (output += d.toString()));
      proc.on("close", () => {
        const voices = output
          .split(/\r?\n/)
          .map((v) => v.trim())
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
