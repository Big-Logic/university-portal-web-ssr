"use client";

import PageIntro from "@/components/dashboard/PageIntro";
import DataTable from "@/components/dashboard/DataTable";

const COLUMNS = [
  { key: "code", label: "Code" },
  { key: "name", label: "Program" },
  {
    key: "department",
    label: "Department",
    render: (row) => row.department || "—",
  },
];

export default function ProgramsView() {
  return (
    <div>
      <PageIntro
        eyebrow="Programs"
        heading="Academic programs"
        sub="The full catalog of programs students can be admitted into."
      />
      {/* <DataTable
        columns={COLUMNS}
        rows={programs}
        getRowKey={(row) => row.id}
        emptyMessage="No programs on file yet."
      /> */}
    </div>
  );
}
