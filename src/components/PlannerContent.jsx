import { useState, useEffect } from "react";
import { geocodePlace } from "../utils/geocode";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
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
  AddModalOverlay,
  AddModal,
  AddModalHeader,
  AddModalTitleArea,
  AddModalSub,
  AddModalTitle,
  AddModalClose,
  AddModalBody,
  AddModalRow,
  AddModalField,
  AddModalLabel,
  AddModalInput,
  AddModalSelect,
  AddModalFooter,
  AddModalButton,
} from "../styles/Plan";

const DEFAULT_CENTER = [35.1706, 136.9067];

function MapController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 14, { duration: 1.2 });
  }, [center[0], center[1]]);
  return null;
}

function getMapCenter(schedule, selectedDateKey, dayMode) {
  if (!schedule || schedule.length === 0) return DEFAULT_CENTER;

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  if (dayMode) {
    const sorted = [...schedule].sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    // 오늘 날짜 항목이 있으면 그 위치로
    const todayItem = sorted.find(item => item.date === todayStr);
    if (todayItem) return [todayItem.lat, todayItem.lng];
    // 오늘이 여행 기간 이전 → 첫째 날, 이후 → 마지막 날
    const firstDate = sorted[0]?.date ?? "";
    if (todayStr < firstDate) return [sorted[0].lat, sorted[0].lng];
    return [sorted[sorted.length - 1].lat, sorted[sorted.length - 1].lng];
  }

  // 일간 플래너
  const isToday = selectedDateKey === todayStr;
  if (!isToday) return [schedule[0].lat, schedule[0].lng];

  const nowStr = `${String(today.getHours()).padStart(2, "0")}:${String(today.getMinutes()).padStart(2, "0")}`;
  const sorted = [...schedule].sort((a, b) => (a.time || "00:00").localeCompare(b.time || "00:00"));

  let target = sorted[0];
  for (const item of sorted) {
    if ((item.time || "00:00") <= nowStr) target = item;
    else break;
  }
  return [target.lat, target.lng];
}

const CATEGORIES = ["기타", "식사", "쇼핑", "관광", "숙소", "교통", "카페"];

export default function PlannerContent({
  isGenerated,
  isConfirmed,
  onConfirmedEdit,
  onGenerate,
  scheduleLabel,
  recommends,
  travel,
  schedule,
  aiInput,
  onAiChange,
  onAiSubmit,
  dayMode,
  selectedDateKey,
  isEditMode = false,
  onEditToggle,
  onDeleteItem,
  onUpdateItem,
  onAddItem,
  onSaveEdits,
}) {
  const [pinModal, setPinModal] = useState(null);
  const [pinnedIds, setPinnedIds] = useState(new Set());
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", time: "12:00", category: "기타", desc: "" });
  const [isSaving, setIsSaving] = useState(false);

  const geocode = (name) => {
    const region = travel?.travel_region_id?.region_ko ?? travel?.travel_region ?? "";
    return geocodePlace(name, region);
  };

  const openEditModal = (item, e) => {
    e.stopPropagation();
    setEditForm({ name: item.name, time: item.time || "12:00", category: item.location || "기타", desc: item.desc || "" });
    setEditModal(item);
  };

  const handleEditSave = async () => {
    if (!editForm.name.trim()) return;
    setIsSaving(true);
    const coords = await geocode(editForm.name);
    onUpdateItem(editModal.id, {
      name: editForm.name,
      time: editForm.time,
      location: editForm.category,
      desc: editForm.desc,
      ...(coords && { lat: coords.lat, lng: coords.lng }),
    });
    setIsSaving(false);
    setEditModal(null);
  };

  const handleAddSave = async () => {
    if (!addForm.name.trim()) return;
    setIsSaving(true);
    const coords = await geocode(addForm.name);
    onAddItem({ ...addForm, ...(coords && { lat: coords.lat, lng: coords.lng }) });
    setAddForm({ name: "", time: "12:00", category: "기타", desc: "" });
    setIsSaving(false);
    setIsAddOpen(false);
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
              <Highlight>{travel?.travel_region_id.region_ko || ""}</Highlight> 여행지 추천
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
          <ScheduleSection paddingBottom={isEditMode ? "120px" : "30px"}>
            {isConfirmed ? (
              <>
                <ScheduleSubtitle style={{ margin: "0 0 6px" }}>{dayMode ? "일정이 확정됐어요!" : "오늘의 일정이 확정됐어요!"}</ScheduleSubtitle>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <ScheduleTitle style={{ margin: 0 }}>{dayMode ? "전체 일정보기" : "오늘 일정보기"}</ScheduleTitle>
                  {!dayMode && (
                    <span
                      onClick={isEditMode ? onEditToggle : onEditToggle}
                      style={{ fontSize: 12, fontWeight: 400, color: isEditMode ? "#ff871e" : "#9a9a9a", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                    >
                      {isEditMode ? "편집취소" : "편집하기"}
                      {isEditMode ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M18 6L6 18M6 6l12 12" stroke="#ff871e" strokeWidth="2.2" strokeLinecap="round"/>
                        </svg>
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#9a9a9a"/>
                        </svg>
                      )}
                    </span>
                  )}
                  {dayMode && (
                    <span onClick={onConfirmedEdit} style={{ fontSize: 12, fontWeight: 500, color: "#9a9a9a", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                      편집하기
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#9a9a9a"/>
                      </svg>
                    </span>
                  )}
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
                center={getMapCenter(schedule, selectedDateKey, dayMode)}
                zoom={14}
                zoomControl={false}
                attributionControl={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapController center={getMapCenter(schedule, selectedDateKey, dayMode)} />
                <Polyline
                  positions={schedule.map((item) => [item.lat, item.lng])}
                  pathOptions={{ color: "#646464", weight: 2, opacity: 1, dashArray: "6 4" }}
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
            {(!isConfirmed || isEditMode) && (
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
                      <TimePill>{dayMode ? item.date.slice(2, 4) + "." + item.date.slice(5, 7) + "." + item.date.slice(8, 10) : item.time}</TimePill>
                    </LeftComp>
                    <TimelineCard
                      onClick={() => !isEditMode && setPinModal(item)}
                      style={{ cursor: isEditMode ? "default" : "pointer" }}
                    >
                      <CardTopRow>
                        <TimelineImage src={item.image} alt={item.name} />
                        <TimelineInfo>
                          <TimelineName>{item.name}</TimelineName>
                          <TimelineLocation>{item.location}</TimelineLocation>
                        </TimelineInfo>
                        {isEditMode && !dayMode && (
                          <TimelineActions>
                            <ActionBtn onClick={(e) => openEditModal(item, e)} title="수정">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#ff871e"/>
                              </svg>
                            </ActionBtn>
                            <ActionBtn onClick={(e) => { e.stopPropagation(); onDeleteItem(item.id); }} title="삭제">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M18 6L6 18M6 6l12 12" stroke="#e53935" strokeWidth="2.2" strokeLinecap="round"/>
                              </svg>
                            </ActionBtn>
                          </TimelineActions>
                        )}
                        {!isConfirmed && !isEditMode && (
                          <TimelineActions />
                        )}
                      </CardTopRow>
                      <TimelineDesc>{item.desc}</TimelineDesc>
                    </TimelineCard>
                  </TimelineRow>
                );
              })}
            </TimelineList>

            {!isConfirmed && !isEditMode && <ScheduleFooterText>이 일정이 마음에 드시나요?</ScheduleFooterText>}
          </ScheduleSection>
        </RecommendBox>
      )}

      {/* 장소 상세 모달 */}
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

      {/* 항목 수정 모달 */}
      {editModal && (
        <AddModalOverlay onClick={() => setEditModal(null)}>
          <AddModal onClick={(e) => e.stopPropagation()}>
            <AddModalHeader>
              <AddModalTitleArea>
                <AddModalSub>일정 내용을 수정해주세요</AddModalSub>
                <AddModalTitle>항목 수정</AddModalTitle>
              </AddModalTitleArea>
              <AddModalClose onClick={() => setEditModal(null)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </AddModalClose>
            </AddModalHeader>
            <AddModalBody>
              <AddModalField>
                <AddModalLabel>장소명</AddModalLabel>
                <AddModalInput
                  placeholder="장소 이름"
                  value={editForm.name}
                  onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))}
                />
              </AddModalField>
              <AddModalRow>
                <AddModalField style={{ flex: 1 }}>
                  <AddModalLabel>방문 시간</AddModalLabel>
                  <AddModalInput
                    type="time"
                    value={editForm.time}
                    onChange={(e) => setEditForm(f => ({ ...f, time: e.target.value }))}
                  />
                </AddModalField>
                <AddModalField style={{ flex: 1 }}>
                  <AddModalLabel>카테고리</AddModalLabel>
                  <AddModalSelect
                    value={editForm.category}
                    onChange={(e) => setEditForm(f => ({ ...f, category: e.target.value }))}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </AddModalSelect>
                </AddModalField>
              </AddModalRow>
              <AddModalField>
                <AddModalLabel>설명</AddModalLabel>
                <textarea
                  placeholder="간단한 설명을 입력하세요"
                  value={editForm.desc}
                  onChange={(e) => setEditForm(f => ({ ...f, desc: e.target.value }))}
                  style={{
                    width: "100%", minHeight: 80, padding: "12px 16px",
                    background: "#f5f5f5", border: "none", borderRadius: 10,
                    fontSize: 14, color: "#333", outline: "none",
                    resize: "vertical", boxSizing: "border-box", fontFamily: "inherit",
                  }}
                />
              </AddModalField>
            </AddModalBody>
            <AddModalFooter>
              <AddModalButton onClick={handleEditSave} disabled={isSaving}>
                {isSaving ? "위치 검색 중..." : "수정 완료"}
              </AddModalButton>
            </AddModalFooter>
          </AddModal>
        </AddModalOverlay>
      )}

      {/* 항목 추가 모달 */}
      {isAddOpen && (
        <AddModalOverlay onClick={() => setIsAddOpen(false)}>
          <AddModal onClick={(e) => e.stopPropagation()}>
            <AddModalHeader>
              <AddModalTitleArea>
                <AddModalSub>일정에 새 항목을 추가해요</AddModalSub>
                <AddModalTitle>항목 추가</AddModalTitle>
              </AddModalTitleArea>
              <AddModalClose onClick={() => setIsAddOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </AddModalClose>
            </AddModalHeader>
            <AddModalBody>
              <AddModalField>
                <AddModalLabel>장소명</AddModalLabel>
                <AddModalInput
                  placeholder="장소 이름"
                  value={addForm.name}
                  onChange={(e) => setAddForm(f => ({ ...f, name: e.target.value }))}
                />
              </AddModalField>
              <AddModalRow>
                <AddModalField style={{ flex: 1 }}>
                  <AddModalLabel>방문 시간</AddModalLabel>
                  <AddModalInput
                    type="time"
                    value={addForm.time}
                    onChange={(e) => setAddForm(f => ({ ...f, time: e.target.value }))}
                  />
                </AddModalField>
                <AddModalField style={{ flex: 1 }}>
                  <AddModalLabel>카테고리</AddModalLabel>
                  <AddModalSelect
                    value={addForm.category}
                    onChange={(e) => setAddForm(f => ({ ...f, category: e.target.value }))}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </AddModalSelect>
                </AddModalField>
              </AddModalRow>
              <AddModalField>
                <AddModalLabel>설명</AddModalLabel>
                <textarea
                  placeholder="간단한 설명을 입력하세요"
                  value={addForm.desc}
                  onChange={(e) => setAddForm(f => ({ ...f, desc: e.target.value }))}
                  style={{
                    width: "100%", minHeight: 80, padding: "12px 16px",
                    background: "#f5f5f5", border: "none", borderRadius: 10,
                    fontSize: 14, color: "#333", outline: "none",
                    resize: "vertical", boxSizing: "border-box", fontFamily: "inherit",
                  }}
                />
              </AddModalField>
            </AddModalBody>
            <AddModalFooter>
              <AddModalButton onClick={handleAddSave} disabled={isSaving}>
                {isSaving ? "위치 검색 중..." : "추가 완료"}
              </AddModalButton>
            </AddModalFooter>
          </AddModal>
        </AddModalOverlay>
      )}
    </>
  );
}
