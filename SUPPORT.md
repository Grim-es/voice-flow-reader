# Support

- **Bug reports:** [GitHub Issues](https://github.com/Grim-es/voice-flow-reader/issues/new?template=bug_report.yml)
- **Feature requests:** [GitHub Issues](https://github.com/Grim-es/voice-flow-reader/issues/new?template=feature_request.yml)
- **Questions & discussions:** [GitHub Discussions](https://github.com/Grim-es/voice-flow-reader/discussions)

## Configuration Help

All settings are under `voice-flow-reader.*` in VS Code settings:

| Setting             | Default               | Description                                   |
| ------------------- | --------------------- | --------------------------------------------- |
| `voice`             | `""`                  | TTS voice name (use **Select Voice** command) |
| `speed`             | `1.0`                 | Speech speed multiplier                       |
| `highlightColor`    | `rgba(255,255,0,0.3)` | Highlight color                               |
| `showEditorButtons` | `true`                | Show editor title bar buttons                 |
| `fileExtensions`    | `["*"]`               | File types to show buttons for                |

## Platform-Specific Help

### Windows

Check available voices in PowerShell:

```powershell
Add-Type -AssemblyName System.Speech
(New-Object System.Speech.Synthesis.SpeechSynthesizer).GetInstalledVoices() | ForEach-Object { $_.VoiceInfo.Name }
```

### macOS

List voices:

```bash
say -v '?'
```

### Linux

Check if espeak-ng is installed:

```bash
espeak-ng --voices
```

Install if missing:

```bash
sudo apt install espeak-ng
```

## Funding

If you find this extension useful, consider supporting development:

- [Patreon](https://patreon.com/shotariya)
- [Buy Me a Coffee](https://buymeacoffee.com/shotariya)
