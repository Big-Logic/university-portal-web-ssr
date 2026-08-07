"use client";

import styled, { css, keyframes } from "styled-components";
import { rt } from "@/lib/theme";
import { motion } from "framer-motion";

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const base = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: ${({ theme }) => rt(theme).font.sans};
  font-weight: 600;
  font-size: 14px;
  border-radius: ${({ theme }) => rt(theme).radius.pill};
  padding: 11px 22px;
  border: 1.5px solid transparent;
  cursor: pointer;
  transition: opacity 0.15s ease, transform 0.1s ease;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;

const variants = {
  primary: css`
    background: ${({ theme }) => rt(theme).color.blue600};
    color: ${({ theme }) => rt(theme).color.white};
    &:hover:not(:disabled) { background: ${({ theme }) => rt(theme).color.blue700}; }
  `,
  secondary: css`
    background: ${({ theme }) => rt(theme).color.white};
    color: ${({ theme }) => rt(theme).color.ink900};
    border-color: ${({ theme }) => rt(theme).color.ink150};
    &:hover:not(:disabled) { border-color: ${({ theme }) => rt(theme).color.ink300}; }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => rt(theme).color.blue700};
    padding-left: 4px;
    padding-right: 4px;
    &:hover:not(:disabled) { text-decoration: underline; }
  `,
};

const StyledButton = styled(motion.button)`
  ${base}
  ${({ $variant }) => variants[$variant] || variants.primary}
  width: ${({ $block }) => ($block ? "100%" : "auto")};
`;

const Spinner = styled.span`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid currentColor;
  border-top-color: transparent;
  animation: ${spin} 0.6s linear infinite;
  flex: none;
`;

export default function Button({
  variant = "primary",
  block = false,
  loading = false,
  loadingText,
  disabled = false,
  children,
  ...rest
}) {
  return (
    <StyledButton
      $variant={variant}
      $block={block}
      // Pulled out of `rest` deliberately: left in, the spread below
      // would land after this and a caller passing `disabled={false}`
      // would re-enable a button that's mid-request.
      disabled={loading || disabled}
      whileTap={{ scale: 0.98 }}
      {...rest}
    >
      {loading && <Spinner aria-hidden="true" />}
      {loading ? loadingText || "Working\u2026" : children}
    </StyledButton>
  );
}
