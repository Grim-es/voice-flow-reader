# Contributing to VoiceFlow Reader

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [VS Code](https://code.visualstudio.com/)

### Getting Started

```bash
git clone https://github.com/Grim-es/voice-flow-reader.git
cd voice-flow-reader
npm install
npm run build
```

Press **F5** in VS Code to launch the Extension Development Host.

### Project Structure

```
src/
├── extension.ts          # Entry point, command registration
├── types.ts              # Shared type definitions
├── config.ts             # VS Code settings reader
├── parser.ts             # Markdown/text → sentence AST
├── speechController.ts   # Playback state machine
├── highlighter.ts        # Editor text highlighting
├── statusBar.ts          # Status bar UI
├── contextKeys.ts        # Editor button visibility logic
└── tts/
    ├── index.ts          # Platform detection factory
    ├── types.ts          # TTS engine interface
    ├── windows.ts        # Windows SAPI via PowerShell
    ├── darwin.ts         # macOS `say`
    └── linux.ts          # espeak-ng / espeak / spd-say
```

### Scripts

| Command           | Description                |
| ----------------- | -------------------------- |
| `npm run build`   | Bundle with esbuild        |
| `npm run watch`   | Bundle + watch for changes |
| `npm run lint`    | Run ESLint                 |
| `npm run format`  | Run Prettier               |
| `npm run package` | Create `.vsix` file        |

## Configuration Reference

The extension exposes these settings that affect behavior:

| Setting             | Type       | Default               | Description                   |
| ------------------- | ---------- | --------------------- | ----------------------------- |
| `voice`             | `string`   | `""`                  | TTS voice name                |
| `speed`             | `number`   | `1.0`                 | Speech speed multiplier       |
| `highlightColor`    | `string`   | `rgba(255,255,0,0.3)` | Sentence highlight color      |
| `showEditorButtons` | `boolean`  | `true`                | Show editor title bar buttons |
| `fileExtensions`    | `string[]` | `["*"]`               | File types for button display |

## Guidelines

- Write clean, typed TypeScript — avoid `any` where possible
- One feature per pull request
- Add a `CHANGELOG.md` entry describing your change
- Test on your platform (Windows / macOS / Linux) before submitting
- Follow the existing code style (Prettier handles formatting)

## Reporting Bugs

Use the [Bug Report](https://github.com/Grim-es/voice-flow-reader/issues/new?template=bug_report.yml) template.

## Suggesting Features

Use the [Feature Request](https://github.com/Grim-es/voice-flow-reader/issues/new?template=feature_request.yml) template.
