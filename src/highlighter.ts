import * as vscode from "vscode";

export class Highlighter {
  private decoration: vscode.TextEditorDecorationType | null = null;

  highlight(
    editor: vscode.TextEditor,
    startOffset: number,
    endOffset: number,
    color: string
  ): void {
    this.clear();

    const startPos = editor.document.positionAt(startOffset);
    const endPos = editor.document.positionAt(endOffset);
    const range = new vscode.Range(startPos, endPos);

    this.decoration = vscode.window.createTextEditorDecorationType({
      backgroundColor: color,
      overviewRulerColor: color,
      overviewRulerLane: vscode.OverviewRulerLane.Center,
    });

    editor.setDecorations(this.decoration, [{ range }]);
    editor.revealRange(range, vscode.TextEditorRevealType.InCenterIfOutsideViewport);
  }

  clear(): void {
    if (this.decoration) {
      this.decoration.dispose();
      this.decoration = null;
    }
  }

  dispose(): void {
    this.clear();
  }
}
