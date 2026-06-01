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
    title: "", location: "", total_amount: "", date: new Date().toISOString().split("T")[0],
    currency: "JPY", payment_method: "현금", category: "기타",
  });
  const categories = ["식비", "쇼핑", "여가", "교통", "숙박", "기타"];

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!form.title || !form.total_amount) return;
    try {
      await api.spending.createReceipt(TRAVEL_ID, { ...form, total_amount: Number(form.total_amount) });
    } catch {
      // API 미연결 시 로컬 처리
    }
    onSave(form);
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalSheet onClick={e => e.stopPropagation()}>
        <ModalHandle />
        <ModalTitle>지출 추가</ModalTitle>
        <ModalField>
          <ModalLabel>내용</ModalLabel>
          <ModalInput placeholder="예) Family Mart, 라멘" value={form.title} onChange={e => handleChange("title", e.target.value)} />
        </ModalField>
        <ModalField>
          <ModalLabel>금액 (엔)</ModalLabel>
          <ModalInput type="number" placeholder="0" value={form.total_amount} onChange={e => handleChange("total_amount", e.target.value)} />
        </ModalField>
        <ModalField>
          <ModalLabel>카테고리</ModalLabel>
          <CategoryPicker>
            {categories.map(c => (
              <CatChip key={c} $active={form.category === c} onClick={() => handleChange("category", c)}>
                {c}
              </CatChip>
            ))}
          </CategoryPicker>
        </ModalField>
        <ModalField>
          <ModalLabel>결제 방법</ModalLabel>
          <CategoryPicker>
            {["현금", "카드"].map(p => (
              <CatChip key={p} $active={form.payment_method === p} onClick={() => handleChange("payment_method", p)}>
                {p}
              </CatChip>
            ))}
          </CategoryPicker>
        </ModalField>
        <ModalField>
          <ModalLabel>날짜</ModalLabel>
          <ModalInput type="date" value={form.date} onChange={e => handleChange("date", e.target.value)} />
        </ModalField>
        <ModalSubmit onClick={handleSubmit}>추가하기</ModalSubmit>
      </ModalSheet>
    </ModalOverlay>
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
        <Logo>PuranPuran</Logo>
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
                  <CategoryFill percent={category.percent} color={category.color} />
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
