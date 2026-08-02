"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { loginSchema } from "@/lib/validation";
import { homePathForRole } from "@/lib/navigation";
import { clientRequest } from "@/lib/api/client";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import { Alert } from "@/components/ui/primitives";
import S from "./login.style";

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
    <S.Screen>
      <S.FormSide>
        <S.Header>
          <S.Mark>
            <GraduationCap size={20} aria-hidden="true" />
          </S.Mark>
          <S.WordmarkText>Basecourse</S.WordmarkText>
        </S.Header>

        <S.FormCenter>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{ width: "100%", maxWidth: 400 }}
          >
            <S.FormCard>
              <S.Eyebrow>Portal sign-in</S.Eyebrow>
              <S.Heading>Welcome back</S.Heading>
              <S.Sub>Log in to your account</S.Sub>

              <S.FormEl onSubmit={handleSubmit(onSubmit)} noValidate>
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

                <S.RememberRow>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe((v) => !v)}
                  />
                  Remember me
                </S.RememberRow>

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
              </S.FormEl>

              <S.Footer>
                Trouble signing in? Contact your registrar&rsquo;s office.
              </S.Footer>
            </S.FormCard>
          </motion.div>
        </S.FormCenter>
      </S.FormSide>

      <S.VisualSide>
        <S.VisualPattern />
        <S.VisualContent>
          <S.VisualQuote>
            Every <span>record</span>, one ledger.
          </S.VisualQuote>
          <S.VisualCaption>
            Courses, offerings, and enrollment, kept in the same system of
            record across every institution that runs on Basecourse.
          </S.VisualCaption>
        </S.VisualContent>
      </S.VisualSide>
    </S.Screen>
  );
}
