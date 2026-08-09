"use client";

import { Check } from "lucide-react";
import { PASSWORD_RULES } from "@/lib/validation";
import S from "./PasswordStrength.style";

// Ported from the design file. `met` counts satisfied rules; the length
// bonus is what separates "everything ticked" from "everything ticked
// and long enough to be worth something", so a 10-character password
// that passes all three still reads Fair rather than Strong.
//
// One label changed from the design, which called this bottom rung "Too
// short": a ten-character all-lowercase password lands here, and
// telling someone it's too short sends them to fix the one rule they
// already passed. "Very weak" is true whichever rule is missing, and
// the checklist underneath names the actual one.
const STRENGTH_LADDER = [
  { label: "Very weak", tone: "danger", width: "25%" },
  { label: "Weak", tone: "danger", width: "40%" },
  { label: "Fair", tone: "warning", width: "65%" },
  { label: "Strong", tone: "success", width: "100%" },
];
const LONG_ENOUGH = 14;

function strengthOf(password) {
  if (!password) return null;
  const met = PASSWORD_RULES.filter((rule) => rule.test(password)).length;
  const index = Math.max(0, met - (password.length >= LONG_ENOUGH ? 0 : 1));
  return STRENGTH_LADDER[Math.min(index, STRENGTH_LADDER.length - 1)];
}

/**
 * The meter and requirement checklist under the new-password field.
 * Reads PASSWORD_RULES straight from lib/validation rather than taking
 * them as a prop -- the same list the schema enforces, so a rule can't
 * be shown without being checked or checked without being shown.
 *
 * Stateless: it derives everything from the password it's handed, so
 * the form stays the only thing holding form state.
 */
export default function PasswordStrength({ password }) {
  const strength = strengthOf(password);

  return (
    <S.Block>
      <S.Row>
        <S.MeterTrack>
          <S.MeterFill
            $tone={strength?.tone}
            $width={strength ? strength.width : "0%"}
          />
        </S.MeterTrack>
        <S.MeterLabel $tone={strength?.tone}>
          {strength ? strength.label : "Strength"}
        </S.MeterLabel>
      </S.Row>

      {/* Not announced per keystroke -- that would talk over someone
          typing. The field's own error message is what carries this
          list's state to a screen reader on submit. */}
      <S.RuleList>
        {PASSWORD_RULES.map((rule) => {
          const met = rule.test(password);
          return (
            <S.Rule key={rule.id}>
              <S.RuleDot $met={met} aria-hidden="true">
                {met && <Check size={10} strokeWidth={3.5} />}
              </S.RuleDot>
              <S.RuleText $met={met}>{rule.label}</S.RuleText>
            </S.Rule>
          );
        })}
      </S.RuleList>
    </S.Block>
  );
}
