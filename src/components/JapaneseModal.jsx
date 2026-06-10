import { useEffect, useRef } from "react";
import {
  Overlay,
  ModalCard,
  ModalTitle,
  PillRow,
  Pill,
  SoundButton,
  RefreshButton,
  JpText,
  JpSub,
  Divider,
  JpMeaning,
  ConfirmButton,
} from "../styles/JapaneseModal";

import sound from "../assets/uil_volume.svg";

export default function JapaneseModal({ open, onClose, data, onRefresh }) {
  const audioRef = useRef(null);

  // 모달이 열렸을 때 배경 스크롤만 막아
  useEffect(() => {
    if (!open) return;
    
    document.body.style.overflow = "hidden";
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSpeak = () => {
    if (!data?.audio_url) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(data.audio_url);
    audioRef.current = audio;
    audio.play().catch(err => {
      console.error("Audio play failed:", err);
    });
  };

  if (!open) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalTitle>오늘의 일본어</ModalTitle>
        
        {onRefresh && (
          <RefreshButton onClick={onRefresh} aria-label="새로고침">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="#888" />
            </svg>
          </RefreshButton>
        )}

        <PillRow>
          <Pill>{data.category}</Pill>
        </PillRow>

        <SoundButton type="button" aria-label="발음 듣기" onClick={handleSpeak}>
          <img src={sound} alt="발음 듣기" />
        </SoundButton>

        <JpText>{data.text}</JpText>
        <JpSub>{data.pronunciation}</JpSub>

        <Divider />

        <JpMeaning>{data.meaning}</JpMeaning>

        
        <ConfirmButton onClick={onClose}>확인했어요</ConfirmButton>
      </ModalCard>
    </Overlay>
  );
}