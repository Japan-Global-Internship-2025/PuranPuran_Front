import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
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
import { api } from "../api";

import TabHome from "../assets/tab-home.svg";
import TabCalendar from "../assets/tab-calendar.svg";
import TabCamera from "../assets/tab-camera.svg";
import TabUser from "../assets/tab-user.svg";

const DUMMY_USER = {
  nickname: "MINJAE98",
  email: "minjae@example.com",
  profileImage: "https://picsum.photos/60/60?random=10",
};

const DUMMY_TRAVELS = [
  {
    id: 1,
    destination: "일본 오사카",
    startDate: "2025.12.21",
    endDate: "2025.12.27",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&q=80",
    isActive: false,
  },
  {
    id: 2,
    destination: "일본 도쿄",
    startDate: "2024.02.03",
    endDate: "2024.02.07",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&q=80",
    isActive: false,
  },
];

export default function MyPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(DUMMY_USER);
  const [travels, setTravels] = useState([]);
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editNickname, setEditNickname] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [userData, travelData] = await Promise.all([
          api.auth.getUser(),
          api.travel.getAll(),
        ]);
        if (userData) setUser(userData);
        if (travelData?.length) setTravels(travelData);
        else setTravels(DUMMY_TRAVELS);
      } catch {
        setTravels(DUMMY_TRAVELS);
      }
    };
    load();
  }, []);

  const activeTravel = travels.find((t) => t.isActive) || travels[0];

  const handleLogout = () => {
    // httpOnly 쿠키는 프론트에서 직접 삭제할 수 없으므로, 서버 로그아웃 엔드포인트가 생기면 여기서 호출하도록 바꿀 수 있습니다.
    navigate("/login");
  };

  const handleEditToggle = () => {
    if (isEditMode) {
      if (editNickname.trim()) {
        setUser((prev) => ({ ...prev, nickname: editNickname.trim() }));
        try { api.auth.updateUser({ nickname: editNickname.trim() }); } catch {}
      }
      setIsEditMode(false);
    } else {
      setEditNickname(user.nickname);
      setIsEditMode(true);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUser((prev) => ({ ...prev, profileImage: url }));
    }
  };

  return (
    <Screen>
      <Header>
        <ProfileSection>
          {isEditMode ? (
            <AvatarWrapper>
              <Avatar src={user.profileImage} alt="프로필" />
              <AvatarAddBtn onClick={() => fileInputRef.current?.click()}>+</AvatarAddBtn>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handlePhotoChange}
              />
            </AvatarWrapper>
          ) : (
            <DefaultAvatar>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" fill="rgba(255,255,255,0.6)" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="rgba(255,255,255,0.6)" />
              </svg>
            </DefaultAvatar>
          )}

          <ProfileInfo>
            <UserNameRow>
              {isEditMode ? (
                <NicknameInput
                  value={editNickname}
                  onChange={(e) => setEditNickname(e.target.value)}
                  autoFocus
                />
              ) : (
                <UserName>{user.nickname}님</UserName>
              )}
              <SettingsIcon onClick={handleEditToggle}>
                {isEditMode ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12l5 5L19 7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </SettingsIcon>
            </UserNameRow>
            <UserStatus>
              {activeTravel
                ? `${activeTravel.destination ?? activeTravel.name?.replace("여행", "").trim()}을 여행중이에요`
                : "여행 준비중이에요"}
            </UserStatus>
          </ProfileInfo>
        </ProfileSection>
      </Header>

      <MenuList>
        {/* 새 여행 만들기 */}
        <MenuItem onClick={() => navigate("/travelstart")}>
          <MenuIcon>✈️</MenuIcon>
          <MenuContent>
            <MenuSub>새로운 추억을 만들러 가볼까요?</MenuSub>
            <MenuTitle>새 여행 일정 만들기</MenuTitle>
          </MenuContent>
          <ArrowIcon>›</ArrowIcon>
        </MenuItem>

        {/* 취향 설정 */}
        <MenuItem onClick={() => navigate("/preference")}>
          <MenuIcon>🌸</MenuIcon>
          <MenuContent>
            <MenuSub>취향에 따라 추천이 바뀌어요</MenuSub>
            <MenuTitle>취향 설정하기</MenuTitle>
          </MenuContent>
          <ArrowIcon>›</ArrowIcon>
        </MenuItem>

        {/* 여행 기록 */}
        <MenuItem isOpen={isRecordOpen} onClick={() => setIsRecordOpen(!isRecordOpen)}>
          <MenuIcon>☁️</MenuIcon>
          <MenuContent>
            <MenuSub>지금까지의 여행을 살펴보세요</MenuSub>
            <MenuTitle>여행기록 보기</MenuTitle>
          </MenuContent>
          <ArrowIcon isOpen={isRecordOpen}>⌄</ArrowIcon>
        </MenuItem>

        {isRecordOpen && (
          <TravelImageList>
            {travels.map((t) => (
              <TravelImageCard
                key={t.id}
                $image={t.image}
                onClick={() => navigate("/plan")}
              >
                <TravelImageOverlay>
                  <TravelImageDate>
                    {t.startDate} - {t.endDate}
                  </TravelImageDate>
                  <TravelImageName>{t.destination ?? t.name}</TravelImageName>
                </TravelImageOverlay>
              </TravelImageCard>
            ))}
          </TravelImageList>
        )}
      </MenuList>

      <LogoutButton onClick={handleLogout}>로그아웃하기</LogoutButton>

      <BottomNav>
        <NavItem onClick={() => navigate("/home")}>
          <NavIcon><img src={TabHome} alt="홈" /></NavIcon>
        </NavItem>
        <NavItem onClick={() => navigate("/plan")}>
          <NavIcon><img src={TabCalendar} alt="일정" /></NavIcon>
        </NavItem>
        <NavItem onClick={() => navigate("/count")}>
          <NavIcon><img src={TabCamera} alt="가계부" /></NavIcon>
        </NavItem>
        <NavItem onClick={() => navigate("/mypage")}>
          <NavIcon $active><img src={TabUser} alt="마이페이지" /></NavIcon>
        </NavItem>
      </BottomNav>
    </Screen>
  );
}

/* ===== 추가 스타일 ===== */

const UserNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

const NicknameInput = styled.input`
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  background: transparent;
  border: none;
  border-bottom: 2px solid rgba(255, 255, 255, 0.6);
  outline: none;
  width: 160px;
  padding: 0 0 2px;
  &::placeholder { color: rgba(255,255,255,0.5); }
`;

const AvatarWrapper = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  flex-shrink: 0;
`;

const AvatarAddBtn = styled.button`
  position: absolute;
  bottom: -2px;
  left: -2px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #ff871e;
  border: 2px solid #ff871e;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  line-height: 1;
`;

const DefaultAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const TravelImageList = styled.div`
  margin: -4px 0 0;
  border-radius: 0 0 16px 16px;
  overflow: hidden;
`;

const TravelImageCard = styled.div`
  position: relative;
  height: 130px;
  background-image: url(${(props) => props.$image});
  background-size: cover;
  background-position: center;
  cursor: pointer;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

const TravelImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.1) 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 14px 16px;
`;

const TravelImageDate = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 4px;
`;

const TravelImageName = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #fff;
`;
