import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../api";
import {
  Screen,
  Header,
  BackButton,
  SkipButton,
  Body,
  TitleSection,
  Title,
  Subtitle,
  GaugeSection,
  GaugeTrack,
  GaugeBar,
  GaugeCount,
  Grid,
  CardWrapper,
  CardImage,
  CardDim,
  CardTag,
  SelectBadge,
  Footer,
  CompleteButton,
  SkipFooterButton,
} from "../styles/Preference";

import p1 from "../assets/images/p1.svg";
import p2 from "../assets/images/p2.svg";
import p3 from "../assets/images/p3.svg";
import p4 from "../assets/images/p4.svg";
import p5 from "../assets/images/p5.svg";
import p6 from "../assets/images/p6.svg";
import p7 from "../assets/images/p7.svg";
import p8 from "../assets/images/p8.svg";
import p9 from "../assets/images/p9.svg";

const MAX_TASTE = 3;

export const CATEGORIES = [
  { id: 1, key: "shopping", tag: "#쇼핑", img: p1 },
  { id: 2, key: "food", tag: "#맛집탐방", img: p2 },
  { id: 3, key: "heritage", tag: "#유적지", img: p3 },
  { id: 4, key: "art", tag: "#예술관람", img: p4 },
  { id: 5, key: "activity", tag: "#체험·액티비티", img: p5 },
  { id: 6, key: "hotel", tag: "#호캉스", img: p6 },
  { id: 7, key: "festival", tag: "#공연·페스티벌", img: p7 },
  { id: 8, key: "nature", tag: "#자연감상", img: p8 },
  { id: 9, key: "photo", tag: "#포토존", img: p9 },
];

export default function Preference() {
  const navigate = useNavigate();
  const location = useLocation();

  // 로그인 시 navigate("/preference", { state: { username: "아이디" } }) 로 넘겨받음
  const username = location.state?.username || "OOO";

  // 선택한 카테고리 id 배열 (최대 3개)
  const [selected, setSelected] = useState([]);

  const handleCard = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((v) => v !== id);
      }
      if (prev.length >= MAX_TASTE) return prev;
      return [...prev, id];
    });
  };

  const handleComplete = async () => {
    try {
      await api.auth.updateUser({ taste: JSON.stringify(selected) });
      navigate("/travelstart");
    } catch (err) {
      console.error(err);
      alert("취향 저장에 실패했습니다.");
    }

    // try {
    //   const response = await fetch("", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       "Authorization": `Bearer ${localStorage.getItem("token")}`,
    //     },
    //     body: JSON.stringify({ taste: selected }),
    //   });
    //   if (response.ok) {
    //     navigate("/travelstart");
    //   } else {
    //     alert("취향 저장에 실패했어요");
    //   }
    // } catch (err) {
    //   alert("네트워크 오류가 발생했어요");
    // }
  };

  const handleSkip = () => {
    navigate("/travelstart");
  };

  return (
    <Screen>
      <Header>
        <BackButton onClick={() => navigate(-1)} aria-label="뒤로가기">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="#111"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </BackButton>
        <SkipButton onClick={handleSkip}>건너뛰기</SkipButton>
      </Header>

      <Body>
        <TitleSection>
          <Title>{username}님의 취향을 알려주세요</Title>
          <Subtitle>카테고리를 선택하면 맞춤 여행을 계획해드려요</Subtitle>
        </TitleSection>

        <GaugeSection>
          <GaugeTrack>
            {Array.from({ length: MAX_TASTE }).map((_, i) => (
              <GaugeBar key={i} $filled={i < selected.length} />
            ))}
          </GaugeTrack>
          <GaugeCount>
            <strong>{selected.length}</strong> / {MAX_TASTE}
          </GaugeCount>
        </GaugeSection>

        <Grid>
          {CATEGORIES.map((cat) => {
            const order = selected.indexOf(cat.id);
            const isSelected = order !== -1;

            return (
              <CardWrapper key={cat.id} onClick={() => handleCard(cat.id)}>
                <CardImage>
                  <img src={cat.img} alt={cat.tag} />
                </CardImage>
                <CardDim $selected={isSelected} />
                <CardTag>{cat.tag}</CardTag>
                <SelectBadge $selected={isSelected}>
                  {isSelected ? order + 1 : ""}
                </SelectBadge>
              </CardWrapper>
            );
          })}
        </Grid>

        <Footer>
          <CompleteButton
            onClick={handleComplete}
            disabled={selected.length === 0}
          >
            완료
          </CompleteButton>
          <SkipFooterButton onClick={handleSkip}>건너뛰기</SkipFooterButton>
        </Footer>
      </Body>
    </Screen>
  );
}
