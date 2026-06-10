import { useState } from "react";
import styled from "styled-components";
import { api } from "../api";

function EditBudgetModal({ travelId, currentBudget, onClose, onSave }) {
  const [budget, setBudget] = useState(currentBudget);

  const handleSubmit = async () => {
    try {
      await api.travel.update(travelId, { travel_budget: Number(budget) });
      onSave(Number(budget));
      onClose();
    } catch (err) {
      console.error("updateBudget failed", err);
      alert("예산 수정에 실패했습니다.");
    }
  };

  return (
    <ReceiptModalOverlay onClick={onClose}>
      <ReceiptModalSheet onClick={e => e.stopPropagation()}>
        <ReceiptModalHeader>
          <ReceiptModalTitleArea>
            <ReceiptModalTitle>예산 수정하기</ReceiptModalTitle>
          </ReceiptModalTitleArea>
          <ReceiptModalClose onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#888" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </ReceiptModalClose>
        </ReceiptModalHeader>

        <ReceiptModalBody>
          <ReceiptModalField>
            <ReceiptModalLabel>새로운 예산 (KRW)</ReceiptModalLabel>
            <ReceiptModalInput
              type="number"
              placeholder="예산을 입력하세요"
              value={budget}
              onChange={e => setBudget(e.target.value)}
            />
          </ReceiptModalField>
        </ReceiptModalBody>

        <ReceiptModalFooter>
          <ReceiptModalButton onClick={handleSubmit}>저장하기</ReceiptModalButton>
        </ReceiptModalFooter>
      </ReceiptModalSheet>
    </ReceiptModalOverlay>
  );
}

export default EditBudgetModal;

const ReceiptModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(3, 3, 3, 0.52);
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
`;

const ReceiptModalSheet = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 380px;
  border-radius: 20px;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 4px 32px rgba(0,0,0,0.22);
`;

const ReceiptModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 28px 24px 16px;
  gap: 8px;
`;

const ReceiptModalTitleArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ReceiptModalTitle = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #111;
`;

const ReceiptModalClose = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;

const ReceiptModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 0 24px 24px;
`;

const ReceiptModalField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ReceiptModalLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #333;
`;

const ReceiptModalInput = styled.input`
  width: 100%;
  height: 50px;
  padding: 0 16px;
  background: #f5f5f5;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  color: #333;
  outline: none;
  box-sizing: border-box;
  &::placeholder { color: #bbb; }
`;

const ReceiptModalFooter = styled.div`
  padding: 0 24px 28px;
`;

const ReceiptModalButton = styled.button`
  width: 100%;
  height: 54px;
  background: #ff871e;
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  &:active { opacity: 0.9; }
`;
