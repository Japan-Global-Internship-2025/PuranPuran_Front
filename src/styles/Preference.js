import styled from "styled-components";

/* ===== auth.js와 동일한 Screen 구조 ===== */
export const Screen = styled.div`
  min-height: 100dvh;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  background: #f8f8f8;
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
`;

/* ===== 헤더: auth.js의 padding: 10px 톤 유지 + 좌우 버튼 배치 ===== */
export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  color: #111;
`;

export const SkipButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #454545;
  padding: 4px 0;
`;

/* ===== Body: auth.js와 동일한 padding ===== */
export const Body = styled.main`
  padding: 28px 24px 24px;
`;

/* ===== 타이틀 섹션: auth.js의 Welcome과 비슷한 톤 ===== */
export const TitleSection = styled.section`
  margin-top: 10px;
  margin-bottom: 28px;
`;

export const Title = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #111;
  line-height: 1.25;
  margin-bottom: 6px;
`;

export const Subtitle = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #949494;
  line-height: 1.4;
`;

/* ===== 게이지: 3분할 막대 ===== */
export const GaugeSection = styled.div`
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 14px;
`;

export const GaugeTrack = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const GaugeBar = styled.div`
  flex: 1;
  height: 8px;
  border-radius: 99px;
  background: ${({ $filled }) => ($filled ? "#ff871e" : "#e0e0e0")};
  transition: background 0.25s ease;
`;

export const GaugeCount = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #b0b0b0;
  white-space: nowrap;
  letter-spacing: 0.2px;

  strong {
    color: #ff871e;
    font-weight: 700;
  }
`;

/* ===== 카드 그리드 ===== */
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

export const CardWrapper = styled.div`
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  aspect-ratio: 1 / 1;
  cursor: pointer;
  user-select: none;
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.97);
  }
`;

export const CardImage = styled.div`
  width: 100%;
  height: 100%;
  background: #ccc;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export const CardDim = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, ${({ $selected }) => ($selected ? 0.5 : 0.25)});
  transition: background 0.2s ease;
  pointer-events: none;
`;

/* 카드 좌하단 pill 형태 태그 */
export const CardTag = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
  padding: 4px 10px;
  border-radius: 99px;
  border: 1px solid rgba(255, 255, 255, 0.85);
  background: rgba(0, 0, 0, 0.15);
  font-size: 11px;
  font-weight: 500;
  color: #fff;
  letter-spacing: -0.2px;
  pointer-events: none;
  white-space: nowrap;
`;

/* 우상단 선택 배지 */
export const SelectBadge = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: ${({ $selected }) =>
    $selected ? "none" : "1.5px solid rgba(255, 255, 255, 0.95)"};
  background: ${({ $selected }) => ($selected ? "#ff871e" : "transparent")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  transition: all 0.2s ease;
  pointer-events: none;
`;

/* ===== 푸터: auth.js의 ButtonWrap과 같은 톤 ===== */
export const Footer = styled.div`
  margin-top: 26px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
`;

/* PrimaryButton과 동일 (radius 7, height 56, font 14/500) */
export const CompleteButton = styled.button`
  width: 100%;
  height: 56px;
  border: 0;
  border-radius: 7px;
  background: ${({ disabled }) => (disabled ? "#e6e6e6" : "#ff871e")};
  color: ${({ disabled }) => (disabled ? "#aaa" : "#ffffff")};
  font-size: 14px;
  font-weight: 500;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};

  &:active:not(:disabled) {
    transform: translateY(1px);
    opacity: 0.95;
  }
`;

/* SecondaryButton과 동일 (Signup의 SecondaryButton 스타일) */
export const SkipFooterButton = styled.button`
  width: 100%;
  height: 56px;
  border: 0;
  border-radius: 7px;
  background: #fff;
  color: #454545;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:active {
    transform: translateY(1px);
    opacity: 0.95;
  }
`;
