import styled from "styled-components";

export const Screen = styled.div`
  width: 100%;
  max-width: 480px;
  min-height: 100dvh;
  background: #f8f8f8;
  padding-bottom: calc(180px + env(safe-area-inset-bottom));
  overflow-x: hidden;
  margin: 0 auto;
  position: relative;
`;

/* ===== 헤더 ===== */
export const Header = styled.header`
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background: #ff871e;
`;

export const TabContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  height: 100%;
`;

export const Tab = styled.button`
  background: none;
  border: none;
 color: ${(props) => (props.$active ? "#fff" : "rgba(255, 255, 255, 0.55)")};
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  padding: 0 16px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s ease;
`;

/* ===== 날짜 스크롤 영역 ===== */
export const DateScroller = styled.div`
  display: flex;
  overflow-x: auto;
  background: #f8f8f8;
  padding: 16px 0 12px;
  gap: 10px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const DateItem = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 60px;
  min-width: 60px;
  height: 90px;
  border: none;
  border-radius: 999px;
  background: ${(props) => (props.$active ? "#ff871e" : "#fff")};
  cursor: pointer;
  flex-shrink: 0;
  scroll-snap-align: start;
  position: relative;
  transition: all 0.2s ease;

  box-shadow: ${(props) =>
    props.active
      ? "0 4px 12px rgba(255, 135, 30, 0.3)"
      : "0 1px 4px rgba(0, 0, 0, 0.04)"};

  &:first-child { margin-left: 20px; }
  &:last-child  { margin-right: 20px; }
`;

export const TodayDot = styled.span`
  position: absolute;
  top: 14px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #fff;
`;

export const DateDay = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: ${({ active }) => (active ? "#fff" : "#9a9a9a")};
`;

export const DateNum = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${({ active }) => (active ? "#fff" : "#2a2a2a")};
`;

/* ===== 시간 선택 ===== */
export const TimeSelector = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 8px 20px 12px;
  background: #f8f8f8;
  position: relative;
  z-index: 10;
`;

export const TimePickerWrapper = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* active 시 주황 배경, 아니면 흰 배경 */
  background: ${({ $active }) => ($active ? "#ff871e" : "#ffffff")};
  border: 1.5px solid ${({ $active }) => ($active ? "#ff871e" : "#e6e6e6")};
  border-radius: 999px;
  padding: 0 16px;
  height: 44px;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
`;

export const StyledTimeInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 2;

  &::-webkit-calendar-picker-indicator {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    color: transparent;
    cursor: pointer;
  }
`;

export const TimeDisplayText = styled.span`
  font-size: 14px;
  font-weight: 600;
  /* active 시 흰 텍스트, 아니면 회색 */
  color: ${({ $active }) => ($active ? "#ffffff" : "#9a9a9a")};
  pointer-events: none;
  letter-spacing: 0.3px;
`;

export const TimeSeparator = styled.span`
  color: #c4c4c4;
  font-size: 14px;
  font-weight: 400;
  flex-shrink: 0;
`;

/* ===== AI 입력 — 입력창 안에 버튼이 붙은 형태 ===== */
export const AiInputSection = styled.div`
  position: relative;
  padding: 4px 20px 16px;
  background: #f8f8f8;
`;

export const AiInput = styled.input`
  width: 100%;
  height: 52px;
  padding: 0 60px 0 20px; /* 오른쪽에 버튼 공간 확보 */
  border-radius: 999px;
  border: 1px solid #e6e6e6;
  background: #fff;
  font-size: 13px;
  color: #2a2a2a;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s ease;

  &::placeholder {
    color: #b0b0b0;
  }

  &:focus {
    border-color: #ff871e;
  }
`;

export const AiButton = styled.button`
  position: absolute;
  right: 26px; /* AiInputSection padding(20px) + 약간의 안쪽 여백 */
  top: 50%;
  transform: translateY(-65%); /* padding-bottom 보정 */
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #ff871e;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.15s ease, background 0.15s ease;

  img {
    width: 18px;
    height: 18px;
    display: block;
  }

  &:active {
    transform: translateY(-65%) scale(0.95);
  }

  &:hover {
    background: #ff7a05;
  }
`;

/* ===== 빈 상태 ===== */
export const EmptyState = styled.div`
  padding: 16px 20px 8px;
  background: #fff;
  margin: 0 20px;
  border-radius: 14px 14px 0 0;
`;

export const EmptyText = styled.div`
  font-size: 13px;
  color: #9a9a9a;
  font-weight: 500;
`;

/* ===== 추천 섹션 ===== */
export const RecommendSection = styled.section`
  background: #fff;
  margin: 0 20px;
  padding: 0 20px 20px;
  border-radius: 0 0 14px 14px;
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #111;
  margin: 0 0 14px;
  padding-top: 8px;
`;

export const Highlight = styled.span`
  color: #ff871e;
`;

export const RecommendCard = styled.div`
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #fafafa;
  border-radius: 14px;
  margin-bottom: 8px;

  &:last-child { margin-bottom: 0; }
`;

export const RecommendImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
  background: #eee;
`;

export const RecommendContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
`;

export const RecommendName = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #111;
`;

export const RecommendLocation = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #9a9a9a;
  margin-bottom: 4px;
`;

export const RecommendDesc = styled.div`
  font-size: 12px;
  color: #6e6e6e;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

/* ===== + 버튼 ===== */
export const PlusButton = styled.button`
  position: fixed;
  bottom: 168px;
  right: 24px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: #ff871e;
  color: #fff; /* SVG가 currentColor를 쓴다면 이 색상을 따라갑니다 */
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255, 135, 30, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  transition: transform 0.15s ease; /* 클릭 시 부드러운 효과 추가 */

  svg {
    display: block;
    /* 만약 아이콘이 하얀색으로 안 나온다면 아래 주석을 풀어서 사용하세요 */
    /* fill: currentColor; */
    /* stroke: currentColor; */
  }

  &:active { 
    transform: scale(0.95); 
  }
`;

/* ===== 일정 생성 요청 버튼 ===== */
export const GenerateButton = styled.button`
  position: fixed;
  bottom: 96px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  max-width: 440px;
  height: 52px;
  background: #ff871e;
  border: none;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(255, 135, 30, 0.3);
  z-index: 50;

  &:active {
    transform: translateX(-50%) translateY(1px);
    opacity: 0.95;
  }
`;

export const GenerateText = styled.span``;

/* ===== 하단 네비게이션 ===== */
export const BottomNav = styled.nav`
  position: fixed;
  bottom: 18px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  width: 280px;
  height: 60px;
  justify-content: center;
  align-items: center;
  gap: 40px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  z-index: 100;
  margin-bottom: env(safe-area-inset-bottom);
`;

export const NavItem = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const NavIcon = styled.div`
  width: 24px;
  height: 24px;

  img {
    width: 100%;
    height: 100%;
    filter: ${(props) => (props.$active ? "none" : "grayscale(100%) opacity(0.4)")};
    transition: all 0.2s ease;
  }
`;