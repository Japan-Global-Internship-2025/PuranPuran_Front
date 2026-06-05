import { Screen, Header, HeaderTitle, Body, Welcome, WelcomeTitle, WelcomeSub, Form, Field, Label, Input, PrimaryButton} from "../styles/auth";
import { Accent, Buttons, SecondaryButton } from "../styles/Signup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../api";


export default function Signup() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [email, setEmail] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      await api.auth.signup({ user_id: userId, user_pw: password, user_email: email, taste: '[]' });
      alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('회원가입에 실패했습니다. 입력 정보를 확인하세요.');
    }
  };

  return (
    <Screen>
      <Header>
        <HeaderTitle>회원가입</HeaderTitle>
      </Header>

      <Body>
        <Welcome>
          <WelcomeTitle>반가워요!</WelcomeTitle>
          <WelcomeSub>
            <Accent>PuranPuran</Accent>에 사용할 정보를 입력해주세요
          </WelcomeSub>
        </Welcome>

        <Form onSubmit={onSubmit}>
          <Field>
            <Label>아이디</Label>
            <Input placeholder="아이디를 입력하세요." autoComplete="username" value={userId} onChange={(e) => setUserId(e.target.value)} />
          </Field>

          <Field>
            <Label>비밀번호</Label>
            <Input
              type="password"
              placeholder="비밀번호를 입력하세요."
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="비밀번호를 한 번 더 입력하세요."
              autoComplete="new-password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
          </Field>

          <Field>
            <Label>이메일 주소</Label>
            <Input
              type="email"
              placeholder="이메일 주소를 입력하세요."
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          <Buttons>
            <PrimaryButton type="submit">회원가입하기</PrimaryButton>
            <SecondaryButton type="button" onClick={() => navigate("/login")}>
              로그인하기
            </SecondaryButton>
          </Buttons>
        </Form>
      </Body>
    </Screen>
  );
}


