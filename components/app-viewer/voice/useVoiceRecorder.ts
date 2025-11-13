// components/app-viewer/voice/useVoiceRecorder.ts
import { useRef, useState } from "react";

/**
 * Hook to record audio and optionally request main (whisper) transcription via window.electronAPI.whisperTranscribe.
 * Returns states and actions. The component should pass callbacks for UI updates.
 */

export function useVoiceRecorder() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);

  async function startRecording(onStart?: () => void) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      audioChunksRef.current = [];
      mr.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) audioChunksRef.current.push(ev.data);
      };
      mr.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        // attempt to save via electron API
        if (window.electronAPI?.fs?.saveRecording) {
          try {
            const filename = `voice_record_${Date.now()}.webm`;
            const buffer = Buffer.from(await blob.arrayBuffer());
            await window.electronAPI.fs.saveRecording(filename, buffer);

            // optional whisper transcription
            if (window.electronAPI?.whisperTranscribe) {
              const res = await window.electronAPI.whisperTranscribe(filename);
              return res;
            } else {
              const txt = "Recording saved. (no transcription available)";
              return { text: txt };
            }
          } catch (err) {
            console.error("save record err", err);
            return { text: null, error: err };
          }
        } else {
          // fallback: browser-only (no native save)
          const text = "Recording complete (not saved to native FS).";
          return { text };
        }
      };
      mr.start();
      setRecording(true);
      onStart?.();
      return true;
    } catch (err) {
      console.error("startRecording error", err);
      return false;
    }
  }

  function stopRecording() {
    try {
      mediaRecorderRef.current?.stop();
      setRecording(false);
    } catch (err) {
      console.error("stopRecording", err);
    }
  }

  return { recording, startRecording, stopRecording };
}
