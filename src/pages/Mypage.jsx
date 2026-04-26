import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Screen,
  Header,
  ProfileSection,
  Avatar,
  ProfileInfo,
  UserName,
  UserStatus,
  SettingsIcon,
  MenuList,
  MenuItem,
  MenuIcon,
  MenuContent,
  MenuSub,
  MenuTitle,
  ArrowIcon,
  LogoutButton,
  BottomNav,
  NavItem,
  NavIcon,
} from "../styles/Mypage";

import TabHome from "../assets/tab-home.svg";
import TabCalendar from "../assets/tab-calendar.svg";
import TabCamera from "../assets/tab-camera.svg";
import TabUser from "../assets/tab-user.svg";
import Setting from "../assets/uil_setting.svg";

const MENU_ITEMS = [
  {
    id: 1,
    icon: "✈️",
    sub: "새로운 추억을 만들러 가볼까요?",
    title: "새 여행 일정 만들기",
    hasArrow: true,
  },
  {
    id: 2,
    icon: "🌸",
    sub: "취향에 따라 추천이 바뀌어요",
    title: "취향 설정하기",
    hasArrow: true,
  },
  {
    id: 3,
    icon: "☁️",
    sub: "지금까지의 여행을 살펴보세요",
    title: "여행기록 보기",
    hasArrow: false,
  },
];

export default function MyPage() {
  const navigate = useNavigate();
  const [isRecordOpen, setIsRecordOpen] = useState(false);

  const handleNavClick = (path) => {
    navigate(path);
  };

  const handleMenuClick = (id) => {
    if (id === 3) {
      setIsRecordOpen(!isRecordOpen);
    } else if (id === 1) {
      navigate("/plan");
    }
    // 설정 페이지 이동
  };

  const handleLogout = () => {
    // 로그아웃 처리
    navigate("/login");
  };

  return (
    <Screen>
    
      <Header>
        <ProfileSection>
          <Avatar src="https://picsum.photos/60/60?random=10" alt="프로필" />
          <ProfileInfo>
            <UserName>
              MINJAE98님
              <SettingsIcon>
                <img src={Setting} alt="설정" />
              </SettingsIcon>
            </UserName>
            <UserStatus>나고야를 여행중이에요</UserStatus>
          </ProfileInfo>
        </ProfileSection>
      </Header>
      <MenuList>
        {MENU_ITEMS.map((item) => (
          <MenuItem 
            key={item.id} 
            onClick={() => handleMenuClick(item.id)}
            isOpen={item.id === 3 && isRecordOpen}
          >
            <MenuIcon>{item.icon}</MenuIcon>
            <MenuContent>
              <MenuSub>{item.sub}</MenuSub>
              <MenuTitle>{item.title}</MenuTitle>
            </MenuContent>
            <ArrowIcon isOpen={item.id === 3 && isRecordOpen}>
              {item.id === 3 ? "⌄" : "›"}
            </ArrowIcon>
          </MenuItem>
        ))}
        
    
        {isRecordOpen && (
          <SubMenu>
            <SubMenuItem>2024 나고야 여행</SubMenuItem>
            <SubMenuItem>2023 도쿄 여행</SubMenuItem>
            <SubMenuItem>2022 오사카 여행</SubMenuItem>
          </SubMenu>
        )}
      </MenuList>
      <LogoutButton onClick={handleLogout}>
        로그아웃하기
      </LogoutButton>

    
      <BottomNav>
        <NavItem onClick={() => handleNavClick("/home")}>
          <NavIcon>
            <img src={TabHome} alt="홈" />
          </NavIcon>
        </NavItem>
        <NavItem onClick={() => handleNavClick("/plan")}>
          <NavIcon>
            <img src={TabCalendar} alt="일정" />
          </NavIcon>
        </NavItem>
        <NavItem onClick={() => handleNavClick("/count")}>
          <NavIcon>
            <img src={TabCamera} alt="가계부" />
          </NavIcon>
        </NavItem>
        <NavItem active onClick={() => handleNavClick("/mypage")}>
          <NavIcon $active>
            <img src={TabUser} alt="마이페이지" />
          </NavIcon>
        </NavItem>
      </BottomNav>
    </Screen>
  );
}


import styled from "styled-components";

const SubMenu = styled.div`
  background: #f9f9f9;
  border-radius: 0 0 16px 16px;
  margin-top: -8px;
  margin-bottom: 12px;
  overflow: hidden;
`;

const SubMenuItem = styled.div`
  padding: 16px 24px 16px 72px;
  font-size: 14px;
  color: #666;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #f5f5f5;
  }
`;