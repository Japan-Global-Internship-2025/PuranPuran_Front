import styled from "styled-components";
export { Screen, Header, HeaderTitle, Body, Welcome, WelcomeTitle, WelcomeSub, Form, Field, Label, Input, ButtonWrap, PrimaryButton };
const Screen = styled.div`
  min-height: 100dvh;
  width: 100%;
  max-width: 480px; 
  margin: 0 auto;
  background: #f8f8f8;

  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
`;

const Header = styled.header`
  display: grid;
  align-items: center;
  padding: 10px;
`;

const HeaderTitle = styled.div`
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #111;
`;


const Body = styled.main`
  padding: 28px 24px 24px;
`;

const Welcome = styled.section`
  margin-top: 10px;
  margin-bottom: 28px;
`;

const WelcomeTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #111;
  line-height: 1.25;
`;

const WelcomeSub = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #111;
  line-height: 1.25;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #454545;
`;

const Input = styled.input`
  height: 46px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1px solid #e6e6e6;
  outline: none;
  font-size: 15px;
  background: #fff;

  &::placeholder {
    color: #949494;
  }

  &:focus {
    border-color: #ff871e;
    box-shadow: 0 0 0 3px rgba(255, 138, 0, 0.15);
  }
`;

const ButtonWrap = styled.div`
  margin-top: 26px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
`;

const PrimaryButton = styled.button`
  width: 100%;
  height: 56px;
  border: 0;
  border-radius: 7px;
  background: #ff871e;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:active {
    transform: translateY(1px);
    opacity: 0.95;
  }
`;
