import { useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import SendArrow from "../assets/send-arrow.svg";
import {
  ScheduleSection,
  ScheduleTitle,
  ScheduleHighlight,
  ScheduleSubtitle,
  MapWrapper,
  MapViewAllBtn,
  TimelineList,
  TimelineRow,
  TimelineLeft,
  TimelineLeftLast,
  NumberBadge,
  TimePill,
  TimelineCard,
  CardTopRow,
  TimelineImage,
  TimelineInfo,
  TimelineName,
  TimelineLocation,
  TimelineDesc,
  TimelineActions,
  ActionBtn,
  ScheduleFooterText,
  RecommendBox,
  EmptyState,
  EmptyText,
  RecommendSection,
  SectionTitle,
  Highlight,
  RecommendCard,
  RecommendImage,
  RecommendContent,
  RecommendName,
  RecommendLocation,
  RecommendDesc,
  AiInputSection,
  AiInput,
  AiButton,
  PinModalOverlay,
  PinModal,
  PinModalHeader,
  PinModalTitleArea,
  PinModalName,
  PinModalSubName,
  PinModalAddress,
  PinModalClose,
  PinModalImage,
  PinModalBody,
  PinModalSection,
  PinModalSectionTitle,
  PinModalDesc,
} from "../styles/Plan";

const PinIcon = ({ active }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ transform: "rotate(45deg)" }}>
    <path d="M17 4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v1l2 4v3l-2 2h10l-2-2V9l2-4V4zm-5 16l-1-4h2l-1 4z" fill={active ? "#ff871e" : "#d0d0d0"}/>
  </svg>
);

const RefreshIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="#d0d0d0"/>
  </svg>
);

export default function PlannerContent({ 
  isGenerated, 
  isConfirmed, 
  onConfirmedEdit, 
  onGenerate, 
  scheduleLabel, 
  recommends, 
  schedule, 
  aiInput, 
  onAiChange, 
  onAiSubmit, 
  dayMode 
}) {
  const [pinModal, setPinModal] = useState(null);
  const [pinnedIds, setPinnedIds] = useState(new Set());

  const togglePin = (id) => {
    setPinnedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <>
      <AiInputSection>
        <AiInput
          type="text"
          placeholder="AI에게 한줄 요청: 번화가에 가서 쇼핑도 하고 밥도..."
          value={aiInput}
          onChange={onAiChange}
          onKeyDown={(e) => { if (e.key === "Enter") onAiSubmit(); }}
        />
        <AiButton onClick={onAiSubmit} aria-label="전송">
          <img src={SendArrow} alt="전송" />
        </AiButton>
      </AiInputSection>

      {!isGenerated ? (
        <RecommendBox>
          <EmptyState>
            <EmptyText>일정이 아직 없어요🥲 생성을 요청해보세요</EmptyText>
          </EmptyState>
          <RecommendSection>
            <SectionTitle>
              <Highlight>나고야</Highlight> 여행지 추천
            </SectionTitle>
            {recommends.map((item) => (
              <RecommendCard key={item.id}>
                <RecommendImage src={item.image} alt={item.name} />
                <RecommendContent>
                  <RecommendName>{item.name}</RecommendName>
                  <RecommendLocation>{item.category}</RecommendLocation>
                  <RecommendDesc>{item.desc}</RecommendDesc>
                </RecommendContent>
              </RecommendCard>
            ))}
          </RecommendSection>
        </RecommendBox>
      ) : (
        <RecommendBox>
          <ScheduleSection>
            {isConfirmed ? (
              <>
                <ScheduleSubtitle style={{ margin: "0 0 6px" }}>{dayMode ? "일정이 확정됐어요!" : "오늘의 일정이 확정됐어요!"}</ScheduleSubtitle>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <ScheduleTitle style={{ margin: 0 }}>{dayMode ? "전체 일정보기" : "오늘 일정보기"}</ScheduleTitle>
                  <span onClick={onConfirmedEdit} style={{ fontSize: 12, fontWeight: 500, color: "#9a9a9a", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                    편집하기
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#9a9a9a"/>
                    </svg>
                  </span>
                </div>
              </>
            ) : (
              <>
                <ScheduleTitle>
                  {dayMode
                    ? <><ScheduleHighlight>{schedule.length}일</ScheduleHighlight> 동안의 추천일정이에요</>
                    : <><ScheduleHighlight>{scheduleLabel}</ScheduleHighlight>의 추천일정이에요</>
                  }
                </ScheduleTitle>
                <ScheduleSubtitle>일정을 <span style={{ color: "#ff871e" }}>드래그하여</span> 편집하고 여행을 계획해보세요.</ScheduleSubtitle>
              </>
            )}

            <MapWrapper>
              <MapContainer
                center={[35.1706, 136.9067]}
                zoom={14}
                zoomControl={false}
                attributionControl={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Polyline
                  positions={schedule.map((item) => [item.lat, item.lng])}
                  pathOptions={{ color: "#aaa", weight: 2, opacity: 0.8, dashArray: "6 4" }}
                />
                {schedule.map((item) => (
                  <Marker
                    key={item.id}
                    position={[item.lat, item.lng]}
                    icon={L.divIcon({
                      className: "",
                      html: `<div style="width:26px;height:26px;border-radius:50%;background:#ff871e;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;line-height:1;">${item.id}</div>`,
                      iconSize: [26, 26],
                      iconAnchor: [13, 13],
                    })}
                  />
                ))}
              </MapContainer>
            </MapWrapper>
            {!isConfirmed && (
              <MapViewAllBtn onClick={onGenerate}>
                전체 대체추천받기
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="#888"/>
                </svg>
              </MapViewAllBtn>
            )}

            <TimelineList>
              {schedule.map((item, idx) => {
                const isLast = idx === schedule.length - 1;
                const LeftComp = isLast ? TimelineLeftLast : TimelineLeft;
                return (
                <TimelineRow key={item.id}>
                  <LeftComp>
                    <NumberBadge>{dayMode ? `${item.id}일차` : item.id}</NumberBadge>
                    <TimePill>{dayMode ? item.date : item.time}</TimePill>
                  </LeftComp>
                  <TimelineCard onClick={() => setPinModal(item)} style={{ cursor: "pointer" }}>
                    <CardTopRow>
                      <TimelineImage src={item.image} alt={item.name} />
                      <TimelineInfo>
                        <TimelineName>{item.name}</TimelineName>
                        <TimelineLocation>{item.location}</TimelineLocation>
                      </TimelineInfo>
                      {!isConfirmed && (
                        <TimelineActions>
                          <ActionBtn onClick={(e) => { e.stopPropagation(); togglePin(item.id); }}>
                            <PinIcon active={pinnedIds.has(item.id)} />
                          </ActionBtn>
                          <ActionBtn onClick={(e) => e.stopPropagation()}><RefreshIcon /></ActionBtn>
                        </TimelineActions>
                      )}
                    </CardTopRow>
                    <TimelineDesc>{item.desc}</TimelineDesc>
                  </TimelineCard>
                </TimelineRow>
                );
              })}
            </TimelineList>
            {!isConfirmed && <ScheduleFooterText>이 일정이 마음에 드시나요?</ScheduleFooterText>}
          </ScheduleSection>
        </RecommendBox>
      )}

      {pinModal && (
        <PinModalOverlay onClick={() => setPinModal(null)}>
          <PinModal onClick={(e) => e.stopPropagation()}>
            <PinModalHeader>
              <PinModalTitleArea>
                <PinModalName>{pinModal.name}</PinModalName>
                {pinModal.subName && <PinModalSubName>{pinModal.subName}</PinModalSubName>}
                {pinModal.address && (
                  <PinModalAddress>
                    <svg width="12" height="14" viewBox="0 0 12 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                      <path d="M6 0C3.243 0 1 2.243 1 5c0 3.75 5 11 5 11s5-7.25 5-11c0-2.757-2.243-5-5-5zm0 7a2 2 0 110-4 2 2 0 010 4z" fill="#9a9a9a"/>
                    </svg>
                    {pinModal.address}
                  </PinModalAddress>
                )}
              </PinModalTitleArea>
              <PinModalClose onClick={() => setPinModal(null)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </PinModalClose>
            </PinModalHeader>
            <PinModalImage src={pinModal.image} alt={pinModal.name} />
            <PinModalBody>
              <PinModalSection>
                <PinModalSectionTitle>이래서 추천해요!</PinModalSectionTitle>
                <PinModalDesc>{pinModal.desc}</PinModalDesc>
              </PinModalSection>
              {pinModal.stayTime && (
                <PinModalSection>
                  <PinModalSectionTitle>이정도 머물러요!</PinModalSectionTitle>
                  <PinModalDesc>{pinModal.stayTime}</PinModalDesc>
                </PinModalSection>
              )}
            </PinModalBody>
          </PinModal>
        </PinModalOverlay>
      )}
    </>
  );
}
