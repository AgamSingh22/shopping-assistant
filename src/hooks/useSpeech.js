// src/hooks/useSpeech.js
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * Web Speech API hook (speech-to-text).
 *
 * Features:
 * - Tracks listening state, interim & final transcripts, and errors
 * - Works with Chrome/Edge/Safari (webkit prefix handled)
 * - Safe on SSR (guards for window)
 * - Optional auto-restart on unexpected end
 *
 * Example:
 *   const {
 *     isSupported, isListening, transcript, finalTranscript, error,
 *     start, stop, reset, setLang
 *   } = useSpeech("en-IN", { interim: true, continuous: true, autoRestart: false });
 */

export default function useSpeech(
  initialLang = "en-IN",
  {
    interim = true,
    continuous = true,
    autoRestart = false, // if recognition ends unexpectedly, try restarting
  } = {}
) {
  const [lang, setLang] = useState(initialLang);

  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);

  // finalTranscript = only final chunks
  const [finalTranscript, setFinalTranscript] = useState("");
  // interimTranscript = current in-progress chunk
  const [interimTranscript, setInterimTranscript] = useState("");

  const recogRef = useRef(null);
  const endedByUserRef = useRef(false); // track user-initiated stop

  const isSupported = useMemo(() => {
    if (typeof window === "undefined") return false;
    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  }, []);

  // Aggregate combined transcript for convenience
  const transcript = useMemo(() => {
    const a = finalTranscript.trim();
    const b = interimTranscript.trim();
    return [a, b].filter(Boolean).join(" ");
  }, [finalTranscript, interimTranscript]);

  // Initialize recognition instance & wire events
  useEffect(() => {
    if (!isSupported) return;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new SR();

    recog.lang = lang;
    recog.interimResults = interim;
    recog.continuous = continuous;

    recog.onresult = (event) => {
      let interimStr = "";
      let addedFinal = "";

      // Web Speech API returns a list of results, where each result can be interim/final
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const text = res[0]?.transcript ?? "";
        if (res.isFinal) {
          addedFinal += text;
        } else {
          interimStr += text;
        }
      }

      if (addedFinal) {
        setFinalTranscript((prev) => (prev ? `${prev} ${addedFinal}`.trim() : addedFinal.trim()));
        setInterimTranscript(""); // clear interim when final landed
      } else {
        setInterimTranscript(interimStr);
      }
    };

    recog.onerror = (e) => {
      // Common error codes: 'no-speech', 'audio-capture', 'not-allowed', 'aborted'
      setError(e?.error || "speech_error");
      setIsListening(false);
    };

    recog.onend = () => {
      setIsListening(false);
      // if not user-initiated and autoRestart is enabled, try to resume
      if (!endedByUserRef.current && autoRestart) {
        try {
          recog.start();
          setIsListening(true);
        } catch {
          /* swallow */
        }
      }
    };

    recogRef.current = recog;

    // Cleanup
    return () => {
      try { recog.stop(); } catch {}
      recogRef.current = null;
    };
  }, [isSupported, lang, interim, continuous, autoRestart]);

  const start = useCallback(() => {
    if (!isSupported || !recogRef.current) return;
    endedByUserRef.current = false;
    setError(null);
    // Don’t clear final transcript automatically; caller can call reset() if needed
    try {
      recogRef.current.start();
      setIsListening(true);
    } catch (e) {
      // Starting too soon after a stop can throw; show a friendly error
      setError(e?.message || "failed_to_start_recognition");
      setIsListening(false);
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported || !recogRef.current) return;
    endedByUserRef.current = true;
    try {
      recogRef.current.stop();
    } catch {
      /* swallow */
    }
    setIsListening(false);
  }, [isSupported]);

  const reset = useCallback(() => {
    setFinalTranscript("");
    setInterimTranscript("");
    setError(null);
  }, []);

  return {
    // state
    isSupported,
    isListening,
    transcript,
    finalTranscript,
    interimTranscript,
    error,
    // controls
    start,
    stop,
    reset,
    setLang, // allow language switching at runtime
    lang,
  };
}
