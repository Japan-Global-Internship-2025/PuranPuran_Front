import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import LoadingOverlay from "./components/LoadingOverlay";

// 첫 진입 화면은 즉시 필요하므로 eager import 유지
import Splash from "./pages/Splash";

// 나머지 페이지는 방문 시점에 로드 (코드 스플리팅)
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Travelstart = lazy(() => import("./pages/Travelstart"));
const Preference = lazy(() => import("./pages/Preference"));
const Home = lazy(() => import("./pages/Home"));
const Plan = lazy(() => import("./pages/Plan"));
const Count = lazy(() => import("./pages/Count"));
const CountCalendar = lazy(() => import("./pages/CountCalendar"));
const Camera = lazy(() => import("./pages/Camera"));
const Mypage = lazy(() => import("./pages/Mypage"));

export default function App() {
  return (
    <Suspense fallback={<LoadingOverlay message="불러오는 중..." subMessage="잠시만 기다려주세요!" />}>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/travelstart" element={<Travelstart />} />
        <Route path="/preference" element={<Preference />} />
        <Route path="/home" element={<Home />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/count" element={<Count />} />
        <Route path="/count-calendar" element={<CountCalendar />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/mypage" element={<Mypage />} />
      </Routes>
    </Suspense>
  );
}
