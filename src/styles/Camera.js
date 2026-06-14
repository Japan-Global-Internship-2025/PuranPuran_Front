import styled from "styled-components";

export const Screen = styled.div`
  width: 100%;
  max-width: 480px;
  min-height: 100dvh;
  background: #3a3a3a;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

export const OrangeHeader = styled.header`
  height: 60px;
  background: #ff871e;
  display: flex;
  align-items: center;
  padding: 0 20px;
  flex-shrink: 0;
`;

export const LogoImg = styled.img`
  height: 28px;
  display: block;
`;

export const DarkNav = styled.div`
  padding: 10px 16px 4px;
  background: #3a3a3a;
`;

export const BackBtn = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 28px;
  cursor: pointer;
  padding: 4px 8px;
  line-height: 1;
`;

export const ViewfinderContainer = styled.div`
  flex: 1;
  position: relative;
  background: #3a3a3a;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 32px;
`;

export const Video = styled.video`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const Canvas = styled.canvas``;

export const ViewfinderOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ViewfinderFrame = styled.div`
  width: 72%;
  aspect-ratio: 0.63;
  border: 2px solid rgba(255, 255, 255, 0.55);
  border-radius: 20px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.25);
`;

export const CameraControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 48px 44px;
  background: #3a3a3a;
  flex-shrink: 0;
`;

export const GalleryIconBtn = styled.button`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.28);
  border: none;
  cursor: pointer;
`;

export const ShutterBtn = styled.button`
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: transparent;
  border: 4px solid #ff871e;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: transform 0.15s;
  &:active { transform: scale(0.93); }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

export const ShutterInner = styled.div`
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: #ff871e;
`;

export const FlashBtn = styled.button`
  width: 56px;
  height: 56px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

export const CameraErrorBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: #fff;
  font-size: 15px;
  text-align: center;
`;

export const GalleryFallbackBtn = styled.button`
  padding: 12px 24px;
  background: #ff871e;
  border: none;
  border-radius: 999px;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
`;

export const ConfirmImage = styled.img`
  width: 100%;
  flex: 1;
  object-fit: contain;
  background: #000;
`;

export const ConfirmActions = styled.div`
  display: flex;
  gap: 12px;
  padding: 20px;
  background: #111;
`;

export const RetakeBtn = styled.button`
  flex: 1;
  height: 50px;
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: none;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
`;

export const AnalyzeBtn = styled.button`
  flex: 2;
  height: 50px;
  border-radius: 999px;
  border: none;
  background: #ff871e;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

/* Edit step */
export const EditHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
`;

export const EditHeaderTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #111;
`;

export const SaveBtn = styled.button`
  background: none;
  border: none;
  color: #ff871e;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
`;

export const ReceiptPreview = styled.img`
  width: 100%;
  max-height: 200px;
  object-fit: cover;
`;

export const EditForm = styled.div`
  background: #fff;
  padding: 20px;
  flex: 1;
  overflow-y: auto;
`;

export const FieldLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #555;
  margin-bottom: 8px;
  margin-top: 16px;
  &:first-child { margin-top: 0; }
`;

export const FieldInput = styled.input`
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

export const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Chip = styled.button`
  padding: 7px 14px;
  border-radius: 999px;
  border: 1.5px solid ${({ $active }) => ($active ? "#ff871e" : "#e6e6e6")};
  background: ${({ $active }) => ($active ? "#fff5eb" : "#fff")};
  color: ${({ $active }) => ($active ? "#ff871e" : "#555")};
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? "700" : "500")};
  cursor: pointer;
  transition: all 0.15s;
`;

export const KrwEstimate = styled.div`
  margin-top: 20px;
  padding: 12px 16px;
  background: #f9f9f9;
  border-radius: 10px;
  font-size: 13px;
  color: #555;
  font-weight: 500;
`;

export const SubmitBtn = styled.button`
  width: calc(100% - 40px);
  margin: 12px 20px 32px;
  height: 52px;
  background: #ff871e;
  border: none;
  border-radius: 14px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  &:active { opacity: 0.9; }
`;

/* Done step */
export const DoneContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding: 40px 24px;
  gap: 12px;
`;

export const DoneIcon = styled.div`
  font-size: 56px;
  margin-bottom: 8px;
`;

export const DoneTitle = styled.div`
  font-size: 22px;
  font-weight: 800;
  color: #111;
`;

export const DoneSub = styled.div`
  font-size: 15px;
  color: #888;
  margin-bottom: 20px;
`;

export const DoneBtn = styled.button`
  width: 100%;
  max-width: 300px;
  height: 52px;
  background: #ff871e;
  border: none;
  border-radius: 14px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
`;

export const DoneBtnSecondary = styled.button`
  width: 100%;
  max-width: 300px;
  height: 52px;
  background: none;
  border: 2px solid #e6e6e6;
  border-radius: 14px;
  color: #555;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
`;
