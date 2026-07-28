"use client";

import PageIntro from "@/components/dashboard/PageIntro";
import DataTable from "@/components/dashboard/DataTable";
import { Badge } from "@/components/ui/primitives";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatMeetingTimes(offering) {
  if (!offering.meeting_times?.length) return "—";
  return offering.meeting_times
    .map(
      (mt) =>
        `${DAY_NAMES[mt.day_of_week] ?? mt.day_of_week} ${mt.start_time}–${mt.end_time}`,
    )
    .join(", ");
}

function formatRoom(offering) {
  if (!offering.rooms) return "—";
  return `${offering.rooms.building} ${offering.rooms.room_number}`;
}

const COLUMNS = [
  {
    key: "course",
    label: "Course",
    render: (row) => (
      <>
        {row.courses?.code}{" "}
        <span style={{ opacity: 0.6 }}>&middot; sec {row.section}</span>
        <div style={{ fontSize: 12.5, opacity: 0.7 }}>{row.courses?.title}</div>
      </>
    ),
  },
  { key: "term", label: "Term", render: (row) => row.terms?.name || "—" },
  {
    key: "delivery_mode",
    label: "Delivery",
    render: (row) => <Badge>{row.delivery_mode.replace("_", " ")}</Badge>,
  },
  { key: "room", label: "Room", render: formatRoom },
  {
    key: "enrollment",
    label: "Enrolled",
    render: (row) => `${row.enrolled_count} / ${row.capacity}`,
  },
  { key: "meetings", label: "Meets", render: formatMeetingTimes },
];

export default function MyTeachingView() {
  return (
    <div>
      <PageIntro
        eyebrow="My Teaching"
        heading="Your course offerings"
        sub="Sections you're assigned to instruct, across all terms."
      />
      {/* <DataTable
        columns={COLUMNS}
        rows={offerings}
        getRowKey={(row) => row.id}
        emptyMessage="You aren't assigned to any course offerings yet."
      /> */}
    </div>
  );
}
