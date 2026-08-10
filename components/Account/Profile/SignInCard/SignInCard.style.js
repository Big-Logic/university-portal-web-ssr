import styled from "styled-components";
import { rt } from "@/lib/style/theme";

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => rt(theme).space[2]};
  margin-top: ${({ theme }) => rt(theme).space[4]};
`;

const Item = styled.div`
  border: 1px solid ${({ theme }) => rt(theme).color.ink150};
  border-radius: ${({ theme }) => rt(theme).radius.md};
  padding: ${({ theme }) => rt(theme).space[3]} ${({ theme }) => rt(theme).space[4]};
`;

const ItemHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => rt(theme).space[3]};
`;

const ItemLabel = styled.div`
  font-size: 13.5px;
  font-weight: 700;
`;

// An email address has no spaces to break at, so it needs somewhere to
// wrap or it widens the whole right-hand column.
const ItemValue = styled.div`
  font-size: 12.5px;
  color: ${({ theme }) => rt(theme).color.ink500};
  margin-top: ${({ theme }) => rt(theme).space[1]};
  overflow-wrap: anywhere;
`;

// A button, not a link: it opens a form in place rather than
// navigating, and anything that reads it as a destination (middle
// click, a screen reader's link list) would be wrong about what it
// does. Same call as /forgot-password's "Use a different email".
const Toggle = styled.button`
  background: none;
  border: none;
  padding: 0;
  flex: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => rt(theme).color.blue700};

  &:hover {
    text-decoration: underline;
  }
`;

const PasswordForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => rt(theme).space[3]};
  margin-top: ${({ theme }) => rt(theme).space[4]};
  padding-top: ${({ theme }) => rt(theme).space[4]};
  border-top: 1px solid ${({ theme }) => rt(theme).color.ink100};
`;

const Note = styled.p`
  font-size: 12.5px;
  color: ${({ theme }) => rt(theme).color.ink500};
  margin: 0;
  text-wrap: pretty;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => rt(theme).space[2]};
`;

const Meta = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => rt(theme).space[2]};
  margin-top: ${({ theme }) => rt(theme).space[4]};
`;

export default {
  List,
  Item,
  ItemHead,
  ItemLabel,
  ItemValue,
  Toggle,
  PasswordForm,
  Note,
  Actions,
  Meta,
};
