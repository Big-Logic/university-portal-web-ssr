"use client";

import styled from "styled-components";
import { rt } from "@/lib/theme";
import { forwardRef, useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

const Label = styled.label`
  font-size: 12.5px;
  font-weight: 600;
  color: ${({ theme }) => rt(theme).color.ink900};
`;

const SideLink = styled.a`
  font-size: 12.5px;
  font-weight: 500;
`;

const InputWrap = styled.div`
  position: relative;
`;

const StyledInput = styled.input`
  width: 100%;
  border-radius: ${({ theme }) => rt(theme).radius.md};
  padding: 10px 14px;
  padding-right: ${({ $hasToggle }) => ($hasToggle ? "40px" : "14px")};
  font-family: ${({ theme }) => rt(theme).font.sans};
  font-size: 14px;
  background: ${({ theme }) => rt(theme).color.ink50};
  border: 1.5px solid ${({ theme, $error }) => ($error ? rt(theme).color.red600 : rt(theme).color.ink150)};
  color: ${({ theme }) => rt(theme).color.ink900};
  transition: border-color 0.15s ease, background 0.15s ease;

  &::placeholder { color: ${({ theme }) => rt(theme).color.ink300}; }

  &:focus {
    outline: none;
    background: ${({ theme }) => rt(theme).color.white};
    border-color: ${({ theme, $error }) => ($error ? rt(theme).color.red600 : rt(theme).color.blue600)};
  }
`;

const ToggleBtn = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  color: ${({ theme }) => rt(theme).color.ink500};
  padding: 2px;
`;

const ErrorText = styled.p`
  margin: 0;
  font-size: 12.5px;
  color: ${({ theme }) => rt(theme).color.red600};
`;

/**
 * forwardRef so react-hook-form's register() can attach its ref
 * directly -- required for RHF to read the input's value.
 */
const Field = forwardRef(function Field(
  { label, sideLink, sideLinkHref, type = "text", error, ...rest },
  ref
) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword && showPassword ? "text" : type;

  return (
    <Wrap>
      <LabelRow>
        <Label htmlFor={id}>{label}</Label>
        {sideLink && <SideLink href={sideLinkHref || "#"}>{sideLink}</SideLink>}
      </LabelRow>
      <InputWrap>
        <StyledInput
          id={id}
          ref={ref}
          type={resolvedType}
          $error={!!error}
          $hasToggle={isPassword}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...rest}
        />
        {isPassword && (
          <ToggleBtn
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </ToggleBtn>
        )}
      </InputWrap>
      {error && <ErrorText id={`${id}-error`} role="alert">{error}</ErrorText>}
    </Wrap>
  );
});

export default Field;
