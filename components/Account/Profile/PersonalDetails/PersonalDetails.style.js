import styled from "styled-components";
import { rt } from "@/lib/style/theme";

const FormEl = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => rt(theme).space[4]};
  margin-top: ${({ theme }) => rt(theme).space[6]};
`;

// $cols is how many the row wants when there's room; below 700px every
// row is one column, because a three-up name row at phone width leaves
// each field too narrow to read its own value.
const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ $cols = 2 }) => $cols}, minmax(0, 1fr));
  gap: ${({ theme }) => rt(theme).space[4]};

  @media (max-width: 700px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

// Boxed rather than merged into the fields above it: these three read
// exactly like the editable rows otherwise, and someone would try to
// type in them.
const Managed = styled.div`
  border: 1px solid ${({ theme }) => rt(theme).color.ink150};
  border-radius: ${({ theme }) => rt(theme).radius.md};
  padding: ${({ theme }) => rt(theme).space[4]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => rt(theme).space[3]};
`;

const ManagedTitle = styled.div`
  font-size: 12.5px;
  font-weight: 700;
  color: ${({ theme }) => rt(theme).color.ink700};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => rt(theme).space[2]};
  flex-wrap: wrap;
`;

export default {
  FormEl,
  Row,
  Managed,
  ManagedTitle,
  Actions,
};
