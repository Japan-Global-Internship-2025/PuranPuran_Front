import { useState, useEffect, useRef } from "react";
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

} from "../styles/Home";

import JapaneseModal from "../components/JapaneseModal";
import BottomNavigation from "../components/BottomNavigation";
import { api } from "../api";
import { speakJapanese } from "../utils/speak";

import ArrowRight from "../assets/uiw_right.svg";
import ArrowDown from "../assets/arrow-b.svg";
import Ling1 from "../assets/ling.svg";
import Ling2 from "../assets/ling2.svg";
import sound from "../assets/uil_volume.svg";
import LogoSvg from "../assets/logo1.svg";

const DUMMY_DATA = {
  user: { name: "" },
  budget: { total: "-------", usedPercent: 0, currency: "JPY" },
  exchange: { rate: 937.98, change: 1.2, trend: "up", baseTime: "00시 00분" },
  japanese: {
    category: "쇼핑 / 계산",
    text: "これはいくらですか？",
    pronunciation: "코레와 이쿠라데스카?",
    meaning: "이거 얼마에요?",
    audio_url: "",
  },
};

export default function Home() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [travel, setTravel] = useState(null);
  const [exchange, setExchange] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [totalSpending, setTotalSpending] = useState(0);
  const [usedPercent, setUsedPercent] = useState(0);
  const [isTravelDay, setIsTravelDay] = useState(false);
  const [isJapaneseModalOpen, setIsJapaneseModalOpen] = useState(false);
  const [japanese, setJapanese] = useState(null);

  const [isTtsPlaying, setIsTtsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handleSpeak = (e) => {
    e.stopPropagation();
    if (!japanese?.text) return;
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    speakJapanese(japanese.text, japanese.audio_url, {
      onStart: () => setIsTtsPlaying(true),
      onEnd: () => setIsTtsPlaying(false),
    });
  };

  const handleRefreshJapanese = async () => {
    try {
      const data = await api.japanese.refresh();
      setJapanese({
        category: data.category,
        text: data.japanese,
        pronunciation: data.pronunciation,
        meaning: data.korean_translation,
        audio_url: data.audio_url,
      });
    } catch (err) {
      console.warn("refreshJapanese failed", err);
      alert("일본어 표현을 새로고침하는 데 실패했습니다.");
    }
  };

  useEffect(() => {
    const fetchJapanese = async () => {
      try {
        const data = await api.japanese.getDaily();
        setJapanese({
          category: data.category,
          text: data.japanese,
          pronunciation: data.pronunciation,
          meaning: data.korean_translation,
          audio_url: data.audio_url,
        });
      } catch (err) {
        console.warn("fetchDailyJapanese failed", err);
        setJapanese(DUMMY_DATA.japanese);
      }
    }
    fetchJapanese();

    const hasSeenToday = sessionStorage.getItem("seen_japanese_modal");
    if (!hasSeenToday) {
      setIsJapaneseModalOpen(true);
      sessionStorage.setItem("seen_japanese_modal", "true");
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const u = await api.auth.getUser();
        if (!mounted) return;
        setUser(u);

        const travelId = u?.lastest_travel_id;

        if (!travelId) {
          alert("현재 여행 정보가 없습니다. 여행 등록 페이지로 이동합니다.");
          navigate("/travelstart");
          return;
        }

        try {
          const ex = await api.exchangeRate.get();
          if (mounted) setExchange(ex);
        } catch (e) {
          console.warn("exchangeRate failed", e);
        }

        try {
          const travelData = await api.travel.getOne(travelId);
          if (mounted) {
            setTravel(travelData);

            // 오늘이 여행 날짜인지 확인
            if (travelData) {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const startDate = new Date(travelData.travel_start_date);
              startDate.setHours(0, 0, 0, 0);
              const endDate = new Date(travelData.travel_end_date);
              endDate.setHours(0, 0, 0, 0);

              const travelDay = today >= startDate && today <= endDate;
              setIsTravelDay(travelDay);

              if (travelDay) {
                const planners = await api.planner.getAll(travelId);
                const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
                const todayPlan = planners.find((p) => p.plan_date === todayStr);
                if (todayPlan && mounted) {
                  setTodaySchedule(todayPlan.items || []);
                }
              }
            }
          }
          if (!travelData && mounted) {
            alert("현재 여행 정보를 불러올 수 없습니다. 여행 시작 페이지로 이동합니다.");
            navigate("/travelstart");
          }
        } catch (e) {
          console.warn("getCurrentTravel failed", e);
        }

        try {
          const rec = await api.spending.getRecent(travelId);
          if (mounted && Array.isArray(rec)) setExpenses(rec);
        } catch (e) {
          console.warn("spending recent failed", e);
        }

        try {
          const total = await api.spending.getTotal(travelId);
          if (mounted) {
            setTotalSpending(total || 0);
          }
        } catch (e) {
          console.warn("spending total failed", e);
        }
      } catch (err) {
        console.warn("getUser failed", err);
        navigate("/login");
      }
    })();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  useEffect(() => {
    if (travel?.travel_budget && totalSpending !== undefined) {
      const percent = Math.min(100, Math.floor((totalSpending / travel.travel_budget) * 100));
      setUsedPercent(percent);
    }
  }, [travel, totalSpending]);

  const formatExpense = (amount) =>
    (amount > 0 ? "- " : "") +
    Math.abs(amount).toLocaleString("ko-KR", { minimumFractionDigits: 0 }) +
    " 원";

  return (
    <Screen>
      <Header>
        <Logo>
          <img src={LogoSvg} alt="PURAN PURAN" />
        </Logo>
      </Header>

      <WelcomeSection>
        <UserName>
          <NameOrange>{user?.user_id ?? DUMMY_DATA.user.name}</NameOrange>
          <NameBlack>님</NameBlack>
        </UserName>
        <WelcomeText>오늘 여행도 즐겁게!</WelcomeText>

        <BudgetCard>
          <BudgetLabel>전체 예산</BudgetLabel>
          <BudgetAmount>
            ₩{(travel?.travel_budget ?? DUMMY_DATA.budget.total).toLocaleString("ko-KR")}
          </BudgetAmount>
          <BudgetNoticeWrapper>
            <BudgetBadge>
              <BudgeIcon src={ArrowDown} alt="" />
              {usedPercent || 0}%
            </BudgetBadge>
            <BudgetNotice>
              기존 예산에서 {usedPercent || 0}% 사용
            </BudgetNotice>
          </BudgetNoticeWrapper>
        </BudgetCard>
      </WelcomeSection>

      <ExchangeCard>
        <ExchangeIcon>¥</ExchangeIcon>
        <ExchangeInfo>
          <ExchangeTime>
            {exchange
              ? `${new Date(exchange.time * 1000).toLocaleString().slice(6, -3)} 기준 엔화환율`
              : "환율 불러오는 중..."}
          </ExchangeTime>
          <ExchangeRateRow>
            <ExchangeRate>
              {exchange ? Number(exchange.now_rate).toFixed(2) : "..."}
            </ExchangeRate>
            <ExchangeUnit>원</ExchangeUnit>
            <ExchangeUit>(100¥ 기준)</ExchangeUit>
          </ExchangeRateRow>
          <ExchangeCurrency>JPY/KRW</ExchangeCurrency>
        </ExchangeInfo>
        <ExchangeChange trend={exchange?.trend ?? DUMMY_DATA.exchange.trend}>
          {exchange
            ? exchange.rate_compare >= 0
              ? `↗ ${exchange.rate_compare}%`
              : `↘ ${Math.abs(exchange.rate_compare)}%`
            : "..."}
          <span>
            {exchange
              ? exchange.status === "+"
                ? "어제보다 상승"
                : "어제보다 하락"
              : ""}
          </span>
        </ExchangeChange>
      </ExchangeCard>

      <SectionHeader>
        <SectionTitle>오늘의 일정</SectionTitle>
        <MoreButton onClick={() => {
          const t = new Date();
          const todayKey = `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`;
          navigate("/plan", { state: { tab: "daily", selectedDate: todayKey } });
        }}>
          <img src={ArrowRight} alt="더보기" />
        </MoreButton>
      </SectionHeader>

      <SectionCard>
        {!isTravelDay ? (
          <div style={{ padding: "20px", textAlign: "center", color: "#9a9a9a", fontSize: "14px" }}>
            오늘은 여행 기간이 아닙니다.
          </div>
        ) : todaySchedule.length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center", color: "#9a9a9a", fontSize: "14px" }}>
            오늘 등록된 일정이 없습니다.
          </div>
        ) : (
          <ScheduleList>
            {todaySchedule.map((item) => (
              <ScheduleItem key={item.id}>
                <ScheduleTime>{item.visit_time?.slice(0, 5)}</ScheduleTime>
                <ScheduleDot>
                  <img
                    src={item.category?.includes("쇼핑") ? Ling2 : Ling1}
                    alt={item.category}
                  />
                </ScheduleDot>
                <ScheduleContent>
                  <ScheduleTitle>{item.place_name}</ScheduleTitle>
                  <ScheduleTag
                    $tag={
                      item.category?.includes("쇼핑")
                        ? "shopping"
                        : item.category?.includes("음식")
                          ? "meal"
                          : "other"
                    }
                  >
                    {item.category}
                  </ScheduleTag>
                </ScheduleContent>
              </ScheduleItem>
            ))}
          </ScheduleList>
        )}
      </SectionCard>

      <SectionHeader>
        <SectionTitle>최근 지출</SectionTitle>
        <MoreButton onClick={() => navigate("/count")}>
          <span>전체보기</span>
        </MoreButton>
      </SectionHeader>

      <SectionCard>
        <ExpenseList>
          {expenses.length > 0 ? (
            expenses.map((expense, idx) => (
              <ExpenseItem key={expense.id ?? idx}>
                <ExpenseInfo>
                  <ExpenseName>{expense.title ?? expense.store ?? "지출"}</ExpenseName>
                  <ExpenseLocation>{expense.category ?? expense.location ?? ""}</ExpenseLocation>
                </ExpenseInfo>
                <ExpenseAmount>
                  {formatExpense(expense.total_krw ?? expense.amount)}
                  <ExpenseYen>
                    - {Math.abs(expense.total_amount ?? expense.yen ?? 0).toLocaleString()} ¥
                  </ExpenseYen>
                </ExpenseAmount>
              </ExpenseItem>
            ))
          ) : (
            <div style={{ padding: "20px", textAlign: "center", color: "#9a9a9a", fontSize: "14px" }}>
              최근 지출 내역이 없습니다.
            </div>
          )}
        </ExpenseList>
      </SectionCard>

      <JapaneseWrapper onClick={() => setIsJapaneseModalOpen(true)}>
        <JapaneseHeaderTexts>
          <JapaneseLabel>오늘 배운 유용한 일본어!</JapaneseLabel>
          <JapaneseGuide>일본어 표현 복습해볼까요?</JapaneseGuide>
        </JapaneseHeaderTexts>

        <JapaneseCard>
          <JapaneseCardHeader>
            <JapanesePill>{japanese?.category || "불러오는 중..."}</JapanesePill>
            <JapaneseSound type="button" aria-label="sound" onClick={handleSpeak}>
              <img src={sound} alt="발음 듣기" />
            </JapaneseSound>
          </JapaneseCardHeader>
          <JapaneseText>{japanese?.text || "..."}</JapaneseText>
          <JapaneseSub>{japanese?.pronunciation || "..."}</JapaneseSub>
          <JapaneseMeaning>{japanese?.meaning || "..."}</JapaneseMeaning>
        </JapaneseCard>
      </JapaneseWrapper>

      <BottomNavigation />

      <JapaneseModal
        open={isJapaneseModalOpen}
        onClose={() => setIsJapaneseModalOpen(false)}
        data={japanese || DUMMY_DATA.japanese}
        onRefresh={handleRefreshJapanese}
      />
    </Screen>
  );
}
