import { useState } from "react";
import styled from "styled-components";
import { api } from "../api";

const CATEGORIES = ["식비", "여가", "쇼핑", "기타"];
const PAYMENT_METHODS = [
  { value: "CASH", label: "현금" },
  { value: "CARD", label: "카드" },
  { value: "OTHER", label: "기타" },
];

// datetime ISO 문자열 → { date: "YYYY-MM-DD", time: "HH:mm" }
function splitDateTime(value) {
  if (!value) {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return {
      date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
      time: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
    };
  }
  const d = new Date(value);
  const pad = (n) => String(n).padStart(2, "0");
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  };
}

function ExpenseDetailModal({ receipt, onClose, onSaved, onDeleted }) {
  const init = splitDateTime(receipt.date);
  const [isEditMode, setIsEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: receipt.title || "",
    location: receipt.location || "",
    date: init.date,
    time: init.time,
    category: receipt.category || "기타",
    total_amount: receipt.total_amount ?? "",
    payment_method: receipt.payment_method || "CASH",
  });

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const paymentLabel = (value) =>
    PAYMENT_METHODS.find((p) => p.value === value)?.label || "현금";

  const handleSave = async () => {
    if (!form.title.trim() || form.total_amount === "") {
      alert("제목과 금액을 입력해주세요.");
      return;
    }
    setSubmitting(true);
    try {
      const isoDate = new Date(`${form.date}T${form.time || "00:00"}:00`).toISOString();
      const updated = await api.spending.updateReceipt(receipt.id, {
        title: form.title,
        location: form.location || "",
        date: isoDate,
        category: form.category,
        total_amount: Number(form.total_amount),
        payment_method: form.payment_method,
      });
      onSaved(updated);
      onClose();
    } catch (err) {
      console.error("updateReceipt failed", err);
      alert("지출 수정에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("이 지출 내역을 삭제할까요?")) return;
    setSubmitting(true);
    try {
      await api.spending.deleteReceipt(receipt.id);
      onDeleted(receipt.id);
      onClose();
    } catch (err) {
      console.error("deleteReceipt failed", err);
      alert("지출 삭제에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalSheet onClick={(e) => e.stopPropagation()}>
        <ModalCloseBtn onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </ModalCloseBtn>

        <ModalTitleSection>
          <ModalSubtitle>{isEditMode ? "지출 내역을 수정해주세요" : "지출 상세 내역"}</ModalSubtitle>
          <ModalTitle>{isEditMode ? "지출 수정하기" : "지출 내역"}</ModalTitle>
        </ModalTitleSection>

        <ModalField>
          <ModalLabel>제목</ModalLabel>
          {isEditMode ? (
            <ModalInput value={form.title} onChange={(e) => handleChange("title", e.target.value)} />
          ) : (
            <ReadValue>{form.title || "-"}</ReadValue>
          )}
        </ModalField>

        <ModalField>
          <ModalLabel>카테고리</ModalLabel>
          {isEditMode ? (
            <ChipRow>
              {CATEGORIES.map((c) => (
                <Chip key={c} $active={form.category === c} onClick={() => handleChange("category", c)}>
                  {c}
                </Chip>
              ))}
            </ChipRow>
          ) : (
            <ReadValue>{form.category}</ReadValue>
          )}
        </ModalField>

        <ModalDateTimeRow>
          <ModalField style={{ flex: 1 }}>
            <ModalLabel>날짜</ModalLabel>
            {isEditMode ? (
              <ModalInput type="date" value={form.date} onChange={(e) => handleChange("date", e.target.value)} />
            ) : (
              <ReadValue>{form.date}</ReadValue>
            )}
          </ModalField>
          <ModalField style={{ flex: 1, marginLeft: "12px" }}>
            <ModalLabel>시간</ModalLabel>
            {isEditMode ? (
              <ModalInput type="time" value={form.time} onChange={(e) => handleChange("time", e.target.value)} />
            ) : (
              <ReadValue>{form.time}</ReadValue>
            )}
          </ModalField>
        </ModalDateTimeRow>

        <ModalField>
          <ModalLabel>장소</ModalLabel>
          {isEditMode ? (
            <LocationInputWrapper>
              <svg width="14" height="16" viewBox="0 0 12 16" fill="none">
                <path d="M6 0C3.243 0 1 2.243 1 5c0 3.75 5 11 5 11s5-7.25 5-11C11 2.243 8.757 0 6 0zm0 7a2 2 0 110-4 2 2 0 010 4z" fill="#bbb" />
              </svg>
              <ModalInput
                placeholder="장소 검색"
                value={form.location}
                onChange={(e) => handleChange("location", e.target.value)}
                style={{ border: "none", background: "transparent", padding: 0, flex: 1 }}
              />
            </LocationInputWrapper>
          ) : (
            <ReadValue>{form.location || "-"}</ReadValue>
          )}
        </ModalField>

        <ModalField>
          <ModalLabel>결제 방식</ModalLabel>
          {isEditMode ? (
            <ChipRow>
              {PAYMENT_METHODS.map((p) => (
                <Chip key={p.value} $active={form.payment_method === p.value} onClick={() => handleChange("payment_method", p.value)}>
                  {p.label}
                </Chip>
              ))}
            </ChipRow>
          ) : (
            <ReadValue>{paymentLabel(form.payment_method)}</ReadValue>
          )}
        </ModalField>

        <ModalField>
          <ModalLabel>결제 금액</ModalLabel>
          {isEditMode ? (
            <AmountInputWrapper>
              <span>¥</span>
              <ModalInput
                type="number"
                placeholder="0"
                value={form.total_amount}
                onChange={(e) => handleChange("total_amount", e.target.value)}
                style={{ border: "none", background: "transparent", padding: 0, flex: 1 }}
              />
            </AmountInputWrapper>
          ) : (
            <ReadValue>
              ¥{Number(form.total_amount || 0).toLocaleString()}
              {receipt.total_krw != null && (
                <ReadSubValue> (₩{Number(receipt.total_krw).toLocaleString("ko-KR")})</ReadSubValue>
              )}
            </ReadValue>
          )}
        </ModalField>

        {isEditMode ? (
          <ButtonRow>
            <CancelBtn onClick={() => setIsEditMode(false)} disabled={submitting}>
              취소
            </CancelBtn>
            <SubmitBtn onClick={handleSave} disabled={submitting}>
              저장하기
            </SubmitBtn>
          </ButtonRow>
        ) : (
          <ButtonRow>
            <DeleteBtn onClick={handleDelete} disabled={submitting}>
              삭제
            </DeleteBtn>
            <SubmitBtn onClick={() => setIsEditMode(true)} disabled={submitting}>
              수정하기
            </SubmitBtn>
          </ButtonRow>
        )}
      </ModalSheet>
    </ModalOverlay>
  );
}

export default ExpenseDetailModal;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
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
  &::placeholder {
    color: #949494;
  }
  &:focus {
    background: #f3f3f3;
  }
`;

const ReadValue = styled.div`
  font-size: 14px;
  color: #333;
  padding: 11px 14px;
  background: #f8f8f8;
  border-radius: 8px;
  min-height: 43px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
`;

const ReadSubValue = styled.span`
  font-size: 12px;
  color: #949494;
  margin-left: 6px;
`;

const ChipRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Chip = styled.button`
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid ${({ $active }) => ($active ? "#ff871e" : "#e5e5e5")};
  background: ${({ $active }) => ($active ? "#fff5eb" : "#fff")};
  color: ${({ $active }) => ($active ? "#ff871e" : "#777")};
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? "600" : "400")};
  cursor: pointer;
  font-family: inherit;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

const SubmitBtn = styled.button`
  flex: 1;
  height: 47px;
  background: #ff871e;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  &:active {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const DeleteBtn = styled.button`
  flex: 0 0 100px;
  height: 47px;
  background: #fff;
  border: 1px solid #f35044;
  border-radius: 8px;
  color: #f35044;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  &:active {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const CancelBtn = styled.button`
  flex: 0 0 100px;
  height: 47px;
  background: #f3f3f3;
  border: none;
  border-radius: 8px;
  color: #777;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  &:active {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;
