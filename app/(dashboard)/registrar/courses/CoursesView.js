"use client";

import PageIntro from "@/components/dashboard/PageIntro";
import DataTable from "@/components/dashboard/DataTable";

const COLUMNS = [
  { key: "code", label: "Code" },
  { key: "title", label: "Title" },
  { key: "program", label: "Program", render: (row) => row.programs?.name || "—" },
  { key: "credit_hours", label: "Credits" },
];

export default function CoursesView({ courses }) {
  return (
    <div>
      <PageIntro eyebrow="Courses" heading="Course catalog" sub="Every course on file, across all programs." />
      <DataTable columns={COLUMNS} rows={courses} getRowKey={(row) => row.id} emptyMessage="No courses on file yet." />
    </div>
  );
}
