import styled from "styled-components";

export const Screen = styled.div`
  min-height: 100dvh;
  width: 100%;
  background: #3a3a3a;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background: #ff871e;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CameraContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
`;

export const Viewfinder = styled.div`
  flex: 1;
  border: 2px solid #666;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  background: #2a2a2a;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const Canvas = styled.canvas`
  display: none;
`;

export const Controls = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 32px 24px;
`;

export const GalleryButton = styled.button`
  width: 48px;
  height: 48px;
  background: #ddd;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  
  div {
    width: 100%;
    height: 100%;
    background: #bbb;
    border-radius: 6px;
  }
`;

export const ShutterButton = styled.button`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 4px solid #ff871e;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  
  div {
    width: 56px;
    height: 56px;
    background: #ff871e;
    border-radius: 50%;
  }
  
  &:active div {
    transform: scale(0.95);
  }
`;

export const FlashButton = styled.button`
  width: 48px;
  height: 48px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  opacity: ${props => props.active ? 1 : 0.6};
  filter: ${props => props.active ? 'none' : 'grayscale(100%)'};
`;