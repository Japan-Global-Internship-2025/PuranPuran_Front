import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 135, 30, 0.2);
  border-top: 5px solid #ff871e;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 20px;
`;

const LoadingText = styled.p`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  margin: 0;
`;

const SubText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  margin-top: 8px;
`;

export default function LoadingOverlay({ message = "AI가 최적의 일정을 짜고 있어요...", subMessage = "잠시만 기다려주세요!" }) {
  return (
    <Overlay>
      <Spinner />
      <LoadingText>{message}</LoadingText>
      <SubText>{subMessage}</SubText>
    </Overlay>
  );
}
