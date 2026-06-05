import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import PlannerContent from "../components/PlannerContent";
import AddPlanModal from "../components/AddPlanModal";
import LoadingOverlay from "../components/LoadingOverlay";
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
  PlannerBox,
  PlusButton,
  GenerateButton,
  GenerateText,
  BottomNav,
  NavItem,
  NavIcon,
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
import PlusIcon from "../assets/plus2.svg";
import RightArrow from "../assets/uiw_right.svg";

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function generateDatesFromRange(startDateStr, endDateStr) {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  const dates = [];
  const cur = new Date(start);
  
  while (cur <= end) {
    dates.push({
      day: DAY_LABELS[cur.getDay()],
      date: cur.getDate(),
      month: cur.getMonth() + 1,
      year: cur.getFullYear(),
      isToday: cur.toDateString() === new Date().toDateString(),
      key: `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}-${String(cur.getDate()).padStart(2, "0")}`,
    });
    cur.setDate(cur.getDate() + 1);
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

export default function Plan() {
  const navigate = useNavigate();
  const dateScrollerRef = useRef(null);
  const todayItemRef = useRef(null);

  const [activeTab, setActiveTab] = useState("daily");
  
  const [travelId, setTravelId] = useState(null);
  const [travel, setTravel] = useState(null);
  const [dates, setDates] = useState([]);
  const [selectedDateKey, setSelectedDateKey] = useState("");
  const [recommends, setRecommends] = useState([]);
  const [allPlanners, setAllPlanners] = useState([]);

  const [schedule, setSchedule] = useState([]);
  const [currentPlace, setCurrentPlace] = useState("");
  const [currentCategory, setCurrentCategory] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [aiInput, setAiInput] = useState("");

  const [isTotalGenerated, setIsTotalGenerated] = useState(false);
  const [isTotalConfirmed, setIsTotalConfirmed] = useState(false);
  const [totalSchedule, setTotalSchedule] = useState([]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [totalStartDate, setTotalStartDate] = useState(null);
  const [totalEndDate, setTotalEndDate] = useState(null);

  const [addModal, setAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
  
  const [startTimeActive, setStartTimeActive] = useState(false);
  const [endTimeActive, setEndTimeActive] = useState(false);

  const selectedDate = dates.find((d) => d.key === selectedDateKey);

  const handleNavClick = (path) => navigate(path);

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

        const travelData = await api.travel.getOne(tId);
        if (!mounted) return;
        setTravel(travelData);

        if (travelData.travel_start_date && travelData.travel_end_date) {
          const generated = generateDatesFromRange(
            travelData.travel_start_date,
            travelData.travel_end_date
          );
          setDates(generated);
          if (generated.length > 0) {
            setSelectedDateKey(generated[0].key);
          }
          setTotalStartDate(new Date(travelData.travel_start_date));
          setTotalEndDate(new Date(travelData.travel_end_date));
        }

        try {
          const recs = await api.travel.recommendPlaces(tId);
          if (mounted && Array.isArray(recs)) {
            setRecommends(recs.map((rec) => ({
              id: rec.id,
              name: rec.title,
              category: rec.category || "추천 관광지",
              desc: rec.description || "",
              image: rec.image_url || `https://picsum.photos/100/100?random=${rec.id}`,
            })));
          }
        } catch (err) {
          console.warn("recommendPlaces failed", err);
        }

        await refreshPlanners(tId);

      } catch (err) {
        console.warn("load travel data failed", err);
        navigate("/login");
      }
    })();
    return () => { mounted = false; };
  }, [navigate]);

  const refreshPlanners = async (tId) => {
    try {
      const planners = await api.planner.getAll(tId);
      setAllPlanners(planners || []);
      return planners;
    } catch (err) {
      console.warn("getAll planners failed", err);
      return [];
    }
  };

  useEffect(() => {
    if (allPlanners.length > 0) {
      // 여행 기간에 해당하는 DailyPlanner들만 모아서 totalSchedule로 변환
      const mapped = allPlanners
        .sort((a, b) => new Date(a.plan_date) - new Date(b.plan_date))
        .map((plan, index) => ({
          id: index + 1,
          date: plan.plan_date,
          name: plan.place || "여행지",
          subName: plan.category || "",
          address: "",
          location: plan.category || "관광",
          desc: plan.daily_description || plan.ai_request || "저장된 일정",
          stayTime: "하루 일정",
          image: `https://picsum.photos/400/200?random=${index + 100}`,
          lat: 35.1706,
          lng: 136.9067
        }));
      
      if (mapped.length > 0) {
        setTotalSchedule(mapped);
        setIsTotalGenerated(true);
        setIsTotalConfirmed(true);
      }
    }
  }, [allPlanners]);

  useEffect(() => {
    if (!selectedDateKey || !allPlanners.length) {
      setSchedule([]);
      setCurrentPlace("");
      setCurrentCategory("");
      setIsGenerated(false);
      setIsConfirmed(false);
      return;
    }

    const matchedPlanner = allPlanners.find(
      (p) => p.plan_date === selectedDateKey
    );

    if (matchedPlanner) {
      const hasItems = Array.isArray(matchedPlanner.items) && matchedPlanner.items.length > 0;
      const mapped = (matchedPlanner.items || []).map((item) => ({
        id: item.id || item.sequence,
        time: item.visit_time,
        name: item.place_name,
        subName: item.location || "",
        address: item.location || "",
        location: item.category,
        desc: item.description,
        stayTime: "약 1시간",
        image: item.image_url || `https://picsum.photos/400/200?random=${item.id}`,
        lat: Number(item.latitude) || 35.1706,
        lng: Number(item.longitude) || 136.9067,
      })).sort((a, b) => a.id - b.id);

      setSchedule(mapped);
      setCurrentPlace(matchedPlanner.place || "");
      setCurrentCategory(matchedPlanner.category || "");
      setStartTime(matchedPlanner.start_time || "09:00");
      setEndTime(matchedPlanner.end_time || "18:00");
      setAiInput(matchedPlanner.ai_request || "");
      
      // 상세 일정이 있을 때만 확정 상태로 표시
      setIsGenerated(hasItems);
      setIsConfirmed(hasItems);
    } else {
      setSchedule([]);
      setCurrentPlace("");
      setCurrentCategory("");
      setIsGenerated(false);
      setIsConfirmed(false);
    }
  }, [selectedDateKey, allPlanners]);

  const handleSubmitAi = () => {
    if (!aiInput.trim()) return;
    if (activeTab === "daily") handleGenerate();
    else handleTotalGenerate();
  };

  const handleGenerate = async (forceRegenerate = false) => {
    if (isGenerated && !forceRegenerate) {
      await handleConfirmSave();
    } else {
      setIsLoading(true);
      try {
        const body = {
          plan_date: selectedDateKey,
          start_time: startTime.slice(0, 5),
          end_time: endTime.slice(0, 5),
          ai_request: aiInput
        };
        const response = await api.planner.generate(travelId, body);
        
        if (response && response.items) {
          const mapped = response.items.map((item) => ({
            id: item.id || item.sequence,
            time: item.visit_time,
            name: item.place_name,
            subName: item.location || "",
            address: item.location || "",
            location: item.category,
            desc: item.description,
            stayTime: "약 1시간",
            image: item.image_url || `https://picsum.photos/400/200?random=${item.id}`,
            lat: Number(item.latitude) || 35.1706,
            lng: Number(item.longitude) || 136.9067,
          })).sort((a, b) => a.id - b.id);

          setSchedule(mapped);
          setCurrentPlace(response.place || "여행지");
          setCurrentCategory(response.category || "관광");
          setIsGenerated(true);
          setIsConfirmed(false);
        } else {
          alert("일정 생성에 실패했습니다.");
        }
      } catch (err) {
        console.error("generate daily plan failed", err);
        alert("일정 생성 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleConfirmSave = async () => {
    setIsLoading(true);
    try {
      const body = {
        place: currentPlace || "여행지",
        category: currentCategory || "관광",
        plan_date: selectedDateKey,
        start_time: startTime,
        end_time: endTime,
        ai_request: aiInput,
        items: schedule.map((item, index) => ({
          visit_time: item.time || "12:00",
          place_name: item.name,
          category: item.location || "기타",
          description: item.desc || "",
          latitude: Number(item.lat),
          longitude: Number(item.lng),
          image_url: item.image || `https://picsum.photos/400/200?random=${index}`,
        }))
      };
      
      await api.planner.save(travelId, body);
      alert("일정이 성공적으로 확정 저장되었습니다.");
      setIsConfirmed(true);
      await refreshPlanners(travelId);
    } catch (err) {
      console.error("save daily plan failed", err);
      alert("일정 저장 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmedEdit = () => {
    setIsConfirmed(false);
  };

  const handleTotalGenerate = async (forceRegenerate = false) => {
    if (isTotalGenerated && !forceRegenerate) {
      await handleTotalConfirmSave();
    } else {
      setIsLoading(true);
      try {
        const response = await api.planner.totalGenerate(travelId);
        if (response && Array.isArray(response.dailyPlans)) {
          const mapped = response.dailyPlans.map((plan, index) => ({
            id: index + 1,
            date: plan.plan_date,
            name: plan.place || "여행지",
            subName: plan.category || "",
            address: "",
            location: plan.category || "관광",
            desc: plan.daily_description || "",
            stayTime: "하루 일정",
            image: `https://picsum.photos/400/200?random=${index + 100}`,
            lat: 35.1706,
            lng: 136.9067
          }));
          setTotalSchedule(mapped);
          setIsTotalGenerated(true);
          setIsTotalConfirmed(false);
        } else {
          alert("전체 일정 요약 생성에 실패했습니다.");
        }
      } catch (err) {
        console.error("generate total plan failed", err);
        alert("전체 일정 요약 생성 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleTotalConfirmSave = async () => {
    setIsLoading(true);
    try {
      const body = {
        dailyPlans: totalSchedule.map(item => ({
          plan_date: item.date,
          place: item.name,
          category: item.location,
          daily_description: item.desc
        }))
      };
      await api.planner.totalSave(travelId, body);
      
      const places = totalSchedule.map(item => item.name);
      await api.planner.totalPlacesSave(travelId, { places });

      alert("전체 일정이 성공적으로 저장되었습니다.");
      setIsTotalConfirmed(true);
      await refreshPlanners(travelId);
    } catch (err) {
      console.error("save total plan failed", err);
      alert("전체 일정 저장 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const isCurrentTabConfirmed = activeTab === "daily" ? isConfirmed : isTotalConfirmed;
  const isCurrentTabGenerated = activeTab === "daily" ? isGenerated : isTotalGenerated;
  const currentGenerateHandler = () => activeTab === "daily" ? handleGenerate() : handleTotalGenerate();

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

      {activeTab === "total" && (
        <>
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
              onGenerate={() => handleTotalGenerate(true)}
              scheduleLabel="전체 여행"
              recommends={recommends}
              schedule={totalSchedule.length > 0 ? totalSchedule : (() => {
                if (!totalStartDate || !totalEndDate) return [];
                const days = [];
                const cur = new Date(totalStartDate);
                let i = 1;
                while (cur <= totalEndDate) {
                  const m = cur.getMonth() + 1;
                  const d = cur.getDate();
                  days.push({
                    id: i,
                    date: `${cur.getFullYear()}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
                    name: `${travel?.travel_region || ""} 관광`,
                    subName: "",
                    address: "",
                    location: "관광",
                    desc: "이날의 대략적인 일정을 생성해보세요.",
                    stayTime: "하루 일정",
                    image: `https://picsum.photos/400/200?random=${i + 100}`,
                    lat: 35.1706,
                    lng: 136.9067
                  });
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
              onGenerate={() => handleGenerate(true)}
              scheduleLabel={selectedDate ? `${selectedDate.month}월 ${selectedDate.date}일 ${selectedDate.day}요일` : "일정"}
              recommends={recommends}
              schedule={schedule}
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

      <AddPlanModal 
        isOpen={addModal} 
        onClose={() => setAddModal(false)} 
        dayMode={activeTab === "total"} 
      />

      <PlusButton aria-label="일정 추가" onClick={() => setAddModal(true)}>
        <img src={PlusIcon} alt="일정 추가" width="24" height="24" />
      </PlusButton>

      {!isCurrentTabConfirmed && (
        <GenerateButton onClick={currentGenerateHandler}>
          <GenerateText>{isCurrentTabGenerated ? "일정 확정하기" : "일정생성 요청하기"}</GenerateText>
          <img src={RightArrow} alt="" style={{ width: 18, height: 18, filter: "brightness(0) invert(1)" }} />
        </GenerateButton>
      )}

      {isLoading && (
        <LoadingOverlay 
          message={isCurrentTabGenerated ? "일정을 저장하고 있어요..." : "AI가 최적의 일정을 짜고 있어요..."} 
        />
      )}
    </Screen>
  );
}
