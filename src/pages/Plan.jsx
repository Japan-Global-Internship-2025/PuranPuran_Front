import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
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


import TabHome from "../assets/tab-home.svg";
import TabCalendar from "../assets/tab-calendar.svg";
import TabCamera from "../assets/tab-camera.svg";
import TabUser from "../assets/tab-user.svg";
import SendArrow from "../assets/send-arrow.svg";
import PlusIcon from "../assets/plus2.svg";
import RightArrow from "../assets/uiw_right.svg";

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

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
  { id: 1, time: "12:00", name: "오스상점가", location: "소매 · 역주변", desc: "일본에서 가장 활기 넘치는 상점가 중 하나로, 가타레세풍의 상가와 저렴한 음식점을 즐길 수 있어요.", image: "https://picsum.photos/100/100?random=30", lat: 35.159, lng: 136.8985 },
  { id: 2, time: "14:00", name: "아베혼 본점", location: "쇼핑 · 시가", desc: "나고야를 대표하는 백화점으로 유명한 브랜드와 다양한 식당이 있어 쇼핑과 식사를 한 번에 해결할 수 있어요.", image: "https://picsum.photos/100/100?random=31", lat: 35.1706, lng: 136.9067 },
  { id: 3, time: "15:00", name: "히로스 사카에 본점", location: "소매 · 카페", desc: "현지인과 관광객 모두에게 인기 있는 복합문화공간으로 쇼핑과 카페를 동시에 즐길 수 있는 공간이에요.", image: "https://picsum.photos/100/100?random=32", lat: 35.1709, lng: 136.9071 },
  { id: 4, time: "16:00", name: "오아시스 21", location: "쇼핑 · 나비가", desc: "유리로 된 지붕 구조물이 인상적인 복합시설로, 아래에는 버스 터미널과 상점들이 있어 나고야의 랜드마크에요.", image: "https://picsum.photos/100/100?random=33", lat: 35.1701, lng: 136.9075 },
  { id: 5, time: "17:00", name: "니고 카페로", location: "카페", desc: "나고야에서 가장 유명한 카페 중 하나로, 특별한 분위기와 독특한 메뉴로 현지인들에게 사랑받는 공간이에요.", image: "https://picsum.photos/100/100?random=34", lat: 35.1722, lng: 136.9055 },
];

function generateDates(start_date, end_date) {
  const start = new Date(start_date);
  start.setHours(0, 0, 0, 0);
  const dates = [];
  const totalDays = Math.ceil((new Date(end_date) - start) / (1000 * 60 * 60 * 24)) + 1;
  // console.log('Generating dates from', start_date, 'to', end_date, 'totalDays:', totalDays);
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
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

const PinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#d0d0d0" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="#d0d0d0" />
  </svg>
);

export default function Plan() {
  const navigate = useNavigate();
  const dateScrollerRef = useRef(null);
  const todayItemRef = useRef(null);

  const [totalDays, setTotalDays] = useState(7);
  const [activeTab, setActiveTab] = useState("daily");
  const [dates, setDates] = useState(() => generateDates(new Date(), new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)));
  const [selectedDateKey, setSelectedDateKey] = useState(dates[0].key);
  const [isGenerated, setIsGenerated] = useState(false);
  const [user, setUser] = useState(null);
  const [travel, setTravel] = useState(null);

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

  useEffect(() => {
    (async () => {
      try {
        const u = await api.auth.getUser();
        const fetchedUser = u?.data ?? null;
        setUser(fetchedUser);
        if (!fetchedUser) {
          alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
          navigate("/login");
        }

        try {
          const travelId = fetchedUser.lastest_travel_id;
          const tr = await api.travel.getOne(travelId);
          if (!tr.data && tr.status === 404) {
            alert("현재 여행 정보를 불러올 수 없습니다. 여행 시작 페이지로 이동합니다.");
            navigate("/travelstart");
          }
          await setTravel(tr.data);
          setDates(await generateDates(tr.data.travel_start_date, tr.data.travel_end_date));
          
          const planner = await api.planner.getAll(travelId);

          if (!isGenerated) {
            const rec = await api.travel.recommendPlaces(travelId);
          }
        }
        catch (err) {
          console.warn('get travel failed', err);
        }
      } catch (err) {
        console.warn('getUser failed', err);
        alert("사용자 정보를 불러오는 데 실패했습니다. 로그인 페이지로 이동합니다.");
        navigate("/login");
      }
    })();
  }, [navigate]);

  const handleGenerate = () => {
    (async () => {
      try {
        if (isGenerated) {
          console.log("일정 확정");
        } else {
          const travelId = user.lastest_travel_id;
          const body = { prompt: aiInput, date: selectedDate?.key };
          if (activeTab === 'daily') {
            const res = await api.planner.generate(travelId, body);
            console.log('planner.generate res', res);
          } else {
            const res = await api.planner.totalGenerate(travelId, body);
            console.log('planner.totalGenerate res', res);
          }
          setIsGenerated(true);
        }
      } catch (err) {
        console.error('generate failed', err);
        alert('일정 생성에 실패했습니다.');
      }
    })();
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const u = await api.auth.getUser();
        if (!mounted) return;
        setUser(u?.data ?? null);
      } catch (err) {
        console.warn('getUser failed', err);
      }
    })();
    return () => { mounted = false };
  }, []);

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

      {/* AI 입력 */}
      <AiInputSection>
        <AiInput
          type="text"
          placeholder="AI에게 한줄 요청: 번화가에 가서 쇼핑도 하고 밥도..."
          value={aiInput}
          onChange={(e) => setAiInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmitAi(); }}
        />
        <AiButton onClick={handleSubmitAi} aria-label="전송">
          <img src={SendArrow} alt="전송" />
        </AiButton>
      </AiInputSection>

      {/* 일정 없음 or 생성된 일정 */}
      {!isGenerated ? (
        <>
          <EmptyState>
            <EmptyText>일정이 아직 없어요🥲 생성을 요청해보세요</EmptyText>
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
        </>
      ) : (
        <ScheduleSection>
          <ScheduleTitle>
            <ScheduleHighlight>
              {selectedDate?.date}일 {selectedDate?.day}요일
            </ScheduleHighlight>의 추천일정이에요
          </ScheduleTitle>
          <ScheduleSubtitle>일정을 드래그하며 편집하고 여행을 계획해보세요.</ScheduleSubtitle>

          {/* 지도 */}
          <MapWrapper>
            <MapContainer
              center={[35.1706, 136.9067]}
              zoom={14}
              zoomControl={false}
              attributionControl={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {DUMMY_SCHEDULE.map((item) => (
                <CircleMarker
                  key={item.id}
                  center={[item.lat, item.lng]}
                  radius={10}
                  pathOptions={{ color: "#fff", fillColor: "#ff871e", fillOpacity: 1, weight: 2 }}
                >
                  <Popup>{item.name}</Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </MapWrapper>
          <MapViewAllBtn>
            전체 지도보기
            <img src={RightArrow} alt="" style={{ width: 12, height: 12, opacity: 0.5 }} />
          </MapViewAllBtn>

          {/* 타임라인 */}
          <TimelineList>
            {DUMMY_SCHEDULE.map((item) => (
              <TimelineRow key={item.id}>
                <TimelineLeft>
                  <NumberBadge>{item.id}</NumberBadge>
                  <TimePill>{item.time}</TimePill>
                </TimelineLeft>
                <TimelineCard>
                  <CardTopRow>
                    <TimelineImage src={item.image} alt={item.name} />
                    <TimelineInfo>
                      <TimelineName>{item.name}</TimelineName>
                      <TimelineLocation>{item.location}</TimelineLocation>
                    </TimelineInfo>
                    <TimelineActions>
                      <ActionBtn><PinIcon /></ActionBtn>
                      <ActionBtn><RefreshIcon /></ActionBtn>
                    </TimelineActions>
                  </CardTopRow>
                  <TimelineDesc>{item.desc}</TimelineDesc>
                </TimelineCard>
              </TimelineRow>
            ))}
          </TimelineList>
          <ScheduleFooterText>이 일정이 마음에 드시나요?</ScheduleFooterText>
        </ScheduleSection>
      )}

      <PlusButton aria-label="일정 추가">
        <img src={PlusIcon} alt="일정 추가" width="24" height="24" />
      </PlusButton>

      <GenerateButton onClick={handleGenerate}>
        <GenerateText>{isGenerated ? "일정 확정하기" : "일정생성 요청하기"}</GenerateText>
        <img src={RightArrow} alt="" style={{ width: 18, height: 18, filter: "brightness(0) invert(1)" }} />
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
