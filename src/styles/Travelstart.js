import styled from "styled-components";

export const Screen = styled.div`
  min-height: 100dvh;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  background: #f8f8f8;
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
`;


export const Header = styled.header`
  display: flex;
  align-items: center;
  padding: 10px 16px;
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  color: #111;
`;

export const HeaderTitle = styled.div`
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #111;
  margin-right: 32px;
`;


export const Body = styled.main`
  padding: 24px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const TopMessage = styled.section`
  margin-top: 4px;
`;

export const TopSub = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #2a2a2a;
  margin: 0 0 4px;
`;

export const TopTitle = styled.h1`
  font-size: 14px;
  font-weight: 600;
  color: #2a2a2a;
  margin: 0;
  line-height: 1.45;
  white-space: pre-line;

  span {
    color: #ff871e;
  }
`;


export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;


export const SectionTitle = styled.h2`
  font-size: 14px;
  font-weight: 500;
  color: #000;
  margin: 0;
`;


export const ChipGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Chip = styled.button`
  height: 34px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid ${({ $selected }) => ($selected ? "#ff871e" : "#e6e6e6")};
  background: #fff;
  color: #454545;
  font-weight: 400;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.15s ease;
  white-space: nowrap;

  &:active {
    transform: scale(0.96);
  }
`;

export const RegionChip = Chip;


export const DateDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 14px;
  background: #fff;
  border: 1px solid #e6e6e6;
  border-radius: 99px;
  font-size: 13px;
  font-weight: 500;
  color: #454545;
  flex-wrap: wrap;
`;

export const DateText = styled.span`
  color: #ff871e;
  font-weight: 600;
`;

export const DateDivider = styled.span`
  color: #c4c4c4;
`;


export const CalendarWrap = styled.div`
  background: #fff;
  border-radius: 14px;
  border: 1px solid #e6e6e6;
  padding: 16px 12px;
`;

export const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28px;
  margin-bottom: 6px;
`;

export const CalendarNavBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  color: #454545;
  display: flex;
  align-items: center;
`;

export const CalendarMonthTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #111;
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 6px;
  column-gap: 0;
`;

export const CalendarDayLabel = styled.div`
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: #c4c4c4;
  padding-bottom: 10px;
`;

export const CalendarCell = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  cursor: ${({ $empty }) => ($empty ? "default" : "pointer")};

  
  background: ${({ $isStart, $isEnd, $inRange }) => {
    if ($isStart && $isEnd) return "transparent";
    if ($isStart) return "linear-gradient(to right, transparent 50%, #ffe8d4 50%)";
    if ($isEnd) return "linear-gradient(to right, #ffe8d4 50%, transparent 50%)";
    if ($inRange) return "#ffe8d4";
    return "transparent";
  }};
`;

export const CalendarDay = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 14px;
  font-weight: ${({ $isStart, $isEnd }) => ($isStart || $isEnd ? 700 : 500)};
  color: ${({ $isStart, $isEnd, $today }) => {
    if ($isStart || $isEnd) return "#fff";
    if ($today) return "#ff871e";
    return "#222";
  }};
  background: ${({ $isStart, $isEnd }) =>
    $isStart || $isEnd ? "#ff871e" : "transparent"};
  position: relative;
  z-index: 1;
  box-shadow: ${({ $isStart, $isEnd }) =>
    $isStart || $isEnd ? "0 2px 6px rgba(255, 135, 30, 0.3)" : "none"};
`;


export const BudgetInputWrapper = styled.div`
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid ${({ $focused }) => ($focused ? "#ff871e" : "#e6e6e6")};
  border-radius: 10px;
  padding: 0 14px;
  height: 48px;
  transition: border-color 0.15s;
`;

export const BudgetCurrency = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #454545;
  margin-right: 6px;
`;

export const BudgetInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  font-weight: 600;
  color: #111;
  background: transparent;

  &::placeholder {
    color: #c4c4c4;
    font-weight: 400;
  }
`;

export const BudgetUnit = styled.span`
  font-size: 13px;
  color: #aaa;
  margin-left: 6px;
`;

export const Divider = styled.hr`
  border: 0;
  border-top: 1px solid #e6e6e6;
  margin: 4px 0 0;
`;


export const Footer = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
`;

export const StartButton = styled.button`
  width: 100%;
  height: 54px;
  border: 0;
  border-radius: 10px;
  background: ${({ disabled }) => (disabled ? "#e6e6e6" : "#ff871e")};
  color: ${({ disabled }) => (disabled ? "#aaa" : "#ffffff")};
  font-size: 15px;
  font-weight: 700;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};

  &:active:not(:disabled) {
    transform: translateY(1px);
    opacity: 0.95;
  }
`;
