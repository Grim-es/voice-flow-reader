# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-02-28

### Fixed

- spd-say speech rate overflowing valid range at higher speed multipliers
- Character offset mismatch for emoji and astral-plane Unicode when using Speak From Cursor and Speak Selection
- Sentence highlight decoration being recreated every sentence instead of reusing when color unchanged

### Changed

- SpeechRange now uses character offsets from VS Code API instead of manual line/column conversion
- Added Output channel (Output panel → VoiceFlow Reader) for diagnostics and error logging
- Linux users now see a warning on startup if no TTS engine is installed

### Removed

- Unused `detected` field in Linux TTS engine

## [1.0.0] - 2026-02-23

### Added

- Text-to-speech with full Unicode / Cyrillic support
- Windows SAPI via PowerShell with UTF-16LE encoded commands
- macOS `say` command with stdin piping
- Linux support with auto-detection: espeak-ng, espeak, spd-say
- Voice selection picker to browse and set installed system voices
- Speak Document — read entire file from the beginning
- Speak From Cursor — read from current position to end
- Speak Selection — read highlighted text only
- Pause, Resume, and Stop playback controls
- Editor title bar buttons (Play / Pause / Stop) with context-aware states
- Configurable button visibility per file extension
- Sentence-level text highlighting during playback
- Configurable highlight color
- Configurable speech speed multiplier
- Status bar progress indicator
- Auto-stop on document edit or close
- Markdown-aware parsing with sentence splitting
- Support for all file types (Markdown parsed as AST, everything else as plain text)
