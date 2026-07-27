"use client";

import styled from "styled-components";
import { rt } from "@/lib/theme";
import { Card } from "@/components/ui/primitives";

const TableWrap = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
`;

const Th = styled.th`
  text-align: left;
  padding: 10px 12px;
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => rt(theme).color.ink500};
  border-bottom: 1px solid ${({ theme }) => rt(theme).color.ink150};
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid ${({ theme }) => rt(theme).color.ink100};
  color: ${({ theme }) => rt(theme).color.ink900};
  vertical-align: top;
`;

const EmptyRow = styled.p`
  padding: ${({ theme }) => rt(theme).space[6]} 0;
  text-align: center;
  color: ${({ theme }) => rt(theme).color.ink500};
  font-size: 13.5px;
`;

/**
 * Shared read-only table shell for the catalog-style list pages
 * (Programs, Courses, Course Offerings, My Teaching) -- same card +
 * table structure, only the columns and data differ per page.
 */
export default function DataTable({ columns, rows, emptyMessage = "Nothing to show yet.", getRowKey }) {
  if (!rows.length) {
    return (
      <Card>
        <EmptyRow>{emptyMessage}</EmptyRow>
      </Card>
    );
  }

  return (
    <Card $pad="0">
      <TableWrap>
        <Table>
          <thead>
            <tr>
              {columns.map((col) => (
                <Th key={col.key}>{col.label}</Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={getRowKey ? getRowKey(row) : i}>
                {columns.map((col) => (
                  <Td key={col.key}>{col.render ? col.render(row) : row[col.key]}</Td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
    </Card>
  );
}
