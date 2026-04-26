import {Screen, Header, HeaderTitle, Body, Welcome, WelcomeTitle, WelcomeSub, Form, Field, Label, Input, ButtonWrap, PrimaryButton} from "../styles/auth";
import { LinkButton } from "../styles/Login";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const onLogin = (e) => {
    e.preventDefault();
    // 로그인 로직
  };

  return (
    <Screen>
      <Header>
        <HeaderTitle>로그인</HeaderTitle>
      </Header>

      <Body>
        <Welcome>
          <WelcomeTitle>환영해요!</WelcomeTitle>
          <WelcomeSub>로그인 후 이용할 수 있어요</WelcomeSub>
        </Welcome>

        <Form onSubmit={onLogin}>
          <Field>
            <Label>아이디</Label>
            <Input
              type="text"
              placeholder="아이디를 입력하세요."
              autoComplete="username"
            />
          </Field>

          <Field>
            <Label>비밀번호</Label>
            <Input
              type="password"
              placeholder="비밀번호를 입력하세요."
              autoComplete="current-password"
            />
          </Field>

          <ButtonWrap>
            <PrimaryButton type="submit">로그인하기</PrimaryButton>
            <LinkButton type="button" onClick={() => navigate("/signup")}>회원가입하기</LinkButton>
          </ButtonWrap>
        </Form>
      </Body>
    </Screen>
  );
}

