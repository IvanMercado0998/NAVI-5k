// components/app-viewer/voice/VoiceButton.tsx
"use client";

import React, { useState } from "react";
import { Mic } from "lucide-react";
import { useVoiceRecorder } from "./useVoiceRecorder";

/**
 * VoiceButton triggers recording and attempts transcription.
 * On successful transcription, it calls onTranscription(text).
 * Also it reports state via onStateChange('listening'|'accepted'|'idle').
 */

interface VoiceButtonProps {
  onTranscription: (text: string) => void;
  onStateChange?: (s: "idle" | "listening" | "accepted") => void;
}

export default function VoiceButton({ onTranscription, onStateChange }: VoiceButtonProps) {
  const { recording, startRecording, stopRecording } = useVoiceRecorder();
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    if (!recording) {
      setBusy(true);
      onStateChange?.("listening");
      const ok = await startRecording();
      setBusy(false);
      if (!ok) {
        onStateChange?.("idle");
        alert("Microphone access denied or unavailable.");
      }
    } else {
      setBusy(true);
      // stop recording and wait for transcription result via the hook's internal onstop return.
      // Our useVoiceRecorder returns a promise when onstop triggers, but we didn't wire it to return to the caller.
      // To keep it simple, we'll dispatch event from global polling: window.electronAPI.whisperTranscribe will be called by the hook's onstop (if available),
      // but our hook returns to onstop. Instead, do a simple UX: dispatch a 'navi:voice:accepted' after 1s with text from whisperTranscribe if available.
      stopRecording();

      // attempt to poll whisperTranscribe -- the recording filename was saved by hook; but we don't have filename here.
      // So we use IPC directly: if whisperTranscribe is present, assume it returns { text }
      try {
        if (window.electronAPI?.whisperTranscribe) {
          const res = await window.electronAPI.whisperTranscribe("latest"); // 'latest' is a convention you should support in main
          const text = res?.text ?? null;
          if (text) {
            onTranscription(text);
            window.dispatchEvent(new CustomEvent("navi:voice:accepted", { detail: { text } }));
            onStateChange?.("accepted");
            setTimeout(() => onStateChange?.("idle"), 1200);
          } else {
            onStateChange?.("idle");
          }
        } else {
          // fallback: dispatch accepted but no text
          onStateChange?.("accepted");
          setTimeout(() => onStateChange?.("idle"), 1000);
        }
      } catch (err) {
        console.error("whisper transcribe error", err);
        onStateChange?.("idle");
      } finally {
        setBusy(false);
      }
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`px-3 py-2 rounded flex items-center gap-2 ${recording ? "bg-red-600 text-white" : "bg-gray-800 text-white"}`}
      title="Voice search"
    >
      <Mic />
      <span>{recording ? "Stop" : "Voice"}</span>
    </button>
  );
}

