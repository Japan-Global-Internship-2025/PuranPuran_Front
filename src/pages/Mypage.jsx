import { useState, useEffect, useRef } from "react";
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
  UserNameRow,
  NicknameInput,
  AvatarWrapper,
  AvatarAddBtn,
  DefaultAvatar,
  TravelImageList,
  TravelImageCard,
  TravelImageOverlay,
  TravelImageDate,
  TravelImageName,
  TravelDeleteBtn,
} from "../styles/Mypage";
import { api } from "../api";
import BottomNavigation from "../components/BottomNavigation";


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
    image: "https://picsum.photos/500/300?random=1",
    isActive: false,
  },
  {
    id: 2,
    destination: "일본 도쿄",
    startDate: "2024.02.03",
    endDate: "2024.02.07",
    image: "https://picsum.photos/500/300?random=2",
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
    let mounted = true;
    const load = async () => {
      try {
        const [userData, travelData] = await Promise.all([
          api.auth.getUser(),
          api.travel.getAll(),
        ]);
        if (!mounted) return;

        if (userData) {
          setUser({
            nickname: userData.user_id || "알 수 없음",
            email: userData.user_email || "",
            profileImage: "https://picsum.photos/60/60?random=10",
          });
        }

        if (Array.isArray(travelData) && travelData.length > 0) {
          const mappedTravels = travelData.map((t) => {
            const start = t.travel_start_date ? new Date(t.travel_start_date).toISOString().split("T")[0].replace(/-/g, ".") : "";
            const end = t.travel_end_date ? new Date(t.travel_end_date).toISOString().split("T")[0].replace(/-/g, ".") : "";
            return {
              id: t.id,
              destination: t.travel_region_id?.region_ko || t.travel_region,
              startDate: start,
              endDate: end,
              name: t.travel_name,
              image: `https://picsum.photos/400/200?random=${t.id}`,
              isActive: t.id === userData?.lastest_travel_id,
            };
          });
          setTravels(mappedTravels);
        } else {
          setTravels([]);
        }
      } catch (err) {
        console.warn("load mypage data failed", err);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const activeTravel = travels.find((t) => t.isActive) || travels[0];

  const handleLogout = async () => {
    try {
      await api.auth.logout();
    } catch (err) {
      console.warn("logout api failed", err);
    }
    navigate("/login");
  };

  const handleEditToggle = async () => {
    if (isEditMode) {
      if (editNickname.trim() && editNickname !== user.nickname) {
        try {
          await api.auth.updateUser({ user_id: editNickname.trim() });
          setUser((prev) => ({ ...prev, nickname: editNickname.trim() }));
        } catch (err) {
          console.error("Failed to update nickname:", err);
          if (err.message.includes("409")) {
            alert("이미 존재하는 아이디입니다.");
          } else {
            alert("닉네임 수정에 실패했습니다.");
          }
        }
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

  const handleDeleteTravel = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("정말로 이 여행 기록을 삭제하시겠습니까?")) {
      try {
        await api.travel.delete(id);
        setTravels((prev) => prev.filter((t) => t.id !== id));
        alert("여행 기록이 삭제되었습니다.");
      } catch (err) {
        console.error("Failed to delete travel:", err);
        alert("여행 삭제에 실패했습니다.");
      }
    }
  };

  const handleSelectTravel = async (id) => {
    try {
      await api.auth.updateUser({ lastest_travel_id: id });
      alert("여행이 변경되었습니다.");
      window.location.reload();
    } catch (err) {
      console.error("Failed to select travel:", err);
      alert("여행 변경에 실패했습니다.");
    }
  };

  return (
    <Screen>
      <Header>
        <ProfileSection>
          {/* {isEditMode ? (
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
          ) : ( */}
            <DefaultAvatar>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" fill="rgba(255,255,255,0.6)" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="rgba(255,255,255,0.6)" />
              </svg>
            </DefaultAvatar>
          {/* )} */}

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
                ? `${activeTravel.destination ?? activeTravel.name?.replace("여행", "").trim()}을/를 여행중이에요`
                : "여행 준비중이에요"}
            </UserStatus>
          </ProfileInfo>
        </ProfileSection>
      </Header>

      <MenuList>
        {/* 새 여행 만들기 */}
        <MenuItem onClick={() => navigate("/travelstart", { state: { from: "mypage" } })}>
          <MenuIcon>✈️</MenuIcon>
          <MenuContent>
            <MenuSub>새로운 추억을 만들러 가볼까요?</MenuSub>
            <MenuTitle>새 여행 일정 만들기</MenuTitle>
          </MenuContent>
          <ArrowIcon>›</ArrowIcon>
        </MenuItem>

        {/* 취향 설정 */}
        <MenuItem onClick={() => navigate("/preference", { state: { from: "mypage" } })}>
          <MenuIcon>🌸</MenuIcon>
          <MenuContent>
            <MenuSub>취향에 따라 추천이 바뀌어요</MenuSub>
            <MenuTitle>취향 설정하기</MenuTitle>
          </MenuContent>
          <ArrowIcon>›</ArrowIcon>
        </MenuItem>

        {/* 여행 기록 */}
        <div>
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
                  onClick={() => handleSelectTravel(t.id)}
                >
                  <TravelDeleteBtn onClick={(e) => handleDeleteTravel(e, t.id)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </TravelDeleteBtn>
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
        </div>

      </MenuList>

      <LogoutButton onClick={handleLogout}>로그아웃하기</LogoutButton>

      <BottomNavigation />
    </Screen>
  );
}
