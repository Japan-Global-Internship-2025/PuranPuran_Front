import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import LogoSvg from "../assets/logo1.svg";
import {
  Screen,
  OrangeHeader,
  LogoImg,
  DarkNav,
  BackBtn,
  ViewfinderContainer,
  Video,
  Canvas,
  ViewfinderOverlay,
  ViewfinderFrame,
  CameraControls,
  GalleryIconBtn,
  ShutterBtn,
  ShutterInner,
  FlashBtn,
  CameraErrorBox,
  GalleryFallbackBtn,
  ConfirmImage,
  ConfirmActions,
  RetakeBtn,
  AnalyzeBtn,
  EditHeader,
  EditHeaderTitle,
  SaveBtn,
  ReceiptPreview,
  EditForm,
  FieldLabel,
  FieldInput,
  ChipRow,
  Chip,
  KrwEstimate,
  SubmitBtn,
  DoneContainer,
  DoneIcon,
  DoneTitle,
  DoneSub,
  DoneBtn,
  DoneBtnSecondary,
} from "../styles/Camera";

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

// 초광각/망원/심도 등 보조 렌즈를 식별 (메인 광각 카메라 우선 선택용)
function isSpecialLens(label = "") {
  return /ultra|wide angle|超広角|초광각|telephoto|tele|망원|depth|심도|0\.5/i.test(
    label
  );
}

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
  const [hasTorch, setHasTorch] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);

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
      // 1. 권한 획득용 기본 후면 카메라 요청 (레이블은 권한 후에만 채워짐)
      let s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      });

      // 2. 장치 목록에서 후면 카메라만 추림
      const devices = await navigator.mediaDevices.enumerateDevices();
      const backCams = devices.filter(
        (d) =>
          d.kind === "videoinput" &&
          /back|rear|environment|후면/i.test(d.label)
      );

      // 3. 초광각/망원/심도 렌즈를 제외한 "메인 광각" 카메라 우선 선택
      const mainCam = backCams.find((d) => !isSpecialLens(d.label)) || backCams[0];

      // 레이블로 메인 카메라를 특정했고 현재 스트림과 다르면 교체
      const currentId = s.getVideoTracks()[0]?.getSettings?.().deviceId;
      if (mainCam?.deviceId && mainCam.deviceId !== currentId) {
        s.getTracks().forEach((t) => t.stop());
        s = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: mainCam.deviceId } },
        });
      }

      // 4. 줌을 지원하면 1.0배(메인 화각)로 고정 — 초광각(0.5x) 방지
      const track = s.getVideoTracks()[0];
      const caps = track.getCapabilities?.() || {};
      if (caps.zoom && caps.zoom.min <= 1 && caps.zoom.max >= 1) {
        try {
          await track.applyConstraints({ advanced: [{ zoom: 1.0 }] });
        } catch (e) {
          console.warn("zoom 1.0 apply failed", e);
        }
      }

      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;

      // 5. 플래시(Torch) 지원 여부 확인
      setHasTorch(!!caps.torch);
    } catch (err) {
      console.error("Camera start error:", err);
      setCameraError(true);
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((t) => t.stop());
    setIsFlashOn(false);
  };

  const toggleFlash = async () => {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    if (!track) return;

    // 일부 브라우저는 getCapabilities가 늦게 채워지므로 토글 시점에 다시 확인
    const caps = track.getCapabilities?.() || {};
    if (!caps.torch) {
      console.warn("이 카메라/브라우저는 플래시(torch)를 지원하지 않습니다.");
      return;
    }

    try {
      const nextMode = !isFlashOn;
      await track.applyConstraints({ advanced: [{ torch: nextMode }] });
      setIsFlashOn(nextMode);
    } catch (err) {
      console.warn("Flash control error:", err);
    }
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
        <FlashBtn onClick={toggleFlash} disabled={!hasTorch}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z"
              fill={isFlashOn ? "#ff871e" : "white"}
            />
          </svg>
        </FlashBtn>
      </CameraControls>
    </Screen>
  );
}
