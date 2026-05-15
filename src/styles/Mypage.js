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
  border: 3px solid rgba(255, 255, 255, 0.3);
  object-fit: cover;
`;

export const ProfileInfo = styled.div`
  flex: 1;
`;

export const UserName = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
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
  bottom: 90px;
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
    filter: ${props => props.$active ? 'none' : 'grayscale(100%) opacity(0.4)'};
    transition: all 0.2s ease;
  }
  
  &:hover img {
    filter: none;
    opacity: 1;
  }
`;