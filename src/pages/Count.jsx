import { useNavigate } from "react-router-dom";
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
const DUMMY_DATA = {
  budget: {
    total: 10000000,
    used: 50000,
    percent: 7,
    remaining: 10000000,
  },
  dailyAvg: {
    amount: 23023,
    change: -5,
    changeText: "어제 대비 -5% 절약중",
  },
  recentExpenses: [
    {
      id: 1,
      name: "Family mart",
      location: "편의점",
      amountKrw: -9551.18,
      amountYen: -1020,
    },
    {
      id: 2,
      name: "Family mart",
      location: "편의점",
      amountKrw: -9551.18,
      amountYen: -1020,
    },
    {
      id: 3,
      name: "Family mart",
      location: "편의점",
      amountKrw: -9551.18,
      amountYen: -1020,
    },
  ],
  categories: [
    { id: 1, name: "식비", icon: <img src={rice} alt="식비" />, amount: 66800, percent: 80, color: "#ff871e" },
    { id: 2, name: "여가", icon: <img src={drink} alt="여가" />, amount: 36600, percent: 30, color: "#ff871e" },
    { id: 3, name: "쇼핑", icon: <img src={shopping} alt="쇼핑" />, amount: 45600, percent: 60, color: "#ff871e" },
    { id: 4, name: "기타", icon: <img src={other} alt="기타" />, amount: 78000, percent: 78, color: "#ff871e" },
  ],
};

export default function Count() {
  const navigate = useNavigate();

  const formatCurrency = (amount) => {
    return "₩" + amount.toLocaleString("ko-KR");
  };

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <Screen>
      <Header>
        <Logo>PuranPuran</Logo>
      </Header>
      <BudgetCard>
        <BudgetLabel>이번 달 예산</BudgetLabel>
        <BudgetInfo>
          <div>
            <BudgetAmountLabel>남은 금액</BudgetAmountLabel>
            <BudgetAmount>{formatCurrency(DUMMY_DATA.budget.remaining)}</BudgetAmount>
          </div>
        </BudgetInfo>
        
        <BudgetProgress>
          <BudgetProgressText>{DUMMY_DATA.budget.percent}% 사용됨</BudgetProgressText>
          <BudgetProgressBar>
            <BudgetProgressFill percent={DUMMY_DATA.budget.percent} />
          </BudgetProgressBar>
          <BudgetDetail>
            {formatCurrency(DUMMY_DATA.budget.used)} / {formatCurrency(DUMMY_DATA.budget.total)}
          </BudgetDetail>
        </BudgetProgress>
      </BudgetCard>


      <ActionGrid>
         <ActionCard primary onClick={() => navigate("/camera")}>
          <ActionIcon> <img src={camera} alt="카메라" /></ActionIcon>
          <ActionTitle>영수증 촬영</ActionTitle>
          <ActionSub>AI 자동 인식</ActionSub>
        </ActionCard>
        <ActionCard>
          <ActionIcon> <img src={plus} alt="추가" /></ActionIcon>
          <ActionTitle>직접 입력</ActionTitle>
          <ActionSub>빠른 내역 추가</ActionSub>
        </ActionCard>
      </ActionGrid>

      <StatsSection>
        <StatsTitle>일일 평균 지출</StatsTitle>
        <StatsCard>
          <StatsLabel>일일 평균 지출</StatsLabel>
          <StatsAmount>
            {DUMMY_DATA.dailyAvg.amount.toLocaleString("ko-KR")}
            <span>원</span>
          </StatsAmount>
          <StatsChange>{DUMMY_DATA.dailyAvg.changeText}</StatsChange>
        </StatsCard>
      </StatsSection>

      <ExpenseSection>
        <SectionHeader>
          <SectionTitle>최근 지출</SectionTitle>
          <MoreButton>전체보기</MoreButton>
        </SectionHeader>

        <ExpenseList>
          {DUMMY_DATA.recentExpenses.map((expense) => (
            <ExpenseItem key={expense.id}>
              <ExpenseInfo>
                <ExpenseName>{expense.name}</ExpenseName>
                <ExpenseLocation>{expense.location}</ExpenseLocation>
              </ExpenseInfo>
              <ExpenseAmount>
                {formatCurrency(expense.amountKrw)}
                <ExpenseYen>{expense.amountYen.toLocaleString()}¥</ExpenseYen>
              </ExpenseAmount>
            </ExpenseItem>
          ))}
        </ExpenseList>
      </ExpenseSection>

      <CategorySection>
        <SectionHeader>
          <SectionTitle>카테고리</SectionTitle>
          <MoreButton>
            <img src={ArrowRight} alt="더보기" />
          </MoreButton>
        </SectionHeader>

        <CategoryList>
          {DUMMY_DATA.categories.map((category) => (
            <CategoryItem key={category.id}>
              <CategoryIcon>{category.icon}</CategoryIcon>
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

     
      <BottomNav>
        <NavItem onClick={() => handleNavClick("/home")}>
          <NavIcon>
            <img src={TabHome} alt="홈" />
          </NavIcon>
        </NavItem>
        <NavItem onClick={() => handleNavClick("/plan")}>
          <NavIcon>
            <img src={TabCalendar} alt="일정" />
          </NavIcon>
        </NavItem>
        <NavItem onClick={() => handleNavClick("/camera")}>
          <NavIcon $active>
            <img src={TabCamera} alt="카메라" />
          </NavIcon>
        </NavItem>
        <NavItem onClick={() => handleNavClick("/mypage")}>
          <NavIcon>
            <img src={TabUser} alt="마이페이지" />
          </NavIcon>
        </NavItem>
      </BottomNav>
    </Screen>
  );
}