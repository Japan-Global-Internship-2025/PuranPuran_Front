import styled from "styled-components";
export { Accent, Buttons, SecondaryButton };


const Accent = styled.span`
  color: #ff8a00;
`;


const Buttons = styled.div`
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SecondaryButton = styled.button`
  width: 100%;
  height: 56px;
  border: 0;
  border-radius: 7px;
  background: #fff;
  color: #454545;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:active {
    transform: translateY(1px);
    opacity: 0.95;
  }
`;