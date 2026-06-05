import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  Screen,
  Header,
  Logo,
  BudgetCard,
  BudgetLabel,
  BudgetInfo,
  BudgetAmountLabel,
  BudgetAmount,
  BudgetProgress,
  BudgetProgressText,
  BudgetProgressBar,
  BudgetProgressFill,
  BudgetDetail,
  ActionGrid,
  ActionCard,
  ActionIcon,
  ActionTitle,
  ActionSub,
  StatsSection,
  StatsTitle,
  StatsCard,
  StatsLabel,
  StatsAmount,
  StatsChange,
  ExpenseSection,
  SectionHeader,
  SectionTitle,
  MoreButton,
  ExpenseList,
  ExpenseItem,
  ExpenseInfo,
  ExpenseName,
  ExpenseLocation,
  ExpenseAmount,
  ExpenseYen,
  CategorySection,
  CategoryList,
  CategoryItem,
  CategoryIcon,
  CategoryInfo,
  CategoryName,
  CategoryAmount,
  CategoryPercent,
  CategoryBar,
  CategoryFill,
  BottomNav,
  NavItem,
  NavIcon,
} from "../styles/Count";
import { api } from "../api";

import TabHome from "../assets/tab-home.svg";
import TabCalendar from "../assets/tab-calendar.svg";
import TabCamera from "../assets/tabler_cash1.svg";
import TabUser from "../assets/tab-user.svg";
import ArrowRight from "../assets/uiw_right.svg";
import camera from "../assets/Group.svg";
import plus from "../assets/plus.svg";
import rice from "../assets/rice.svg";
import drink from "../assets/tabler_cup.svg";
import shopping from "../assets/shopping.svg";
import other from "../assets/gg.svg";
import LogoSvg from "../assets/logo1.svg";

const TRAVEL_ID = 1;

const DUMMY_DATA = {
  budget: { total: 10000000, used: 720000, percent: 7, remaining: 9280000 },
  dailyAvg: { amount: 180000, changeText: "어제 대비 -5% 절약중" },
  recentExpenses: [
    { id: 1, title: "Family Mart", location: "편의점", total_amount: 1020, total_krw: 9551, currency: "JPY", category: "기타" },
    { id: 2, title: "スシロー", location: "맛집", total_amount: 2200, total_krw: 20592, currency: "JPY", category: "식비" },
    { id: 3, title: "ドン·キホーテ", location: "쇼핑", total_amount: 3800, total_krw: 35576, currency: "JPY", category: "쇼핑" },
  ],
  categories: [
    { id: 1, name: "식비", icon: rice, amount: 66800, percent: 45, color: "#ff871e" },
    { id: 2, name: "여가", icon: drink, amount: 36600, percent: 25, color: "#5F27CD" },
    { id: 3, name: "쇼핑", icon: shopping, amount: 45600, percent: 31, color: "#10AC84" },
    { id: 4, name: "기타", icon: other, amount: 18000, percent: 12, color: "#576574" },
  ],
};

// 지출 직접 입력 모달
function AddExpenseModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    title: "", location: "", total_amount: "",
    date: new Date().toISOString().split("T")[0],
    time: "00:00",
    currency: "JPY", payment_method: "현금", category: "기타",
  });

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!form.title || !form.total_amount) return;
    try {
      await api.spending.createReceipt(TRAVEL_ID, { ...form, total_amount: Number(form.total_amount) });
    } catch { /* API 미연결 시 로컬 처리 */ }
    onSave(form);
    onClose();
  };

  return (
    <ReceiptModalOverlay onClick={onClose}>
      <ReceiptModalSheet onClick={e => e.stopPropagation()}>
        <ReceiptModalHeader>
          <ReceiptModalTitleArea>
            <ReceiptModalSub>영수증을 직접 기입해 알려주세요</ReceiptModalSub>
            <ReceiptModalTitle>영수증 입력하기</ReceiptModalTitle>
          </ReceiptModalTitleArea>
          <ReceiptModalClose onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </ReceiptModalClose>
        </ReceiptModalHeader>

        <ReceiptModalBody>
          <ReceiptModalField>
            <ReceiptModalLabel>제목</ReceiptModalLabel>
            <ReceiptModalInput
              placeholder="ex) 마트 장보기"
              value={form.title}
              onChange={e => handleChange("title", e.target.value)}
            />
          </ReceiptModalField>

          <ReceiptModalRow>
            <ReceiptModalField style={{ flex: 1 }}>
              <ReceiptModalLabel>날짜</ReceiptModalLabel>
              <ReceiptModalInput
                type="date"
                value={form.date}
                onChange={e => handleChange("date", e.target.value)}
                style={{ color: form.date ? "#333" : "#bbb" }}
              />
            </ReceiptModalField>
            <ReceiptModalField style={{ flex: 1 }}>
              <ReceiptModalLabel>시간</ReceiptModalLabel>
              <ReceiptModalInput
                type="time"
                value={form.time}
                onChange={e => handleChange("time", e.target.value)}
              />
            </ReceiptModalField>
          </ReceiptModalRow>

          <ReceiptModalField>
            <ReceiptModalLabel>장소</ReceiptModalLabel>
            <ReceiptModalInputWithIcon>
              <svg width="14" height="16" viewBox="0 0 12 16" fill="none">
                <path d="M6 0C3.243 0 1 2.243 1 5c0 3.75 5 11 5 11s5-7.25 5-11C11 2.243 8.757 0 6 0zm0 7a2 2 0 110-4 2 2 0 010 4z" fill="#bbb"/>
              </svg>
              <ReceiptModalInput
                placeholder="장소 검색"
                value={form.location}
                onChange={e => handleChange("location", e.target.value)}
                style={{ border: "none", background: "transparent", padding: 0, flex: 1, height: "auto" }}
              />
            </ReceiptModalInputWithIcon>
          </ReceiptModalField>

          <ReceiptModalField>
            <ReceiptModalLabel>금액</ReceiptModalLabel>
            <ReceiptModalInputWithIcon>
              <span style={{ color: "#bbb", fontSize: 15, marginRight: 2 }}>¥</span>
              <ReceiptModalInput
                type="number"
                placeholder="0"
                value={form.total_amount}
                onChange={e => handleChange("total_amount", e.target.value)}
                style={{ border: "none", background: "transparent", padding: 0, flex: 1, height: "auto" }}
              />
            </ReceiptModalInputWithIcon>
          </ReceiptModalField>
        </ReceiptModalBody>

        <ReceiptModalFooter>
          <ReceiptModalButton onClick={handleSubmit}>일정 추가하기</ReceiptModalButton>
        </ReceiptModalFooter>
      </ReceiptModalSheet>
    </ReceiptModalOverlay>
  );
}

export default function Count() {
  const navigate = useNavigate();
  const [data, setData] = useState(DUMMY_DATA);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [recent, category, total] = await Promise.all([
          api.spending.getRecent(TRAVEL_ID),
          api.spending.getCategory(TRAVEL_ID),
          api.spending.getTotal(TRAVEL_ID),
        ]);
        setData(prev => ({
          ...prev,
          recentExpenses: recent || prev.recentExpenses,
          categories: category || prev.categories,
          budget: total || prev.budget,
        }));
      } catch {
        // API 미연결 시 더미 데이터 유지
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const formatKrw = (amount) => "₩" + Math.abs(amount).toLocaleString("ko-KR");
  const formatYen = (amount) => `¥${Math.abs(amount).toLocaleString()}`;

  const handleSaveExpense = (form) => {
    const newItem = {
      id: Date.now(),
      title: form.title,
      location: form.category,
      total_amount: Number(form.total_amount),
      total_krw: Math.round(Number(form.total_amount) * 9.36),
      currency: form.currency,
      category: form.category,
    };
    setData(prev => ({
      ...prev,
      recentExpenses: [newItem, ...prev.recentExpenses].slice(0, 3),
    }));
  };

  return (
    <Screen>
      <Header>
        <Logo src={LogoSvg} alt="PURAN PURAN" />
        <CalendarBtn onClick={() => navigate("/count-calendar")}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="18" rx="3" stroke="white" strokeWidth="1.8"/>
            <path d="M3 9H21" stroke="white" strokeWidth="1.8"/>
            <path d="M8 2V5M16 2V5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            <circle cx="8" cy="13" r="1" fill="white"/>
            <circle cx="12" cy="13" r="1" fill="white"/>
            <circle cx="16" cy="13" r="1" fill="white"/>
            <circle cx="8" cy="17" r="1" fill="white"/>
            <circle cx="12" cy="17" r="1" fill="white"/>
          </svg>
        </CalendarBtn>
      </Header>

      {/* 예산 카드 */}
      <BudgetCard>
        <BudgetLabel>이번 여행 예산</BudgetLabel>
        <BudgetInfo>
          <div>
            <BudgetAmountLabel>남은 금액</BudgetAmountLabel>
            <BudgetAmount>{formatKrw(data.budget.remaining)}</BudgetAmount>
          </div>
        </BudgetInfo>
        <BudgetProgress>
          <BudgetProgressText>{data.budget.percent}% 사용됨</BudgetProgressText>
          <BudgetProgressBar>
            <BudgetProgressFill percent={data.budget.percent} />
          </BudgetProgressBar>
          <BudgetDetail>
            {formatKrw(data.budget.used)} / {formatKrw(data.budget.total)}
          </BudgetDetail>
        </BudgetProgress>
      </BudgetCard>

      {/* 액션 버튼 */}
      <ActionGrid>
        <ActionCard primary onClick={() => navigate("/camera")}>
          <ActionIcon><img src={camera} alt="카메라" /></ActionIcon>
          <ActionTitle>영수증 촬영</ActionTitle>
          <ActionSub>AI 자동 인식</ActionSub>
        </ActionCard>
        <ActionCard onClick={() => setShowModal(true)}>
          <ActionIcon><img src={plus} alt="추가" /></ActionIcon>
          <ActionTitle>직접 입력</ActionTitle>
          <ActionSub>빠른 내역 추가</ActionSub>
        </ActionCard>
      </ActionGrid>

      {/* 일일 평균 지출 */}
      <StatsSection>
        <StatsTitle>일일 평균 지출</StatsTitle>
        <StatsCard>
          <StatsLabel>하루 평균 지출액</StatsLabel>
          <StatsAmount>
            {data.dailyAvg.amount.toLocaleString("ko-KR")}
            <span>원</span>
          </StatsAmount>
          <StatsChange>{data.dailyAvg.changeText}</StatsChange>
        </StatsCard>
      </StatsSection>

      {/* 최근 지출 */}
      <ExpenseSection>
        <SectionHeader>
          <SectionTitle>최근 지출</SectionTitle>
          <MoreButton>전체보기</MoreButton>
        </SectionHeader>
        <ExpenseList>
          {data.recentExpenses.map((expense) => (
            <ExpenseItem key={expense.id}>
              <ExpenseInfo>
                <ExpenseName>{expense.title}</ExpenseName>
                <ExpenseLocation>{expense.location || expense.category}</ExpenseLocation>
              </ExpenseInfo>
              <ExpenseAmount>
                -{formatKrw(expense.total_krw || expense.amountKrw)}
                <ExpenseYen>-{formatYen(expense.total_amount || expense.amountYen)}</ExpenseYen>
              </ExpenseAmount>
            </ExpenseItem>
          ))}
        </ExpenseList>
      </ExpenseSection>

      {/* 카테고리 */}
      <CategorySection>
        <SectionHeader>
          <SectionTitle>카테고리별 지출</SectionTitle>
          <MoreButton><img src={ArrowRight} alt="더보기" /></MoreButton>
        </SectionHeader>
        <CategoryList>
          {data.categories.map((category) => (
            <CategoryItem key={category.id}>
              <CategoryIcon>
                <img src={category.icon} alt={category.name} style={{ width: 24, height: 24 }} />
              </CategoryIcon>
              <CategoryInfo>
                <CategoryName>{category.name}</CategoryName>
                <CategoryBar>
                  <CategoryFill percent={category.percent} />
                </CategoryBar>
              </CategoryInfo>
              <div style={{ textAlign: "right" }}>
                <CategoryAmount>{category.amount.toLocaleString("ko-KR")}원</CategoryAmount>
                <CategoryPercent>{category.percent}%</CategoryPercent>
              </div>
            </CategoryItem>
          ))}
        </CategoryList>
      </CategorySection>

      {/* 하단 네비게이션 */}
      <BottomNav>
        <NavItem onClick={() => navigate("/home")}>
          <NavIcon><img src={TabHome} alt="홈" /></NavIcon>
        </NavItem>
        <NavItem onClick={() => navigate("/plan")}>
          <NavIcon><img src={TabCalendar} alt="일정" /></NavIcon>
        </NavItem>
        <NavItem onClick={() => navigate("/count")}>
          <NavIcon $active><img src={TabCamera} alt="가계부" /></NavIcon>
        </NavItem>
        <NavItem onClick={() => navigate("/mypage")}>
          <NavIcon><img src={TabUser} alt="마이페이지" /></NavIcon>
        </NavItem>
      </BottomNav>

      {showModal && (
        <AddExpenseModal onClose={() => setShowModal(false)} onSave={handleSaveExpense} />
      )}
    </Screen>
  );
}

/* ===== 모달 스타일 ===== */
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
  padding: 12px 20px 40px;
`;

const ModalHandle = styled.div`
  width: 40px;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  margin: 0 auto 20px;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #111;
  margin: 0 0 20px;
`;

const ModalField = styled.div`
  margin-bottom: 16px;
`;

const ModalLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #555;
  margin-bottom: 8px;
`;

const ModalInput = styled.input`
  width: 100%;
  height: 46px;
  padding: 0 14px;
  border: 1.5px solid #e6e6e6;
  border-radius: 12px;
  font-size: 14px;
  color: #111;
  outline: none;
  box-sizing: border-box;
  &:focus { border-color: #ff871e; }
`;

const CategoryPicker = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const CatChip = styled.button`
  padding: 7px 14px;
  border-radius: 999px;
  border: 1.5px solid ${({ $active }) => ($active ? "#ff871e" : "#e6e6e6")};
  background: ${({ $active }) => ($active ? "#fff5eb" : "#fff")};
  color: ${({ $active }) => ($active ? "#ff871e" : "#555")};
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? "700" : "500")};
  cursor: pointer;
  transition: all 0.15s;
`;

const CalendarBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-left: auto;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalSubmit = styled.button`
  width: 100%;
  height: 52px;
  margin-top: 8px;
  background: #ff871e;
  border: none;
  border-radius: 14px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  &:active { opacity: 0.9; }
`;

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

const ReceiptModalSub = styled.div`
  font-size: 12px;
  color: #aaa;
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

const ReceiptModalRow = styled.div`
  display: flex;
  gap: 12px;
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

const ReceiptModalInputWithIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 50px;
  padding: 0 16px;
  background: #f5f5f5;
  border-radius: 10px;
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
