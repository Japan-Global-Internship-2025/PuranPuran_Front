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

  return (
    <BottomNav>
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
