import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import logoImg from '../assets/logo.svg';
import { Wrapper, Logo } from '../styles/Splash';

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        await api.auth.getUser();
        navigate('/home');
      } catch {
        navigate('/login');
      }
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
