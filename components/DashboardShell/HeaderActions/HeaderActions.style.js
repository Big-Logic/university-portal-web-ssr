import styled, { keyframes } from "styled-components";
import { rt } from "@/lib/theme";
import { BREAKPOINT } from "../constants";

const Wrap = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => rt(theme).space[2]};
`;

const Anchor = styled.div`
  position: relative;
`;

const IconButton = styled.button`
  position: relative;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => rt(theme).color.ink150};
  border-radius: ${({ theme }) => rt(theme).radius.pill};
  background: ${({ theme, $open }) =>
    $open ? rt(theme).color.ink100 : rt(theme).color.white};
  color: ${({ theme }) => rt(theme).color.ink700};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => rt(theme).color.ink100};
  }
`;

const UnreadDot = styled.span`
  position: absolute;
  top: 3px;
  right: 3px;
  width: 8px;
  height: 8px;
  border-radius: ${({ theme }) => rt(theme).radius.pill};
  background: ${({ theme }) => rt(theme).color.red600};
  border: 1.5px solid ${({ theme }) => rt(theme).color.white};
`;

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
`;

// Same BREAKPOINT the sidebar turns into a drawer at. Above it these
// are popovers anchored to their trigger; below it a popover anchored
// to the right edge of a narrow viewport either overflows the page or
// has to be re-centered with transforms, so it becomes a bottom sheet
// instead -- full width, thumb-reachable, and out of the way of the
// nav drawer which owns the left edge.
const Popover = styled.div`
  position: absolute;
  top: 42px;
  right: 0;
  z-index: 40;
  width: ${({ $wide }) => ($wide ? "300px" : "280px")};
  background: ${({ theme }) => rt(theme).color.white};
  border: 1px solid ${({ theme }) => rt(theme).color.ink150};
  border-radius: ${({ theme }) => rt(theme).radius.lg};
  padding: ${({ theme }) => rt(theme).space[4]};
  box-shadow: ${({ theme }) => rt(theme).shadow.md};

  @media (max-width: ${BREAKPOINT}) {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: auto;
    z-index: 56;
    max-height: 75vh;
    overflow-y: auto;
    border: none;
    border-top: 1px solid ${({ theme }) => rt(theme).color.ink150};
    border-radius: ${({ theme }) => rt(theme).radius.lg}
      ${({ theme }) => rt(theme).radius.lg} 0 0;
    /* Keeps the last row clear of the home indicator on iOS. */
    padding-bottom: calc(
      ${({ theme }) => rt(theme).space[4]} + env(safe-area-inset-bottom)
    );
    animation: ${slideUp} 180ms ease-out;
  }
`;

// Sits above the sidebar drawer's own scrim (z-index 45) and panel
// (50), since the header stays tappable while that drawer is open.
const SheetScrim = styled.div`
  display: none;

  @media (max-width: ${BREAKPOINT}) {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 55;
    background: rgba(26, 32, 41, 0.4);
  }
`;

// Purely an affordance -- the sheet isn't draggable. It signals
// "dismissible surface" on a panel that has no visible close button,
// where on desktop the popover's anchoring made that obvious.
const SheetHandle = styled.div`
  display: none;

  @media (max-width: ${BREAKPOINT}) {
    display: block;
    width: 36px;
    height: 4px;
    margin: 0 auto ${({ theme }) => rt(theme).space[3]};
    border-radius: ${({ theme }) => rt(theme).radius.pill};
    background: ${({ theme }) => rt(theme).color.ink150};
  }
`;

const PopoverHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => rt(theme).space[2]};
  margin-bottom: 2px;
`;

const PopoverTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
`;

const PopoverSub = styled.div`
  font-size: 12.5px;
  color: ${({ theme }) => rt(theme).color.ink500};
  margin-bottom: ${({ theme }) => rt(theme).space[3]};
`;

const Linkish = styled.button`
  border: none;
  background: none;
  padding: 0;
  font-size: 12.5px;
  font-weight: 700;
  font-family: inherit;
  color: ${({ theme }) => rt(theme).color.blue700};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ $tight }) => ($tight ? "2px" : "10px")};
`;

const CalendarRow = styled.div`
  display: flex;
  gap: ${({ theme }) => rt(theme).space[3]};
`;

const CalendarDate = styled.div`
  font-family: ${({ theme }) => rt(theme).font.mono};
  font-size: 12.5px;
  color: ${({ theme }) => rt(theme).color.ink500};
  width: 52px;
  flex: none;
`;

const CalendarLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
`;

const DocRow = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: calc(100% + 12px);
  margin: 0 -6px;
  padding: 9px 10px;
  border: none;
  border-radius: ${({ theme }) => rt(theme).radius.md};
  background: transparent;
  color: inherit;
  font-family: inherit;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => rt(theme).color.ink50};
  }
`;

const DocBody = styled.div`
  flex: 1;
  min-width: 0;
`;

const DocName = styled.div`
  font-size: 13px;
  font-weight: 600;
`;

const DocMeta = styled.div`
  font-size: 11.5px;
  color: ${({ theme }) => rt(theme).color.ink500};
`;

const NotificationRow = styled.div`
  display: flex;
  gap: 10px;
  padding: 10px 12px;
  border-radius: ${({ theme }) => rt(theme).radius.md};
  background: ${({ theme, $unread }) =>
    $unread ? rt(theme).color.blue50 : "transparent"};
`;

const NotificationText = styled.div`
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
`;

const NotificationMeta = styled.div`
  font-size: 11.5px;
  color: ${({ theme }) => rt(theme).color.ink500};
  margin-top: 2px;
`;

const HeadActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => rt(theme).color.ink100};
  margin: ${({ theme }) => rt(theme).space[3]} 0;
`;

const SampleNote = styled.p`
  margin: ${({ theme }) => rt(theme).space[3]} 0 0;
  font-size: 11.5px;
  color: ${({ theme }) => rt(theme).color.ink500};
`;

export default {
  Wrap,
  Anchor,
  IconButton,
  UnreadDot,
  Popover,
  SheetScrim,
  SheetHandle,
  PopoverHead,
  PopoverTitle,
  PopoverSub,
  Linkish,
  List,
  CalendarRow,
  CalendarDate,
  CalendarLabel,
  DocRow,
  DocBody,
  DocName,
  DocMeta,
  NotificationRow,
  NotificationText,
  NotificationMeta,
  HeadActions,
  Divider,
  SampleNote,
};
