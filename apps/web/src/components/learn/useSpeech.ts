"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Text-to-speech for Bengali using the browser's built-in voices. Whether a
 * Bengali voice exists depends on the device, so `available` is false when
 * none is found and callers hide their speaker buttons instead of failing.
 */
export function useSpeech() {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    const check = () => setAvailable(synth.getVoices().some((v) => v.lang.toLowerCase().startsWith("bn")));
    check();
    synth.addEventListener("voiceschanged", check);
    return () => synth.removeEventListener("voiceschanged", check);
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    const voice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith("bn"));
    if (!voice) return;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = voice.lang;
    utterance.rate = 0.85;
    synth.speak(utterance);
  }, []);

  return { available, speak };
}
