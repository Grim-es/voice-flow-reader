import * as vscode from "vscode";

export class Highlighter {
  private decoration: vscode.TextEditorDecorationType | null = null;
  private currentColor: string | null = null;

  highlight(
    editor: vscode.TextEditor,
    startOffset: number,
    endOffset: number,
    color: string
  ): void {
    // Only recreate the decoration type when the color changes
    if (this.currentColor !== color) {
      this.clear();
      this.decoration = vscode.window.createTextEditorDecorationType({
        backgroundColor: color,
        overviewRulerColor: color,
        overviewRulerLane: vscode.OverviewRulerLane.Center,
      });
      this.currentColor = color;
    }

    const startPos = editor.document.positionAt(startOffset);
    const endPos = editor.document.positionAt(endOffset);
    const range = new vscode.Range(startPos, endPos);

    editor.setDecorations(this.decoration!, [{ range }]);
    editor.revealRange(range, vscode.TextEditorRevealType.InCenterIfOutsideViewport);
  }

  clear(): void {
    if (this.decoration) {
      this.decoration.dispose();
      this.decoration = null;
      this.currentColor = null;
    }
  }

  dispose(): void {
    this.clear();
  }
}
