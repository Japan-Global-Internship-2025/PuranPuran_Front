import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { api } from "../api";

const TRAVEL_ID = 1;

const CATEGORIES = ["식비", "쇼핑", "여가", "교통", "숙박", "기타"];
const PAYMENT_METHODS = ["현금", "카드"];

export default function Camera() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [step, setStep] = useState("camera"); // "camera" | "confirm" | "edit" | "done"
  const [uploading, setUploading] = useState(false);
  const [parsed, setParsed] = useState(null);
  const [form, setForm] = useState({
    title: "", location: "", total_amount: "",
    date: new Date().toISOString().split("T")[0],
    currency: "JPY", payment_method: "현금", category: "식비",
  });
  const [cameraError, setCameraError] = useState(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch {
      setCameraError(true);
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach(t => t.stop());
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedImage(dataUrl);
    stopCamera();
    setStep("confirm");
  };

  const handleGallery = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCapturedImage(ev.target.result);
      stopCamera();
      setStep("confirm");
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!capturedImage) return;
    setUploading(true);
    try {
      const blob = await (await fetch(capturedImage)).blob();
      const formData = new FormData();
      formData.append("file", blob, "receipt.jpg");
      const result = await api.spending.uploadReceipt(formData);
      setParsed(result);
      setForm(prev => ({
        ...prev,
        title: result?.title || "",
        total_amount: result?.total_amount || "",
        category: result?.category || "식비",
      }));
    } catch {
      // API 미연결 시 더미 파싱 결과
      setForm(prev => ({ ...prev, title: "영수증 내역", total_amount: "1200" }));
    } finally {
      setUploading(false);
      setStep("edit");
    }
  };

  const handleSave = async () => {
    try {
      await api.spending.createReceipt(TRAVEL_ID, {
        ...form,
        total_amount: Number(form.total_amount),
      });
    } catch {
      // API 미연결 시 무시
    }
    setStep("done");
  };

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const retake = () => {
    setCapturedImage(null);
    setStep("camera");
    startCamera();
  };

  if (step === "done") {
    return (
      <Screen>
        <DoneContainer>
          <DoneIcon>✅</DoneIcon>
          <DoneTitle>지출이 기록됐어요!</DoneTitle>
          <DoneSub>{form.title} · ¥{form.total_amount}</DoneSub>
          <DoneBtn onClick={() => navigate("/count")}>가계부로 돌아가기</DoneBtn>
          <DoneBtnSecondary onClick={retake}>영수증 더 촬영하기</DoneBtnSecondary>
        </DoneContainer>
      </Screen>
    );
  }

  if (step === "edit") {
    return (
      <Screen>
        <EditHeader>
          <BackBtn onClick={() => setStep("confirm")}>←</BackBtn>
          <EditHeaderTitle>지출 내용 확인</EditHeaderTitle>
          <SaveBtn onClick={handleSave}>저장</SaveBtn>
        </EditHeader>

        {capturedImage && (
          <ReceiptPreview src={capturedImage} alt="영수증" />
        )}

        <EditForm>
          <FieldLabel>내용</FieldLabel>
          <FieldInput value={form.title} onChange={e => handleChange("title", e.target.value)} placeholder="영수증 내용" />

          <FieldLabel>금액 (엔)</FieldLabel>
          <FieldInput type="number" value={form.total_amount} onChange={e => handleChange("total_amount", e.target.value)} placeholder="0" />

          <FieldLabel>날짜</FieldLabel>
          <FieldInput type="date" value={form.date} onChange={e => handleChange("date", e.target.value)} />

          <FieldLabel>카테고리</FieldLabel>
          <ChipRow>
            {CATEGORIES.map(c => (
              <Chip key={c} $active={form.category === c} onClick={() => handleChange("category", c)}>{c}</Chip>
            ))}
          </ChipRow>

          <FieldLabel>결제 방법</FieldLabel>
          <ChipRow>
            {PAYMENT_METHODS.map(p => (
              <Chip key={p} $active={form.payment_method === p} onClick={() => handleChange("payment_method", p)}>{p}</Chip>
            ))}
          </ChipRow>

          <KrwEstimate>
            예상 원화: ₩{(Number(form.total_amount) * 9.36).toLocaleString("ko-KR")}
          </KrwEstimate>
        </EditForm>

        <SubmitBtn onClick={handleSave}>저장하기</SubmitBtn>
      </Screen>
    );
  }

  if (step === "confirm") {
    return (
      <Screen>
        <EditHeader>
          <BackBtn onClick={retake}>←</BackBtn>
          <EditHeaderTitle>사진 확인</EditHeaderTitle>
          <div style={{ width: 40 }} />
        </EditHeader>
        <ConfirmImage src={capturedImage} alt="촬영된 영수증" />
        <ConfirmActions>
          <RetakeBtn onClick={retake}>다시 촬영</RetakeBtn>
          <AnalyzeBtn onClick={handleUpload} disabled={uploading}>
            {uploading ? "분석 중..." : "AI 분석하기"}
          </AnalyzeBtn>
        </ConfirmActions>
      </Screen>
    );
  }

  return (
    <Screen>
      <CameraHeader>
        <BackBtn onClick={() => navigate("/count")}>←</BackBtn>
        <CameraTitle>영수증 촬영</CameraTitle>
        <GalleryBtn onClick={() => fileInputRef.current?.click()}>갤러리</GalleryBtn>
      </CameraHeader>

      <ViewfinderContainer>
        {cameraError ? (
          <CameraErrorBox>
            <p>카메라를 사용할 수 없어요</p>
            <GalleryFallbackBtn onClick={() => fileInputRef.current?.click()}>
              갤러리에서 선택
            </GalleryFallbackBtn>
          </CameraErrorBox>
        ) : (
          <>
            <Video ref={videoRef} autoPlay playsInline muted />
            <ViewfinderOverlay>
              <ViewfinderFrame />
              <ViewfinderHint>영수증을 프레임 안에 맞춰주세요</ViewfinderHint>
            </ViewfinderOverlay>
          </>
        )}
        <Canvas ref={canvasRef} style={{ display: "none" }} />
      </ViewfinderContainer>

      <CameraControls>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleGallery}
        />
        <GalleryIconBtn onClick={() => fileInputRef.current?.click()}>
          <span style={{ fontSize: 20 }}>🖼</span>
        </GalleryIconBtn>
        <ShutterBtn onClick={takePhoto} disabled={cameraError}>
          <ShutterInner />
        </ShutterBtn>
        <div style={{ width: 56 }} />
      </CameraControls>
    </Screen>
  );
}

/* ===== 스타일 ===== */
const Screen = styled.div`
  width: 100%;
  max-width: 480px;
  min-height: 100dvh;
  background: #111;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

const CameraHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #111;
  z-index: 10;
`;

const CameraTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #fff;
`;

const BackBtn = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 22px;
  cursor: pointer;
  padding: 4px;
  width: 40px;
  text-align: left;
`;

const GalleryBtn = styled.button`
  background: none;
  border: none;
  color: #ff871e;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const ViewfinderContainer = styled.div`
  flex: 1;
  position: relative;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Canvas = styled.canvas``;

const ViewfinderOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const ViewfinderFrame = styled.div`
  width: 280px;
  height: 200px;
  border: 2px solid rgba(255,255,255,0.8);
  border-radius: 12px;
  box-shadow: 0 0 0 9999px rgba(0,0,0,0.35);
`;

const ViewfinderHint = styled.div`
  color: rgba(255,255,255,0.8);
  font-size: 13px;
  font-weight: 500;
`;

const CameraControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 40px 40px;
  background: #111;
`;

const GalleryIconBtn = styled.button`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: rgba(255,255,255,0.12);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ShutterBtn = styled.button`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(255,255,255,0.9);
  border: 4px solid rgba(255,255,255,0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 3px rgba(255,255,255,0.2);
  transition: transform 0.15s;
  &:active { transform: scale(0.93); }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const ShutterInner = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #fff;
`;

const CameraErrorBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: #fff;
  font-size: 15px;
  text-align: center;
`;

const GalleryFallbackBtn = styled.button`
  padding: 12px 24px;
  background: #ff871e;
  border: none;
  border-radius: 999px;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
`;

const ConfirmImage = styled.img`
  width: 100%;
  flex: 1;
  object-fit: contain;
  background: #000;
`;

const ConfirmActions = styled.div`
  display: flex;
  gap: 12px;
  padding: 20px;
  background: #111;
`;

const RetakeBtn = styled.button`
  flex: 1;
  height: 50px;
  border-radius: 999px;
  border: 2px solid rgba(255,255,255,0.3);
  background: none;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
`;

const AnalyzeBtn = styled.button`
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
const EditHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
`;

const EditHeaderTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #111;
`;

const SaveBtn = styled.button`
  background: none;
  border: none;
  color: #ff871e;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
`;

const ReceiptPreview = styled.img`
  width: 100%;
  max-height: 200px;
  object-fit: cover;
`;

const EditForm = styled.div`
  background: #fff;
  padding: 20px;
  flex: 1;
  overflow-y: auto;
`;

const FieldLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #555;
  margin-bottom: 8px;
  margin-top: 16px;
  &:first-child { margin-top: 0; }
`;

const FieldInput = styled.input`
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

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chip = styled.button`
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

const KrwEstimate = styled.div`
  margin-top: 20px;
  padding: 12px 16px;
  background: #f9f9f9;
  border-radius: 10px;
  font-size: 13px;
  color: #555;
  font-weight: 500;
`;

const SubmitBtn = styled.button`
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
const DoneContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding: 40px 24px;
  gap: 12px;
`;

const DoneIcon = styled.div`
  font-size: 56px;
  margin-bottom: 8px;
`;

const DoneTitle = styled.div`
  font-size: 22px;
  font-weight: 800;
  color: #111;
`;

const DoneSub = styled.div`
  font-size: 15px;
  color: #888;
  margin-bottom: 20px;
`;

const DoneBtn = styled.button`
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

const DoneBtnSecondary = styled.button`
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
