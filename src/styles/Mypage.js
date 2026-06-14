import styled from "styled-components";


export const Screen = styled.div`
  min-height: 100dvh;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  background: #f8f8f8;
  position: relative;
  padding-bottom: calc(90px + env(safe-area-inset-bottom));
`;


export const Header = styled.header`
  background: #ff871e;
  padding: 32px 24px;
  border-radius: 0 0 24px 24px;
  margin-bottom: 24px;
`;

export const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const Avatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.5);
  object-fit: cover;
`;

export const ProfileInfo = styled.div`
  flex: 1;
`;

export const UserName = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #fff;
`;

export const SettingsIcon = styled.span`
  font-size: 16px;
  cursor: pointer;
  opacity: 0.8;
  
  &:hover {
    opacity: 1;
  }
`;

export const UserStatus = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
`;


export const MenuList = styled.div`
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #fff;
  border-radius: ${props => props.isOpen ? '16px 16px 0 0' : '16px'};
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

export const MenuIcon = styled.div`
  width: 48px;
  height: 48px;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const MenuContent = styled.div`
  flex: 1;
`;

export const MenuSub = styled.div`
  font-size: 13px;
  color: #949494;
  margin-bottom: 4px;
`;

export const MenuTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #111;
`;

export const ArrowIcon = styled.div`
  font-size: 18px;
  color: #949494;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'none'};
  transition: transform 0.2s;
`;

//lognout
export const LogoutButton = styled.button`
  position: fixed;
  bottom: 120px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 48px);
  max-width: 345px;
  padding: 16px;
  background: #fff;
  border: none;
  border-radius: 12px;
  color: #ff4444;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  
  &:hover {
    background: #fff5f5;
  }
`;

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
    filter: ${props => props.$active
      ? 'brightness(0) saturate(100%) invert(57%) sepia(75%) saturate(700%) hue-rotate(346deg) brightness(103%) contrast(95%)'
      : 'grayscale(100%) opacity(0.4)'};
    transition: all 0.2s ease;
  }
`;

/* ===== 추가 스타일 ===== */

export const UserNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

export const NicknameInput = styled.input`
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

export const AvatarWrapper = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  flex-shrink: 0;
`;

export const AvatarAddBtn = styled.button`
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

export const DefaultAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const TravelImageList = styled.div`
  margin: -4px 0 0;
  border-radius: 0 0 16px 16px;
  overflow: hidden;
`;

export const TravelImageCard = styled.div`
  position: relative;
  height: 130px;
  background-image: url(${(props) => props.$image});
  background-size: cover;
  background-position: center;
  cursor: pointer;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

export const TravelImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.1) 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 14px 16px;
`;

export const TravelImageDate = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 4px;
`;

export const TravelImageName = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #fff;
`;

export const TravelDeleteBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.35);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 5;
  transition: all 0.2s;
  &:hover {
    background: rgba(255, 59, 48, 0.8);
    transform: scale(1.1);
  }
`;