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
  font-weight: 500;
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
    props.$active
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
  background: ${({ $active }) => ($active ? "#fff" : "#ff871e")};
`;

export const DateDay = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: ${({ $active }) => ($active ? "#fff" : "#9a9a9a")};
`;

export const DateNum = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: ${({ $active }) => ($active ? "#fff" : "#616161")};
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
  background: ${({ $active }) => ($active ? "#ff871e" : "#ffffff")};
  border: 1.5px solid ${({ $active }) => ($active ? "#ff871e" : "#e6e6e6")};
  border-radius: 999px;
  padding: 0 16px;
  height: 35px;
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
  font-weight: 500;
  color: ${({ $active }) => ($active ? "#ffffff" : "#ff871e")};
  pointer-events: none;
  letter-spacing: 1.5px;
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
  padding: 16px 20px 0px;
  background: transparent;
`;

export const EmptyText = styled.div`
  font-size: 13px;
  color: #939393;
  font-weight: 500;
  letter-spacing: -0.1px;
`;

/* ===== 추천 섹션 ===== */
export const RecommendSection = styled.section`
  background: transparent;
  margin: 0;
  padding: 4px 20px 200px;
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #2a2a2a;
  margin: 0 0 12px;
  padding-top: 10px;
  letter-spacing: -0.3px;
`;

export const Highlight = styled.span`
  color: #ff871e;
`;

export const RecommendCard = styled.div`
  display: flex;
  gap: 14px;
  padding: 14px 12px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 14px;
  margin-bottom: 10px;

  &:last-child { margin-bottom: 0; }
`;

export const RecommendImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
  background: #ddd;
`;

export const RecommendContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  flex: 1;
  min-width: 0;
  justify-content: center;
`;

export const RecommendName = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #111;
  margin-bottom: 2px;
`;

export const RecommendLocation = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #9a9a9a;
  margin-bottom: 6px;
`;

export const RecommendDesc = styled.div`
  font-size: 12px;
  color: #777;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

/* ===== + 버튼 ===== */
export const PlusButton = styled.button`
  position: fixed;
  bottom: calc(148px + env(safe-area-inset-bottom));
  right: 20px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  background: #ff871e;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(255, 135, 30, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  img {
    width: 22px;
    height: 22px;
    display: block;
    filter: brightness(0) invert(1);
  }

  &:active {
    transform: scale(0.94);
    box-shadow: 0 2px 8px rgba(255, 135, 30, 0.35);
  }
`;

/* ===== 일정 생성 요청 버튼 ===== */
export const GenerateButton = styled.button`
  position: fixed;
  bottom: calc(86px + env(safe-area-inset-bottom));
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 40px);
  max-width: 440px;
  height: 54px;
  background: #ff871e;
  border: none;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: -0.2px;
  box-shadow: 0 4px 18px rgba(255, 135, 30, 0.35);
  z-index: 50;

  &:active {
    transform: translateX(-50%) translateY(1px);
    opacity: 0.95;
  }
`;

export const GenerateText = styled.span`
  font-size: 16px;
  font-weight: 700;
`;

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
    filter: ${(props) =>
      props.$active
        ? "invert(58%) sepia(88%) saturate(600%) hue-rotate(345deg) brightness(107%) contrast(101%)"
        : "grayscale(100%) opacity(0.4)"};
    transition: all 0.2s ease;
  }
`;

/* ===== 생성된 일정 뷰 ===== */
export const ScheduleSection = styled.div`
  background: transparent;
  padding: 20px 20px 0;
`;

export const ScheduleTitle = styled.h2`
  font-size: 18px;
  font-weight: 800;
  color: #111;
  margin: 0 0 4px;
  letter-spacing: -0.3px;
  line-height: 1.4;
`;

export const ScheduleHighlight = styled.span`
  color: #ff871e;
`;

export const ScheduleSubtitle = styled.p`
  font-size: 12px;
  color: #aaa;
  margin: 0 0 16px;
`;

export const MapWrapper = styled.div`
  width: calc(100% + 40px);
  height: 200px;
  margin-left: -20px;
  margin-right: -20px;
  overflow: hidden;
  margin-bottom: 28px;

  .leaflet-container {
    width: 100%;
    height: 100%;
  }
`;

export const MapViewAllBtn = styled.button`
  background: none;
  border: none;
  font-size: 12px;
  color: #888;
  cursor: pointer;
  padding: 0;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
`;

export const ScheduleFooterText = styled.p`
  font-size: 12px;
  color: #bbb;
  text-align: center;
  margin: 8px 0 100px;
`;

export const TimelineList = styled.div`
  padding-bottom: 8px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: 28px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #ffe0cc;
    z-index: 0;
  }
`;

export const TimelineRow = styled.div`
  display: flex;
  align-items: flex-start;
  padding-bottom: 16px;
`;

export const TimelineLeft = styled.div`
  width: fit-content;
  flex-shrink: 0;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  position: relative;
  z-index: 1;
`;

export const TimelineLeftLast = styled.div`
  width: fit-content;
  flex-shrink: 0;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  position: relative;
  z-index: 1;
`;

export const NumberBadge = styled.div`
  width: 44px;
  height: 26px;
  border-radius: 999px;
  background: #ff871e;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
`;

export const TimePill = styled.div`
  border: 1.5px solid #ff871e;
  border-radius: 999px;
  padding: 3px 7px;
  font-size: 10px;
  font-weight: 600;
  color: #ff871e;
  background: #fff;
  white-space: nowrap;
  text-align: center;
`;

export const TimelineCard = styled.div`
  flex: 1;
  min-width: 0;
  background: #fff;
  border: 1.5px solid #e0e0f0;
  border-radius: 14px;
  padding: 14px 14px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const CardTopRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

export const TimelineImage = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
  background: #ddd;
`;

export const TimelineInfo = styled.div`
  flex: 1;
  min-width: 0;
  padding-top: 4px;
`;

export const TimelineName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #111;
  margin-bottom: 4px;
`;

export const TimelineLocation = styled.div`
  font-size: 12px;
  color: #888;
  font-weight: 400;
`;

export const TimelineDesc = styled.div`
  font-size: 14px;
  color: #616161;
  line-height: 1.6;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const TimelineActions = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
  flex-shrink: 0;
  padding-top: 2px;
`;

export const ActionBtn = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s;

  &:active { color: #ff871e; }
`;

/* ===== RecommendBox / PlannerBox ===== */
export const RecommendBox = styled.div`
  background: #fff;
  border-radius: 20px 20px 0 0;
  width: 100%;
  flex: 1;
`;

export const PlannerBox = styled.div`
  background: #f8f8f8;
  border-radius: 24px 24px 0 0;
  margin-top: 12px;
  min-height: 400px;
`;

/* ===== Pin Modal ===== */
export const PinModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(3, 3, 3, 0.52);
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
`;

export const PinModal = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 335px;
  border-radius: 14px;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.22);
`;

export const PinModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 28px 28px 20px;
  gap: 8px;
`;

export const PinModalTitleArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 0;
`;

export const PinModalName = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #2a2a2a;
`;

export const PinModalSubName = styled.div`
  font-size: 12px;
  color: #949494;
  margin-top: -4px;
`;

export const PinModalAddress = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 4px;
  font-size: 11px;
  color: #bfbcbc;
  margin-top: 8px;
  line-height: 1.4;
`;

export const PinModalClose = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;

export const PinModalImage = styled.img`
  width: calc(100% - 56px);
  height: 120px;
  object-fit: cover;
  flex-shrink: 0;
  border-radius: 10px;
  margin: 0 28px;
`;

export const PinModalBody = styled.div`
  padding: 20px 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const PinModalSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const PinModalSectionTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #f27100;
`;

export const PinModalDesc = styled.div`
  font-size: 12px;
  color: #616161;
  line-height: 1.65;
`;

/* ===== Add Modal ===== */
export const AddModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(3, 3, 3, 0.52);
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
`;

export const AddModal = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 355px;
  border-radius: 20px;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.22);
`;

export const AddModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 28px 24px 20px;
  gap: 8px;
`;

export const AddModalTitleArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const AddModalSub = styled.div`
  font-size: 12px;
  color: #aaa;
`;

export const AddModalTitle = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #111;
`;

export const AddModalClose = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;

export const AddModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 0 24px 24px;
`;

export const AddModalRow = styled.div`
  display: flex;
  gap: 12px;
`;

export const AddModalField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const AddModalLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #333;
`;

export const AddModalInput = styled.input`
  width: 100%;
  height: 50px;
  padding: 0 16px;
  background: #f5f5f5;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  color: #333;
  outline: none;
  box-sizing: border-box;
  &::placeholder { color: #bbb; }
`;

export const AddModalSelect = styled.select`
  width: 100%;
  height: 50px;
  padding: 0 16px;
  background: #f5f5f5;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  color: #333;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%23888' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  cursor: pointer;
`;

export const AddModalInputWithIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 50px;
  padding: 0 16px;
  background: #f5f5f5;
  border-radius: 10px;
`;

export const AddModalFooter = styled.div`
  padding: 0 24px 28px;
`;

export const AddModalButton = styled.button`
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