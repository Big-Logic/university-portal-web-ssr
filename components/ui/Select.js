"use client";

import styled from "styled-components";
import { forwardRef, useId } from "react";
import { ChevronDown } from "lucide-react";
import { rt } from "@/lib/style/theme";

// Deliberately the same shell as Field: label above, 1.5px border,
// ink50 that turns white on focus. A select that styled itself would
// read as a different kind of control sitting in the same form row.

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 12.5px;
  font-weight: 600;
  color: ${({ theme }) => rt(theme).color.ink900};
`;

const SelectWrap = styled.div`
  position: relative;
  display: flex;
`;

const StyledSelect = styled.select`
  width: 100%;
  border-radius: ${({ theme }) => rt(theme).radius.md};
  padding: 10px 36px 10px 14px;
  font-family: ${({ theme }) => rt(theme).font.sans};
  font-size: 14px;
  background: ${({ theme }) => rt(theme).color.ink50};
  border: 1.5px solid
    ${({ theme, $error }) => ($error ? rt(theme).color.red600 : rt(theme).color.ink150)};
  color: ${({ theme }) => rt(theme).color.ink900};
  transition: border-color 0.15s ease, background 0.15s ease;

  /* The native arrow is replaced by the icon below -- appearance:none
     alone leaves Safari drawing its own on top. */
  appearance: none;

  &:focus {
    outline: none;
    background: ${({ theme }) => rt(theme).color.white};
    border-color: ${({ theme, $error }) =>
      $error ? rt(theme).color.red600 : rt(theme).color.blue600};
  }
`;

// pointer-events: none so the icon is scenery -- clicking where it sits
// still opens the select underneath.
const Chevron = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  pointer-events: none;
  color: ${({ theme }) => rt(theme).color.ink500};
`;

const ErrorText = styled.p`
  margin: 0;
  font-size: 12.5px;
  color: ${({ theme }) => rt(theme).color.red600};
`;

/** forwardRef for the same reason as Field: react-hook-form's register(). */
const Select = forwardRef(function Select({ label, error, children, ...rest }, ref) {
  const id = useId();

  return (
    <Wrap>
      <Label htmlFor={id}>{label}</Label>
      <SelectWrap>
        <StyledSelect
          id={id}
          ref={ref}
          $error={!!error}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...rest}
        >
          {children}
        </StyledSelect>
        <Chevron>
          <ChevronDown size={16} aria-hidden="true" />
        </Chevron>
      </SelectWrap>
      {error && (
        <ErrorText id={`${id}-error`} role="alert">
          {error}
        </ErrorText>
      )}
    </Wrap>
  );
});

export default Select;
