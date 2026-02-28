# VoiceFlow Reader — VS Code Extension

Read text documents with **full Unicode / Cyrillic support**.

Free, local, no API keys — uses your operating system's built-in TTS.

## Features

- 🔊 Read entire documents, from cursor, or selected text
- ⏯️ Pause, resume, and stop controls
- 🎯 Highlights the currently spoken sentence
- 🌍 Full Unicode support — English, Chinese, Arabic, etc.
- 🎛️ Editor title bar buttons (Play / Pause / Stop)
- 🎨 Configurable highlight color
- 📂 Filter buttons by file type
- 🗣️ Voice picker from installed system voices
- 💻 Works on Windows, macOS, and Linux

## Setup

### Windows

Voices are provided by **SAPI** (System.Speech).

1. Open Command Palette (`Ctrl+Shift+P`) → **VoiceFlow Reader: Select Voice**
2. Pick `Microsoft George Desktop`

### macOS

Uses the built-in `say` command.
Install additional voices in **System Settings → Accessibility → Spoken Content → System Voice → Manage Voices**.

### Linux

Install `espeak-ng`:

```bash
sudo apt install espeak-ng
```

For Chinese: set `voice-flow-reader.voice` to `zh`.

## Commands

| Command                                 | Description                                 |
| --------------------------------------- | ------------------------------------------- |
| **VoiceFlow Reader: Speak Document**    | Read the entire document from the beginning |
| **VoiceFlow Reader: Speak From Cursor** | Read from the cursor position to the end    |
| **VoiceFlow Reader: Speak Selection**   | Read the selected text only                 |
| **VoiceFlow Reader: Pause**             | Pause playback                              |
| **VoiceFlow Reader: Resume**            | Resume paused playback                      |
| **VoiceFlow Reader: Stop**              | Stop playback and reset position            |
| **VoiceFlow Reader: Select Voice**      | Pick from installed system voices           |

## Editor Buttons

Play, Pause, and Stop buttons appear in the top-right corner of the editor:

| State   | Buttons           |
| ------- | ----------------- |
| Stopped | ▶ Play            |
| Playing | ⏸ Pause · ⏹ Stop  |
| Paused  | ▶ Resume · ⏹ Stop |

Buttons can be hidden entirely or shown only for specific file types (see Settings below).

## Settings

| Setting                               | Default               | Description                                                                         |
| ------------------------------------- | --------------------- | ----------------------------------------------------------------------------------- |
| `voice-flow-reader.voice`             | `""`                  | Voice name. Leave empty for system default. Use **Select Voice** command to browse. |
| `voice-flow-reader.speed`             | `1.0`                 | Speech speed multiplier (`0.1` – `5.0`)                                             |
| `voice-flow-reader.highlightColor`    | `rgba(255,255,0,0.3)` | Background color for the currently spoken sentence                                  |
| `voice-flow-reader.showEditorButtons` | `true`                | Show Play / Pause / Stop buttons in the editor title bar                            |
| `voice-flow-reader.fileExtensions`    | `["*"]`               | File extensions to show buttons for. Use `["*"]` for all files.                     |

### Example Configurations

```jsonc
// Show buttons only for Markdown and plain text
{
  "voice-flow-reader.showEditorButtons": true,
  "voice-flow-reader.fileExtensions": ["md", "txt"]
}

// Hide buttons entirely (commands still available via Command Palette)
{
  "voice-flow-reader.showEditorButtons": false
}

// English voice at 1.2x speed with custom highlight
{
  "voice-flow-reader.voice": "Microsoft George Desktop",
  "voice-flow-reader.speed": 1.2,
  "voice-flow-reader.highlightColor": "rgba(100, 200, 255, 0.3)"
}
```

## Supported File Types

| Format     | Extensions                                   |
| ---------- | -------------------------------------------- |
| Markdown   | `.md`, `.markdown`, `.mdx`, `.mdown`, `.mkd` |
| Plain text | `.txt`, `.text`, and any other extension     |

## Build

```bash
git clone https://github.com/Grim-es/voice-flow-reader.git
cd voice-flow-reader
npm install
npm run build
```

Press **F5** in VS Code to launch the Extension Development Host.

### Package as VSIX

```bash
npm run package
```

Install the generated `.vsix` via **Extensions → ⋯ → Install from VSIX**.

## Support

- 🐛 [Report a bug](https://github.com/Grim-es/voice-flow-reader/issues/new?template=bug_report.yml)
- 💡 [Request a feature](https://github.com/Grim-es/voice-flow-reader/issues/new?template=feature_request.yml)
- 💬 [Discussions](https://github.com/Grim-es/voice-flow-reader/discussions)

## Funding

If you find this extension useful:

- [Patreon](https://patreon.com/shotariya)
- [Buy Me a Coffee](https://buymeacoffee.com/shotariya)

## License

[MIT](LICENSE)
