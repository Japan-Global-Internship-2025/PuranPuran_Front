import { useEffect } from "react";
import {
  Overlay,
  ModalCard,
  ModalTitle,
  PillRow,
  Pill,
  SoundButton,
  JpText,
  JpSub,
  Divider,
  JpMeaning,
  ConfirmButton,
} from "../styles/JapaneseModal";

import sound from "../assets/uil_volume.svg";

export default function JapaneseModal({ open, onClose, data }) {
  // 모달이 열렸을 때 배경 스크롤만 막아
  useEffect(() => {
    if (!open) return;
    
    document.body.style.overflow = "hidden";
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalTitle>오늘의 일본어</ModalTitle>

        <PillRow>
          <Pill>{data.category}</Pill>
        </PillRow>

        <SoundButton type="button" aria-label="발음 듣기">
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