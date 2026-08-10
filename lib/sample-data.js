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
 *   - signed-in devices (/account/profile)
 *       → the API issues refresh tokens but exposes no way to list or
 *         revoke them, so there is nothing to read
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

// Admin directory (/admin/users). Fabricated people, fabricated IDs.
// The real source is GET /api/v1/users, which exists but isn't wired
// up here yet -- when it is, delete both arrays and fetch in
// app/(dashboard)/admin/users/page.js, then drop the "Sample" badge
// from UsersView.
export const DIRECTORY_STUDENTS = [
  { id: "s1", name: "Alfred Ngwayah", email: "alfred.n@university.edu", code: "4471-2280", primary: "BSc Computer Science", primaryMeta: "Year 2 · 9 credits", secondary: "June 2026", status: "Active" },
  { id: "s2", name: "Priya Raman", email: "priya.r@university.edu", code: "4471-2281", primary: "BSc Health Science", primaryMeta: "Year 3 · 42 credits", secondary: "June 2026", status: "Active" },
  { id: "s3", name: "Daniel Osei", email: "daniel.o@university.edu", code: "4471-2282", primary: "BA Business Administration", primaryMeta: "Year 1 · 6 credits", secondary: "June 2026", status: "Inactive" },
  { id: "s4", name: "Sofia Marchetti", email: "sofia.m@university.edu", code: "4471-2283", primary: "BSc Computer Science", primaryMeta: "Year 4 · 108 credits", secondary: "June 2026", status: "Graduated" },
  { id: "s5", name: "Tomás Herrera", email: "tomas.h@university.edu", code: "4471-2284", primary: "BA Education", primaryMeta: "Year 2 · 30 credits", secondary: "March 2026", status: "Inactive" },
  { id: "s6", name: "Amina Yusuf", email: "amina.y@university.edu", code: "4471-2285", primary: "BSc Data Analytics", primaryMeta: "Year 3 · 66 credits", secondary: "June 2026", status: "Active" },
  { id: "s7", name: "Lukas Berg", email: "lukas.b@university.edu", code: "4471-2286", primary: "BA Business Administration", primaryMeta: "Year 2 · 27 credits", secondary: "June 2026", status: "Active" },
  { id: "s8", name: "Chidera Okafor", email: "chidera.o@university.edu", code: "4471-2287", primary: "BSc Health Science", primaryMeta: "Year 1 · 3 credits", secondary: "June 2026", status: "Inactive" },
  { id: "s9", name: "Hana Suzuki", email: "hana.s@university.edu", code: "4471-2288", primary: "BSc Data Analytics", primaryMeta: "Year 4 · 114 credits", secondary: "June 2026", status: "Graduated" },
  { id: "s10", name: "Miguel Santos", email: "miguel.s@university.edu", code: "4471-2289", primary: "BA Education", primaryMeta: "Year 3 · 60 credits", secondary: "December 2025", status: "Withdrawn" },
  { id: "s11", name: "Ruth Adeyemi", email: "ruth.a@university.edu", code: "4471-2290", primary: "BSc Computer Science", primaryMeta: "Year 1 · 9 credits", secondary: "June 2026", status: "Active" },
  { id: "s12", name: "Erik Lindqvist", email: "erik.l@university.edu", code: "4471-2291", primary: "BA Business Administration", primaryMeta: "Year 4 · 102 credits", secondary: "June 2026", status: "Inactive" },
];

export const DIRECTORY_ADMINS = [
  { id: "a1", name: "Marta Solano", email: "marta.s@university.edu", code: "STF-0031", primary: "Registrar", primaryMeta: "Records office", secondary: "Full access", status: "Active" },
  { id: "a2", name: "Peter Aluko", email: "peter.a@university.edu", code: "STF-0044", primary: "Admissions officer", primaryMeta: "Admissions", secondary: "Standard", status: "Active" },
  { id: "a3", name: "Nadia Farouk", email: "nadia.f@university.edu", code: "STF-0052", primary: "Bursar", primaryMeta: "Finance", secondary: "Billing only", status: "Active" },
  { id: "a4", name: "Greg Whitmore", email: "greg.w@university.edu", code: "STF-0067", primary: "Academic advisor", primaryMeta: "Student services", secondary: "Standard", status: "Active" },
  { id: "a5", name: "Ivy Chen", email: "ivy.c@university.edu", code: "STF-0071", primary: "IT administrator", primaryMeta: "Technology", secondary: "Full access", status: "Active" },
  { id: "a6", name: "Samuel Boateng", email: "samuel.b@university.edu", code: "STF-0080", primary: "Faculty lead", primaryMeta: "Computer Science", secondary: "Read only", status: "Inactive" },
  { id: "a7", name: "Renata Alves", email: "renata.a@university.edu", code: "STF-0085", primary: "Records clerk", primaryMeta: "Records office", secondary: "Standard", status: "Inactive" },
  { id: "a8", name: "Oliver Grant", email: "oliver.g@university.edu", code: "STF-0092", primary: "Career services lead", primaryMeta: "Student services", secondary: "Standard", status: "Active" },
];

// Maps a directory status onto a Badge tone (components/ui/primitives).
export const DIRECTORY_STATUS_TONE = {
  Active: "success",
  Inactive: "neutral",
  Graduated: "accent",
  Withdrawn: "warning",
};
// The "Where you're signed in" card on /account/profile.
//
// No endpoint backs this, and it isn't a matter of one not being wired
// up yet: the API issues refresh tokens but exposes no way to read or
// revoke them individually (auth.routes.js is login/refresh/logout,
// and logout ends only the session that calls it). Listing devices
// needs the API to expose its sessions first.
//
// So this renders read-only, behind a "Sample" badge: no per-row sign
// out, because there is nothing to call and a button that quietly did
// nothing would be worse than no button. The one real way to end every
// other session today is a password change, which the card says.
export const ACCOUNT_SESSIONS = [
  { id: "mac", device: "Chrome on macOS", meta: "Portland, OR · This device", current: true },
  { id: "iphone", device: "Safari on iPhone", meta: "Portland, OR · 2 hours ago", current: false },
  { id: "windows", device: "Edge on Windows", meta: "Campus library · August 3", current: false },
];
