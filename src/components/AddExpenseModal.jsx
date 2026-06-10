import { useState } from "react";
import styled from "styled-components";
import { api } from "../api";

function AddExpenseModal({ travelId, onClose, onSave }) {
  const [form, setForm] = useState({
    title: "",
    total_amount: "",
    date: new Date().toISOString().split("T")[0],
    time: "12:00",
    location: "",
    category: "식비",
    payment_method: "현금",
  });

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.total_amount) {
      alert("제목과 금액을 입력해주세요.");
      return;
    }
    try {
      await api.spending.createReceipt(travelId, {
        title: form.title,
        location: form.location || form.category,
        total_amount: Number(form.total_amount),
        date: new Date(form.date).toISOString(),
        currency: "JPY",
        payment_method: form.payment_method === "카드" ? "CARD" : "CASH",
        category: form.category,
      });
      onSave();
      onClose();
    } catch (err) {
      console.error("addExpense failed", err);
      alert("지출 저장에 실패했습니다.");
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalSheet onClick={e => e.stopPropagation()}>
        <ModalCloseBtn onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </ModalCloseBtn>

        <ModalTitleSection>
          <ModalSubtitle>영수증을 직접 기입해 알려주세요</ModalSubtitle>
          <ModalTitle>영수증 입력하기</ModalTitle>
        </ModalTitleSection>

        <ModalField>
          <ModalLabel>제목</ModalLabel>
          <ModalInput placeholder="ex) 마트 장보기" value={form.title} onChange={e => handleChange("title", e.target.value)} />
        </ModalField>

        <ModalDateTimeRow>
          <ModalField style={{ flex: 1 }}>
            <ModalLabel>날짜</ModalLabel>
            <ModalInput type="date" value={form.date} onChange={e => handleChange("date", e.target.value)} />
          </ModalField>
          <ModalField style={{ flex: 1, marginLeft: "12px" }}>
            <ModalLabel>시간</ModalLabel>
            <ModalInput type="time" value={form.time} onChange={e => handleChange("time", e.target.value)} />
          </ModalField>
        </ModalDateTimeRow>

        <ModalField>
          <ModalLabel>장소</ModalLabel>
          <LocationInputWrapper>
            <svg width="14" height="16" viewBox="0 0 12 16" fill="none">
              <path d="M6 0C3.243 0 1 2.243 1 5c0 3.75 5 11 5 11s5-7.25 5-11C11 2.243 8.757 0 6 0zm0 7a2 2 0 110-4 2 2 0 010 4z" fill="#bbb" />
            </svg>
            <ModalInput placeholder="장소 검색" value={form.location} onChange={e => handleChange("location", e.target.value)} style={{ border: "none", background: "transparent", padding: 0, flex: 1 }} />
          </LocationInputWrapper>
        </ModalField>

        <ModalField>
          <ModalLabel>금액</ModalLabel>
          <AmountInputWrapper>
            <span>¥</span>
            <ModalInput type="number" placeholder="0" value={form.total_amount} onChange={e => handleChange("total_amount", e.target.value)} style={{ border: "none", background: "transparent", padding: 0, flex: 1 }} />
          </AmountInputWrapper>
        </ModalField>

        <ModalSubmit onClick={handleSubmit}>일정 추가하기</ModalSubmit>
      </ModalSheet>
    </ModalOverlay>
  );
}

export default AddExpenseModal;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 200;
  display: flex;
  align-items: flex-end;
`;

const ModalSheet = styled.div`
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  background: #fff;
  border-radius: 24px 24px 0 0;
  padding: 20px 20px 40px;
  position: relative;
`;

const ModalCloseBtn = styled.button`
  position: absolute;
  right: 14px;
  top: 12px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalTitleSection = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ModalSubtitle = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: #9a9a9a;
  margin: 0;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #2a2a2a;
  margin: 0;
`;

const ModalField = styled.div`
  margin-bottom: 14px;
`;

const ModalDateTimeRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 14px;
`;

const LocationInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 43px;
  padding: 0 14px;
  background: #f3f3f3;
  border-radius: 8px;
`;

const AmountInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 43px;
  padding: 0 14px;
  background: #f3f3f3;
  border-radius: 8px;
  color: #949494;
  font-size: 13px;
  font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
`;

const ModalLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #454545;
  margin-bottom: 8px;
`;

const ModalInput = styled.input`
  width: 100%;
  height: 43px;
  padding: 0 14px;
  background: #f3f3f3;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  color: #333;
  outline: none;
  box-sizing: border-box;
  font-family: inherit;
  &::placeholder { color: #949494; }
  &:focus { background: #f3f3f3; }
`;

const ModalSubmit = styled.button`
  width: 100%;
  height: 47px;
  margin-top: 14px;
  background: #ff871e;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  &:active { opacity: 0.9; }
`;
