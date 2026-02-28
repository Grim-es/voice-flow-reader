export interface SpeechNode {
  /** Plain text to speak (no markdown syntax) */
  text: string;
  /** Character offset range in the original source [start, end) */
  range: [number, number];
}

export interface SpeechPosition {
  /** 1-based line number */
  line: number;
  /** 0-based column */
  column: number;
}

export interface SpeechRange {
  start: SpeechPosition;
  end?: SpeechPosition;
}
