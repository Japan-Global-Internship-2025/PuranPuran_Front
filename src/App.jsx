import { Routes, Route, Navigate } from "react-router-dom";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Signup from "./pages/signup";
import Travelstart from "./pages/Travelstart";
import Preference from "./pages/Preference";
import Home from "./pages/Home"; 
import Plan from "./pages/Plan";
import Count from "./pages/Count";
import Camera from "./pages/Camera";
import Mypage from "./pages/Mypage";
import CountCalendar from "./pages/CountCalendar";
export default function App() {
  return (
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
  );
}