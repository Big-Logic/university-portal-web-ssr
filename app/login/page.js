"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import styled from "styled-components";
import { rt } from "@/lib/theme";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { loginSchema } from "@/lib/validation";
import { homePathForRole } from "@/lib/navigation";
import { clientRequest } from "@/lib/client-api";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import { Card, Alert } from "@/components/ui/primitives";

const Screen = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: ${({ theme }) => rt(theme).color.ink50};

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const FormSide = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => rt(theme).space[3]};
  padding: ${({ theme }) => rt(theme).space[4]}
    ${({ theme }) => rt(theme).space[6]};
  border-bottom: 1px solid ${({ theme }) => rt(theme).color.ink150};
`;

const Mark = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => rt(theme).radius.md};
  background: ${({ theme }) => rt(theme).color.ink900};
  color: ${({ theme }) => rt(theme).color.white};
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
`;

const WordmarkText = styled.div`
  font-weight: 800;
  font-size: 17px;
  letter-spacing: -0.01em;
`;

const FormCenter = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => rt(theme).space[6]};
`;

const FormCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  box-shadow: ${({ theme }) => rt(theme).shadow.md};
`;

const Eyebrow = styled.p`
  font-family: ${({ theme }) => rt(theme).font.mono};
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => rt(theme).color.blue700};
  margin: 0 0 4px;
`;

const Heading = styled.h1`
  font-size: 24px;
  margin-bottom: 4px;
`;

const Sub = styled.p`
  color: ${({ theme }) => rt(theme).color.ink500};
  font-size: 14px;
  margin: 0 0 ${({ theme }) => rt(theme).space[6]};
`;

const FormEl = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => rt(theme).space[4]};
`;

const RememberRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${({ theme }) => rt(theme).color.ink700};
  cursor: pointer;
`;

const Footer = styled.p`
  text-align: center;
  font-size: 13.5px;
  color: ${({ theme }) => rt(theme).color.ink500};
  margin-top: ${({ theme }) => rt(theme).space[4]};
`;

const VisualSide = styled.div`
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => rt(theme).color.ink900};

  @media (max-width: 860px) {
    display: none;
  }
`;

const VisualPattern = styled.div`
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    ${({ theme }) => rt(theme).color.blue700} 1px,
    transparent 1px
  );
  background-size: 28px 28px;
  opacity: 0.25;
`;

const VisualContent = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: ${({ theme }) => rt(theme).space[12]};
`;

const VisualQuote = styled.p`
  color: ${({ theme }) => rt(theme).color.white};
  font-size: 30px;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.01em;
  max-width: 460px;
  margin: 0 0 ${({ theme }) => rt(theme).space[4]};

  span {
    color: ${({ theme }) => rt(theme).color.blue100};
  }
`;

const VisualCaption = styled.p`
  color: ${({ theme }) => rt(theme).color.ink300};
  font-size: 14px;
  max-width: 420px;
  margin: 0;
`;

export default function LoginPage() {
  const [formError, setFormError] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const loginMutation = useMutation({
    mutationFn: (values) =>
      clientRequest("/api/auth/login", {
        method: "POST",
        body: values,
      }),
    onSuccess: (data) => {
      // Full navigation, not router.push -- the httpOnly cookie was
      // just set on this response, and Proxy needs a fresh request to
      // see it before the destination page's server-side fetch will
      // succeed. A client-side route transition wouldn't guarantee that.
      window.location.href = homePathForRole(data?.user?.role);
    },
    onError: (err) => setFormError(err.message),
  });

  function onSubmit(values) {
    setFormError(null);
    loginMutation.mutate(values);
  }

  return (
    <Screen>
      <FormSide>
        <Header>
          <Mark>
            <GraduationCap size={20} aria-hidden="true" />
          </Mark>
          <WordmarkText>Basecourse</WordmarkText>
        </Header>

        <FormCenter>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{ width: "100%", maxWidth: 400 }}
          >
            <FormCard>
              <Eyebrow>Portal sign-in</Eyebrow>
              <Heading>Welcome back</Heading>
              <Sub>Log in to your account</Sub>

              <FormEl onSubmit={handleSubmit(onSubmit)} noValidate>
                <Field
                  label="Email address"
                  type="email"
                  placeholder="you@university.edu"
                  error={errors.email?.message}
                  {...register("email")}
                />

                <Field
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  sideLink="Forgot password?"
                  sideLinkHref="/forgot-password"
                  error={errors.password?.message}
                  {...register("password")}
                />

                <RememberRow>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe((v) => !v)}
                  />
                  Remember me
                </RememberRow>

                {formError && (
                  <Alert $tone="danger" role="alert">
                    {formError}
                  </Alert>
                )}

                <Button
                  type="submit"
                  block
                  loading={loginMutation.isPending}
                  loadingText="Signing in…"
                >
                  Log in
                </Button>
              </FormEl>

              <Footer>
                Trouble signing in? Contact your registrar&rsquo;s office.
              </Footer>
            </FormCard>
          </motion.div>
        </FormCenter>
      </FormSide>

      <VisualSide>
        <VisualPattern />
        <VisualContent>
          <VisualQuote>
            Every <span>record</span>, one ledger.
          </VisualQuote>
          <VisualCaption>
            Courses, offerings, and enrollment, kept in the same system of
            record across every institution that runs on Basecourse.
          </VisualCaption>
        </VisualContent>
      </VisualSide>
    </Screen>
  );
}
