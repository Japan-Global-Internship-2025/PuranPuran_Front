import styled from "styled-components";

export const Screen = styled.div`
  width: 100%;
  max-width: 480px;
  min-height: 100dvh;
  background: #f8f8f8;
  margin: 0 auto;
  padding-bottom: 40px;
`;

export const LogoHeader = styled.div`
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 20px;
  background: #ff871e;
`;

export const Logo = styled.img`
  height: 24px;
`;

export const Header = styled.header`
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background: #fff;
  border-bottom: 1px solid #f5f5f5;
`;

export const BackBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
`;

export const HeaderTitle = styled.div`
  flex: 1;
  text-align: center;
  font-size: 17px;
  font-weight: 700;
  color: #454545;
`;

export const CalendarCard = styled.div`
  background: #fff;
  border-radius: 20px;
  margin: 20px 16px;
  padding: 20px 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
`;

export const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const NavBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 10px;
  display: flex;
  align-items: center;
`;

export const MonthTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #111;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px 0;
`;

export const DayLabel = styled.div`
  text-align: center;
  font-size: 13px;
  color: #aaa;
  font-weight: 500;
  padding-bottom: 12px;
`;

export const Cell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 4px 0;
  cursor: pointer;
  min-height: 44px;
`;

export const DayNum = styled.div`
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

export const Dot = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${({ $selected }) => ($selected ? '#fff' : '#ff871e')};
`;

export const DetailSection = styled.div`
  margin: 0 16px;
  padding: 0;
`;

export const DetailHeader = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #111;
  margin-bottom: 20px;
  padding: 0 8px;
`;

export const EmptyText = styled.div`
  font-size: 14px;
  color: #aaa;
  text-align: center;
  padding: 40px 16px;
`;

export const ExpenseItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.03);
  margin-bottom: 12px;
  cursor: pointer;
  transition: transform 0.1s ease;
  &:active { transform: scale(0.99); }
  &:last-child { margin-bottom: 0; }
`;

export const ExpenseInfo = styled.div``;

export const ExpenseName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #111;
  margin-bottom: 3px;
`;

export const ExpenseLocation = styled.div`
  font-size: 12px;
  color: #aaa;
`;

export const ExpenseRight = styled.div`
  text-align: right;
`;

export const ExpenseKrw = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #111;
`;

export const ExpenseYen = styled.div`
  font-size: 12px;
  color: #aaa;
  margin-top: 2px;
`;
