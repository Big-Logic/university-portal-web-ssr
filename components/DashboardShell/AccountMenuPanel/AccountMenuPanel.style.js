import Link from "next/link";
import styled from "styled-components";
import { rt } from "@/lib/theme";

// Unpositioned base panel -- each caller (header kebab, mobile sidebar
// kebab) extends this with its own `position`/anchor offsets, since
// one opens downward from the header and the other upward from the
// sidebar footer.
export const AccountMenuPanel = styled.div`
  background: ${({ theme }) => rt(theme).color.white};
  border: 1px solid ${({ theme }) => rt(theme).color.ink150};
  border-radius: ${({ theme }) => rt(theme).radius.lg};
  padding: ${({ theme }) => rt(theme).space[1]};
  box-shadow: ${({ theme }) => rt(theme).shadow.md};
  z-index: 60;
`;

const Header = styled.div`
  padding: 10px 12px 12px;
`;

const Name = styled.div`
  font-size: 13.5px;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Email = styled.div`
  font-size: 12.5px;
  color: ${({ theme }) => rt(theme).color.ink500};
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => rt(theme).color.ink100};
  margin: 0 4px 6px;
`;

const ItemLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: ${({ theme }) => rt(theme).radius.md};
  font-size: 13.5px;
  font-weight: 600;
  color: ${({ theme }) => rt(theme).color.ink700};
  text-decoration: none;

  &:hover {
    text-decoration: none;
    background: ${({ theme }) => rt(theme).color.ink50};
    color: ${({ theme }) => rt(theme).color.ink900};
  }
`;

const ItemBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border: none;
  border-radius: ${({ theme }) => rt(theme).radius.md};
  font-size: 13.5px;
  font-weight: 600;
  color: ${({ theme }) => rt(theme).color.ink700};
  background: transparent;
  cursor: pointer;
  text-align: left;

  &:hover:not(:disabled) {
    background: ${({ theme }) => rt(theme).color.ink50};
    color: ${({ theme }) => rt(theme).color.ink900};
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export default {
  Header,
  Name,
  Email,
  Divider,
  ItemLink,
  ItemBtn,
};
