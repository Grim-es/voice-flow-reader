import * as vscode from "vscode";
import * as path from "path";
import { getConfig } from "./config";

export class ContextKeys {
  private isPlaying = false;
  private isPaused = false;

  setState(state: "playing" | "paused" | "stopped"): void {
    this.isPlaying = state === "playing";
    this.isPaused = state === "paused";
    vscode.commands.executeCommand(
      "setContext",
      "voice-flow-reader.isPlaying",
      this.isPlaying
    );
    vscode.commands.executeCommand(
      "setContext",
      "voice-flow-reader.isPaused",
      this.isPaused
    );
  }

  updateVisibility(): void {
    const cfg = getConfig();

    if (!cfg.showEditorButtons) {
      vscode.commands.executeCommand(
        "setContext",
        "voice-flow-reader.showButtons",
        false
      );
      vscode.commands.executeCommand(
        "setContext",
        "voice-flow-reader.matchesFileType",
        false
      );
      return;
    }

    vscode.commands.executeCommand("setContext", "voice-flow-reader.showButtons", true);

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.commands.executeCommand(
        "setContext",
        "voice-flow-reader.matchesFileType",
        false
      );
      return;
    }

    // Untitled files have no extension — treat as matching
    if (editor.document.isUntitled) {
      vscode.commands.executeCommand(
        "setContext",
        "voice-flow-reader.matchesFileType",
        true
      );
      return;
    }

    // Check for any wildcard variant: "*", "**", "*.*"
    const matchAll = cfg.fileExtensions.some(
      (e) => e === "*" || e === "**" || e === "*.*"
    );

    if (matchAll) {
      vscode.commands.executeCommand(
        "setContext",
        "voice-flow-reader.matchesFileType",
        true
      );
      return;
    }

    const fileName = editor.document.fileName;
    const ext = path.extname(fileName).toLowerCase().replace(/^\./, "");
    const extensions = cfg.fileExtensions.map((e) =>
      e
        .replace(/^\./, "")
        .replace(/^\*\.?/, "")
        .toLowerCase()
    );
    const matches = extensions.includes(ext);

    vscode.commands.executeCommand(
      "setContext",
      "voice-flow-reader.matchesFileType",
      matches
    );
  }

  initialize(): void {
    this.setState("stopped");
    this.updateVisibility();
  }

  dispose(): void {
    this.setState("stopped");
    vscode.commands.executeCommand("setContext", "voice-flow-reader.showButtons", false);
    vscode.commands.executeCommand(
      "setContext",
      "voice-flow-reader.matchesFileType",
      false
    );
  }
}
