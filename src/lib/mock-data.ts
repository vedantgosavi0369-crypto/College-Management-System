import {
  User,
  AttendanceRecord,
  RecheckRequest,
  Escalation,
  Notice,
  GateEntry,
  LostFoundEntry,
  KeyEntry,
  VisitorEntry,
  LabIssue,
} from "./types";

// ─── Mock Users ──────────────────────────────────────────────────
export const MOCK_USERS: User[] = [
  { id: "u1", name: "Admin Singh", email: "admin@cms.edu", role: "admin" },
  { id: "u2", name: "Dr. Priya Mehta", email: "hod@cms.edu", role: "principal", department: "Computer Science" },
  { id: "u3", name: "Prof. Arun Kumar", email: "teacher@cms.edu", role: "teacher", department: "Computer Science" },
  { id: "u4", name: "Riya Sharma", email: "student@cms.edu", role: "student", department: "Computer Science" },
  { id: "u5", name: "Ramesh Gupta", email: "watchman@cms.edu", role: "watchman" },
  { id: "u6", name: "Suresh Yadav", email: "staff@cms.edu", role: "staff", department: "Computer Lab" },
];

// Demo login credentials
export const DEMO_CREDENTIALS: Record<string, { password: string; userId: string }> = {
  "admin@cms.edu": { password: "admin123", userId: "u1" },
  "hod@cms.edu": { password: "hod123", userId: "u2" },
  "teacher@cms.edu": { password: "teacher123", userId: "u3" },
  "student@cms.edu": { password: "student123", userId: "u4" },
  "watchman@cms.edu": { password: "watchman123", userId: "u5" },
  "staff@cms.edu": { password: "staff123", userId: "u6" },
};

// ─── Mock Notices ────────────────────────────────────────────────
export const MOCK_NOTICES: Notice[] = [
  {
    id: "n1",
    title: "Annual Day Celebration – 30th September",
    body: "All students and staff are invited to the Annual Day Celebration on 30th September at the main auditorium. Attendance is mandatory for all departments.",
    targetRoles: ["student", "teacher", "staff", "watchman"],
    postedBy: "Dr. Priya Mehta",
    postedByRole: "principal",
    createdAt: "2026-09-20T09:00:00Z",
    isUrgent: true,
    readBy: [],
  },
  {
    id: "n2",
    title: "Mid-Semester Exam Schedule Released",
    body: "The mid-semester examination schedule has been released. Students can view the detailed timetable on the student portal. Examinations begin from October 5th.",
    targetRoles: ["student", "teacher"],
    postedBy: "Admin Singh",
    postedByRole: "admin",
    createdAt: "2026-09-19T11:30:00Z",
    isUrgent: false,
    readBy: [],
  },
  {
    id: "n3",
    title: "DBMS Unit 3 Test Postponed",
    body: "The DBMS Unit 3 test scheduled for tomorrow (Sept 22) has been postponed to September 25th due to unavoidable circumstances. Students are advised to use this time productively.",
    targetRoles: ["student"],
    postedBy: "Prof. Arun Kumar",
    postedByRole: "teacher",
    createdAt: "2026-09-21T08:00:00Z",
    isUrgent: false,
    readBy: [],
  },
  {
    id: "n4",
    title: "Library Closed for Maintenance – Sept 22",
    body: "The college library will remain closed for the entire day on September 22nd for annual maintenance and stock auditing. Digital resources remain accessible online.",
    targetRoles: ["student", "teacher", "staff", "admin", "principal"],
    postedBy: "Admin Singh",
    postedByRole: "admin",
    createdAt: "2026-09-20T15:00:00Z",
    isUrgent: false,
    readBy: [],
  },
];

// ─── Mock Attendance ─────────────────────────────────────────────
export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: "a1", studentId: "u4", studentName: "Riya Sharma", subjectId: "s1", subjectName: "Data Structures and Applications", date: "2026-09-21", status: "present", markedBy: "Prof. Arun Kumar" },
  { id: "a2", studentId: "u4", studentName: "Riya Sharma", subjectId: "s2", subjectName: "Computer Network Technology", date: "2026-09-21", status: "present", markedBy: "Prof. Arun Kumar" },
  { id: "a3", studentId: "u4", studentName: "Riya Sharma", subjectId: "s3", subjectName: "Programming Concepts and Practices", date: "2026-09-20", status: "present", markedBy: "Prof. Arun Kumar" },
  { id: "a4", studentId: "u4", studentName: "Riya Sharma", subjectId: "s4", subjectName: "Data Structures and Applications Laboratory", date: "2026-09-19", status: "present", markedBy: "Prof. Arun Kumar" },
  { id: "a5", studentId: "u4", studentName: "Riya Sharma", subjectId: "s5", subjectName: "Entrepreneurial Software Development and Management", date: "2026-09-18", status: "late", markedBy: "Prof. Arun Kumar" },
  { id: "a6", studentId: "u4", studentName: "Riya Sharma", subjectId: "s6", subjectName: "Universal Human Values", date: "2026-09-17", status: "present", markedBy: "Prof. Arun Kumar" },
  // Other students for teacher view
  { id: "a7", studentId: "s2", studentName: "Aarav Patel", subjectId: "s1", subjectName: "Data Structures and Applications", date: "2026-09-21", status: "present", markedBy: "Prof. Arun Kumar" },
  { id: "a8", studentId: "s3", studentName: "Sneha Rao", subjectId: "s1", subjectName: "Data Structures and Applications", date: "2026-09-21", status: "absent", markedBy: "Prof. Arun Kumar" },
  { id: "a9", studentId: "s4", studentName: "Kiran Das", subjectId: "s1", subjectName: "Data Structures and Applications", date: "2026-09-21", status: "present", markedBy: "Prof. Arun Kumar" },
  { id: "a10", studentId: "s5", studentName: "Meera Nair", subjectId: "s1", subjectName: "Data Structures and Applications", date: "2026-09-21", status: "late", markedBy: "Prof. Arun Kumar" },
];

// Subject-wise summary for student
export interface SubjectAttendance {
  subject: string;
  type: "TH" | "PR" | "TU";
  attended: number;
  total: number;
  percentage: number;
}

export const ATTENDANCE_SUMMARY: SubjectAttendance[] = [
  { subject: "Data Structures and Applications", type: "TH", attended: 28, total: 32, percentage: 87.5 },
  { subject: "Computer Network Technology", type: "TH", attended: 30, total: 32, percentage: 93.75 },
  { subject: "Programming Concepts and Practices", type: "TH", attended: 11, total: 12, percentage: 91.67 },
  { subject: "Data Structures and Applications Laboratory", type: "PR", attended: 17, total: 20, percentage: 85.0 },
  { subject: "Computer Network Technology Laboratory", type: "PR", attended: 6, total: 6, percentage: 100.0 },
  { subject: "Essential Skills Development Lab", type: "PR", attended: 9, total: 10, percentage: 90.0 },
  { subject: "Professional Development and Career Readiness", type: "PR", attended: 11, total: 11, percentage: 100.0 },
  { subject: "Entrepreneurial Software Development and Management", type: "TH", attended: 21, total: 24, percentage: 87.5 },
  { subject: "Universal Human Values", type: "TH", attended: 22, total: 23, percentage: 95.65 },
  { subject: "Community Engagement Project", type: "PR", attended: 12, total: 12, percentage: 100.0 },
  { subject: "Foreign Language Studies - German", type: "PR", attended: 11, total: 11, percentage: 100.0 },
  { subject: "Fundamentals of Financial Management", type: "TH", attended: 14, total: 14, percentage: 100.0 },
  { subject: "Fundamentals of Financial Management Tutorial", type: "TU", attended: 10, total: 10, percentage: 100.0 },
];

// ─── Mock Recheck Requests ───────────────────────────────────────
export const MOCK_RECHECK_REQUESTS: RecheckRequest[] = [
  {
    id: "r1",
    studentId: "u4",
    studentName: "Riya Sharma",
    subject: "Data Structures and Applications Laboratory",
    date: "2026-09-15",
    reason: "I was present in the practical session and completed lab assignment #4, but was recorded absent.",
    status: "Forwarded",
    submittedAt: "2026-09-16T10:00:00Z",
    teacherComment: "Verified lab submission record. Forwarding to HOD for final sign-off.",
  },
  {
    id: "r2",
    studentId: "u4",
    studentName: "Riya Sharma",
    subject: "Entrepreneurial Software Development and Management",
    date: "2026-09-10",
    reason: "Attended institutional hackathon on duty with prior permission.",
    status: "Approved",
    submittedAt: "2026-09-11T09:00:00Z",
    teacherComment: "OD letter verified.",
    hodComment: "Approved. Attendance updated.",
  },
  {
    id: "r3",
    studentId: "s2",
    studentName: "Aarav Patel",
    subject: "Data Structures and Applications",
    date: "2026-09-18",
    reason: "I was late due to college bus delay, guard slip issued.",
    status: "Pending",
    submittedAt: "2026-09-19T08:30:00Z",
  },
];

// ─── Mock Escalations ────────────────────────────────────────────
export const MOCK_ESCALATIONS: Escalation[] = [
  {
    id: "e1",
    raisedBy: "Prof. Arun Kumar",
    raisedByRole: "teacher",
    category: "Resource",
    description: "The projector in Room 203 has been broken for two weeks. Multiple requests to the admin office have gone unanswered. Urgently need this resolved before the upcoming guest lecture.",
    status: "In Progress",
    createdAt: "2026-09-18T10:00:00Z",
    updatedAt: "2026-09-20T14:00:00Z",
  },
  {
    id: "e2",
    raisedBy: "Prof. Arun Kumar",
    raisedByRole: "teacher",
    category: "Disciplinary",
    description: "A group of students has been consistently disruptive during lectures. Repeated warnings have not been effective. Requesting guidance on further action.",
    status: "Pending",
    createdAt: "2026-09-21T07:00:00Z",
    updatedAt: "2026-09-21T07:00:00Z",
  },
];

// ─── Mock Lab Issues ─────────────────────────────────────────────
export const MOCK_LAB_ISSUES: LabIssue[] = [
  {
    id: "l1",
    reportedBy: "Suresh Yadav",
    lab: "Computer Lab 1",
    category: "Equipment",
    description: "5 computers in the lab have non-functional keyboards. Students are unable to use them for practicals.",
    status: "In Progress",
    createdAt: "2026-09-19T09:00:00Z",
    updatedAt: "2026-09-20T11:00:00Z",
  },
  {
    id: "l2",
    reportedBy: "Suresh Yadav",
    lab: "Computer Lab 2",
    category: "Network",
    description: "Internet connection in Lab 2 has been intermittent for the past 3 days. This is affecting ongoing practicals.",
    status: "Pending",
    createdAt: "2026-09-21T08:00:00Z",
    updatedAt: "2026-09-21T08:00:00Z",
  },
  {
    id: "l3",
    reportedBy: "Suresh Yadav",
    lab: "Physics Lab",
    category: "Electrical",
    description: "Two overhead lights have blown out. The lab is poorly lit, creating safety concerns.",
    status: "Resolved",
    createdAt: "2026-09-10T10:00:00Z",
    updatedAt: "2026-09-12T16:00:00Z",
    resolutionNotes: "Lights replaced by the electrical team.",
  },
];

// ─── Mock Register Entries ───────────────────────────────────────
export const MOCK_GATE_ENTRIES: GateEntry[] = [
  { id: "g1", type: "gate", entryType: "Person", name: "Vendor – Canteen Supplies", inTime: "08:15", outTime: "09:00", loggedBy: "Ramesh Gupta", isUrgent: false, timestamp: "2026-09-21T08:15:00Z" },
  { id: "g2", type: "gate", entryType: "Vehicle", name: "College Bus", vehicleNumber: "MH-12-AB-1234", inTime: "08:30", loggedBy: "Ramesh Gupta", isUrgent: false, timestamp: "2026-09-21T08:30:00Z" },
  { id: "g3", type: "gate", entryType: "Person", name: "Suspicious person loitering near gate", inTime: "10:00", outTime: "10:05", loggedBy: "Ramesh Gupta", isUrgent: true, timestamp: "2026-09-21T10:00:00Z" },
];

export const MOCK_VISITOR_ENTRIES: VisitorEntry[] = [
  { id: "v1", type: "visitor", visitorName: "Rajesh Khanna", purpose: "Parent meeting", whomToMeet: "Prof. Arun Kumar", inTime: "11:00", loggedBy: "Ramesh Gupta", isUrgent: false, timestamp: "2026-09-21T11:00:00Z" },
  { id: "v2", type: "visitor", visitorName: "Inspector Sharma", purpose: "College inspection", whomToMeet: "Admin Singh", inTime: "09:30", outTime: "12:00", loggedBy: "Ramesh Gupta", isUrgent: false, timestamp: "2026-09-21T09:30:00Z" },
];

export const MOCK_LOSTFOUND_ENTRIES: LostFoundEntry[] = [
  { id: "lf1", type: "lostfound", itemName: "Black wallet", description: "Found near the canteen. Contains some cash and ID cards.", foundDate: "2026-09-20", isClaimed: false, loggedBy: "Ramesh Gupta", timestamp: "2026-09-20T13:00:00Z" },
  { id: "lf2", type: "lostfound", itemName: "Blue water bottle", description: "Found in Room 203 after the last lecture.", foundDate: "2026-09-19", isClaimed: true, claimedBy: "Aarav Patel", loggedBy: "Ramesh Gupta", timestamp: "2026-09-19T17:00:00Z" },
];

export const MOCK_KEY_ENTRIES: KeyEntry[] = [
  { id: "k1", type: "key", keyId: "LAB-CS-01", roomName: "Computer Lab 1", issuedTo: "Suresh Yadav", timeOut: "08:00", loggedBy: "Ramesh Gupta", timestamp: "2026-09-21T08:00:00Z" },
  { id: "k2", type: "key", keyId: "ROOM-203", roomName: "Classroom 203", issuedTo: "Prof. Arun Kumar", timeOut: "09:00", timeIn: "11:00", loggedBy: "Ramesh Gupta", timestamp: "2026-09-21T09:00:00Z" },
];
