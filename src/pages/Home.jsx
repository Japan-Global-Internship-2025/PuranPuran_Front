import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Screen,
  Header,
  Logo,
  WelcomeSection,
  UserName,
  NameOrange,
  NameBlack,
  WelcomeText,
  BudgetCard,
  BudgetLabel,
  BudgetAmount,
  BudgetNoticeWrapper,
  BudgetBadge,
  BudgeIcon,
  BudgetNotice,

  ExchangeCard,
  ExchangeIcon,
  ExchangeInfo,
  ExchangeRateRow,
  ExchangeUnit,
  ExchangeUit,
  ExchangeCurrency,
  ExchangeRate,
  ExchangeTime,
  ExchangeChange,

  SectionHeader,
  SectionTitle,
  MoreButton,
  SectionCard,

  ScheduleList,
  ScheduleItem,
  ScheduleTime,
  ScheduleDot,
  ScheduleContent,
  ScheduleTitle,
  ScheduleTag,

  ExpenseList,
  ExpenseItem,
  ExpenseInfo,
  ExpenseName,
  ExpenseLocation,
  ExpenseAmount,
  ExpenseYen,

  JapaneseWrapper,
  JapaneseHeaderTexts,
  JapaneseLabel,
  JapaneseGuide,
  JapaneseCard,
  JapaneseCardHeader,
  JapaneseSound,
  JapanesePill,
  JapaneseText,
  JapaneseSub,
  JapaneseMeaning,

  BottomNav,
  NavItem,
  NavIconImg,
} from "../styles/Home";


import JapaneseModal from "../components/JapaneseModal";


import TabHome from "../assets/tab-home.svg";
import TabCalendar from "../assets/tab-calendar.svg";
import TabCamera from "../assets/tab-camera.svg";
import TabUser from "../assets/tab-user.svg";
import ArrowRight from "../assets/uiw_right.svg";
import ArrowDown from "../assets/arrow-b.svg";
import Ling1 from "../assets/ling.svg";
import Ling2 from "../assets/ling2.svg";
import sound from "../assets/uil_volume.svg";
import LogoSvg from "../assets/logo1.svg";

const DUMMY_DATA = {
  user: { name: "MINJAE98" },
  budget: { total: 10000000, usedPercent: 12, currency: "JPY" },
  exchange: { rate: 937.98, change: 1.2, trend: "up", baseTime: "00시 00분" },
  schedules: [
    { id: 1, time: "12:00", title: "나고야 오스상점가", tag: "shopping" },
    { id: 2, time: "14:00", title: "야바톤 본점", tag: "meal" },
    { id: 3, time: "14:00", title: "하브스 사카에", tag: "meal" },
  ],
  expenses: [
    { id: 1, name: "Family mart", location: "편의점", amountKrw: -9551.18, amountYen: -1020 },
    { id: 2, name: "Family mart", location: "편의점", amountKrw: -9551.18, amountYen: -1020 },
    { id: 3, name: "Family mart", location: "편의점", amountKrw: -9551.18, amountYen: -1020 },
  ],
  japanese: {
    category: "쇼핑 / 계산",
    text: "これはいくらですか？",
    pronunciation: "코레와 이쿠라데스카?",
    meaning: "이거 얼마에요?",
  },
};

export default function Home() {
  const navigate = useNavigate();

  // 일본어 오픈
  const [isJapaneseModalOpen, setIsJapaneseModalOpen] = useState(false);

  // 첫 진입 시 자동으로 모달 열기 (하루에 한 번만)
  useEffect(() => {
    const hasSeenToday = sessionStorage.getItem("seen_japanese_modal");
    if (!hasSeenToday) {
      setIsJapaneseModalOpen(true);
      sessionStorage.setItem("seen_japanese_modal", "true");
    }
  }, []);

  const formatExpense = (amount) =>
    (amount < 0 ? "- " : "") +
    Math.abs(amount).toLocaleString("ko-KR", { minimumFractionDigits: 2 }) +
    " 원";

  const handleNavClick = (path) => navigate(path);

  return (
    <Screen>
      <Header>
        <Logo>
          <img src={LogoSvg} alt="PURAN PURAN" />
        </Logo>
      </Header>

      <WelcomeSection>
        <UserName>
          <NameOrange>{DUMMY_DATA.user.name}</NameOrange>
          <NameBlack>님</NameBlack>
        </UserName>
        <WelcomeText>오늘 여행도 즐겁게!</WelcomeText>

        <BudgetCard>
          <BudgetLabel>전체 예산</BudgetLabel>
          <BudgetAmount>
            ₩{DUMMY_DATA.budget.total.toLocaleString("ko-KR")}
          </BudgetAmount>
          <BudgetNoticeWrapper>
            <BudgetBadge>
              <BudgeIcon src={ArrowDown} alt="" />
              {DUMMY_DATA.budget.usedPercent}%
            </BudgetBadge>
            <BudgetNotice>
              기존 예산에서 {DUMMY_DATA.budget.usedPercent}% 사용
            </BudgetNotice>
          </BudgetNoticeWrapper>
        </BudgetCard>
      </WelcomeSection>

      <ExchangeCard>
        <ExchangeIcon>¥</ExchangeIcon>
        <ExchangeInfo>
          <ExchangeTime>
            {DUMMY_DATA.exchange.baseTime} 기준 엔화환율
          </ExchangeTime>
          <ExchangeRateRow>
            <ExchangeRate>{DUMMY_DATA.exchange.rate.toFixed(2)}</ExchangeRate>
            <ExchangeUnit>원</ExchangeUnit>
            <ExchangeUit>(100¥ 기준)</ExchangeUit>
          </ExchangeRateRow>
          <ExchangeCurrency>JPY/KRW</ExchangeCurrency>
        </ExchangeInfo>
        <ExchangeChange trend={DUMMY_DATA.exchange.trend}>
          ↗ {DUMMY_DATA.exchange.change}%
          <span>어제보다 상승</span>
        </ExchangeChange>
      </ExchangeCard>

      <SectionHeader>
        <SectionTitle>오늘의 일정</SectionTitle>
        <MoreButton>
          <img src={ArrowRight} alt="더보기" />
        </MoreButton>
      </SectionHeader>

      <SectionCard>
        <ScheduleList>
          {DUMMY_DATA.schedules.map((schedule) => (
            <ScheduleItem key={schedule.id}>
              <ScheduleTime>{schedule.time}</ScheduleTime>
              <ScheduleDot>
                <img
                  src={schedule.tag === "shopping" ? Ling2 : Ling1}
                  alt={schedule.tag}
                />
              </ScheduleDot>
              <ScheduleContent>
                <ScheduleTitle>{schedule.title}</ScheduleTitle>
                <ScheduleTag $tag={schedule.tag}>{schedule.tag}</ScheduleTag>
              </ScheduleContent>
            </ScheduleItem>
          ))}
        </ScheduleList>
      </SectionCard>

      <SectionHeader>
        <SectionTitle>최근 지출</SectionTitle>
        <MoreButton>
          <span>전체보기</span>
        </MoreButton>
      </SectionHeader>

      <SectionCard>
        <ExpenseList>
          {DUMMY_DATA.expenses.map((expense) => (
            <ExpenseItem key={expense.id}>
              <ExpenseInfo>
                <ExpenseName>{expense.name}</ExpenseName>
                <ExpenseLocation>{expense.location}</ExpenseLocation>
              </ExpenseInfo>
              <ExpenseAmount>
                {formatExpense(expense.amountKrw)}
                <ExpenseYen>
                  - {Math.abs(expense.amountYen).toLocaleString()} ¥
                </ExpenseYen>
              </ExpenseAmount>
            </ExpenseItem>
          ))}
        </ExpenseList>
      </SectionCard>


      <JapaneseWrapper onClick={() => setIsJapaneseModalOpen(true)}>
        <JapaneseHeaderTexts>
          <JapaneseLabel>오늘 배운 유용한 일본어!</JapaneseLabel>
          <JapaneseGuide>일본어 표현 복습해볼까요?</JapaneseGuide>
        </JapaneseHeaderTexts>

        <JapaneseCard>
          <JapaneseCardHeader>
            <JapanesePill>{DUMMY_DATA.japanese.category}</JapanesePill>
            <JapaneseSound
              type="button"
              aria-label="sound"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={sound} alt="발음 듣기" />
            </JapaneseSound>
          </JapaneseCardHeader>
          <JapaneseText>{DUMMY_DATA.japanese.text}</JapaneseText>
          <JapaneseSub>{DUMMY_DATA.japanese.pronunciation}</JapaneseSub>
          <JapaneseMeaning>{DUMMY_DATA.japanese.meaning}</JapaneseMeaning>
        </JapaneseCard>
      </JapaneseWrapper>

      <BottomNav>
        <NavItem $active onClick={() => handleNavClick("/home")}>
          <NavIconImg src={TabHome} alt="홈" />
        </NavItem>
        <NavItem onClick={() => handleNavClick("/plan")}>
          <NavIconImg src={TabCalendar} alt="일정" />
        </NavItem>
        <NavItem onClick={() => handleNavClick("/count")}>
          <NavIconImg src={TabCamera} alt="가계부" />
        </NavItem>
        <NavItem onClick={() => handleNavClick("/mypage")}>
          <NavIconImg src={TabUser} alt="마이페이지" />
        </NavItem>
      </BottomNav>

      {/* 일본어 모달 */}
      <JapaneseModal
        open={isJapaneseModalOpen}
        onClose={() => setIsJapaneseModalOpen(false)}
        data={DUMMY_DATA.japanese}
        // open={true}  
        // onClose={() => {}} 
        // data={DUMMY_DATA.japanese}
      />
    </Screen>
  );
}