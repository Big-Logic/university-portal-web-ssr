import styled, { css } from "styled-components";
import { rt } from "@/lib/theme";
import { Card } from "@/components/ui/primitives";

// Column visibility. The design drops the least load-bearing columns
// first as width runs out rather than letting the table scroll early:
// the secondary column (Term/Access) goes at 1000px, the ID at 700px.
// Below that the table scrolls inside its own container.
const HIDE_SECONDARY = "1000px";
const HIDE_ID = "700px";

const hideAt = (bp) => css`
  @media (max-width: ${bp}) {
    display: none;
  }
`;

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => rt(theme).space[6]};
`;

const HeadRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => rt(theme).space[4]};
  flex-wrap: wrap;
`;

const HeadActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => rt(theme).space[2]};
  flex-wrap: wrap;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => rt(theme).space[3]};
`;

// Tabs -------------------------------------------------------------

const Tabs = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px;
  border: 1px solid ${({ theme }) => rt(theme).color.ink150};
  border-radius: ${({ theme }) => rt(theme).radius.pill};
  background: ${({ theme }) => rt(theme).color.white};
  align-self: flex-start;
  max-width: 100%;
  overflow-x: auto;
`;

const Tab = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  padding: 9px 18px;
  border: none;
  border-radius: ${({ theme }) => rt(theme).radius.pill};
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  background: ${({ theme, $active }) =>
    $active ? rt(theme).color.blue600 : "transparent"};
  color: ${({ theme, $active }) =>
    $active ? rt(theme).color.white : rt(theme).color.ink700};

  &:hover {
    background: ${({ theme, $active }) =>
      $active ? rt(theme).color.blue600 : rt(theme).color.ink100};
  }
`;

const TabCount = styled.span`
  font-family: ${({ theme }) => rt(theme).font.mono};
  font-size: 12px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: ${({ theme }) => rt(theme).radius.pill};
  background: ${({ theme, $active }) =>
    $active ? "rgba(255, 255, 255, 0.22)" : rt(theme).color.ink100};
  color: ${({ theme, $active }) =>
    $active ? rt(theme).color.white : rt(theme).color.ink500};
`;

// Card + toolbar ---------------------------------------------------

const Panel = styled(Card)`
  padding: 0;
  overflow: hidden;
  box-shadow: ${({ theme }) => rt(theme).shadow.sm};
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => rt(theme).space[3]};
  flex-wrap: wrap;
  padding: 14px 16px;
  border-bottom: 1px solid ${({ theme }) => rt(theme).color.ink100};
`;

const Search = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1 1 240px;
  min-width: 0;
  height: 38px;
  padding: 0 14px;
  border: 1px solid ${({ theme }) => rt(theme).color.ink150};
  border-radius: ${({ theme }) => rt(theme).radius.md};
  background: ${({ theme }) => rt(theme).color.ink50};
  color: ${({ theme }) => rt(theme).color.ink500};
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: 14px;
  color: ${({ theme }) => rt(theme).color.ink900};
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => rt(theme).space[2]};
  flex-wrap: wrap;
`;

const Filter = styled.button`
  padding: 7px 14px;
  border-radius: ${({ theme }) => rt(theme).radius.pill};
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? rt(theme).color.blue600 : rt(theme).color.ink150};
  background: ${({ theme, $active }) =>
    $active ? rt(theme).color.blue100 : rt(theme).color.white};
  color: ${({ theme, $active }) =>
    $active ? rt(theme).color.blue700 : rt(theme).color.ink700};
`;

const ResultCount = styled.div`
  margin-left: auto;
  font-size: 12.5px;
  color: ${({ theme }) => rt(theme).color.ink500};
  white-space: nowrap;
`;

// Bulk-selection bar -----------------------------------------------

const BulkBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => rt(theme).space[3]};
  flex-wrap: wrap;
  width: 100%;
`;

const BulkLabel = styled.div`
  font-size: 13.5px;
  font-weight: 700;
`;

const BulkAction = styled.button`
  padding: 7px 14px;
  border-radius: ${({ theme }) => rt(theme).radius.pill};
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  background: ${({ theme }) => rt(theme).color.white};
  border: 1px solid
    ${({ theme, $danger }) =>
      $danger ? "#F0D2D2" : rt(theme).color.ink150};
  color: ${({ theme, $danger }) =>
    $danger ? rt(theme).color.red600 : rt(theme).color.ink700};

  &:hover {
    background: ${({ theme, $danger }) =>
      $danger ? rt(theme).color.red100 : rt(theme).color.ink100};
    color: ${({ theme, $danger }) =>
      $danger ? rt(theme).color.red600 : rt(theme).color.ink900};
  }
`;

const LinkAction = styled.button`
  margin-left: auto;
  border: none;
  background: none;
  padding: 0;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => rt(theme).color.blue700};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

// Table ------------------------------------------------------------

const TableScroll = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  min-width: 560px;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 12px;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => rt(theme).color.ink500};
  background: ${({ theme }) => rt(theme).color.ink50};
  border-bottom: 1px solid ${({ theme }) => rt(theme).color.ink150};
  white-space: nowrap;
  ${({ $hide }) => $hide && hideAt($hide)}
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid ${({ theme }) => rt(theme).color.ink100};
  color: ${({ theme }) => rt(theme).color.ink900};
  vertical-align: middle;
  ${({ $hide }) => $hide && hideAt($hide)}
`;

const Row = styled.tr`
  &:hover {
    background: ${({ theme }) => rt(theme).color.ink50};
  }
`;

const CheckCell = styled(Td)`
  width: 44px;
  padding-right: 0;
`;

const Check = styled.button`
  width: 18px;
  height: 18px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: ${({ theme }) => rt(theme).radius.sm};
  cursor: pointer;
  border: ${({ theme, $on }) =>
    $on
      ? `1px solid ${rt(theme).color.blue600}`
      : `1.5px solid ${rt(theme).color.ink300}`};
  background: ${({ theme, $on }) =>
    $on ? rt(theme).color.blue600 : rt(theme).color.white};
`;

const Person = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

const Avatar = styled.div`
  width: 34px;
  height: 34px;
  flex: none;
  border-radius: ${({ theme }) => rt(theme).radius.pill};
  background: ${({ theme }) => rt(theme).color.blue100};
  color: ${({ theme }) => rt(theme).color.blue700};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12.5px;
  font-weight: 800;
`;

const PersonText = styled.div`
  min-width: 0;
`;

const Name = styled.div`
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Email = styled.div`
  font-size: 12.5px;
  color: ${({ theme }) => rt(theme).color.ink500};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Mono = styled.div`
  font-family: ${({ theme }) => rt(theme).font.mono};
  font-size: 13px;
  color: ${({ theme }) => rt(theme).color.ink700};
  white-space: nowrap;
`;

const Primary = styled.div`
  font-size: 13.5px;
  font-weight: 600;
`;

const PrimaryMeta = styled.div`
  font-size: 12px;
  color: ${({ theme }) => rt(theme).color.ink500};
  margin-top: 2px;
`;

const Secondary = styled.div`
  font-size: 13px;
  color: ${({ theme }) => rt(theme).color.ink700};
  white-space: nowrap;
`;

const MenuCell = styled(Td)`
  width: 44px;
  text-align: right;
`;

const Kebab = styled.button`
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${({ theme }) => rt(theme).radius.pill};
  background: ${({ theme, $open }) =>
    $open ? rt(theme).color.ink100 : "transparent"};
  color: ${({ theme }) => rt(theme).color.ink700};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => rt(theme).color.ink100};
  }
`;

// position: fixed, not absolute -- the table sits inside an
// overflow-x: auto container, which would clip an absolutely
// positioned menu. Coordinates come from the trigger's bounding rect
// (see UsersView), and the menu closes on scroll/resize since those
// invalidate the measurement.
const Menu = styled.div`
  position: fixed;
  z-index: 70;
  width: 210px;
  background: ${({ theme }) => rt(theme).color.white};
  border: 1px solid ${({ theme }) => rt(theme).color.ink150};
  border-radius: ${({ theme }) => rt(theme).radius.lg};
  padding: ${({ theme }) => rt(theme).space[2]};
  box-shadow: ${({ theme }) => rt(theme).shadow.md};
`;

const MenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border: none;
  border-radius: ${({ theme }) => rt(theme).radius.md};
  background: transparent;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  color: ${({ theme, $danger }) =>
    $danger ? rt(theme).color.red600 : rt(theme).color.ink700};

  &:hover {
    background: ${({ theme, $danger }) =>
      $danger ? rt(theme).color.red100 : rt(theme).color.ink50};
    color: ${({ theme, $danger }) =>
      $danger ? rt(theme).color.red600 : rt(theme).color.ink900};
  }
`;

const MenuDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => rt(theme).color.ink100};
  margin: 6px 4px;
`;

// Empty + pagination -----------------------------------------------

const Empty = styled.div`
  padding: ${({ theme }) => rt(theme).space[12]} ${({ theme }) => rt(theme).space[6]};
  text-align: center;
`;

const EmptyTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const EmptyBody = styled.div`
  font-size: 13.5px;
  color: ${({ theme }) => rt(theme).color.ink500};
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => rt(theme).space[3]};
  flex-wrap: wrap;
  padding: 14px 16px;
  border-top: 1px solid ${({ theme }) => rt(theme).color.ink100};
`;

const Range = styled.div`
  font-size: 12.5px;
  color: ${({ theme }) => rt(theme).color.ink500};
`;

const Pager = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const PageBtn = styled.button`
  min-width: 32px;
  height: 32px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => rt(theme).radius.pill};
  font-family: ${({ theme }) => rt(theme).font.mono};
  font-size: 13px;
  cursor: pointer;
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? rt(theme).color.blue600 : rt(theme).color.ink150};
  background: ${({ theme, $active }) =>
    $active ? rt(theme).color.blue600 : "transparent"};
  color: ${({ theme, $active }) =>
    $active ? rt(theme).color.white : rt(theme).color.ink700};

  &:disabled {
    cursor: default;
    color: ${({ theme }) => rt(theme).color.ink300};
  }
`;

export { HIDE_SECONDARY, HIDE_ID };

export default {
  Page,
  HeadRow,
  HeadActions,
  TitleRow,
  Tabs,
  Tab,
  TabCount,
  Panel,
  Toolbar,
  Search,
  SearchInput,
  FilterRow,
  Filter,
  ResultCount,
  BulkBar,
  BulkLabel,
  BulkAction,
  LinkAction,
  TableScroll,
  Table,
  Th,
  Td,
  Row,
  CheckCell,
  Check,
  Person,
  Avatar,
  PersonText,
  Name,
  Email,
  Mono,
  Primary,
  PrimaryMeta,
  Secondary,
  MenuCell,
  Kebab,
  Menu,
  MenuItem,
  MenuDivider,
  Empty,
  EmptyTitle,
  EmptyBody,
  Pagination,
  Range,
  Pager,
  PageBtn,
};
