// audio_url 재생 시도 → mixed content 또는 실패 시 SpeechSynthesis fallback
export function speakJapanese(text, audioUrl, { onStart, onEnd } = {}) {
  const isMixedContent =
    window.location.protocol === "https:" && audioUrl?.startsWith("http:");

  if (audioUrl && !isMixedContent) {
    const audio = new Audio(audioUrl);
    if (onStart) audio.onplay = onStart;
    if (onEnd) audio.onended = onEnd;
    audio.onerror = () => fallbackSpeak(text, { onStart, onEnd });
    audio.play().catch(() => fallbackSpeak(text, { onStart, onEnd }));
    return;
  }

  fallbackSpeak(text, { onStart, onEnd });
}

function fallbackSpeak(text, { onStart, onEnd } = {}) {
  if (!("speechSynthesis" in window) || !text) {
    onEnd?.();
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  utterance.rate = 0.85;
  if (onStart) utterance.onstart = onStart;
  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }
  window.speechSynthesis.speak(utterance);
}
