import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Screen,
  Header,
  Logo,
  CalendarBtn,
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
  CategoryItemHeader,
  CategoryAmountWrapper,
  EmptyExpenseText,
} from "../styles/Count";
import { api } from "../api";
import BottomNavigation from "../components/BottomNavigation";
import AddExpenseModal from "../components/AddExpenseModal";
import EditBudgetModal from "../components/EditBudgetModal";
// import { getTravelWithFallback } from "../utils/travel";

import ArrowRight from "../assets/uiw_right.svg";
import camera from "../assets/Group.svg";
import plus from "../assets/plus.svg";
import rice from "../assets/rice.svg";
import drink from "../assets/tabler_cup.svg";
import shopping from "../assets/shopping.svg";
import other from "../assets/gg.svg";
import LogoSvg from "../assets/logo1.svg";
import RightArrow from "../assets/uiw_right.svg";

const DUMMY_DATA = {
  budget: { total: 0, used: 0, percent: 0, remaining: 0 },
  dailyAvg: { amount: 0, changeText: "불러오는 중..." },
  recentExpenses: [],
  categories: [],
};

const EXPENSE_CATEGORIES = ["식비", "쇼핑", "여가", "교통", "숙박", "기타"];
const PAYMENT_METHODS = ["현금", "카드"];

export default function Count() {
  const navigate = useNavigate();
  const [travelId, setTravelId] = useState(null);
  const [travel, setTravel] = useState(null);
  const [data, setData] = useState(DUMMY_DATA);
  const [showModal, setShowModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      setLoading(true);
      try {
        const u = await api.auth.getUser();
        if (!mounted) return;
        const fetchedUser = u ?? null;
        const tId = fetchedUser?.lastest_travel_id;

        if (!tId) {
          alert("현재 여행 정보가 없습니다. 여행 등록 페이지로 이동합니다.");
          navigate("/travelstart");
          return;
        }
        setTravelId(tId);

        const travelData = await api.travel.getOne(tId);
        if (!mounted || !travelData) return;
        setTravel(travelData);

        const [recent, categoryTotals, totalKrw] = await Promise.all([
          api.spending.getRecent(tId),
          api.spending.getCategory(tId),
          api.spending.getTotal(tId),
        ]);

        if (!mounted) return;

        // 안전한 숫자 변환 헬퍼
        const toSafeNum = (v) => {
          const n = Number(v);
          return isNaN(n) ? 0 : n;
        };

        const budgetTotal = toSafeNum(travelData?.travel_budget) || 0;
        const used = toSafeNum(totalKrw);
        const remaining = budgetTotal - used;
        const percent = budgetTotal > 0 ? Math.min(100, Math.round((used / budgetTotal) * 100)) : 0;

        const mappedCategories = [
          { id: 1, name: "식비", icon: rice, amount: toSafeNum(categoryTotals?.["식비"]), color: "#ff871e" },
          { id: 2, name: "여가", icon: drink, amount: toSafeNum(categoryTotals?.["여가"]), color: "#5F27CD" },
          { id: 3, name: "쇼핑", icon: shopping, amount: toSafeNum(categoryTotals?.["쇼핑"]), color: "#10AC84" },
          { id: 4, name: "기타", icon: other, amount: toSafeNum(categoryTotals?.["기타"]), color: "#576574" },
        ];
        const totalCatAmount = mappedCategories.reduce((sum, cat) => sum + cat.amount, 0);
        mappedCategories.forEach(cat => {
          cat.percent = totalCatAmount > 0 ? Math.round((cat.amount / totalCatAmount) * 100) : 0;
        });

        // 날짜 유효성 검사로 NaN 방지
        const startDate = travelData?.travel_start_date ? new Date(travelData.travel_start_date) : null;
        const endDate = travelData?.travel_end_date ? new Date(travelData.travel_end_date) : null;
        const isValidDate = (d) => d instanceof Date && !isNaN(d.getTime());
        const dayDiff = (isValidDate(startDate) && isValidDate(endDate))
          ? Math.max(1, Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1)
          : 1;
        const dailyAvgAmount = Math.round(used / dayDiff);

        // recentExpenses 정규화 (필드명 통일)
        const normalizedRecent = Array.isArray(recent)
          ? recent.map(r => ({
            id: r.id,
            title: r.title || "알 수 없음",
            location: r.location || r.category || "",
            category: r.category || "기타",
            total_amount: toSafeNum(r.total_amount),
            total_krw: toSafeNum(r.total_krw),
            date: r.date,
          }))
          : [];

        setData({
          budget: { total: budgetTotal, used, percent, remaining },
          dailyAvg: { amount: dailyAvgAmount, changeText: "계획대로 소비 중" },
          recentExpenses: normalizedRecent,
          categories: mappedCategories,
        });

      } catch (err) {
        console.warn("load spending data failed", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadData();
    return () => { mounted = false; };
  }, [navigate]);

  // 안전한 숫자 포맷 (NaN/undefined/null → 0으로 대체)
  const toSafeNum = (v) => { const n = Number(v); return isNaN(n) ? 0 : n; };
  const formatKrw = (amount) => "₩" + toSafeNum(amount).toLocaleString("ko-KR");
  const formatYen = (amount) => `¥${toSafeNum(amount).toLocaleString()}`;

  const handleSaveExpense = () => {
    window.location.reload();
  };

  const handleSaveBudget = (newBudget) => {
    setTravel(prev => ({ ...prev, travel_budget: newBudget }));
    const used = data.budget.used;
    const remaining = newBudget - used;
    const percent = newBudget > 0 ? Math.min(100, Math.round((used / newBudget) * 100)) : 0;
    setData(prev => ({
      ...prev,
      budget: { total: newBudget, used, percent, remaining }
    }));
  }



  return (
    <Screen>
      <Header>
        <Logo src={LogoSvg} alt="PURAN PURAN" />
        <CalendarBtn onClick={() => navigate("/count-calendar")}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="18" rx="3" stroke="white" strokeWidth="1.8" />
            <path d="M3 9H21" stroke="white" strokeWidth="1.8" />
            <path d="M8 2V5M16 2V5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="8" cy="13" r="1" fill="white" />
            <circle cx="12" cy="13" r="1" fill="white" />
            <circle cx="16" cy="13" r="1" fill="white" />
            <circle cx="8" cy="17" r="1" fill="white" />
            <circle cx="12" cy="17" r="1" fill="white" />
          </svg>
        </CalendarBtn>
      </Header>

      {/* 예산 카드 */}
      <BudgetCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <BudgetLabel>이번 여행 예산</BudgetLabel>
          <button onClick={() => setShowBudgetModal(true)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}>수정</button>
        </div>
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
            {toSafeNum(data.dailyAvg.amount).toLocaleString("ko-KR")}
            <span>원</span>
          </StatsAmount>
          <StatsChange>{data.dailyAvg.changeText}</StatsChange>
        </StatsCard>
      </StatsSection>

      {/* 최근 지출 */}
      <ExpenseSection>
        <SectionHeader>
          <SectionTitle>최근 지출</SectionTitle>
          <MoreButton onClick={() => navigate("/count-calendar")}>
            전체보기 <img src={RightArrow} alt="더보기" style={{ height: '10px' }} />
          </MoreButton>
        </SectionHeader>
        {data.recentExpenses.length === 0 ? (
          <EmptyExpenseText>최근 지출이 없습니다</EmptyExpenseText>
        ) : (
          <ExpenseList>
            {data.recentExpenses.map((expense) => (
              <ExpenseItem key={expense.id}>
                <ExpenseInfo>
                  <ExpenseName>{expense.title}</ExpenseName>
                  <ExpenseLocation>{expense.category}</ExpenseLocation>
                </ExpenseInfo>
                <ExpenseAmount>
                  -{formatKrw(expense.total_krw)}
                  <ExpenseYen>-{formatYen(expense.total_amount)}</ExpenseYen>
                </ExpenseAmount>
              </ExpenseItem>
            ))}
          </ExpenseList>
        )}
      </ExpenseSection>

      {/* 카테고리 */}
      <CategorySection>
        <SectionHeader>
          <SectionTitle>카테고리별 지출</SectionTitle>
        </SectionHeader>
        <CategoryList>
          {data.categories.map((category) => (
            <CategoryItem key={category.id}>
              <CategoryItemHeader>
                <CategoryIcon>
                  <img src={category.icon} alt={category.name} style={{ width: 24, height: 24 }} />
                </CategoryIcon>
                <CategoryName>{category.name}</CategoryName>
                <CategoryAmountWrapper>
                  <CategoryAmount>{toSafeNum(category.amount).toLocaleString("ko-KR")}원</CategoryAmount>
                  <CategoryPercent>{toSafeNum(category.percent)}%</CategoryPercent>
                </CategoryAmountWrapper>
              </CategoryItemHeader>
              <CategoryBar>
                <CategoryFill percent={category.percent} />
              </CategoryBar>
            </CategoryItem>
          ))}
        </CategoryList>
      </CategorySection>

      <BottomNavigation />

      {showModal && (
        <AddExpenseModal travelId={travelId} onClose={() => setShowModal(false)} onSave={handleSaveExpense} />
      )}
      {showBudgetModal && (
        <EditBudgetModal
          travelId={travelId}
          currentBudget={travel?.travel_budget}
          onClose={() => setShowBudgetModal(false)}
          onSave={handleSaveBudget}
        />
      )}
    </Screen>
  );
}
