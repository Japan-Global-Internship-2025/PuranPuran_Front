import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Screen,
  Header,
  BackButton,
  CameraContainer,
  Viewfinder,
  Controls,
  GalleryButton,
  ShutterButton,
  FlashButton,
  Video,
  Canvas,
} from "../styles/Camera";
import styled from "styled-components";
export default function Camera() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [flash, setFlash] = useState(false);



  

  const goBack = () => {
    navigate(-1);
  };

  return (
    <Screen>
      <Header>
        <BackButton onClick={goBack}>←</BackButton>
        <span>PuranPuran</span>
      </Header>

      <CameraContainer>
        <Viewfinder>
          <Video ref={videoRef} autoPlay playsInline />
          <Canvas ref={canvasRef} style={{ display: "none" }} />
          {flash && <FlashOverlay />}
        </Viewfinder>

        <Controls>
          <GalleryButton>
            <div /> {/* 갤러리 썸네일 */}
          </GalleryButton>
          
          <ShutterButton onClick={takePhoto}>
            <div />
          </ShutterButton>
          
          <FlashButton onClick={() => setFlash(!flash)} active={flash}>
            ⚡
          </FlashButton>
        </Controls>
      </CameraContainer>
    </Screen>
  );
}

