import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
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

const Screen = styled.div`
  width: 100%;
  max-width: 480px;
  min-height: 100dvh;
  background: #f8f8f8;
  margin: 0 auto;
  padding-bottom: 40px;
`;

const LogoHeader = styled.div`
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 20px;
  background: #ff871e;
`;

const Logo = styled.img`
  height: 24px;
`;

const Header = styled.header`
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background: #fff;
  border-bottom: 1px solid #f5f5f5;
`;

const BackBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
`;

const HeaderTitle = styled.div`
  flex: 1;
  text-align: center;
  font-size: 17px;
  font-weight: 700;
  color: #454545;
`;

const CalendarCard = styled.div`
  background: #fff;
  border-radius: 20px;
  margin: 20px 16px;
  padding: 20px 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
`;

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const NavBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 10px;
  display: flex;
  align-items: center;
`;

const MonthTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #111;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px 0;
`;

const DayLabel = styled.div`
  text-align: center;
  font-size: 13px;
  color: #aaa;
  font-weight: 500;
  padding-bottom: 12px;
`;

const Cell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 4px 0;
  cursor: pointer;
  min-height: 44px;
`;

const DayNum = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: ${({ $selected, $today }) => ($selected || $today) ? '700' : '400'};
  color: ${({ $selected }) => ($selected ? '#fff' : '#111')};
  background: ${({ $selected, $today }) =>
    $selected ? '#ff871e' : $today ? '#fff5eb' : 'transparent'};
`;

const Dot = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${({ $selected }) => ($selected ? '#fff' : '#ff871e')};
`;

const DetailSection = styled.div`
  margin: 0 16px;
  padding: 0;
`;

const DetailHeader = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #111;
  margin-bottom: 20px;
  padding: 0 8px;
`;

const EmptyText = styled.div`
  font-size: 14px;
  color: #aaa;
  text-align: center;
  padding: 40px 16px;
`;

const ExpenseItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 0 5px rgba(0,0,0,0.03);
  margin-bottom: 12px;
  cursor: pointer;
  transition: transform 0.1s ease;
  &:active { transform: scale(0.99); }
  &:last-child { margin-bottom: 0; }
`;

const ExpenseInfo = styled.div``;
const ExpenseName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #111;
  margin-bottom: 3px;
`;
const ExpenseLocation = styled.div`
  font-size: 12px;
  color: #aaa;
`;
const ExpenseRight = styled.div`
  text-align: right;
`;
const ExpenseKrw = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #111;
`;
const ExpenseYen = styled.div`
  font-size: 12px;
  color: #aaa;
  margin-top: 2px;
`;
