"use client";

import { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Check, CalendarPlus } from "lucide-react";
import { rt } from "@/lib/theme";
import { Badge } from "@/components/ui/primitives";
import Button from "@/components/ui/Button";
import NoticeBanner from "@/components/dashboard/NoticeBanner";
import {
  CHECKLIST,
  CHECKLIST_INITIAL_DONE,
  TERM_PROGRESS,
  COURSES,
  REGISTRATION_WINDOW,
} from "@/lib/sample-data";

// Matches DashboardShell's own breakpoint on purpose, so the sidebar
// collapsing to a drawer and these grids collapsing to one column
// happen at the same width rather than fighting each other in a
// 40px band. (The source design used 1000px for both; the shell was
// already built at 960px, so 960px is the value that keeps them in sync.)
const BREAKPOINT = "960px";
const NARROW = "700px";

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => rt(theme).space[6]};

  @media (max-width: ${NARROW}) {
    gap: ${({ theme }) => rt(theme).space[4]};
  }
`;

/* ---------- tabs ---------- */

const Tabs = styled.div`
  display: flex;
  gap: ${({ theme }) => rt(theme).space[6]};
  border-bottom: 1px solid ${({ theme }) => rt(theme).color.ink150};
`;

const Tab = styled.button`
  display: inline-block;
  padding: 0 0 13px;
  border: none;
  border-bottom: 2px solid
    ${({ theme, $active }) => ($active ? rt(theme).color.blue600 : "transparent")};
  margin-bottom: -1px;
  background: none;
  font-family: inherit;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  color: ${({ theme, $active }) => ($active ? rt(theme).color.ink900 : rt(theme).color.ink500)};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => rt(theme).color.ink900};
  }
`;

/* ---------- title ---------- */

const Title = styled.h1`
  font-size: 34px;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  text-wrap: pretty;
  margin: 0;

  @media (max-width: ${NARROW}) {
    font-size: 24px;
    line-height: 1.2;
  }
`;

/* ---------- grids ---------- */

const GridWide = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
  gap: 20px;
  align-items: start;

  @media (max-width: ${BREAKPOINT}) {
    grid-template-columns: minmax(0, 1fr);
  }
  @media (max-width: ${NARROW}) {
    gap: 16px;
  }
`;

const GridNarrow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr);
  gap: 20px;
  align-items: start;

  @media (max-width: ${BREAKPOINT}) {
    grid-template-columns: minmax(0, 1fr);
  }
  @media (max-width: ${NARROW}) {
    gap: 16px;
  }
`;

/* ---------- cards ---------- */

const Panel = styled.section`
  background: ${({ theme }) => rt(theme).color.white};
  border: 1px solid ${({ theme }) => rt(theme).color.ink150};
  border-radius: ${({ theme }) => rt(theme).radius.lg};
  padding: ${({ theme }) => rt(theme).space[6]};

  @media (max-width: ${NARROW}) {
    padding: ${({ theme }) => rt(theme).space[4]};
  }
`;

const PanelHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => rt(theme).space[3]};
  margin-bottom: 2px;
`;

const PanelTitle = styled.h2`
  font-size: 17px;
  font-weight: 700;
  margin: 0;
`;

const PanelSub = styled.p`
  font-size: 13px;
  color: ${({ theme }) => rt(theme).color.ink500};
  margin: 0 0 ${({ theme }) => rt(theme).space[4]};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border: 1px solid ${({ theme }) => rt(theme).color.ink150};
  border-radius: ${({ theme }) => rt(theme).radius.md};

  & + & {
    margin-top: ${({ theme }) => rt(theme).space[2]};
  }

  @media (max-width: ${NARROW}) {
    align-items: flex-start;
    flex-wrap: wrap;
    row-gap: 10px;
    padding: 12px 14px;
  }
`;

/* ---------- term progress ---------- */

const MeterLabel = styled.div`
  font-size: 13px;
  color: ${({ theme }) => rt(theme).color.ink500};
  margin-bottom: 8px;
`;

const MeterTrack = styled.div`
  position: relative;
  height: 10px;
  flex: 1;
  border-radius: ${({ theme }) => rt(theme).radius.pill};
  background: ${({ theme }) => rt(theme).color.ink100};
  overflow: hidden;
`;

const MeterFill = styled(motion.div)`
  position: absolute;
  inset: 0 auto 0 0;
  border-radius: ${({ theme }) => rt(theme).radius.pill};
  background: ${({ theme }) => rt(theme).color.blue600};
`;

const MeterRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => rt(theme).space[3]};
`;

const MeterValue = styled.span`
  font-size: 13px;
  white-space: nowrap;
  flex: none;
  color: ${({ theme }) => rt(theme).color.ink700};
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => rt(theme).space[3]};
  margin-top: ${({ theme }) => rt(theme).space[4]};
`;

const Stat = styled.div`
  border: 1px solid ${({ theme }) => rt(theme).color.ink150};
  border-radius: ${({ theme }) => rt(theme).radius.md};
  padding: ${({ theme }) => rt(theme).space[4]};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;

  small {
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => rt(theme).color.ink500};
  }
`;

const StatLabel = styled.div`
  font-size: 12.5px;
  font-weight: 600;
  margin-top: 6px;
`;

const StatCaption = styled.div`
  font-size: 11.5px;
  color: ${({ theme }) => rt(theme).color.ink500};
`;

/* ---------- checklist ---------- */

const CheckRow = styled.button`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => rt(theme).space[3]};
  width: 100%;
  padding: 10px 0;
  border: none;
  border-top: 1px solid ${({ theme }) => rt(theme).color.ink100};
  background: none;
  font-family: inherit;
  text-align: left;
  cursor: pointer;

  &:first-of-type {
    border-top: none;
  }
`;

const CheckBox = styled.span`
  width: 18px;
  height: 18px;
  flex: none;
  margin-top: 1px;
  border-radius: ${({ theme }) => rt(theme).radius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => rt(theme).color.white};
  border: ${({ theme, $done }) =>
    $done ? `1px solid ${rt(theme).color.blue600}` : `1.5px solid ${rt(theme).color.ink300}`};
  background: ${({ theme, $done }) => ($done ? rt(theme).color.blue600 : rt(theme).color.white)};
`;

const CheckLabel = styled.div`
  font-size: 13.5px;
  font-weight: 600;
  color: ${({ theme, $done }) => ($done ? rt(theme).color.ink300 : rt(theme).color.ink900)};
  text-decoration: ${({ $done }) => ($done ? "line-through" : "none")};
`;

const CheckMeta = styled.div`
  font-size: 11.5px;
  color: ${({ theme }) => rt(theme).color.ink500};
  margin-top: 2px;
`;

const ChecklistSummary = styled.p`
  font-size: 12.5px;
  color: ${({ theme }) => rt(theme).color.ink500};
  margin: ${({ theme }) => rt(theme).space[3]} 0 0;
`;

/* ---------- courses ---------- */

const CourseCode = styled.div`
  font-family: ${({ theme }) => rt(theme).font.mono};
  font-size: 12.5px;
  color: ${({ theme }) => rt(theme).color.ink500};
`;

const CourseTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
`;

const CourseMeta = styled.div`
  font-size: 12px;
  color: ${({ theme }) => rt(theme).color.ink500};
  margin-top: 2px;
`;

const CourseMeter = styled.div`
  width: 110px;
  flex: none;

  @media (max-width: ${NARROW}) {
    width: 100%;
    order: 3;
  }
`;

/* ---------- empty tab state ---------- */

const EmptyPanel = styled(Panel)`
  text-align: center;
  color: ${({ theme }) => rt(theme).color.ink500};
  font-size: 14px;
`;

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "support", label: "Support" },
  { id: "media", label: "Media Center" },
];

export default function StudentHomeView({ user }) {
  const firstName = user.fullName?.split(" ")[0] || user.fullName;
  const [tab, setTab] = useState("overview");
  const [done, setDone] = useState(CHECKLIST_INITIAL_DONE);

  const doneCount = CHECKLIST.filter((item) => done[item.id]).length;
  const termPct = Math.round((TERM_PROGRESS.weeksElapsed / TERM_PROGRESS.weeksTotal) * 100);

  function toggleItem(id) {
    setDone((current) => ({ ...current, [id]: !current[id] }));
  }

  return (
    <Page>
      <NoticeBanner />

      <Tabs role="tablist">
        {TABS.map((t) => (
          <Tab
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            $active={tab === t.id}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </Tab>
        ))}
      </Tabs>

      <Title>Welcome back, {firstName}.</Title>

      {tab !== "overview" ? (
        <EmptyPanel>
          {/* Single template expression on purpose: writing this as
              `{label} hasn't been built yet.` across two lines makes JSX
              strip the newline+indent between them and render
              "Supporthasn't been built yet." */}
          {`${TABS.find((t) => t.id === tab).label} hasn\u2019t been built yet.`}
        </EmptyPanel>
      ) : (
        <>
          <GridWide>
            <Panel>
              <PanelHead>
                <PanelTitle>{REGISTRATION_WINDOW.heading}</PanelTitle>
                <Badge $tone="neutral">Sample</Badge>
              </PanelHead>
              <PanelSub>{REGISTRATION_WINDOW.body}</PanelSub>
              <Button variant="secondary">
                <CalendarPlus size={15} aria-hidden="true" />
                {REGISTRATION_WINDOW.cta}
              </Button>
            </Panel>

            <Panel>
              <PanelHead>
                <PanelTitle>Academic progress</PanelTitle>
                <Badge $tone="neutral">Sample</Badge>
              </PanelHead>
              <PanelSub>Grading &amp; transcripts aren&rsquo;t connected yet.</PanelSub>

              <MeterLabel>Term progress (weeks)</MeterLabel>
              <MeterRow>
                <MeterTrack>
                  <MeterFill
                    initial={{ width: 0 }}
                    animate={{ width: `${termPct}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </MeterTrack>
                <MeterValue>
                  {TERM_PROGRESS.weeksElapsed} / {TERM_PROGRESS.weeksTotal} weeks
                </MeterValue>
              </MeterRow>

              <StatGrid>
                <Stat>
                  <StatValue>{TERM_PROGRESS.gpa}</StatValue>
                  <StatLabel>Cumulative GPA</StatLabel>
                  <StatCaption>{TERM_PROGRESS.gpaCaption}</StatCaption>
                </Stat>
                <Stat>
                  <StatValue>
                    {TERM_PROGRESS.creditsEarned}
                    <small>/{TERM_PROGRESS.creditsRequired}</small>
                  </StatValue>
                  <StatLabel>Credits earned</StatLabel>
                  <StatCaption>{TERM_PROGRESS.creditsCaption}</StatCaption>
                </Stat>
              </StatGrid>
            </Panel>
          </GridWide>

          <GridNarrow>
            <Panel>
              <PanelHead>
                <PanelTitle>Checklist</PanelTitle>
                <Badge $tone="neutral">Sample</Badge>
              </PanelHead>
              <PanelSub>A to-do list for you.</PanelSub>

              {CHECKLIST.map((item) => {
                const isDone = !!done[item.id];
                return (
                  <CheckRow
                    key={item.id}
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    aria-pressed={isDone}
                  >
                    <CheckBox $done={isDone} aria-hidden="true">
                      {isDone && <Check size={12} strokeWidth={3} />}
                    </CheckBox>
                    <div>
                      <CheckLabel $done={isDone}>{item.label}</CheckLabel>
                      <CheckMeta>{item.meta}</CheckMeta>
                    </div>
                  </CheckRow>
                );
              })}

              <ChecklistSummary>
                {doneCount} of {CHECKLIST.length} done.
              </ChecklistSummary>
            </Panel>

            <Panel>
              <PanelHead>
                <PanelTitle>Your courses</PanelTitle>
                <Badge $tone="neutral">Sample</Badge>
              </PanelHead>
              <PanelSub>
                Enrollment endpoints exist on the API but aren&rsquo;t wired into this page yet.
              </PanelSub>

              {COURSES.map((course) => (
                <Row key={course.id}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <CourseCode>{course.code}</CourseCode>
                    <CourseTitle>{course.title}</CourseTitle>
                    <CourseMeta>{course.meta}</CourseMeta>
                  </div>
                  <CourseMeter>
                    <MeterTrack>
                      <MeterFill
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.round(course.progress * 100)}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </MeterTrack>
                  </CourseMeter>
                  <Badge $tone={course.progress >= 1 ? "success" : "accent"}>{course.status}</Badge>
                </Row>
              ))}
            </Panel>
          </GridNarrow>
        </>
      )}
    </Page>
  );
}
