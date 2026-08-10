"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@/lib/validation/forgotPassword";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import { Alert } from "@/components/ui/primitives";
import AuthIntro from "@/components/Auth/reusables/AuthIntro";
import Shared from "../ForgotPassword.style";
import S from "./RequestForm.style";

/**
 * Owns its own form state. The view above only needs the address that
 * was submitted -- it keeps that as the record of which panel to show
 * -- so `useForm` lives here and the mutation stays up there.
 *
 * `formError` is passed down rather than raised here because the same
 * error can also arrive from the confirmation panel's resend, which
 * doesn't go through this form at all.
 */
export default function RequestForm({ onSubmit, isPending, formError }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

  return (
    <>
      <AuthIntro
        eyebrow="Account recovery"
        heading="Reset your password"
        sub={
          <>
            Enter the email address on your account. We&rsquo;ll send you a
            link to set a new password.
          </>
        }
      />

      <S.FormEl onSubmit={handleSubmit(onSubmit)} noValidate>
        {formError && (
          <Alert $tone="danger" role="alert">
            {formError}
          </Alert>
        )}

        {/* Plain div, and it earns its place: it keeps the hint inside
            the field's own box, so FormEl's gap doesn't push it away
            from the input it describes. */}
        <div>
          <Field
            label="Email address"
            type="email"
            placeholder="you@university.edu"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <S.Hint>
            Students: use the address your institution issued you(if any).
          </S.Hint>
        </div>

        <Button type="submit" block loading={isPending} loadingText="Sending link…">
          Send reset link
        </Button>
      </S.FormEl>

      <Shared.Divider />

      <Shared.FootRow>
        <Shared.BackLink href="/login">Back to sign in</Shared.BackLink>
        <span>Need help? Contact your registrar&rsquo;s office.</span>
      </Shared.FootRow>
    </>
  );
}
