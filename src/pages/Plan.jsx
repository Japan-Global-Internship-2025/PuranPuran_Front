import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Screen,
  Header,
  TabContainer,
  Tab,
  DateScroller,
  DateItem,
  TodayDot,
  DateDay,
  DateNum,
  TimeSelector,
  TimePickerWrapper,
  StyledTimeInput,
  TimeDisplayText,
  TimeSeparator,
  AiInputSection,
  AiInput,
  AiButton,
  EmptyState,
  EmptyText,
  SectionTitle,
  Highlight,
  RecommendSection,
  RecommendCard,
  RecommendImage,
  RecommendContent,
  RecommendName,
  RecommendLocation,
  RecommendDesc,
  PlusButton,
  GenerateButton,
  GenerateText,
  BottomNav,
  NavItem,
  NavIcon,
  ScheduleSection,
  ScheduleTitle,
  ScheduleHighlight,
  ScheduleSubtitle,
  MapWrapper,
  MapViewAllBtn,
  TimelineList,
  TimelineRow,
  TimelineLeft,
  TimelineLeftLast,
  NumberBadge,
  TimePill,
  TimelineCard,
  CardTopRow,
  TimelineImage,
  TimelineInfo,
  TimelineName,
  TimelineLocation,
  TimelineDesc,
  TimelineActions,
  ActionBtn,
  ScheduleFooterText,
} from "../styles/Plan";


import {
  CalendarWrap,
  CalendarHeader,
  CalendarNavBtn,
  CalendarMonthTitle,
  CalendarGrid,
  CalendarDayLabel,
  CalendarCell,
  CalendarDay,
} from "../styles/Travelstart";

import TabHome from "../assets/tab-home.svg";
import TabCalendar from "../assets/tab-calendar.svg";
import TabCamera from "../assets/tab-camera.svg";
import TabUser from "../assets/tab-user.svg";
import SendArrow from "../assets/send-arrow.svg";
import PlusIcon from "../assets/plus2.svg";
import RightArrow from "../assets/uiw_right.svg";

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];
const TOTAL_DAYS = 10;


const DUMMY_RECOMMENDS = [
  {
    id: 1,
    name: "나고야성",
    location: "역사지 · 역주변",
    desc: "내부에서 에도 시대의 역사와 문화를 살펴볼 수 있고, 봄에는 벚꽃 명소로도 유명해요. 접근성도 좋아서 나고야 여행에서 들를 대표 스팟이에요.",
    image: "https://picsum.photos/100/100?random=1",
  },
  {
    id: 2,
    name: "레고랜드 재팬",
    location: "테마파크 · 나고야항",
    desc: "일루미네이션 분위기 속에서 다양한 어트랙션을 즐길 수 있는 나고야 대표 테마파크에요. 주요 도시를 레고로 재현해 사진스팟으로도 유명해요.",
    image: "https://picsum.photos/100/100?random=2",
  },
  {
    id: 3,
    name: "나고야성",
    location: "역사지 · 역주변",
    desc: "내부에서 에도 시대의 역사와 문화를 살펴볼 수 있고, 봄에는 벚꽃 명소로도 유명해요. 접근성도 좋아서 나고야 여행에서 들를 대표 스팟이에요.",
    image: "https://picsum.photos/100/100?random=13",
  },
];

const DUMMY_SCHEDULE = [
  { id: 1, time: "12:00", name: "오스상점가", subName: "大須商店街", address: "〒460-0011 아이치현 나고야시 나카구 오스", location: "소매 · 역주변", desc: "MINJAE98님이 좋아할 만한 쇼핑하기 장소에요. 빈티지숍과 굿즈샵이 많고 길거리 음식도 다양해서 가볍게 돌아다니기 좋아요. 쇼핑과 식사가 동시에 가능해요.", stayTime: "약 1시간 ~ 3시간 30분", image: "https://picsum.photos/400/200?random=30", lat: 35.159, lng: 136.8985 },
  { id: 2, time: "14:00", name: "아베혼 본점", subName: "矢場とん 矢場町本店", address: "〒460-0008 아이치현 나고야시 나카구 사카에", location: "쇼핑 · 시가", desc: "나고야를 대표하는 백화점으로 유명한 브랜드와 다양한 식당이 있어 쇼핑과 식사를 한 번에 해결할 수 있어요.", stayTime: "약 1시간 ~ 2시간", image: "https://picsum.photos/400/200?random=31", lat: 35.1706, lng: 136.9067 },
  { id: 3, time: "15:00", name: "히로스 사카에 본점", subName: "ヒロズ栄本店", address: "〒460-0008 아이치현 나고야시 나카구 사카에", location: "소매 · 카페", desc: "현지인과 관광객 모두에게 인기 있는 복합문화공간으로 쇼핑과 카페를 동시에 즐길 수 있는 공간이에요.", stayTime: "약 30분 ~ 1시간", image: "https://picsum.photos/400/200?random=32", lat: 35.1709, lng: 136.9071 },
  { id: 4, time: "16:00", name: "오아시스 21", subName: "オアシス21", address: "〒461-0005 아이치현 나고야시 히가시구 히가시사쿠라", location: "쇼핑 · 나비가", desc: "유리로 된 지붕 구조물이 인상적인 복합시설로, 아래에는 버스 터미널과 상점들이 있어 나고야의 랜드마크에요.", stayTime: "약 30분 ~ 1시간", image: "https://picsum.photos/400/200?random=33", lat: 35.1701, lng: 136.9075 },
  { id: 5, time: "17:00", name: "니고 카페로", subName: "にこcaféろ", address: "〒461-0004 아이치현 나고야시 히가시구 도쿠가와", location: "카페", desc: "나고야에서 가장 유명한 카페 중 하나로, 특별한 분위기와 독특한 메뉴로 현지인들에게 사랑받는 공간이에요.", stayTime: "약 30분 ~ 1시간 30분", image: "https://picsum.photos/400/200?random=34", lat: 35.1722, lng: 136.9055 },
];

const DUMMY_TOTAL_SCHEDULE = [
  { id: 1, date: "5/27", name: "오스상점가", subName: "大須商店街", address: "〒460-0011 아이치현 나고야시 나카구 오스", location: "소매 · 역주변", desc: "MINJAE98님이 좋아할 만한 쇼핑하기 장소에요. 빈티지숍과 굿즈샵이 많고 길거리 음식도 다양해서 가볍게 돌아다니기 좋아요.", stayTime: "약 1시간 ~ 3시간 30분", image: "https://picsum.photos/400/200?random=30", lat: 35.159, lng: 136.8985 },
  { id: 2, date: "5/28", name: "나고야성", subName: "名古屋城", address: "〒460-0031 아이치현 나고야시 나카구 혼마루", location: "역사지 · 관광", desc: "에도 시대의 역사와 문화를 살펴볼 수 있고, 봄에는 벚꽃 명소로도 유명해요.", stayTime: "약 2시간 ~ 3시간", image: "https://picsum.photos/400/200?random=40", lat: 35.1851, lng: 136.8998 },
  { id: 3, date: "5/29", name: "오아시스 21", subName: "オアシス21", address: "〒461-0005 아이치현 나고야시 히가시구", location: "쇼핑 · 나비가", desc: "유리로 된 지붕 구조물이 인상적인 복합시설로, 나고야의 랜드마크에요.", stayTime: "약 30분 ~ 1시간", image: "https://picsum.photos/400/200?random=33", lat: 35.1701, lng: 136.9075 },
  { id: 4, date: "5/30", name: "레고랜드 재팬", subName: "レゴランド・ジャパン", address: "〒455-0848 아이치현 나고야시 미나토구", location: "테마파크 · 나고야항", desc: "일루미네이션 분위기 속에서 다양한 어트랙션을 즐길 수 있는 나고야 대표 테마파크에요.", stayTime: "약 4시간 ~ 6시간", image: "https://picsum.photos/400/200?random=41", lat: 35.1073, lng: 136.8836 },
  { id: 5, date: "5/31", name: "아츠타 신궁", subName: "熱田神宮", address: "〒456-0031 아이치현 나고야시 아츠타구", location: "신사 · 문화", desc: "일본 3대 신궁 중 하나로, 약 1900년의 역사를 자랑하는 나고야의 대표 성지에요.", stayTime: "약 1시간 ~ 2시간", image: "https://picsum.photos/400/200?random=42", lat: 35.1281, lng: 136.9081 },
];

function generateDates(count) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dates = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({
      day: DAY_LABELS[d.getDay()],
      date: d.getDate(),
      month: d.getMonth() + 1,
      year: d.getFullYear(),
      isToday: i === 0,
      key: `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`,
    });
  }
  return dates;
}

const formatDisplayTime = (timeStr) => {
  if (!timeStr) return "시간 선택";
  const [hour, minute] = timeStr.split(":");
  const h = parseInt(hour, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const displayHour = h % 12 || 12;
  return `${ampm}  ${String(displayHour).padStart(2, "0")} : ${minute}`;
};

const ChevronDown = ({ color = "#fff" }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <path d="M3 5L7 9L11 5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PinIcon = ({ active }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ transform: "rotate(45deg)" }}>
    <path d="M17 4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v1l2 4v3l-2 2h10l-2-2V9l2-4V4zm-5 16l-1-4h2l-1 4z" fill={active ? "#ff871e" : "#d0d0d0"}/>
  </svg>
);

const RefreshIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="#d0d0d0"/>
  </svg>
);

export default function Plan() {
  const navigate = useNavigate();
  const dateScrollerRef = useRef(null);
  const todayItemRef = useRef(null);

  const [activeTab, setActiveTab] = useState("daily");
  const [dates] = useState(() => generateDates(TOTAL_DAYS));
  const [selectedDateKey, setSelectedDateKey] = useState(dates[0].key);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isTotalGenerated, setIsTotalGenerated] = useState(false);
  const [isTotalConfirmed, setIsTotalConfirmed] = useState(false);

  // 총 여행 플래너 달력 상태
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [totalStartDate, setTotalStartDate] = useState(null);
  const [totalEndDate, setTotalEndDate] = useState(null);

  const totalFirstDay = new Date(calYear, calMonth, 1).getDay();
  const totalDaysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const prevCalMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  };
  const nextCalMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  };
  const handleTotalDayClick = (date) => {
    if (!totalStartDate || (totalStartDate && totalEndDate)) {
      setTotalStartDate(date);
      setTotalEndDate(null);
    } else {
      if (date < totalStartDate) { setTotalEndDate(totalStartDate); setTotalStartDate(date); }
      else setTotalEndDate(date);
    }
  };

  const [startTimeActive, setStartTimeActive] = useState(false);
  const [endTimeActive, setEndTimeActive] = useState(false);

  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");
  const [aiInput, setAiInput] = useState("");

  const selectedDate = dates.find((d) => d.key === selectedDateKey);

  const handleNavClick = (path) => navigate(path);

  const handleSubmitAi = () => {
    if (!aiInput.trim()) return;
    setAiInput("");
  };

  const handleGenerate = () => {
    if (isGenerated) {
      setIsConfirmed(true);
    } else {
      setIsGenerated(true);
    }
  };

  const handleConfirmedEdit = () => {
    setIsConfirmed(false);
  };

  return (
    <Screen>
      <Header>
        <TabContainer>
          <Tab $active={activeTab === "daily"} onClick={() => setActiveTab("daily")}>
            일간 플래너
          </Tab>
          <Tab $active={activeTab === "total"} onClick={() => setActiveTab("total")}>
            총 여행 플래너
          </Tab>
        </TabContainer>
      </Header>

      {/* 총 여행 플래너 */}
      {activeTab === "total" && (
        <>
          {/* 달력 */}
          <CalendarWrap style={{ margin: "16px 20px 0" }}>
            <CalendarHeader>
              <CalendarNavBtn onClick={prevCalMonth}>
                <svg width="10" height="16" viewBox="0 0 8 14" fill="none">
                  <path d="M7 1L1 7L7 13" stroke="#454545" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </CalendarNavBtn>
              <CalendarMonthTitle>{calYear}년 {calMonth + 1}월</CalendarMonthTitle>
              <CalendarNavBtn onClick={nextCalMonth}>
                <svg width="10" height="16" viewBox="0 0 8 14" fill="none">
                  <path d="M1 1L7 7L1 13" stroke="#454545" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </CalendarNavBtn>
            </CalendarHeader>

            <CalendarGrid>
              {DAY_LABELS.map((d) => (
                <CalendarDayLabel key={d}>{d}</CalendarDayLabel>
              ))}
              {Array.from({ length: totalFirstDay }).map((_, i) => (
                <CalendarCell key={`empty-${i}`} $empty />
              ))}
              {Array.from({ length: totalDaysInMonth }).map((_, i) => {
                const date = new Date(calYear, calMonth, i + 1);
                const isStart = totalStartDate?.toDateString() === date.toDateString();
                const isEnd = totalEndDate?.toDateString() === date.toDateString();
                const inRange = totalStartDate && totalEndDate && date > totalStartDate && date < totalEndDate;
                const isToday = today.toDateString() === date.toDateString();
                return (
                  <CalendarCell
                    key={i}
                    $isStart={isStart}
                    $isEnd={isEnd}
                    $inRange={inRange}
                    onClick={() => handleTotalDayClick(date)}
                  >
                    <CalendarDay $isStart={isStart} $isEnd={isEnd} $today={isToday}>
                      {i + 1}
                    </CalendarDay>
                  </CalendarCell>
                );
              })}
            </CalendarGrid>
          </CalendarWrap>

          <PlannerBox>
            <PlannerContent
              isGenerated={isTotalGenerated}
              isConfirmed={isTotalConfirmed}
              onConfirmedEdit={() => setIsTotalConfirmed(false)}
              onGenerate={() => isTotalGenerated ? setIsTotalConfirmed(true) : setIsTotalGenerated(true)}
              scheduleLabel="전체 여행"
              recommends={DUMMY_RECOMMENDS}
              schedule={(() => {
                if (!totalStartDate || !totalEndDate) return DUMMY_TOTAL_SCHEDULE;
                const days = [];
                const cur = new Date(totalStartDate);
                let i = 1;
                while (cur <= totalEndDate) {
                  const m = cur.getMonth() + 1;
                  const d = cur.getDate();
                  const base = DUMMY_TOTAL_SCHEDULE[(i - 1) % DUMMY_TOTAL_SCHEDULE.length];
                  days.push({ ...base, id: i, date: `${String(m).padStart(2,"0")}월 ${String(d).padStart(2,"0")}일` });
                  cur.setDate(cur.getDate() + 1);
                  i++;
                }
                return days;
              })()}
              aiInput={aiInput}
              onAiChange={(e) => setAiInput(e.target.value)}
              onAiSubmit={handleSubmitAi}
              dayMode
            />
          </PlannerBox>
        </>
      )}

      {/* 일간 플래너 콘텐츠 */}
      {activeTab === "daily" && (
        <>
          <DateScroller ref={dateScrollerRef}>
            {dates.map((item) => {
              const isActive = selectedDateKey === item.key;
              return (
                <DateItem
                  key={item.key}
                  ref={item.isToday ? todayItemRef : null}
                  $active={isActive}
                  onClick={() => setSelectedDateKey(item.key)}
                >
                  <DateDay $active={isActive}>{item.day}</DateDay>
                  <DateNum $active={isActive}>{item.date}</DateNum>
                  {item.isToday && <TodayDot $active={isActive} />}
                </DateItem>
              );
            })}
          </DateScroller>

          {/* 시간 선택 */}
          <TimeSelector>
            <TimePickerWrapper $active={startTimeActive}>
              <TimeDisplayText $active={startTimeActive}>
                {formatDisplayTime(startTime)}
              </TimeDisplayText>
              <ChevronDown color={startTimeActive ? "#fff" : "#ff871e"} />
              <StyledTimeInput
                type="time"
                value={startTime}
                onFocus={() => setStartTimeActive(true)}
                onBlur={() => setStartTimeActive(false)}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </TimePickerWrapper>

            <TimeSeparator>—</TimeSeparator>

            <TimePickerWrapper $active={endTimeActive}>
              <TimeDisplayText $active={endTimeActive}>
                {formatDisplayTime(endTime)}
              </TimeDisplayText>
              <ChevronDown color={endTimeActive ? "#fff" : "#ff871e"} />
              <StyledTimeInput
                type="time"
                value={endTime}
                onFocus={() => setEndTimeActive(true)}
                onBlur={() => setEndTimeActive(false)}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </TimePickerWrapper>
          </TimeSelector>

          <PlannerBox>
            <PlannerContent
              isGenerated={isGenerated}
              isConfirmed={isConfirmed}
              onConfirmedEdit={handleConfirmedEdit}
              onGenerate={handleGenerate}
              scheduleLabel={`${selectedDate?.date}일 ${selectedDate?.day}요일`}
              recommends={DUMMY_RECOMMENDS}
              schedule={DUMMY_SCHEDULE}
              aiInput={aiInput}
              onAiChange={(e) => setAiInput(e.target.value)}
              onAiSubmit={handleSubmitAi}
            />
          </PlannerBox>
        </>
      )}

      <BottomNav>
        <NavItem onClick={() => handleNavClick("/home")}>
          <NavIcon><img src={TabHome} alt="홈" /></NavIcon>
        </NavItem>
        <NavItem onClick={() => handleNavClick("/plan")}>
          <NavIcon $active><img src={TabCalendar} alt="일정" /></NavIcon>
        </NavItem>
        <NavItem onClick={() => handleNavClick("/count")}>
          <NavIcon><img src={TabCamera} alt="가계부" /></NavIcon>
        </NavItem>
        <NavItem onClick={() => handleNavClick("/mypage")}>
          <NavIcon><img src={TabUser} alt="마이페이지" /></NavIcon>
        </NavItem>
      </BottomNav>
    </Screen>
  );
}

const PinModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(3, 3, 3, 0.52);
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
`;

const PinModal = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 335px;
  border-radius: 14px;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.22);
`;

const PinModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 28px 28px 20px;
  gap: 8px;
`;

const PinModalTitleArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 0;
`;

const PinModalName = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #2a2a2a;
`;

const PinModalSubName = styled.div`
  font-size: 12px;
  color: #949494;
  margin-top: -4px;
`;

const PinModalAddress = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 4px;
  font-size: 11px;
  color: #bfbcbc;
  margin-top: 8px;
  line-height: 1.4;
`;

const PinModalClose = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;

const PinModalImage = styled.img`
  width: calc(100% - 56px);
  height: 120px;
  object-fit: cover;
  flex-shrink: 0;
  border-radius: 10px;
  margin: 0 28px;
`;

const PinModalBody = styled.div`
  padding: 20px 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const PinModalSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const PinModalSectionTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #f27100;
`;

const PinModalDesc = styled.div`
  font-size: 12px;
  color: #616161;
  line-height: 1.65;
`;

const AddModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(3, 3, 3, 0.52);
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
`;

const AddModal = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 355px;
  border-radius: 20px;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.22);
`;

const AddModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 28px 24px 20px;
  gap: 8px;
`;

const AddModalTitleArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const AddModalSub = styled.div`
  font-size: 12px;
  color: #aaa;
`;

const AddModalTitle = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #111;
`;

const AddModalClose = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;

const AddModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 0 24px 24px;
`;

const AddModalRow = styled.div`
  display: flex;
  gap: 12px;
`;

const AddModalField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AddModalLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #333;
`;

const AddModalInput = styled.input`
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

const AddModalSelect = styled.select`
  width: 100%;
  height: 50px;
  padding: 0 16px;
  background: #f5f5f5;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  color: #333;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%23888' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  cursor: pointer;
`;

const AddModalInputWithIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 50px;
  padding: 0 16px;
  background: #f5f5f5;
  border-radius: 10px;
`;

const AddModalFooter = styled.div`
  padding: 0 24px 28px;
`;

const AddModalButton = styled.button`
  width: 100%;
  height: 54px;
  background: #ff871e;
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
`;

const RecommendBox = styled.div`
  background: #fff;
  border-radius: 20px 20px 0 0;
  width: 100%;
  flex: 1;
`;

/* ===== PlannerBox: PlannerContent를 감싸는 부모 컨테이너 ===== */
const PlannerBox = styled.div`
  background: #f8f8f8;
  border-radius: 24px 24px 0 0;
  margin-top: 12px;
  min-height: 400px;
`;

/* ===== PlannerContent 컴포넌트 ===== */
function PlannerContent({ isGenerated, isConfirmed, onConfirmedEdit, onGenerate, scheduleLabel, recommends, schedule, aiInput, onAiChange, onAiSubmit, dayMode }) {
  const [pinModal, setPinModal] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [addTitle, setAddTitle] = useState("");
  const [addTime, setAddTime] = useState("12:00");
  const [addDate, setAddDate] = useState("");
  const [addCategory, setAddCategory] = useState("기타");
  const [addPlace, setAddPlace] = useState("");
  const [pinnedIds, setPinnedIds] = useState(new Set());

  const togglePin = (id) => {
    setPinnedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <>
      {/* AI 입력 */}
      <AiInputSection>
        <AiInput
          type="text"
          placeholder="AI에게 한줄 요청: 번화가에 가서 쇼핑도 하고 밥도..."
          value={aiInput}
          onChange={onAiChange}
          onKeyDown={(e) => { if (e.key === "Enter") onAiSubmit(); }}
        />
        <AiButton onClick={onAiSubmit} aria-label="전송">
          <img src={SendArrow} alt="전송" />
        </AiButton>
      </AiInputSection>

      {/* 일정 없음 or 생성된 일정 */}
      {!isGenerated ? (
        <>
          <RecommendBox>
            <EmptyState>
              <EmptyText>일정이 아직 없어요🥲 생성을 요청해보세요</EmptyText>
            </EmptyState>
            <RecommendSection>
              <SectionTitle>
                <Highlight>나고야</Highlight> 여행지 추천
              </SectionTitle>
              {recommends.map((item) => (
                <RecommendCard key={item.id}>
                  <RecommendImage src={item.image} alt={item.name} />
                  <RecommendContent>
                    <RecommendName>{item.name}</RecommendName>
                    <RecommendLocation>{item.location}</RecommendLocation>
                    <RecommendDesc>{item.desc}</RecommendDesc>
                  </RecommendContent>
                </RecommendCard>
              ))}
            </RecommendSection>
          </RecommendBox>
        </>
      ) : (
        <RecommendBox>
          <ScheduleSection>
            {isConfirmed ? (
              <>
                <ScheduleSubtitle style={{ margin: "0 0 6px" }}>{dayMode ? "일정이 확정됐어요!" : "오늘의 일정이 확정됐어요!"}</ScheduleSubtitle>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <ScheduleTitle style={{ margin: 0 }}>{dayMode ? "전체 일정보기" : "오늘 일정보기"}</ScheduleTitle>
                  <span onClick={onConfirmedEdit} style={{ fontSize: 12, fontWeight: 500, color: "#9a9a9a", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                    편집하기
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#9a9a9a"/>
                    </svg>
                  </span>
                </div>
              </>
            ) : (
              <>
                <ScheduleTitle>
                  {dayMode
                    ? <><ScheduleHighlight>{schedule.length}일</ScheduleHighlight> 동안의 추천일정이에요</>
                    : <><ScheduleHighlight>{scheduleLabel}</ScheduleHighlight>의 추천일정이에요</>
                  }
                </ScheduleTitle>
                <ScheduleSubtitle>일정을 <span style={{ color: "#ff871e" }}>드래그하여</span> 편집하고 여행을 계획해보세요.</ScheduleSubtitle>
              </>
            )}

            <MapWrapper>
              <MapContainer
                center={[35.1706, 136.9067]}
                zoom={14}
                zoomControl={false}
                attributionControl={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Polyline
                  positions={schedule.map((item) => [item.lat, item.lng])}
                  pathOptions={{ color: "#aaa", weight: 2, opacity: 0.8, dashArray: "6 4" }}
                />
                {schedule.map((item) => (
                  <Marker
                    key={item.id}
                    position={[item.lat, item.lng]}
                    icon={L.divIcon({
                      className: "",
                      html: `<div style="width:26px;height:26px;border-radius:50%;background:#ff871e;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;line-height:1;">${item.id}</div>`,
                      iconSize: [26, 26],
                      iconAnchor: [13, 13],
                    })}
                  />
                ))}
              </MapContainer>
            </MapWrapper>
            {!isConfirmed && (
              <MapViewAllBtn>
                전체 대체추천받기
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="#888"/>
                </svg>
              </MapViewAllBtn>
            )}

            <TimelineList>
              {schedule.map((item, idx) => {
                const isLast = idx === schedule.length - 1;
                const LeftComp = isLast ? TimelineLeftLast : TimelineLeft;
                return (
                <TimelineRow key={item.id}>
                  <LeftComp>
                    <NumberBadge>{dayMode ? `${item.id}일차` : item.id}</NumberBadge>
                    <TimePill>{dayMode ? item.date : item.time}</TimePill>
                  </LeftComp>
                  <TimelineCard onClick={() => setPinModal(item)} style={{ cursor: "pointer" }}>
                    <CardTopRow>
                      <TimelineImage src={item.image} alt={item.name} />
                      <TimelineInfo>
                        <TimelineName>{item.name}</TimelineName>
                        <TimelineLocation>{item.location}</TimelineLocation>
                      </TimelineInfo>
                      {!isConfirmed && (
                        <TimelineActions>
                          <ActionBtn onClick={(e) => { e.stopPropagation(); togglePin(item.id); }}>
                            <PinIcon active={pinnedIds.has(item.id)} />
                          </ActionBtn>
                          <ActionBtn onClick={(e) => e.stopPropagation()}><RefreshIcon /></ActionBtn>
                        </TimelineActions>
                      )}
                    </CardTopRow>
                    <TimelineDesc>{item.desc}</TimelineDesc>
                  </TimelineCard>
                </TimelineRow>
                );
              })}
            </TimelineList>
            {!isConfirmed && <ScheduleFooterText>이 일정이 마음에 드시나요?</ScheduleFooterText>}
          </ScheduleSection>
        </RecommendBox>
      )}

      {pinModal && (
        <PinModalOverlay onClick={() => setPinModal(null)}>
          <PinModal onClick={(e) => e.stopPropagation()}>
            <PinModalHeader>
              <PinModalTitleArea>
                <PinModalName>{pinModal.name}</PinModalName>
                {pinModal.subName && <PinModalSubName>{pinModal.subName}</PinModalSubName>}
                {pinModal.address && (
                  <PinModalAddress>
                    <svg width="12" height="14" viewBox="0 0 12 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                      <path d="M6 0C3.243 0 1 2.243 1 5c0 3.75 5 11 5 11s5-7.25 5-11c0-2.757-2.243-5-5-5zm0 7a2 2 0 110-4 2 2 0 010 4z" fill="#9a9a9a"/>
                    </svg>
                    {pinModal.address}
                  </PinModalAddress>
                )}
              </PinModalTitleArea>
              <PinModalClose onClick={() => setPinModal(null)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </PinModalClose>
            </PinModalHeader>
            <PinModalImage src={pinModal.image} alt={pinModal.name} />
            <PinModalBody>
              <PinModalSection>
                <PinModalSectionTitle>이래서 추천해요!</PinModalSectionTitle>
                <PinModalDesc>{pinModal.desc}</PinModalDesc>
              </PinModalSection>
              {pinModal.stayTime && (
                <PinModalSection>
                  <PinModalSectionTitle>이정도 머물러요!</PinModalSectionTitle>
                  <PinModalDesc>{pinModal.stayTime}</PinModalDesc>
                </PinModalSection>
              )}
            </PinModalBody>
          </PinModal>
        </PinModalOverlay>
      )}

      {addModal && (
        <AddModalOverlay onClick={() => setAddModal(false)}>
          <AddModal onClick={(e) => e.stopPropagation()}>
            <AddModalHeader>
              <AddModalTitleArea>
                <AddModalSub>수동으로 개인일정을 알려주세요</AddModalSub>
                <AddModalTitle>일정 추가하기</AddModalTitle>
              </AddModalTitleArea>
              <AddModalClose onClick={() => setAddModal(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </AddModalClose>
            </AddModalHeader>

            <AddModalBody>
              <AddModalField>
                <AddModalLabel>제목</AddModalLabel>
                <AddModalInput
                  placeholder="ex) 팀 저녁 회식"
                  value={addTitle}
                  onChange={(e) => setAddTitle(e.target.value)}
                />
              </AddModalField>

              <AddModalRow>
                <AddModalField style={{ flex: 1 }}>
                  <AddModalLabel>{dayMode ? "날짜" : "시간"}</AddModalLabel>
                  {dayMode ? (
                    <AddModalInput
                      type="date"
                      value={addDate}
                      onChange={(e) => setAddDate(e.target.value)}
                    />
                  ) : (
                    <AddModalSelect value={addTime} onChange={(e) => setAddTime(e.target.value)}>
                      {["06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </AddModalSelect>
                  )}
                </AddModalField>
                <AddModalField style={{ flex: 1 }}>
                  <AddModalLabel>카테고리</AddModalLabel>
                  <AddModalSelect value={addCategory} onChange={(e) => setAddCategory(e.target.value)}>
                    {["기타","식사","쇼핑","관광","숙소","교통","카페"].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </AddModalSelect>
                </AddModalField>
              </AddModalRow>

              <AddModalField>
                <AddModalLabel>장소</AddModalLabel>
                <AddModalInputWithIcon>
                  <svg width="14" height="16" viewBox="0 0 12 16" fill="none">
                    <path d="M6 0C3.243 0 1 2.243 1 5c0 3.75 5 11 5 11s5-7.25 5-11C11 2.243 8.757 0 6 0zm0 7a2 2 0 110-4 2 2 0 010 4z" fill="#bbb"/>
                  </svg>
                  <AddModalInput
                    placeholder="장소 검색"
                    value={addPlace}
                    onChange={(e) => setAddPlace(e.target.value)}
                    style={{ border: "none", background: "transparent", padding: 0, flex: 1 }}
                  />
                </AddModalInputWithIcon>
              </AddModalField>
            </AddModalBody>

            <AddModalFooter>
              <AddModalButton onClick={() => setAddModal(false)}>일정 추가</AddModalButton>
            </AddModalFooter>
          </AddModal>
        </AddModalOverlay>
      )}

      <PlusButton aria-label="일정 추가" onClick={() => setAddModal(true)}>
        <img src={PlusIcon} alt="일정 추가" width="24" height="24" />
      </PlusButton>

      {!isConfirmed && (
        <GenerateButton onClick={onGenerate}>
          <GenerateText>{isGenerated ? "일정 확정하기" : "일정생성 요청하기"}</GenerateText>
          <img src={RightArrow} alt="" style={{ width: 18, height: 18, filter: "brightness(0) invert(1)" }} />
        </GenerateButton>
      )}
    </>
  );
}
