import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
} from "../styles/Plan";

import TabHome from "../assets/tab-home.svg";
import TabCalendar from "../assets/tab-calendar.svg";
import TabCamera from "../assets/tab-camera.svg";
import TabUser from "../assets/tab-user.svg";
import SendArrow from "../assets/send-arrow.svg";
import PlusIcon from "../assets/plus2.svg";

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
    name: "오스 상점가",
    location: "쇼핑 · 나카구",
    desc: "빈티지 숍, 잡화점, 음식점이 즐비한 나고야의 대표 상점가예요. 젊은 문화와 전통이 공존하는 독특한 분위기로 쇼핑과 산책 모두 즐길 수 있어요.",
    image: "https://picsum.photos/100/100?random=3",
  },
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

// 화살표 SVG (인라인)
const ChevronDown = ({ color = "#fff" }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <path d="M3 5L7 9L11 5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Plan() {
  const navigate = useNavigate();
  const dateScrollerRef = useRef(null);
  const todayItemRef = useRef(null);

  const [activeTab, setActiveTab] = useState("daily");
  const [dates] = useState(() => generateDates(TOTAL_DAYS));
  const [selectedDateKey, setSelectedDateKey] = useState(dates[0].key);

  // 시간 active 상태 (클릭 시 주황 배경)
  const [startTimeActive, setStartTimeActive] = useState(false);
  const [endTimeActive, setEndTimeActive] = useState(false);

  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");
  const [aiInput, setAiInput] = useState("");

  const handleNavClick = (path) => navigate(path);

  const handleSubmitAi = () => {
    if (!aiInput.trim()) return;
    console.log("AI 요청:", {
      date: selectedDateKey,
      startTime,
      endTime,
      prompt: aiInput,
    });
    setAiInput("");
  };

  const handleGenerate = () => {
    console.log("일정 생성 요청", { date: selectedDateKey, startTime, endTime });
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

      {/* 날짜 스크롤러 */}
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
              {item.isToday && isActive && <TodayDot />}
              <DateDay $active={isActive}>{item.day}</DateDay>
              <DateNum $active={isActive}>{item.date}</DateNum>
            </DateItem>
          );
        })}
      </DateScroller>

      {/* 시간 선택 */}
      <TimeSelector>
        {/* 시작 시간 */}
        <TimePickerWrapper $active={startTimeActive}>
          <TimeDisplayText $active={startTimeActive}>
            {formatDisplayTime(startTime)}
          </TimeDisplayText>
          <ChevronDown color={startTimeActive ? "#fff" : "#9a9a9a"} />
          <StyledTimeInput
            type="time"
            value={startTime}
            onFocus={() => setStartTimeActive(true)}
            onBlur={() => setStartTimeActive(false)}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </TimePickerWrapper>

        <TimeSeparator>—</TimeSeparator>

        {/* 종료 시간 */}
        <TimePickerWrapper $active={endTimeActive}>
          <TimeDisplayText $active={endTimeActive}>
            {formatDisplayTime(endTime)}
          </TimeDisplayText>
          <ChevronDown color={endTimeActive ? "#fff" : "#9a9a9a"} />
          <StyledTimeInput
            type="time"
            value={endTime}
            onFocus={() => setEndTimeActive(true)}
            onBlur={() => setEndTimeActive(false)}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </TimePickerWrapper>
      </TimeSelector>

      {/* AI 입력 — 입력창 안에 전송 버튼 */}
      <AiInputSection>
        <AiInput
          type="text"
          placeholder="AI에게 한줄 요청: 번화가에 가서 쇼핑도 하고 밥도..."
          value={aiInput}
          onChange={(e) => setAiInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmitAi();
          }}
        />
        <AiButton onClick={handleSubmitAi} aria-label="전송">
          <img src={SendArrow} alt="전송" />
        </AiButton>
      </AiInputSection>

      <EmptyState>
        <EmptyText>일정이 아직 없어요😢 생성을 요청해보세요</EmptyText>
      </EmptyState>

      <RecommendSection>
        <SectionTitle>
          <Highlight>나고야</Highlight> 여행지 추천
        </SectionTitle>

        {DUMMY_RECOMMENDS.map((item) => (
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

      <PlusButton aria-label="일정 추가">
        <img src={PlusIcon} alt="일정 추가" width="24" height="24" />
      </PlusButton>

      <GenerateButton onClick={handleGenerate}>
        <GenerateText>일정생성 요청하기</GenerateText>
        <span style={{ fontSize: 16 }}>›</span>
      </GenerateButton>

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