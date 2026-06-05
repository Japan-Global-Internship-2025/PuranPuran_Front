import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Screen, Header, BackButton, HeaderTitle,
  Body, TopMessage, TopSub, TopTitle,
  Section, SectionTitle, ChipGroup, Chip, RegionChip,
  DateDisplay, DateText, DateDivider,
  CalendarWrap, CalendarHeader, CalendarNavBtn, CalendarMonthTitle,
  CalendarGrid, CalendarDayLabel, CalendarCell, CalendarDay,
  Divider,
  Footer, StartButton,
  BudgetInputWrapper, BudgetCurrency, BudgetInput, BudgetUnit,
} from "../styles/Travelstart";


const REGIONS = [
  { id: "tokyo",     label: "도쿄 🗼" },
  { id: "osaka",     label: "오사카 🐙" },
  { id: "fukuoka",   label: "후쿠오카 🍜" },
  { id: "hokkaido",  label: "홋카이도 🐻" },
  { id: "kumamoto",  label: "구마모토 🌋" },
  { id: "kyoto",     label: "교토 ⛩️" },
  { id: "sapporo",   label: "삿포로 ❄️" },
  { id: "kamakura",  label: "가마쿠라 🌿" },
  { id: "yokohama",  label: "요코하마 🌊" },
  { id: "shizuoka",  label: "시즈오카 🍵" },
  { id: "nagoya",    label: "나고야 🎎" },
  { id: "okinawa",   label: "오키나와 🌴" },
  { id: "takayama",  label: "다카야마 🏔️" },
  { id: "kanazawa",  label: "가나자와 🎋" },
  { id: "nara",      label: "나라 🦌" },
  { id: "etc",       label: "기타 지역 🪃" },
];


const TRANSPORTS = [
  { id: "walk",    label: "도보 🦶" },
  { id: "transit", label: "대중교통 🚌" },
  { id: "bike",    label: "자전거 🚲" },
  { id: "car",     label: "자동차 🚗" },
];


const WALK_DISTANCES = [
  { id: "any",  label: "상관 없음" },
  { id: "10",   label: "10분 (약 0.8km)" },
  { id: "20",   label: "20분 (약 1.5km)" },
  { id: "30",   label: "30분 (약 2.3km)" },
  { id: "40",   label: "40분 (약 3km)" },
  { id: "50",   label: "50분 (약 3.8km)" },
  { id: "60",   label: "60분 (약 4.5km)" },
];


const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function formatDate(date) {
  if (!date) return null;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return { y, m, d };
}

function isSameDay(a, b) {
  if (!a || !b) return false;
  return a.toDateString() === b.toDateString();
}

function isInRange(date, start, end) {
  if (!start || !end) return false;
  return date > start && date < end;
}

export default function TravelStart() {
  const navigate = useNavigate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [region, setRegion] = useState(null);
  const [transports, setTransports] = useState([]);
  const [walkDistances, setWalkDistances] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [budget, setBudget] = useState("");
  const [budgetFocused, setBudgetFocused] = useState(false);
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth()); // 0-indexed


  const toggleMulti = (setter, id) => {
    setter((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };


  const handleDayClick = (date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else {

      if (date < startDate) {
        setEndDate(startDate);
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
  };

  /* 달력 */
  const firstDay = new Date(calYear, calMonth, 1).getDay(); // 0=일
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear((y) => y - 1); setCalMonth(11); }
    else setCalMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear((y) => y + 1); setCalMonth(0); }
    else setCalMonth((m) => m + 1);
  };


  const canStart = region && startDate && endDate && transports.length > 0 && walkDistances.length > 0 && budget;

  const handleStart = () => {
    // 더미 
    console.log("여행 정보:", { region, startDate, endDate, transports, walkDistances });
    navigate("/home");

    
  };

  /* ── 날짜 포맷 표시 ── */
  const startFmt = formatDate(startDate);
  const endFmt = formatDate(endDate);

  return (
    <Screen>
      <Header>
        <BackButton onClick={() => navigate(-1)} aria-label="뒤로가기">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </BackButton>
        <HeaderTitle>여행 일정 등록</HeaderTitle>
      </Header>

      <Body>
        {/* 상단 메시지 */}
        <TopMessage>
          <TopSub>거의 다 왔어요</TopSub>
          <TopTitle>
            <span>PuranPuran</span>과 함께 할 여행일정을 알려주세요!
          </TopTitle>
        </TopMessage>

        {/* 지역 선택 */}
        <Section>
          <SectionTitle>여행을 떠나는 지역은 어디인가요?</SectionTitle>
          <ChipGroup>
            {REGIONS.map((r) => (
              <RegionChip
                key={r.id}
                $selected={region === r.id}
                onClick={() => setRegion(r.id)}
              >
                {r.label}
              </RegionChip>
            ))}
          </ChipGroup>
        </Section>

        {/* 날짜 선택 */}
        <Section>
          <SectionTitle>여행을 떠나는 날짜는 언제인가요?</SectionTitle>

          {/* 선택된 날짜 표시 */}
          <DateDisplay>
            {startFmt ? (
              <span>
                <DateText>{startFmt.y}</DateText>년{" "}
                <DateText>{startFmt.m}</DateText>월{" "}
                <DateText>{startFmt.d}</DateText>일 부터
              </span>
            ) : (
              <span>시작일 선택</span>
            )}
            <DateDivider>—</DateDivider>
            {endFmt ? (
              <span>
                <DateText>{endFmt.y}</DateText>년{" "}
                <DateText>{endFmt.m}</DateText>월{" "}
                <DateText>{endFmt.d}</DateText>일 까지
              </span>
            ) : (
              <span>종료일 선택</span>
            )}
          </DateDisplay>

          {/* 달력 */}
          <CalendarWrap>
            <CalendarHeader>
              <CalendarNavBtn onClick={prevMonth}>
                <svg width="10" height="16" viewBox="0 0 8 14" fill="none">
                  <path d="M7 1L1 7L7 13" stroke="#454545" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </CalendarNavBtn>
              <CalendarMonthTitle>{calYear}년 {calMonth + 1}월</CalendarMonthTitle>
              <CalendarNavBtn onClick={nextMonth}>
                <svg width="10" height="16" viewBox="0 0 8 14" fill="none">
                  <path d="M1 1L7 7L1 13" stroke="#454545" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </CalendarNavBtn>
            </CalendarHeader>

            <CalendarGrid>
              {/* 요일 라벨 */}
              {DAY_LABELS.map((d) => (
                <CalendarDayLabel key={d}>{d}</CalendarDayLabel>
              ))}

              {/* 빈 칸 채우기 */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <CalendarCell key={`empty-${i}`} $empty />
              ))}

              {/* 날짜 */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const date = new Date(calYear, calMonth, i + 1);
                const isStart = isSameDay(date, startDate);
                const isEnd = isSameDay(date, endDate);
                const inRange = isInRange(date, startDate, endDate);
                const isToday = isSameDay(date, today);

                return (
                  <CalendarCell
                    key={i}
                    $isStart={isStart}
                    $isEnd={isEnd}
                    $inRange={inRange}
                    onClick={() => handleDayClick(date)}
                  >
                    <CalendarDay $isStart={isStart} $isEnd={isEnd} $today={isToday}>
                      {i + 1}
                    </CalendarDay>
                  </CalendarCell>
                );
              })}
            </CalendarGrid>
          </CalendarWrap>
        </Section>

        {/* 이동 수단 */}
        <Section>
          <SectionTitle>이동 수단을 선택해주세요</SectionTitle>
          <ChipGroup>
            {TRANSPORTS.map((t) => (
              <Chip
                key={t.id}
                $selected={transports.includes(t.id)}
                onClick={() => toggleMulti(setTransports, t.id)}
              >
                {t.label}
              </Chip>
            ))}
          </ChipGroup>
        </Section>

        {/* 도보 거리 */}
        <Section>
          <SectionTitle>도보가능 거리를 알려주세요</SectionTitle>
          <ChipGroup>
            <Chip
              key="any"
              $selected={walkDistances.includes("any")}
              onClick={() => toggleMulti(setWalkDistances, "any")}
            >
              상관 없음
            </Chip>
          </ChipGroup>
          <Divider />
          <ChipGroup>
            {WALK_DISTANCES.filter((w) => w.id !== "any").map((w) => (
              <Chip
                key={w.id}
                $selected={walkDistances.includes(w.id)}
                onClick={() => toggleMulti(setWalkDistances, w.id)}
              >
                {w.label}
              </Chip>
            ))}
          </ChipGroup>
        </Section>

        {/* 예산 입력 */}
        <Section>
          <SectionTitle>전체 예산을 알려주세요</SectionTitle>
          <BudgetInputWrapper $focused={budgetFocused}>
            <BudgetCurrency>₩</BudgetCurrency>
            <BudgetInput
              type="number"
              placeholder="0"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              onFocus={() => setBudgetFocused(true)}
              onBlur={() => setBudgetFocused(false)}
            />
            <BudgetUnit>원</BudgetUnit>
          </BudgetInputWrapper>
        </Section>

        <Footer>
          <StartButton onClick={handleStart} disabled={!canStart}>
            여행 시작하기
          </StartButton>
        </Footer>
      </Body>
    </Screen>
  );
}