import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Screen,
  LogoHeader,
  Logo,
  Header,
  BackBtn,
  HeaderTitle,
  CalendarCard,
  CalendarHeader,
  NavBtn,
  MonthTitle,
  Grid,
  DayLabel,
  Cell,
  DayNum,
  Dot,
  DetailSection,
  DetailHeader,
  EmptyText,
  ExpenseItem,
  ExpenseInfo,
  ExpenseName,
  ExpenseLocation,
  ExpenseRight,
  ExpenseKrw,
  ExpenseYen,
} from "../styles/CountCalendar";
import LogoSvg from "../assets/logo1.svg";
import BottomNavigation from "../components/BottomNavigation";
import ExpenseDetailModal from "../components/ExpenseDetailModal";
import { api } from "../api";

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export default function CountCalendar() {
  const navigate = useNavigate();
  const today = new Date();

  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  
  const [receipts, setReceipts] = useState([]);
  const [travelId, setTravelId] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // 1. 초기 로드 (사용자 및 여행 영수증 전체 데이터)
  useEffect(() => {
    let mounted = true;
    (async () => {
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

        // 캘린더를 여행 시작 년/월로 이동 (여러 달에 걸치면 첫 여행일 기준)
        const travelData = await api.travel.getOne(tId);
        if (mounted && travelData?.travel_start_date) {
          const startDate = new Date(travelData.travel_start_date);
          setCalYear(startDate.getFullYear());
          setCalMonth(startDate.getMonth());
          setSelectedDay(startDate.getDate());
        }

        const allReceipts = await api.spending.getReceipts(tId);
        if (mounted && Array.isArray(allReceipts)) {
          setReceipts(allReceipts);
        }
      } catch (err) {
        console.warn("load calendar receipts failed", err);
      }
    })();
    return () => { mounted = false; };
  }, [navigate]);

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
    setSelectedDay(null);
  };

  // 날짜별 총 지출액 매핑
  const expenseDatesMap = receipts.reduce((acc, r) => {
    const d = new Date(r.date);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    acc[key] = (acc[key] || 0) + Number(r.total_amount);
    return acc;
  }, {});

  // 선택한 날짜의 상세 지출 내역
  const selectedExpenses = selectedDay ? receipts.filter(r => {
    const d = new Date(r.date);
    return d.getFullYear() === calYear && d.getMonth() === calMonth && d.getDate() === selectedDay;
  }).map(r => ({
    id: r.id,
    name: r.title,
    location: r.category || "지출",
    krw: Math.round(r.total_krw || 0),
    yen: Math.round(r.total_amount || 0),
    raw: r,
  })) : [];

  // 수정 저장 후 목록 갱신
  const handleSaved = (updated) => {
    if (!updated) return;
    setReceipts(prev => prev.map(r => (r.id === updated.id ? { ...r, ...updated } : r)));
  };

  // 삭제 후 목록에서 제거
  const handleDeleted = (deletedId) => {
    setReceipts(prev => prev.filter(r => r.id !== deletedId));
  };

  return (
    <Screen>
      <LogoHeader>
        <Logo src={LogoSvg} alt="PURAN PURAN" />
      </LogoHeader>
      <Header>
        <BackBtn onClick={() => navigate("/count")}>
          <svg width="10" height="16" viewBox="0 0 8 14" fill="none">
            <path d="M7 1L1 7L7 13" stroke="#454545" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </BackBtn>
        <HeaderTitle>한 달 지출</HeaderTitle>
        <div style={{ width: 32 }} />
      </Header>

      <CalendarCard>
        <CalendarHeader>
          <NavBtn onClick={prevMonth}>
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
              <path d="M7 1L1 7L7 13" stroke="#454545" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </NavBtn>
          <MonthTitle>{calYear}년 {calMonth + 1}월</MonthTitle>
          <NavBtn onClick={nextMonth}>
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
              <path d="M1 1L7 7L1 13" stroke="#454545" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </NavBtn>
        </CalendarHeader>

        <Grid>
          {DAY_LABELS.map(d => <DayLabel key={d}>{d}</DayLabel>)}
          {Array.from({ length: firstDay }).map((_, i) => <Cell key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const key = `${calYear}-${calMonth + 1}-${day}`;
            const hasExpense = !!expenseDatesMap[key];
            const isSelected = selectedDay === day;
            const isToday = calYear === today.getFullYear() && calMonth === today.getMonth() && day === today.getDate();
            return (
              <Cell key={i} onClick={() => setSelectedDay(day)}>
                <DayNum $selected={isSelected} $today={isToday}>{day}</DayNum>
                {hasExpense && <Dot $selected={isSelected} />}
              </Cell>
            );
          })}
        </Grid>
      </CalendarCard>

      {selectedDay && (
        <DetailSection>
          <DetailHeader>
            지출 내역
          </DetailHeader>
          {selectedExpenses.length === 0 ? (
            <EmptyText>아직 기록이 없어요 😢</EmptyText>
          ) : (
            selectedExpenses.map(item => (
              <ExpenseItem key={item.id} onClick={() => setSelectedReceipt(item.raw)}>
                <ExpenseInfo>
                  <ExpenseName>{item.name}</ExpenseName>
                  <ExpenseLocation>{item.location}</ExpenseLocation>
                </ExpenseInfo>
                <ExpenseRight>
                  <ExpenseKrw>-₩{item.krw.toLocaleString("ko-KR")}</ExpenseKrw>
                  <ExpenseYen>-¥{item.yen.toLocaleString()}</ExpenseYen>
                </ExpenseRight>
              </ExpenseItem>
            ))
          )}
        </DetailSection>
      )}

      <BottomNavigation />

      {selectedReceipt && (
        <ExpenseDetailModal
          receipt={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
        />
      )}
    </Screen>
  );
}
