import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo.svg';
import styled, { keyframes } from 'styled-components';

const fadeOut = keyframes`
  from { opacity: 1; }
  to   { opacity: 0; }
`;

export const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #FF871E;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeOut} 0.5s ease 1.5s forwards;
`;

export const Logo = styled.img`
  width: 45vw;
`;
function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');  // 2초 후 로그인으로 이동
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Wrapper>
      <Logo src={logoImg} alt="Puran Puran" />
    </Wrapper>
  );
}

export default Splash;
