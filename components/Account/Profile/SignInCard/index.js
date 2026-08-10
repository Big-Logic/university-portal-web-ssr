"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { changePasswordSchema } from "@/lib/validation/changePassword";
import { clientRequest } from "@/lib/api/client";
import { formatDate, formatDateTime } from "@/utils/date";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import Shared from "../Profile.style";
import S from "./SignInCard.style";

// Long enough to read what just happened and why you're about to be
// asked to sign in again -- the toast and this share the number, so
// the message is on screen for exactly the wait it describes.
//
// Nothing is protected during it: the cookies are already gone as of
// the response that triggered it, so this is a courtesy pause, not a
// grace period. See the note in onSuccess.
const SIGN_OUT_DELAY_MS = 10_000;

/**
 * The credentials half of the account: what you sign in with, when you
 * last did, and when the record was touched.
 *
 * The password mutation lives here rather than in the view above
 * because nothing else shares it -- and because it ends differently
 * from every other mutation in the app: on success the API has revoked
 * every refresh token for this account, and the Route Handler has
 * cleared both cookies, so there is no session left to render into.
 *
 * There is no "password last changed" row, though the API tracks the
 * column: GET /users/me doesn't return it (USER_PROFILE_SELECT in the
 * API's utils/userProfile.js), and it only comes back in the response
 * to a change. A date invented to fill the gap would be a fabricated
 * claim about the account's own security -- the one thing this card
 * shouldn't do. The row returns when the field does.
 */
export default function SignInCard({ user }) {
  const [open, setOpen] = useState(false);
  const signOutTimer = useRef(null);

  // The pending navigation is global, so it has to be cancellable: an
  // uncleared timer would still fire after this card unmounted and
  // yank the person out of whatever page they'd moved to in the
  // meantime.
  useEffect(() => () => clearTimeout(signOutTimer.current), []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(changePasswordSchema) });

  const changePassword = useMutation({
    mutationFn: (values) =>
      clientRequest("/api/users/me/password", {
        method: "PATCH",
        // confirmPassword stays in the browser -- there's nothing for
        // the API to do with it.
        body: {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
      }),
    onError: (err) => {
      // Toasted rather than shown inline, which suits what actually
      // reaches here: the schema catches every rule about the new
      // password before submit, so a failure at this point is either a
      // mistyped current password or the network -- both facts about
      // the attempt, not about a field that's still on screen.
      //
      // It also survives the form: `close` resets the mutation, so an
      // inline alert would vanish the moment someone cancelled out,
      // taking the reason with it.
      toast.error(`Password change failed!! ${err.message}`);
    },
    onSuccess: () => {
      // The pause is for reading, not for working: both cookies were
      // cleared by the response that got us here, so the session is
      // already over and anything on this page that talks to the
      // server during the wait will 401. lib/api/client.js redirects
      // to /login on its own when that happens, which can cut the wait
      // short -- the toast is the message either way, so it stays on
      // screen for the same duration rather than depending on the
      // timer below surviving.
      toast.success(
        "Password updated. You've been signed out everywhere — taking you to sign in.",
        { duration: SIGN_OUT_DELAY_MS },
      );

      // Full navigation, not router.push: Proxy has to see a fresh
      // request to notice the cookies are gone, and a client-side
      // transition wouldn't guarantee that -- same reasoning as login
      // and logout.
      signOutTimer.current = setTimeout(() => {
        window.location.href = "/login";
      }, SIGN_OUT_DELAY_MS);
    },
  });

  function close() {
    setOpen(false);
    reset();
    changePassword.reset();
  }

  const meta = [
    {
      label: "Account created",
      value: formatDate(user.createdAt, { timeZone: user.timezone }),
    },
    {
      label: "Last updated",
      value: formatDate(user.updatedAt, { timeZone: user.timezone }),
    },
  ];

  return (
    <Shared.Panel>
      <Shared.PanelTitle>Sign-in</Shared.PanelTitle>

      <S.List>
        <S.Item>
          <S.ItemLabel>Email address</S.ItemLabel>
          <S.ItemValue>{user.email}</S.ItemValue>
        </S.Item>

        <S.Item>
          <S.ItemHead>
            <S.ItemLabel>Password</S.ItemLabel>
            <S.Toggle
              type="button"
              onClick={open ? close : () => setOpen(true)}
            >
              {open ? "Cancel" : "Change"}
            </S.Toggle>
          </S.ItemHead>

          {open && (
            <S.PasswordForm
              onSubmit={handleSubmit((values) => changePassword.mutate(values))}
              noValidate
            >
              <Field
                label="Current password"
                type="password"
                placeholder="Your current password"
                autoComplete="current-password"
                error={errors.currentPassword?.message}
                {...register("currentPassword")}
              />
              <Field
                label="New password"
                type="password"
                placeholder="At least 10 characters"
                autoComplete="new-password"
                error={errors.newPassword?.message}
                {...register("newPassword")}
              />
              <Field
                label="Confirm new password"
                type="password"
                placeholder="Type it again"
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />

              {/* Said before the fact, not after: this signs the person
                  out of this tab as well, and being told that once
                  they're already on the login screen is too late. */}
              <S.Note>
                Changing your password signs you out everywhere, including here.
                You&rsquo;ll sign back in with the new one.
              </S.Note>

              <S.Actions>
                {/* Stays busy through the wait, not just the request:
                    the session is over the moment the request
                    succeeds, so a re-enabled button would only offer a
                    second submit that cannot work. */}
                <Button
                  type="submit"
                  loading={changePassword.isPending || changePassword.isSuccess}
                  loadingText={
                    changePassword.isSuccess ? "Signing you out…" : "Updating…"
                  }
                >
                  Update password
                </Button>
              </S.Actions>
            </S.PasswordForm>
          )}
        </S.Item>

        <S.Item>
          <S.ItemLabel>Last sign-in</S.ItemLabel>
          <S.ItemValue>
            {formatDateTime(user.lastLoginAt, { timeZone: user.timezone }) ??
              "This is your first sign-in."}
          </S.ItemValue>
        </S.Item>
      </S.List>

      <S.Meta>
        <Shared.Divider />
        {meta.map((row) => (
          <Shared.MetaRow key={row.label}>
            <Shared.MetaLabel>{row.label}</Shared.MetaLabel>
            <Shared.MetaValue>{row.value}</Shared.MetaValue>
          </Shared.MetaRow>
        ))}
      </S.Meta>
    </Shared.Panel>
  );
}
