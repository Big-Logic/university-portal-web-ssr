"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, FolderClosed, Bell, FileText } from "lucide-react";
import { Badge } from "@/components/ui/primitives";
import { TERM_CALENDAR, DOCUMENTS, NOTIFICATIONS } from "@/lib/sample-data";
import S from "./HeaderActions.style";

// One wrapper for all three so the sheet handle and dialog semantics
// stay identical across them.
function Panel({ wide, label, children }) {
  return (
    <S.Popover $wide={wide} role="dialog" aria-label={label}>
      <S.SheetHandle aria-hidden="true" />
      {children}
    </S.Popover>
  );
}

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
    <S.Wrap ref={wrapRef}>
      {/* Only paints below BREAKPOINT (see SheetScrim). It sits inside
          wrapRef, so the outside-mousedown listener above deliberately
          ignores it -- dismissal is this explicit onClick instead. */}
      {open && <S.SheetScrim onClick={() => setOpen(null)} aria-hidden="true" />}

      <S.Anchor>
        <S.IconButton
          type="button"
          $open={open === "calendar"}
          onClick={() => toggle("calendar")}
          aria-label="Term calendar"
          aria-expanded={open === "calendar"}
          title="Term calendar"
        >
          <CalendarDays size={16} aria-hidden="true" />
        </S.IconButton>

        {open === "calendar" && (
          <Panel label="Term calendar">
            <S.PopoverHead>
              <S.PopoverTitle>Term calendar</S.PopoverTitle>
              <Badge $tone="neutral">Sample</Badge>
            </S.PopoverHead>
            <S.PopoverSub>{TERM_CALENDAR.termLabel}</S.PopoverSub>
            <S.List>
              {TERM_CALENDAR.events.map((event) => (
                <S.CalendarRow key={event.date + event.label}>
                  <S.CalendarDate>{event.date}</S.CalendarDate>
                  <S.CalendarLabel>{event.label}</S.CalendarLabel>
                </S.CalendarRow>
              ))}
            </S.List>
            <S.Divider />
            <S.SampleNote>No calendar endpoint exists yet.</S.SampleNote>
          </Panel>
        )}
      </S.Anchor>

      <S.Anchor>
        <S.IconButton
          type="button"
          $open={open === "files"}
          onClick={() => toggle("files")}
          aria-label="Your documents"
          aria-expanded={open === "files"}
          title="Your documents"
        >
          <FolderClosed size={16} aria-hidden="true" />
        </S.IconButton>

        {open === "files" && (
          <Panel label="Your documents">
            <S.PopoverHead>
              <S.PopoverTitle>Your documents</S.PopoverTitle>
              <Badge $tone="neutral">Sample</Badge>
            </S.PopoverHead>
            <S.PopoverSub>
              {DOCUMENTS.length} files ready to download.
            </S.PopoverSub>
            <S.List $tight>
              {DOCUMENTS.map((doc) => (
                <S.DocRow key={doc.id} type="button">
                  <FileText size={16} aria-hidden="true" />
                  <S.DocBody>
                    <S.DocName>{doc.name}</S.DocName>
                    <S.DocMeta>{doc.meta}</S.DocMeta>
                  </S.DocBody>
                </S.DocRow>
              ))}
            </S.List>
            <S.SampleNote>No documents endpoint exists yet.</S.SampleNote>
          </Panel>
        )}
      </S.Anchor>

      <S.Anchor>
        <S.IconButton
          type="button"
          $open={open === "alerts"}
          onClick={() => toggle("alerts")}
          aria-label={hasUnread ? "Notifications, unread" : "Notifications"}
          aria-expanded={open === "alerts"}
          title="Notifications"
        >
          <Bell size={16} aria-hidden="true" />
          {hasUnread && <S.UnreadDot />}
        </S.IconButton>

        {open === "alerts" && (
          <Panel wide label="Notifications">
            <S.PopoverHead>
              <S.PopoverTitle>Notifications</S.PopoverTitle>
              <S.HeadActions>
                <Badge $tone="neutral">Sample</Badge>
                <S.Linkish type="button" onClick={() => setReadAll(true)}>
                  Mark all read
                </S.Linkish>
              </S.HeadActions>
            </S.PopoverHead>
            <S.PopoverSub />
            <S.List>
              {NOTIFICATIONS.map((note) => (
                <S.NotificationRow
                  key={note.id}
                  $unread={!readAll && note.unread}
                >
                  <div>
                    <S.NotificationText>{note.text}</S.NotificationText>
                    <S.NotificationMeta>{note.meta}</S.NotificationMeta>
                  </div>
                </S.NotificationRow>
              ))}
            </S.List>
            <S.SampleNote>No notifications endpoint exists yet.</S.SampleNote>
          </Panel>
        )}
      </S.Anchor>
    </S.Wrap>
  );
}
