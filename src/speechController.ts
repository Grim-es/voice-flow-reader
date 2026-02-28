import { EventEmitter } from "events";
import { parseDocument } from "./parser";
import type { TtsEngine } from "./tts/types";
import type { SpeechNode, SpeechRange } from "./types";

export type SpeechState = "playing" | "paused" | "stopped";

export class SpeechController extends EventEmitter {
  private nodes: SpeechNode[] = [];
  private index = 0;
  private generation = 0;
  private _state: SpeechState = "stopped";
  private voice = "";
  private speed = 1;

  constructor(private tts: TtsEngine) {
    super();
  }

  get state(): SpeechState {
    return this._state;
  }

  get totalNodes(): number {
    return this.nodes.length;
  }

  get currentIndex(): number {
    return this.index;
  }

  start(
    text: string,
    filePath: string,
    voice: string,
    speed: number,
    range?: SpeechRange
  ): void {
    // Stop any previous playback
    this.stopInternal();

    this.voice = voice;
    this.speed = speed;
    this.nodes = parseDocument(text, filePath, range);
    this.index = 0;

    if (this.nodes.length === 0) {
      this.emit("empty");
      return;
    }

    this.setState("playing");
    this.play();
  }

  pause(): void {
    if (this._state !== "playing") return;
    this.setState("paused");
    this.tts.stop();
  }

  resume(voice: string, speed: number): void {
    if (this._state !== "paused") return;
    this.voice = voice;
    this.speed = speed;
    this.setState("playing");
    this.play();
  }

  stop(): void {
    this.stopInternal();
  }

  private stopInternal(): void {
    if (this._state === "stopped") return;
    this.generation++;
    this.tts.stop();
    this.index = 0;
    this.nodes = [];
    this.setState("stopped");
  }

  private async play(): Promise<void> {
    const gen = ++this.generation;

    while (this.index < this.nodes.length) {
      if (gen !== this.generation) return;
      if (this._state !== "playing") return;

      const node = this.nodes[this.index];
      this.emit("node", node, this.index, this.nodes.length);

      try {
        await this.tts.speak(node.text, this.voice, this.speed);
      } catch (err) {
        if (gen !== this.generation) return;
        if (this._state !== "playing") return;
        this.emit("error", err instanceof Error ? err : new Error(String(err)), node);
      }

      if (gen !== this.generation) return;
      if (this._state !== "playing") return;

      this.index++;
    }

    // Finished all nodes
    if (gen === this.generation && this._state === "playing") {
      this.index = 0;
      this.nodes = [];
      this.setState("stopped");
    }
  }

  private setState(s: SpeechState): void {
    this._state = s;
    this.emit("state", s);
  }

  dispose(): void {
    this.stopInternal();
    this.removeAllListeners();
  }
}
