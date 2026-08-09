"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/lib/validation/resetPassword";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import { Alert } from "@/components/ui/primitives";
import PasswordStrength from "../PasswordStrength";
import { TOKEN_TTL_COPY } from "../constants";
import Shared from "../PasswordReset.style";
import S from "./ResetForm.style";

/**
 * Owns its own form state. The view above only needs to know that a
 * submit happened and what came back, not which fields exist or how
 * they validate -- so `useForm` lives here and the view keeps just the
 * mutation, whose outcome is the one thing that decides which panel
 * renders.
 *
 * `formError` is passed down rather than raised here because the view
 * routes a spent link to a different panel entirely; only the errors
 * that leave the user on this form reach this component.
 */
export default function ResetForm({ onSubmit, isPending, formError }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resetPasswordSchema) });

  const password = watch("newPassword") || "";

  return (
    <>
      <div>
        <S.Eyebrow>Account recovery</S.Eyebrow>
        <Shared.Heading>Set a new password</Shared.Heading>
        <Shared.Sub>
          Choose something you haven&rsquo;t used on this account before.
          You&rsquo;ll sign in with it straight after.
        </Shared.Sub>
      </div>

      <S.FormEl onSubmit={handleSubmit(onSubmit)} noValidate>
        {formError && (
          <Alert $tone="danger" role="alert">
            {formError}
          </Alert>
        )}

        {/* Plain div, and it earns its place: it keeps the meter and
            checklist inside the password field's own box, so FormEl's
            gap doesn't push them away from the input they describe. */}
        <div>
          <Field
            label="New password"
            type="password"
            placeholder="At least 10 characters"
            autoComplete="new-password"
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />
          <PasswordStrength password={password} />
        </div>

        <Field
          label="Confirm new password"
          type="password"
          placeholder="Type it again"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button
          type="submit"
          block
          loading={isPending}
          loadingText="Updating password…"
        >
          Update password
        </Button>
      </S.FormEl>

      <Shared.Divider />

      <Shared.FootRow>
        <Shared.BackLink href="/login">Back to sign in</Shared.BackLink>
        <span>Links expire {TOKEN_TTL_COPY} after they&rsquo;re sent.</span>
      </Shared.FootRow>
    </>
  );
}
