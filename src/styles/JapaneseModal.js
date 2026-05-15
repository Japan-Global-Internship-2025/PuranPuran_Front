import styled from "styled-components";


export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 0 24px;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;


export const ModalCard = styled.div`
  width: 100%;
  max-width: 360px;
  background: #fff;
  border-radius: 20px;
  padding: 22px 22px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: slideUp 0.25s ease;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const ModalTitle = styled.h2`
  align-self: flex-start;
  margin: 0 0 14px;
  font-size: 16px;
  font-weight: 600;
  color: #454545;
`;

export const PillRow = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
`;

export const Pill = styled.span`
  display: inline-flex;
  padding: 4px 12px;
  border-radius: 999px;
  border: 1px solid rgba(25, 203, 64, 0.16);
  background: #d1fddb;
  font-size: 12px;
  font-weight: 500;
  color: #19cb40;
`;


export const SoundButton = styled.button`
  border: none;
  background: transparent;
  padding: 4px;
  cursor: pointer;
  opacity: 0.6;
  margin-bottom: 4px;

  img {
    width: 28px;
    height: 28px;
    color: #bfbcbc;
    display: block;
  }
`;


export const JpText = styled.div`
  font-size: 22px;
  font-weight: 600;
  color: #454545;
  text-align: center;
  line-height: 1.3;
`;

export const JpSub = styled.div`
  margin-top: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #616161;
  text-align: center;
`;


export const Divider = styled.hr`
  width: 100%;
  border: 0;
  border-top: 1px solid #efefef;
  margin: 16px 0;
`;

export const JpMeaning = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #454545;
  text-align: center;
  margin-bottom: 32px;
`;


export const ConfirmButton = styled.button`
  width: 100%;
  height: 52px;
  border: 0;
  border-radius: 10px;
  background: #ff871e;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:active {
    transform: translateY(1px);
    opacity: 0.95;
  }
`;