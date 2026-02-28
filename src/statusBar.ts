import * as vscode from "vscode";

export class StatusBar {
  private item: vscode.StatusBarItem;

  constructor() {
    this.item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    this.item.command = "voice-flow-reader.stop";
  }

  showPlaying(current: number, total: number): void {
    this.item.text = `$(unmute) ${current + 1}/${total}`;
    this.item.tooltip = "Click to stop reading";
    this.item.show();
  }

  showPaused(): void {
    this.item.text = "$(mute) Paused";
    this.item.tooltip = "Click to stop reading";
    this.item.show();
  }

  hide(): void {
    this.item.hide();
  }

  dispose(): void {
    this.item.dispose();
  }
}
