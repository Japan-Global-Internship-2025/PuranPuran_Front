import styled from "styled-components";

export const BottomNav = styled.nav`
  position: fixed;
  bottom: calc(18px + env(safe-area-inset-bottom));
  left: 50%;
  transform: translateX(-50%);
  width: 280px;
  height: 62px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.10);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  z-index: 100;
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
    filter: ${(props) =>
      props.$active
        ? "invert(58%) sepia(88%) saturate(600%) hue-rotate(345deg) brightness(107%) contrast(101%)"
        : "grayscale(100%) opacity(0.4)"};
    transition: all 0.2s ease;
  }
`;
