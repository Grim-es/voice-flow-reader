import * as vscode from "vscode";
import { createTtsEngine } from "./tts/index";
import { SpeechController } from "./speechController";
import { Highlighter } from "./highlighter";
import { StatusBar } from "./statusBar";
import { ContextKeys } from "./contextKeys";
import { getConfig } from "./config";
import type { SpeechNode } from "./types";

export function activate(context: vscode.ExtensionContext) {
  const output = vscode.window.createOutputChannel("VoiceFlow Reader");
  const tts = createTtsEngine();
  output.appendLine(`Platform: ${process.platform}`);
  const controller = new SpeechController(tts);
  const highlighter = new Highlighter();
  const statusBar = new StatusBar();
  const contextKeys = new ContextKeys();

  let activeFileName = "";
  const docListeners: vscode.Disposable[] = [];

  function clearDocListeners() {
    docListeners.forEach((d) => d.dispose());
    docListeners.length = 0;
  }

  // --- Initialize context keys ---
  contextKeys.initialize();

  // --- Check TTS availability on Linux ---
  if (process.platform === "linux") {
    tts.getVoices().then(
      () => output.appendLine(`TTS engine ready`),
      () => {
        output.appendLine(`No TTS engine found`);
        vscode.window.showWarningMessage(
          "VoiceFlow Reader: No TTS engine found. Install espeak-ng: sudo apt install espeak-ng"
        );
      }
    );
  }

  // --- Update button visibility when editor or config changes ---
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(() => {
      contextKeys.updateVisibility();
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("voice-flow-reader")) {
        contextKeys.updateVisibility();
      }
    })
  );

  // --- Controller events ---

  controller.on("node", (node: SpeechNode, index: number, total: number) => {
    const editor = vscode.window.activeTextEditor;
    if (editor && editor.document.fileName === activeFileName) {
      const cfg = getConfig();
      highlighter.highlight(editor, node.range[0], node.range[1], cfg.highlightColor);
    }
    statusBar.showPlaying(index, total);
  });

  controller.on("state", (state: string) => {
    contextKeys.setState(state as "playing" | "paused" | "stopped");

    if (state === "stopped") {
      highlighter.clear();
      statusBar.hide();
      clearDocListeners();
    } else if (state === "paused") {
      highlighter.clear();
      statusBar.showPaused();
    }
  });

  controller.on("empty", () => {
    vscode.window.showInformationMessage(
      "VoiceFlow Reader: No readable text found in this document."
    );
  });

  controller.on("error", (err: Error, node: SpeechNode) => {
    output.appendLine(
      `[skip] "${node.text.slice(0, 60)}${node.text.length > 60 ? "…" : ""}" — ${err.message}`
    );
  });

  // --- Helper to set up document watchers ---

  function watchDocument(fileName: string) {
    clearDocListeners();
    docListeners.push(
      vscode.workspace.onDidChangeTextDocument((e) => {
        if (e.document.fileName === fileName) {
          controller.stop();
        }
      })
    );
    docListeners.push(
      vscode.workspace.onDidCloseTextDocument((doc) => {
        if (doc.fileName === fileName) {
          controller.stop();
        }
      })
    );
  }

  // --- Commands ---

  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand(
      "voice-flow-reader.speakDocument",
      (editor) => {
        const cfg = getConfig();
        activeFileName = editor.document.fileName;
        watchDocument(activeFileName);
        controller.start(
          editor.document.getText(),
          editor.document.fileName,
          cfg.voice,
          cfg.speed
        );
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("voice-flow-reader.speakHere", (editor) => {
      const cfg = getConfig();
      const pos = editor.selection.active;
      const startOffset = editor.document.offsetAt(pos);
      activeFileName = editor.document.fileName;
      watchDocument(activeFileName);
      controller.start(
        editor.document.getText(),
        editor.document.fileName,
        cfg.voice,
        cfg.speed,
        { startOffset }
      );
    })
  );

  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand(
      "voice-flow-reader.speakSelection",
      (editor) => {
        const cfg = getConfig();
        const sel = editor.selection;
        if (sel.isEmpty) return;
        const startOffset = editor.document.offsetAt(sel.start);
        const endOffset = editor.document.offsetAt(sel.end);
        activeFileName = editor.document.fileName;
        watchDocument(activeFileName);
        controller.start(
          editor.document.getText(),
          editor.document.fileName,
          cfg.voice,
          cfg.speed,
          { startOffset, endOffset }
        );
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("voice-flow-reader.pause", () => {
      controller.pause();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("voice-flow-reader.resume", () => {
      const cfg = getConfig();
      controller.resume(cfg.voice, cfg.speed);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("voice-flow-reader.stop", () => {
      controller.stop();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("voice-flow-reader.selectVoice", async () => {
      const voices = await tts.getVoices();
      if (voices.length === 0) {
        vscode.window.showWarningMessage("No TTS voices found on this system.");
        return;
      }
      const picked = await vscode.window.showQuickPick(voices, {
        placeHolder: "Select a voice for VoiceFlow Reader",
      });
      if (picked) {
        await vscode.workspace
          .getConfiguration("voice-flow-reader")
          .update("voice", picked, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(`VoiceFlow Reader voice set to: ${picked}`);
      }
    })
  );

  // --- Cleanup ---

  context.subscriptions.push({
    dispose() {
      controller.dispose();
      highlighter.dispose();
      statusBar.dispose();
      contextKeys.dispose();
      tts.dispose();
      clearDocListeners();
      output.dispose();
    },
  });
}

export function deactivate() {}
