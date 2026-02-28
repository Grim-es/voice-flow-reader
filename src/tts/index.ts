import { TtsEngine } from "./types";
import { WindowsTts } from "./windows";
import { DarwinTts } from "./darwin";
import { LinuxTts } from "./linux";

export type { TtsEngine };

export function createTtsEngine(): TtsEngine {
  switch (process.platform) {
    case "win32":
      return new WindowsTts();
    case "darwin":
      return new DarwinTts();
    default:
      return new LinuxTts();
  }
}
