import { useState, useEffect } from "react";
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
import TabCamera from "../assets/tab-user.svg";
import TabUser from "../assets/tab-user.svg";
import Setting from "../assets/uil_setting.svg";

const DUMMY_USER = {
  nickname: "MINJAE98",
  email: "minjae@example.com",
  profileImage: "https://picsum.photos/60/60?random=10",
};

const DUMMY_TRAVELS = [
  { id: 1, name: "2026 나고야 여행", startDate: "2026-05-27", endDate: "2026-05-31", isActive: true },
  { id: 2, name: "2024 도쿄 여행", startDate: "2024-11-01", endDate: "2024-11-07", isActive: false },
  { id: 3, name: "2023 오사카 여행", startDate: "2023-08-10", endDate: "2023-08-14", isActive: false },
];

export default function MyPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(DUMMY_USER);
  const [travels, setTravels] = useState([]);
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

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

  const activeTravel = travels.find(t => t.isActive) || travels[0];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Screen>
      <Header>
        <ProfileSection>
          <Avatar src={user.profileImage} alt="프로필" />
          <ProfileInfo>
            <UserName>
              {user.nickname}님
              <SettingsIcon onClick={() => setShowEditModal(true)}>
                <img src={Setting} alt="설정" />
              </SettingsIcon>
            </UserName>
            <UserStatus>
              {activeTravel ? `${activeTravel.name.replace("여행", "").trim()}을 여행중이에요` : "여행 준비중이에요"}
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
            <MenuTitle>여행 기록 보기</MenuTitle>
          </MenuContent>
          <ArrowIcon isOpen={isRecordOpen}>⌄</ArrowIcon>
        </MenuItem>

        {isRecordOpen && (
          <TravelSubList>
            {travels.map(t => (
              <TravelSubItem
                key={t.id}
                $active={t.isActive}
                onClick={() => navigate("/plan")}
              >
                <TravelSubDot $active={t.isActive} />
                <TravelSubName>{t.name}</TravelSubName>
                <TravelSubDate>{t.startDate?.slice(0, 7)}</TravelSubDate>
                {t.isActive && <ActiveBadge>진행중</ActiveBadge>}
              </TravelSubItem>
            ))}
          </TravelSubList>
        )}
      </MenuList>

      {/* 현재 여행 카드 */}
      {activeTravel && (
        <TravelCard onClick={() => navigate("/plan")}>
          <TravelCardBadge>🗺 현재 여행</TravelCardBadge>
          <TravelCardName>{activeTravel.name}</TravelCardName>
          <TravelCardDate>
            {activeTravel.startDate} ~ {activeTravel.endDate}
          </TravelCardDate>
          <TravelCardArrow>일정 보러가기 →</TravelCardArrow>
        </TravelCard>
      )}

      <LogoutButton onClick={handleLogout}>로그아웃하기</LogoutButton>

      <BottomNav>
        <NavItem onClick={() => navigate("/home")}>
          <NavIcon><img src={TabHome} alt="홈" /></NavIcon>
        </NavItem>
        <NavItem onClick={() => navigate("/plan")}>
          <NavIcon><img src={TabCalendar} alt="일정" /></NavIcon>
        </NavItem>
        <NavItem onClick={() => navigate("/count")}>
          <NavIcon><img src={TabCamera} alt="가계부" style={{ filter: "grayscale(100%) opacity(0.4)" }} /></NavIcon>
        </NavItem>
        <NavItem onClick={() => navigate("/mypage")}>
          <NavIcon $active><img src={TabUser} alt="마이페이지" /></NavIcon>
        </NavItem>
      </BottomNav>

      {showEditModal && (
        <EditProfileModal user={user} onClose={() => setShowEditModal(false)} onSave={setUser} />
      )}
    </Screen>
  );
}

/* ===== 프로필 편집 모달 ===== */
function EditProfileModal({ user, onClose, onSave }) {
  const [nickname, setNickname] = useState(user.nickname);

  const handleSave = async () => {
    try {
      await api.auth.updateUser({ nickname });
    } catch { /* API 미연결 */ }
    onSave(prev => ({ ...prev, nickname }));
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalSheet onClick={e => e.stopPropagation()}>
        <ModalHandle />
        <ModalTitle>프로필 수정</ModalTitle>
        <ModalField>
          <ModalLabel>닉네임</ModalLabel>
          <ModalInput value={nickname} onChange={e => setNickname(e.target.value)} placeholder="닉네임 입력" />
        </ModalField>
        <ModalSave onClick={handleSave}>저장하기</ModalSave>
      </ModalSheet>
    </ModalOverlay>
  );
}

/* ===== 추가 스타일 ===== */
const TravelSubList = styled.div`
  background: #f9f9f9;
  margin: -4px 0 8px;
  border-radius: 0 0 16px 16px;
  overflow: hidden;
`;

const TravelSubItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 24px 14px 60px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  &:last-child { border-bottom: none; }
  &:hover { background: #f5f5f5; }
`;

const TravelSubDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? "#ff871e" : "#ddd")};
  flex-shrink: 0;
`;

const TravelSubName = styled.div`
  flex: 1;
  font-size: 14px;
  color: #333;
  font-weight: 500;
`;

const TravelSubDate = styled.div`
  font-size: 12px;
  color: #aaa;
`;

const ActiveBadge = styled.div`
  background: #fff5eb;
  color: #ff871e;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
`;

const TravelCard = styled.div`
  margin: 0 20px 16px;
  background: linear-gradient(135deg, #ff871e 0%, #ff6b00 100%);
  border-radius: 20px;
  padding: 18px 20px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(255,135,30,0.3);
`;

const TravelCardBadge = styled.div`
  font-size: 12px;
  color: rgba(255,255,255,0.8);
  margin-bottom: 6px;
`;

const TravelCardName = styled.div`
  font-size: 18px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 4px;
`;

const TravelCardDate = styled.div`
  font-size: 12px;
  color: rgba(255,255,255,0.75);
  margin-bottom: 12px;
`;

const TravelCardArrow = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: rgba(255,255,255,0.9);
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 200;
  display: flex;
  align-items: flex-end;
`;

const ModalSheet = styled.div`
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  background: #fff;
  border-radius: 24px 24px 0 0;
  padding: 12px 20px 40px;
`;

const ModalHandle = styled.div`
  width: 40px;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  margin: 0 auto 20px;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #111;
  margin: 0 0 20px;
`;

const ModalField = styled.div`
  margin-bottom: 16px;
`;

const ModalLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #555;
  margin-bottom: 8px;
`;

const ModalInput = styled.input`
  width: 100%;
  height: 46px;
  padding: 0 14px;
  border: 1.5px solid #e6e6e6;
  border-radius: 12px;
  font-size: 14px;
  color: #111;
  outline: none;
  box-sizing: border-box;
  &:focus { border-color: #ff871e; }
`;

const ModalSave = styled.button`
  width: 100%;
  height: 52px;
  margin-top: 8px;
  background: #ff871e;
  border: none;
  border-radius: 14px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
`;
