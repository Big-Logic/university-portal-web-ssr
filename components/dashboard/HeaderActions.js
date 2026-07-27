"use client";

import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { CalendarDays, FolderClosed, Bell, FileText } from "lucide-react";
import { rt } from "@/lib/theme";
import { Badge } from "@/components/ui/primitives";
import { TERM_CALENDAR, DOCUMENTS, NOTIFICATIONS } from "@/lib/sample-data";

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
  background: ${({ theme, $open }) => ($open ? rt(theme).color.ink100 : rt(theme).color.white)};
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

  /* Keeps the panel on screen when the trigger sits near the right
     edge on small viewports, where a fixed 280px panel anchored to
     the right would otherwise overflow the page. */
  @media (max-width: 420px) {
    width: calc(100vw - 32px);
    right: auto;
    left: 50%;
    transform: translateX(-50%);
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
  background: ${({ theme, $unread }) => ($unread ? rt(theme).color.blue50 : "transparent")};
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

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => rt(theme).color.ink100};
  margin: ${({ theme }) => rt(theme).space[3]} 0 ${({ theme }) => rt(theme).space[3]};
`;

const SampleNote = styled.p`
  margin: ${({ theme }) => rt(theme).space[3]} 0 0;
  font-size: 11.5px;
  color: ${({ theme }) => rt(theme).color.ink500};
`;

/**
 * The three header affordances from the dashboard design: term
 * calendar, documents, and notifications.
 *
 * All three render sample content (see lib/sample-data.js) -- no
 * endpoint backs any of them yet -- so each panel carries a visible
 * "Sample" badge rather than passing fabricated dates and grades off
 * as the signed-in user's own.
 */
export default function HeaderActions() {
  const [open, setOpen] = useState(null);
  const [readAll, setReadAll] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    function onPointerDown(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(null);
    }
    function onKeyDown(e) {
      if (e.key === "Escape") setOpen(null);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const toggle = (id) => setOpen((current) => (current === id ? null : id));
  const hasUnread = !readAll && NOTIFICATIONS.some((n) => n.unread);

  return (
    <Wrap ref={wrapRef}>
      <Anchor>
        <IconButton
          type="button"
          $open={open === "calendar"}
          onClick={() => toggle("calendar")}
          aria-label="Term calendar"
          aria-expanded={open === "calendar"}
          title="Term calendar"
        >
          <CalendarDays size={16} aria-hidden="true" />
        </IconButton>

        {open === "calendar" && (
          <Popover role="dialog" aria-label="Term calendar">
            <PopoverHead>
              <PopoverTitle>Term calendar</PopoverTitle>
              <Badge $tone="neutral">Sample</Badge>
            </PopoverHead>
            <PopoverSub>{TERM_CALENDAR.termLabel}</PopoverSub>
            <List>
              {TERM_CALENDAR.events.map((event) => (
                <CalendarRow key={event.date + event.label}>
                  <CalendarDate>{event.date}</CalendarDate>
                  <CalendarLabel>{event.label}</CalendarLabel>
                </CalendarRow>
              ))}
            </List>
            <Divider />
            <SampleNote>No calendar endpoint exists yet.</SampleNote>
          </Popover>
        )}
      </Anchor>

      <Anchor>
        <IconButton
          type="button"
          $open={open === "files"}
          onClick={() => toggle("files")}
          aria-label="Your documents"
          aria-expanded={open === "files"}
          title="Your documents"
        >
          <FolderClosed size={16} aria-hidden="true" />
        </IconButton>

        {open === "files" && (
          <Popover role="dialog" aria-label="Your documents">
            <PopoverHead>
              <PopoverTitle>Your documents</PopoverTitle>
              <Badge $tone="neutral">Sample</Badge>
            </PopoverHead>
            <PopoverSub>{DOCUMENTS.length} files ready to download.</PopoverSub>
            <List $tight>
              {DOCUMENTS.map((doc) => (
                <DocRow key={doc.id} type="button">
                  <FileText size={16} aria-hidden="true" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <DocName>{doc.name}</DocName>
                    <DocMeta>{doc.meta}</DocMeta>
                  </div>
                </DocRow>
              ))}
            </List>
            <SampleNote>No documents endpoint exists yet.</SampleNote>
          </Popover>
        )}
      </Anchor>

      <Anchor>
        <IconButton
          type="button"
          $open={open === "alerts"}
          onClick={() => toggle("alerts")}
          aria-label={hasUnread ? "Notifications, unread" : "Notifications"}
          aria-expanded={open === "alerts"}
          title="Notifications"
        >
          <Bell size={16} aria-hidden="true" />
          {hasUnread && <UnreadDot />}
        </IconButton>

        {open === "alerts" && (
          <Popover $wide role="dialog" aria-label="Notifications">
            <PopoverHead>
              <PopoverTitle>Notifications</PopoverTitle>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Badge $tone="neutral">Sample</Badge>
                <Linkish type="button" onClick={() => setReadAll(true)}>
                  Mark all read
                </Linkish>
              </div>
            </PopoverHead>
            <PopoverSub />
            <List>
              {NOTIFICATIONS.map((note) => (
                <NotificationRow key={note.id} $unread={!readAll && note.unread}>
                  <div>
                    <NotificationText>{note.text}</NotificationText>
                    <NotificationMeta>{note.meta}</NotificationMeta>
                  </div>
                </NotificationRow>
              ))}
            </List>
            <SampleNote>No notifications endpoint exists yet.</SampleNote>
          </Popover>
        )}
      </Anchor>
    </Wrap>
  );
}
