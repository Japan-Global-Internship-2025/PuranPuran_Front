import styled from "styled-components";

export const Screen = styled.div`
  width: 100vw;
  min-height: 100dvh;
  background: #f8f8f8;
  
  padding-bottom: calc(110px + env(safe-area-inset-bottom));
`;

export const Header = styled.header`
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background: #FF871E;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
`;

export const Logo = styled.img`
  height: 30px;
  display: block;
`;

//예산
export const BudgetCard = styled.div`
  background: #ff871e;
  border-radius: 16px;
  padding: 20px;
  margin: 16px 24px;
  color: #fff;
`;

export const BudgetLabel = styled.div`
  font-size: 13px;
  opacity: 0.9;
  margin-bottom: 12px;
`;

export const BudgetInfo = styled.div`
  margin-bottom: 16px;
`;

export const BudgetAmountLabel = styled.div`
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 4px;
`;

export const BudgetAmount = styled.div`
  font-size: 32px;
  font-weight: 700;
`;

export const BudgetProgress = styled.div`
  margin-top: 16px;
`;

export const BudgetProgressText = styled.div`
  font-size: 12px;
  margin-bottom: 8px;
  opacity: 0.9;
`;

export const BudgetProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
`;

export const BudgetProgressFill = styled.div`
  width: ${props => props.percent}%;
  height: 100%;
  background: #fff;
  border-radius: 4px;
  transition: width 0.3s ease;
`;

export const BudgetDetail = styled.div`
  font-size: 12px;
  opacity: 0.9;
  text-align: right;
`;

export const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 0 24px;
  margin-bottom: 24px;
`;

export const ActionCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  border-radius: 16px;
  border: none;
  background: ${props => props.primary ? '#ff871e' : '#fff'};
  color: ${props => props.primary ? '#fff' : '#111'};
  cursor: pointer;
  box-shadow: ${props => props.primary ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.04)'};
`;

export const ActionIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${props => props.primary ? 'rgba(255, 255, 255, 0.2)' : '#fff5eb'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

export const ActionTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
`;

export const ActionSub = styled.div`
  font-size: 12px;
  opacity: ${props => props.primary ? 0.8 : 0.6};
`;

//통계
export const StatsSection = styled.section`
  padding: 0 24px;
  margin-bottom: 24px;
`;

export const StatsTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #111;
  margin-bottom: 12px;
`;

export const StatsCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 20px;
`;

export const StatsLabel = styled.div`
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
`;

export const StatsAmount = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #111;
  margin-bottom: 8px;
  
  span {
    font-size: 16px;
    font-weight: 400;
  }
`;

export const StatsChange = styled.div`
  display: inline-block;
  padding: 6px 12px;
  background: #e8f5e9;
  color: #4caf50;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`;


export const ExpenseSection = styled.section`
  padding: 0 24px;
  margin-bottom: 24px;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #111;
  margin: 0;
`;

export const MoreButton = styled.button`
  background: none;
  border: none;
  color: #949494;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  img {
    width: 16px;
    height: 16px;
    opacity: 0.6;
  }
`;

export const ExpenseList = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 0 16px;
`;

export const ExpenseItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

export const ExpenseInfo = styled.div``;

export const ExpenseName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #111;
  margin-bottom: 4px;
`;

export const ExpenseLocation = styled.div`
  font-size: 12px;
  color: #949494;
`;

export const ExpenseAmount = styled.div`
  text-align: right;
  font-size: 15px;
  font-weight: 600;
  color: #111;
`;

export const ExpenseYen = styled.div`
  font-size: 12px;
  color: #949494;
  margin-top: 2px;
`;

// 카테고리
export const CategorySection = styled.section`
  padding: 0 24px;
  margin-bottom: 100px;
`;

export const CategoryList = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 16px 20px;
`;

export const CategoryItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 0;

  &:not(:last-child) {
    border-bottom: 1px solid #f5f5f5;
  }
`;

export const CategoryItemHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  width: 100%;
`;

export const CategoryIcon = styled.div`
  width: 24px;
  height: 24px;
  background: transparent;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
`;

export const CategoryInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const CategoryName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #454545;
`;

export const CategoryAmountWrapper = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  margin-left: auto;
  text-align: right;
`;

export const CategoryBar = styled.div`
  width: 100%;
  height: 6px;
  background: #d9d9d9;
  border-radius: 9px;
  overflow: hidden;
`;

export const CategoryFill = styled.div`
  width: ${props => props.percent}%;
  height: 100%;
  background: ${props => props.color || '#ff871e'};
  border-radius: 9px;
  transition: width 0.3s ease;
`;

export const CategoryAmount = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #454545;
`;

export const CategoryPercent = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #949494;
`;

//하단바
export const BottomNav = styled.nav`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  width: 279px;
  height: 62px;
  justify-content: center;
  align-items: center;
  gap: 40px;
  border-radius: 33px;
  background: rgba(255, 255, 255, 0.80);
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.10);
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
    filter: ${props => props.$active ? 'none' : 'grayscale(100%) opacity(0.4)'};
    transition: all 0.2s ease;
  }
  
  &:hover img {
    filter: none;
    opacity: 1;
  }
`;