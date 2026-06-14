import styled, { keyframes } from "styled-components";

const fadeOut = keyframes`
  from { opacity: 1; }
  to   { opacity: 0; }
`;

export const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #FF871E;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeOut} 0.5s ease 1.5s forwards;
`;

export const Logo = styled.img`
  width: 45vw;
`;
