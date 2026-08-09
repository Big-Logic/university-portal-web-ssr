"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validation/login";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import { Alert } from "@/components/ui/primitives";
import S from "./LoginForm.style";

/**
 * Owns its own form state, same split as ResetForm on /reset-password:
 * the view above only needs the submitted values and what came back, so
 * `useForm` lives here and the mutation stays up there.
 *
 * `formError` arrives as a prop because it's the mutation's, not this
 * form's -- a rejected credential is the API's answer, and nothing here
 * could have caught it.
 */
export default function LoginForm({ onSubmit, isPending, formError }) {
  // Not part of the schema and not sent to the API: session lifetime is
  // decided by the cookies the login Route Handler sets, so this is a
  // placeholder for a preference the backend doesn't take yet. Local
  // state rather than lifted, since nothing above reads it.
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  return (
    <>
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

        <Button type="submit" block loading={isPending} loadingText="Signing in…">
          Log in
        </Button>
      </S.FormEl>

      <S.Footer>
        Trouble signing in? Contact your registrar&rsquo;s office.
      </S.Footer>
    </>
  );
}
