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

const COLUMNS = [
  {
    key: "course",
    label: "Course",
    render: (row) => (
      <>
        {row.courses?.code}{" "}
        <span style={{ opacity: 0.6 }}>&middot; sec {row.section}</span>
      </>
    ),
  },
  { key: "term", label: "Term", render: (row) => row.terms?.name || "—" },
  {
    key: "instructor",
    label: "Instructor",
    render: (row) => row.users?.full_name || "—",
  },
  {
    key: "delivery_mode",
    label: "Delivery",
    render: (row) => <Badge>{row.delivery_mode.replace("_", " ")}</Badge>,
  },
  {
    key: "enrollment",
    label: "Enrolled",
    render: (row) => `${row.enrolled_count} / ${row.capacity}`,
  },
  { key: "meetings", label: "Meets", render: formatMeetingTimes },
];

export default function CourseOfferingsView() {
  return (
    <div>
      <PageIntro
        eyebrow="Course Offerings"
        heading="Course offerings"
        sub="Every section running or scheduled, with its instructor, enrollment, and meeting pattern."
      />
      {/* <DataTable
        columns={COLUMNS}
        rows={offerings}
        getRowKey={(row) => row.id}
        emptyMessage="No course offerings on file yet."
      /> */}
    </div>
  );
}
