/**
 * ============================================================
 * PLACEHOLDER CONTENT — NOT REAL STUDENT DATA
 * ============================================================
 *
 * Everything in this file is sample content carried over from the
 * dashboard design. None of it comes from the API, because none of it
 * has an endpoint yet:
 *
 *   - checklist / calendar / documents / notifications
 *       → no endpoints exist at all
 *   - GPA, credits, course progress
 *       → Grading & Transcripts (Epic 4) isn't built
 *   - course list
 *       → Enrollment endpoints exist on the API but this page doesn't
 *         call them yet (see the note in StudentHomeView.js)
 *
 * It lives in ONE file on purpose: when an endpoint lands, delete the
 * matching export here and fetch it in the Server Component instead.
 * Every consumer of this data renders it behind a visible "Sample"
 * badge, so nothing here is ever presented to a student as their own
 * real record.
 */

export const NOTICES = [
  "Assessment fees change for the September term.",
  "Registration opens July 22 and closes August 5.",
  "Transcript requests now process in two business days.",
];

export const CHECKLIST = [
  { id: "journal", label: "Submit Unit 5 learning journal", meta: "Due July 23" },
  { id: "peer", label: "Complete 2 remaining peer assessments", meta: "Closes July 26" },
  { id: "register", label: "Register for the September term", meta: "Opens July 22" },
  { id: "profile", label: "Confirm your mailing address", meta: "No deadline" },
];

// Pre-checked on first render, matching the design's initial state.
export const CHECKLIST_INITIAL_DONE = { profile: true };

export const TERM_CALENDAR = {
  termLabel: "June 2026 term",
  events: [
    { date: "Jul 23", label: "Unit 5 journal due" },
    { date: "Jul 26", label: "Peer assessments close" },
    { date: "Aug 5", label: "Registration closes" },
    { date: "Aug 20", label: "Final exams begin" },
  ],
};

export const DOCUMENTS = [
  { id: "enrollment", name: "Enrollment letter", meta: "June 12, 2026 · PDF" },
  { id: "transcript", name: "Unofficial transcript", meta: "June 30, 2026 · PDF" },
  { id: "fees", name: "Fee statement — June", meta: "July 1, 2026 · PDF" },
];

export const NOTIFICATIONS = [
  { id: "graded", text: "Your Unit 4 journal was graded: 92.", meta: "2 hours ago", unread: true },
  { id: "fees", text: "Assessment fees change for the September term.", meta: "Yesterday", unread: true },
  { id: "registration", text: "Registration opens July 22.", meta: "July 18", unread: false },
];

export const TERM_PROGRESS = {
  weeksElapsed: 5,
  weeksTotal: 9,
  gpa: "3.00",
  gpaCaption: "Standing SAP",
  creditsEarned: 9,
  creditsRequired: 120,
  creditsCaption: "June 2026",
};

export const COURSES = [
  { id: "cs3302", code: "CS 3302", title: "Database Systems", meta: "Section A · MWF 10:00", progress: 0.55, status: "In progress" },
  { id: "cs4407", code: "CS 4407", title: "Algorithms", meta: "Section B · TTh 13:00", progress: 0.4, status: "In progress" },
  { id: "engl1102", code: "ENGL 1102", title: "Composition II", meta: "Section A · Online", progress: 1, status: "Completed" },
];

export const REGISTRATION_WINDOW = {
  heading: "Registration",
  body: "Registration for the September term opens July 22 and closes August 5.",
  cta: "View available sections",
};
