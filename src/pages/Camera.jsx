import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { api } from "../api";
import LogoSvg from "../assets/logo1.svg";

const CATEGORIES = ["식비", "쇼핑", "여가", "교통", "숙박", "기타"];

// input[type=date]는 YYYY-MM-DD만 허용 — AI가 다양한 포맷으로 반환해도 정규화
function normalizeDate(raw) {
  if (!raw) return null;
  // YYYY-MM-DD 또는 YYYY/MM/DD 패턴 추출
  const m = String(raw).match(/(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/);
  if (m) return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
  // ISO 문자열 (T 포함)
  const d = new Date(raw);
  if (!isNaN(d.getTime())) return d.toISOString().split("T")[0];
  return null;
}
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
  const [travelId, setTravelId] = useState(null);
  const [form, setForm] = useState({
    title: "", location: "", total_amount: "",
    date: new Date().toISOString().split("T")[0],
    currency: "JPY", payment_method: "현금", category: "식비",
  });
  const [cameraError, setCameraError] = useState(false);

  useEffect(() => {
    // 사용자 정보 로딩하여 travelId 가져오기
    (async () => {
      try {
        const u = await api.auth.getUser();
        const tId = u?.lastest_travel_id;
        if (!tId) {
          alert("현재 여행 정보가 없습니다. 여행 등록 페이지로 이동합니다.");
          navigate("/travelstart");
          return;
        }
        setTravelId(tId);
      } catch (err) {
        console.warn("getUser failed in camera page", err);
        navigate("/login");
      }
    })();
    
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
      
      const paymentMethodHandled = result?.payment_method === "CARD" ? "카드" : "현금";
      setForm(prev => ({
        ...prev,
        title: result?.title || "영수증 내역",
        total_amount: result?.total_amount || "",
        category: result?.category || "식비",
        location: result?.location || "",
        payment_method: paymentMethodHandled,
        date: normalizeDate(result?.date) ?? prev.date
      }));
    } catch (err) {
      console.warn("AI analyze failed", err);
      // 에러 시 기본값
      setForm(prev => ({ ...prev, title: "영수증 내역", total_amount: "1200", payment_method: "현금" }));
    } finally {
      setUploading(false);
      setStep("edit");
    }
  };

  const handleSave = async () => {
    try {
      const paymentMethodMapped = form.payment_method === "카드" ? "CARD" : "CASH";
      const body = {
        title: form.title,
        location: form.location || form.category,
        total_amount: Number(form.total_amount),
        date: new Date(form.date).toISOString(),
        currency: form.currency,
        payment_method: paymentMethodMapped,
        category: form.category,
      };
      await api.spending.createReceipt(travelId, body);
    } catch (err) {
      console.error("save receipt failed", err);
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
      <OrangeHeader>
        <LogoImg src={LogoSvg} alt="PURAN PURAN" />
      </OrangeHeader>

      <DarkNav>
        <BackBtn onClick={() => navigate("/count")}>‹</BackBtn>
      </DarkNav>

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
        <GalleryIconBtn onClick={() => fileInputRef.current?.click()} />
        <ShutterBtn onClick={takePhoto} disabled={cameraError}>
          <ShutterInner />
        </ShutterBtn>
        <FlashBtn>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z" fill="white" />
          </svg>
        </FlashBtn>
      </CameraControls>
    </Screen>
  );
}

/* ===== 스타일 ===== */
const Screen = styled.div`
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

const OrangeHeader = styled.header`
  height: 60px;
  background: #ff871e;
  display: flex;
  align-items: center;
  padding: 0 20px;
  flex-shrink: 0;
`;

const LogoImg = styled.img`
  height: 28px;
  display: block;
`;

const DarkNav = styled.div`
  padding: 10px 16px 4px;
  background: #3a3a3a;
`;

const BackBtn = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 28px;
  cursor: pointer;
  padding: 4px 8px;
  line-height: 1;
`;

const ViewfinderContainer = styled.div`
  flex: 1;
  position: relative;
  background: #3a3a3a;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 32px;
`;

const Video = styled.video`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Canvas = styled.canvas``;

const ViewfinderOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ViewfinderFrame = styled.div`
  width: 72%;
  aspect-ratio: 0.63;
  border: 2px solid rgba(255, 255, 255, 0.55);
  border-radius: 20px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.25);
`;

const CameraControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 48px 44px;
  background: #3a3a3a;
  flex-shrink: 0;
`;

const GalleryIconBtn = styled.button`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.28);
  border: none;
  cursor: pointer;
`;

const ShutterBtn = styled.button`
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

const ShutterInner = styled.div`
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: #ff871e;
`;

const FlashBtn = styled.button`
  width: 56px;
  height: 56px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
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
