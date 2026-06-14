import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import LogoSvg from "../assets/logo1.svg";
import {
  Screen, OrangeHeader, LogoImg, DarkNav, BackBtn, ViewfinderContainer,
  Video, Canvas, ViewfinderOverlay, ViewfinderFrame, CameraControls,
  GalleryIconBtn, ShutterBtn, ShutterInner, FlashBtn, CameraErrorBox,
  GalleryFallbackBtn, ConfirmImage, ConfirmActions, RetakeBtn, AnalyzeBtn,
  EditHeader, EditHeaderTitle, SaveBtn, ReceiptPreview, EditForm,
  FieldLabel, FieldInput, ChipRow, Chip, KrwEstimate, SubmitBtn,
  DoneContainer, DoneIcon, DoneTitle, DoneSub, DoneBtn, DoneBtnSecondary,
} from "../styles/Camera";

const CATEGORIES = ["식비", "쇼핑", "여가", "교통", "숙박", "기타"];
const PAYMENT_METHODS = ["현금", "카드"];

function normalizeDate(raw) {
  if (!raw) return null;
  const m = String(raw).match(/(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/);
  if (m) return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
  const d = new Date(raw);
  if (!isNaN(d.getTime())) return d.toISOString().split("T")[0];
  return null;
}

function isSpecialLens(label = "") {
  return /ultra|wide angle|超広角|초광각|telephoto|tele|망원|depth|심도|0\.5/i.test(label);
}

export default function Camera() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // 💡 [수정] 클로저 트랩을 피하기 위해 현재 실행 중인 스트림을 ref로 관리
  const streamRef = useRef(null); 
  const [streamState, setStreamState] = useState(null); // UI 리렌더링용

  const [capturedImage, setCapturedImage] = useState(null);
  const [step, setStep] = useState("camera");
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
    // 여행 정보 로드
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
    
    // 💡 [수정] 컴포넌트 언마운트 시 명확하게 카메라 종료
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraError(false);
      
      // 💡 [수정] 혹시 이미 열려있는 스트림이 있다면 먼저 종료 (Strict Mode 대응)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }

      // 1. 기본 권한 획득
      let s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      });

      // 2. 메인 카메라 찾기 루틴
      const devices = await navigator.mediaDevices.enumerateDevices();
      console.log("Available video devices:", devices);
      const backCams = devices.filter(
        (d) => d.kind === "videoinput" && /back|rear|environment|main|후면/i.test(d.label)
      );
      console.log("Back cameras found:", backCams);

      const mainCam = backCams.find((d) => !isSpecialLens(d.label)) || backCams[0];
      const currentId = s.getVideoTracks()[0]?.getSettings?.().deviceId;

      if (mainCam?.deviceId && mainCam.deviceId !== currentId) {
        s.getTracks().forEach((t) => t.stop());
        s = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: mainCam.deviceId } },
        });
      }

      // 3. 줌 설정 (1.0배 고정)
      const track = s.getVideoTracks()[0];
      const caps = track.getCapabilities?.() || {};
      if (caps.zoom && caps.zoom.min <= 1 && caps.zoom.max >= 1) {
        try {
          await track.applyConstraints({ advanced: [{ zoom: 1.0 }] });
        } catch (e) {
          console.warn("zoom 1.0 apply failed", e);
        }
      }

      // 💡 [수정] ref와 state에 모두 저장
      streamRef.current = s;
      setStreamState(s);

      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }

      // 💡 [수정] 하드웨어가 로드될 시간을 주기 위해 300ms 후 플래시 지원 여부 체크
      setTimeout(() => {
        if (streamRef.current) {
          const currentTrack = streamRef.current.getVideoTracks()[0];
          const currentCaps = currentTrack?.getCapabilities?.() || {};
          setHasTorch(!!currentCaps.torch);
        }
      }, 300);

    } catch (err) {
      console.error("Camera start error:", err);
      setCameraError(true);
    }
  };

  const stopCamera = () => {
    // 💡 [수정] 항상 최신 스트림을 가리키는 ref를 사용해 종료
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setStreamState(null);
    setIsFlashOn(false);
  };

  const toggleFlash = async () => {
    // 💡 [수정] ref 기반으로 최신 트랙을 가져옴
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;

    const caps = track.getCapabilities?.() || {};
    if (!caps.torch) {
      alert("이 카메라/브라우저는 플래시를 지원하지 않습니다.");
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
    stopCamera(); // 사진 찍으면 카메라 끄기 (플래시도 같이 꺼짐)
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
          <DoneSub>{form.title} · {form.total_amount}엔</DoneSub>
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

        {capturedImage && <ReceiptPreview src={capturedImage} alt="영수증" />}

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
            <p>카메라를 사용할 수 없어요 (HTTPS 연결을 확인하세요)</p>
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
        
        {/* 💡 [수정] 지원 여부에 따라 버튼 비활성화 해제 */}
        <FlashBtn onClick={toggleFlash} disabled={!hasTorch}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z"
              fill={isFlashOn ? "#ff871e" : (hasTorch ? "white" : "#555")}
            />
          </svg>
        </FlashBtn>
      </CameraControls>
    </Screen>
  );
}