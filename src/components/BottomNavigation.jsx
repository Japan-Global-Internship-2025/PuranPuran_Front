import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BottomNav, NavItem, NavIcon } from "../styles/BottomNav";
import TabHome from "../assets/tab-home.svg";
import TabCalendar from "../assets/tab-calendar.svg";
import TabCamera from "../assets/tabler_cash1.svg";
import TabUser from "../assets/tab-user.svg";

export default function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  let active = location.pathname.split("/")[1] || "home";
  if (active === "count-calendar") active = "count";

  // 스크롤 방향에 따라 nav바를 축소/복원 (아래로 내리면 축소, 위로 올리면 복원)
  const [shrunk, setShrunk] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = Math.max(0, window.scrollY);
        if (y < 10) {
          setShrunk(false);
        } else if (y > lastScrollY.current + 4) {
          setShrunk(true);
        } else if (y < lastScrollY.current - 4) {
          setShrunk(false);
        }
        lastScrollY.current = y;
        ticking.current = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <BottomNav $shrunk={shrunk}>
      <NavItem onClick={() => navigate("/home")}>
        <NavIcon $active={active === "home"}><img src={TabHome} alt="홈" /></NavIcon>
      </NavItem>
      <NavItem onClick={() => navigate("/plan")}>
        <NavIcon $active={active === "plan"}><img src={TabCalendar} alt="일정" /></NavIcon>
      </NavItem>
      <NavItem onClick={() => navigate("/count")}>
        <NavIcon $active={active === "count"}><img src={TabCamera} alt="가계부" /></NavIcon>
      </NavItem>
      <NavItem onClick={() => navigate("/mypage")}>
        <NavIcon $active={active === "mypage"}><img src={TabUser} alt="마이페이지" /></NavIcon>
      </NavItem>
    </BottomNav>
  );
}
