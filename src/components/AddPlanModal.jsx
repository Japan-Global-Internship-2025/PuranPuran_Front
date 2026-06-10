import { useState } from "react";
import {
  AddModalOverlay,
  AddModal,
  AddModalHeader,
  AddModalTitleArea,
  AddModalSub,
  AddModalTitle,
  AddModalClose,
  AddModalBody,
  AddModalRow,
  AddModalField,
  AddModalLabel,
  AddModalInput,
  AddModalInputWithIcon,
  AddModalFooter,
  AddModalButton,
  AddModalSelect,
} from "../styles/Plan";

export default function AddPlanModal({ isOpen, onClose, dayMode }) {
  const [addTitle, setAddTitle] = useState("");
  const [addTime, setAddTime] = useState("12:00");
  const [addDate, setAddDate] = useState("");
  const [addCategory, setAddCategory] = useState("기타");
  const [addPlace, setAddPlace] = useState("");

  if (!isOpen) return null;

  return (
    <AddModalOverlay onClick={onClose}>
      <AddModal onClick={(e) => e.stopPropagation()}>
        <AddModalHeader>
          <AddModalTitleArea>
            <AddModalSub>수동으로 개인일정을 알려주세요</AddModalSub>
            <AddModalTitle>일정 추가하기</AddModalTitle>
          </AddModalTitleArea>
          <AddModalClose onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </AddModalClose>
        </AddModalHeader>

        <AddModalBody>
          <AddModalField>
            <AddModalLabel>제목</AddModalLabel>
            <AddModalInput
              placeholder="ex) 팀 저녁 회식"
              value={addTitle}
              onChange={(e) => setAddTitle(e.target.value)}
            />
          </AddModalField>

          <AddModalRow>
            <AddModalField style={{ flex: 1 }}>
              <AddModalLabel>{dayMode ? "날짜" : "시간"}</AddModalLabel>
              {dayMode ? (
                <AddModalInput
                  type="date"
                  value={addDate}
                  onChange={(e) => setAddDate(e.target.value)}
                />
              ) : (
                <AddModalInput
                  type="time"
                  value={addTime}
                  onChange={(e) => setAddTime(e.target.value)}
                />
              )}
            </AddModalField>
            <AddModalField style={{ flex: 1 }}>
              <AddModalLabel>카테고리</AddModalLabel>
              <AddModalSelect value={addCategory} onChange={(e) => setAddCategory(e.target.value)}>
                {["기타","식사","쇼핑","관광","숙소","교통","카페"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </AddModalSelect>
            </AddModalField>
          </AddModalRow>

          <AddModalField>
            <AddModalLabel>장소</AddModalLabel>
            <AddModalInputWithIcon>
              <svg width="14" height="16" viewBox="0 0 12 16" fill="none">
                <path d="M6 0C3.243 0 1 2.243 1 5c0 3.75 5 11 5 11s5-7.25 5-11C11 2.243 8.757 0 6 0zm0 7a2 2 0 110-4 2 2 0 010 4z" fill="#bbb"/>
              </svg>
              <AddModalInput
                placeholder="장소 검색"
                value={addPlace}
                onChange={(e) => setAddPlace(e.target.value)}
                style={{ border: "none", background: "transparent", padding: 0, flex: 1 }}
              />
            </AddModalInputWithIcon>
          </AddModalField>
        </AddModalBody>

        <AddModalFooter>
          <AddModalButton onClick={onClose}>일정 추가</AddModalButton>
        </AddModalFooter>
      </AddModal>
    </AddModalOverlay>
  );
}
