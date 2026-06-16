import {Screen, Header, HeaderTitle, Body, Welcome, WelcomeTitle, WelcomeSub, Form, Field, Label, Input, ButtonWrap, PrimaryButton} from "../styles/auth";
import { LinkButton } from "../styles/Login";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../api";

export default function Login() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async (e) => {
    e.preventDefault();
    if (!userId || !password) {
      alert("아이디와 비밀번호를 모두 입력하세요.");
      return;
    }
    try {
      await api.auth.login({ user_id: userId, user_pw: password });
      navigate("/home");
    } catch (err) {
      if (err && err.status === 401) {
        alert("아이디 또는 비밀번호가 올바르지 않습니다. 다시 시도하세요.");
        return;
      }
      console.error(err);
      alert("로그인에 실패했습니다. 입력 정보를 확인하세요.");
    }
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
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </Field>

          <Field>
            <Label>비밀번호</Label>
            <Input
              type="password"
              placeholder="비밀번호를 입력하세요."
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

