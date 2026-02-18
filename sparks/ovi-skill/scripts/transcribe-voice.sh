#!/usr/bin/env bash
# OVI Voice Transcription
# Transcribes a Telegram voice note (ogg/m4a/mp3/wav) via OpenAI Whisper API
# Usage: transcribe-voice.sh <audio-file> [--language en] [--prompt "hint"]
set -euo pipefail

AUDIO_FILE="${1:-}"
shift || true

if [[ -z "$AUDIO_FILE" ]]; then
  echo "Usage: transcribe-voice.sh <audio-file> [--language en] [--prompt hint]" >&2
  exit 2
fi

if [[ ! -f "$AUDIO_FILE" ]]; then
  echo "File not found: $AUDIO_FILE" >&2
  exit 1
fi

if [[ -z "${OPENAI_API_KEY:-}" ]]; then
  echo "Missing OPENAI_API_KEY" >&2
  exit 1
fi

language=""
prompt="OVI voice command. Speaker is VS7."

while [[ $# -gt 0 ]]; do
  case "$1" in
    --language) language="${2:-}"; shift 2 ;;
    --prompt)   prompt="${2:-}"; shift 2 ;;
    *) echo "Unknown arg: $1" >&2; exit 2 ;;
  esac
done

# Call Whisper API
result=$(curl -sS https://api.openai.com/v1/audio/transcriptions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F "file=@${AUDIO_FILE}" \
  -F "model=whisper-1" \
  -F "response_format=text" \
  ${language:+-F "language=${language}"} \
  ${prompt:+-F "prompt=${prompt}"})

echo "$result"
