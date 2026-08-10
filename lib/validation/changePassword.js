import { z } from "zod";
import { PASSWORD_RULES } from "./resetPassword";

// Same rules as the reset-password form, deliberately: what we ask
// someone to choose shouldn't depend on which screen they're choosing
// it from. They're stricter than the API's own 8-character minimum
// (changePasswordSchema in users.validators.js) in the safe direction
// -- everything accepted here is accepted there.
//
// The rules are spelled out in the message rather than shown as a live
// checklist, unlike /reset-password: this form sits inside a settings
// card that is collapsed by default, and a permanent checklist would
// outweigh the three fields it belongs to.
const RULES_SUMMARY =
  "Use at least 10 characters, with an uppercase and a lowercase letter and a number or symbol.";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: z
      .string()
      .min(1, "Enter a new password.")
      .refine((value) => PASSWORD_RULES.every((rule) => rule.test(value)), RULES_SUMMARY),
    confirmPassword: z.string().min(1, "Re-enter your new password."),
  })
  .refine((values) => values.newPassword !== values.currentPassword, {
    message: "Choose a password you haven't used on this account.",
    path: ["newPassword"],
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Both passwords must match.",
    path: ["confirmPassword"],
  });
