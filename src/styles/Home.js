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

export const Logo = styled.h1`
  margin: 0;
  display: flex;
  align-items: center;
  
  img {
    height: 30px; 
    display: block;
  }
`;

export const WelcomeSection = styled.section`
  padding: 16px 20px 12px;
`;

export const UserName = styled.div`
  font-size: 20px;
  font-weight: 600;
`;

export const NameOrange = styled.span`
  color: #ff871e;
`;

export const NameBlack = styled.span`
  color: #2a2a2a;
  margin-left: 0px; 
`;

export const WelcomeText = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: #2a2a2a;
  margin-bottom: 18px;
`;

// 예산
export const BudgetCard = styled.div`
  background: #ff871e;
  border-radius: 16px;
  padding: 16px;
  color: #fff;
`;

export const BudgetLabel = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.22);
  font-size: 11px;
  font-weight: 400;
  line-height: 12px;
  margin-bottom: 10px;
`;

export const BudgetAmount = styled.div`
  font-size: 32px;
  font-weight: 600;
  letter-spacing: -0.5px;
  margin-bottom: 10px;
  line-height: 39px;
`;

export const BudgetNoticeWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const BudgetBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  width: 49px;
  height: 20px;
  border-radius: 20px;
  background: #F75044;
  font-size: 9px;
  font-weight: 600;
  margin-right: 8px;
`;


export const BudgeIcon = styled.img`
  width: 16px;
  height: 30px;
  transform: scale(0.9); 
`;

export const BudgetNotice = styled.span`
  font-size: 11px;
  color: #fff;
  font-weight: 400;
  line-height: 13px;
  opacity: 0.95;
`;

// 환율
export const ExchangeCard = styled.div`
  margin: 10px 20px 0;
  background: #fff;
  border-radius: 14px;
  padding: 14px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);
`;

export const ExchangeIcon = styled.div`
  width: 59px;
  height: 59px;
  padding: 7px;
  border-radius: 12px;
  background: #ff871e;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 30px;
  font-weight: 400;
`;

export const ExchangeInfo = styled.div`
  flex: 1;
`;

export const ExchangeTime = styled.div`
  color: #9A9A9A;
  font-family: "Pretendard Variable";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 13px; /* 108.333% */
`;
export const ExchangeRateRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
`;
export const ExchangeRate = styled.div`
  color: #454545;
  font-family: "Pretendard Variable";
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 30px; /* 125% */

  span {
    margin-left: 6px;
    font-size: 12px;
    font-weight: 600;
    color: #9a9a9a;
  }
`;
export const ExchangeUnit = styled.span`
  font-size: 16px;
  color: #9a9a9a;
  font-weight: 600;
`;
export const ExchangeUit = styled.span`
  font-size: 11px;
  color: #ccc;
  font-weight: 400;
`;
export const ExchangeCurrency = styled.div`
  font-size: 11px;
  color: #9a9a9a;
  font-weight: 400;
  line-height: 13px;
  margin-top: 2px;
`;
export const ExchangeChange = styled.div`
  text-align: right;
  font-size: 16px;
  font-weight: 600;
  color: ${(p) => (p.trend === "up" ? "#f35044" : p.trend === "down" ? "#007aff" : "#111")};

  span {
    display: block;
    margin-top: 2px;
    font-size: 11px;
    font-weight: 400;
    color: #9a9a9a;
  }
`;

export const SectionHeader = styled.div`
  margin: 24px 20px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #2a2a2a;
`;

export const MoreButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #9a9a9a;
  cursor: pointer;

  img {
    width: 16px;
    height: 16px;
    opacity: 0.55;
  }

  span {
    font-size: 12px;
    font-weight: 800;
    color: #9a9a9a;
  }
`;

export const SectionCard = styled.div`
  margin: 0 20px;
  background: #fff;
  border-radius: 16px;
  padding: 10px 14px;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);
`;

// 일정 리스트
export const ScheduleList = styled.div`
  padding: 6px 6px;
`;

export const ScheduleItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  position: relative;
  
  &::before {
    content: "";
    position: absolute;
    left: 11px; 
    top: 38px; 
    bottom: -4px; 
    width: 1px;
    background: #e0e0e0;
  }
  
  &:first-child {
    padding-top: 0;
  }
  
  &:first-child::before {
    top: 20px; 
  }
  
  &:last-child {
    padding-bottom: 0;
  }
  

  &:last-child::before {
    bottom: 8px; 
  }
`;

export const ScheduleTime = styled.div`
  font-size: 12px;
  color: #9a9a9a;
  min-width: 42px;
  font-weight: 600;
`;

export const ScheduleDot = styled.div`
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 3px; 
  
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

export const ScheduleContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;

export const ScheduleTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #454545;
  line-height: 17px;
`;


export const ScheduleTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px; /* 상하 여백을 살짝 주어 둥근 테두리와 균형을 맞췄습니다 */
  font-size: 12px;
  font-weight: 400;
  width: fit-content;
  color: #454545;

  /* 피그마에서 제공된 둥글기 공통 적용 */
  border-radius: 26px;

  /* 태그 종류에 따른 배경색 (피그마 rgba 수치) */
  background: ${props =>
    props.$tag === 'shopping' ? 'rgba(86, 213, 255, 0.20)' :
      props.$tag === 'meal' ? 'rgba(255, 155, 148, 0.50)' : '#f5f5f5'
  };

  /* 태그 종류에 따른 테두리 (피그마 rgba 수치) */
  border: 1px solid ${props =>
    props.$tag === 'shopping' ? 'rgba(86, 213, 255, 0.30)' :
      props.$tag === 'meal' ? 'rgba(243, 80, 68, 0.44)' : '#e6e6e6'
  };
`;

// 지출 리스트
export const ExpenseList = styled.div`
  padding: 4px 6px;
`;

export const ExpenseItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;

  & + & {
    border-top: 1px solid #f2f2f2;
  }
`;

export const ExpenseInfo = styled.div``;

export const ExpenseName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #2a2a2a;
  margin-bottom: 4px;
`;

export const ExpenseLocation = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #9a9a9a;
`;

export const ExpenseAmount = styled.div`
  text-align: right;
  font-size: 14px;
  font-weight: 600;
  color: #616161;
`;

export const ExpenseYen = styled.div`
  margin-top: 2px;
  font-size: 12px;
  font-weight: 600;
  color: #9a9a9a;
`;

// 일본어
export const JapaneseWrapper = styled.div`
  margin: 28px 20px 0;
`;

export const JapaneseHeaderTexts = styled.div`
  margin-bottom: 12px;
`;

export const JapaneseLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #939393;
`;

export const JapaneseGuide = styled.div`
  margin-top: 3px;
  font-size: 16px;
  font-weight: 600;
  color: #454545;
`;

export const JapaneseCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);
`;

export const JapaneseCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
`;

export const JapanesePill = styled.span`
  display: inline-flex;
  padding: 4px 10px; 
  
  border-radius: 21px;
  border: 1px solid rgba(25, 203, 64, 0.16);
  background: #D1FDDB;

  
  font-size: 12px;
  font-weight: 500;
  color: #19CB40; 
`;

export const JapaneseSound = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  opacity: 0.7;
  
  img {
    width: 24px;
    height: 24px;
  }
`;

export const JapaneseText = styled.div`
  font-size: 22px;
  font-weight: 600;
  color: #010101;
  margin-bottom: 8px;
`;

export const JapaneseSub = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #939393;
  margin-bottom: 3px;
`;

export const JapaneseMeaning = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #616161;
`;

// 하단바
export const BottomNav = styled.nav`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: calc(18px + env(safe-area-inset-bottom));
  width: 280px;
  height: 62px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  z-index: 100;
`;

export const NavItem = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  opacity: ${(p) => (p.$active ? 1 : 0.45)};
`;

export const NavIconImg = styled.img`
  width: 24px;
  height: 24px;
  display: block;
`;