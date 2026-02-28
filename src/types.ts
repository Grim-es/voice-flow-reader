export interface SpeechNode {
  /** Plain text to speak (no markdown syntax) */
  text: string;
  /** Character offset range in the original source [start, end) */
  range: [number, number];
}

export interface SpeechRange {
  /** Start character offset in the document text */
  startOffset: number;
  /** End character offset (exclusive). Omit to read to end of document. */
  endOffset?: number;
}
