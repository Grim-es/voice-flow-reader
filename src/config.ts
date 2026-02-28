import * as vscode from "vscode";

export interface VoiceFlowReaderConfig {
  voice: string;
  speed: number;
  highlightColor: string;
  showEditorButtons: boolean;
  fileExtensions: string[];
}

export function getConfig(): VoiceFlowReaderConfig {
  const cfg = vscode.workspace.getConfiguration("voice-flow-reader");
  return {
    voice: cfg.get<string>("voice", ""),
    speed: cfg.get<number>("speed", 1.0),
    highlightColor: cfg.get<string>("highlightColor", "rgba(255, 255, 0, 0.3)"),
    showEditorButtons: cfg.get<boolean>("showEditorButtons", true),
    fileExtensions: cfg.get<string[]>("fileExtensions", ["*"]),
  };
}
