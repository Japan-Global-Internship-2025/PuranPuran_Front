import { Screen, Header, HeaderTitle, Body, Welcome, WelcomeTitle, WelcomeSub, Form, Field, Label, Input, PrimaryButton} from "../styles/auth";
import { Accent, Buttons, SecondaryButton } from "../styles/Signup";
import { useNavigate } from "react-router-dom";


export default function Signup() {
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    //회원가입 로직
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
            <Input placeholder="아이디를 입력하세요." autoComplete="username" />
          </Field>

          <Field>
            <Label>비밀번호</Label>
            <Input
              type="password"
              placeholder="비밀번호를 입력하세요."
              autoComplete="new-password"
            />
            <Input
              type="password"
              placeholder="비밀번호를 한 번 더 입력하세요."
              autoComplete="new-password"
            />
          </Field>

          <Field>
            <Label>이메일 주소</Label>
            <Input
              type="email"
              placeholder="이메일 주소를 입력하세요."
              autoComplete="email"
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


