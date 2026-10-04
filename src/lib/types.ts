// ─── Role Types ────────────────────────────────────────────────
export type Role =
  | "admin"
  | "principal"
  | "teacher"
  | "student"
  | "watchman"
  | "staff";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
  avatar?: string;
}

// ─── Attendance ─────────────────────────────────────────────────
export type AttendanceStatus = "present" | "absent" | "late";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  subjectId: string;
  subjectName: string;
  date: string;
  status: AttendanceStatus;
  markedBy: string;
}

// ─── Recheck Request ────────────────────────────────────────────
export type RecheckStatus =
  | "Pending"
  | "Forwarded"
  | "Approved"
  | "Rejected";

export interface RecheckRequest {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  date: string;
  reason: string;
  proofUrl?: string;
  status: RecheckStatus;
  submittedAt: string;
  teacherComment?: string;
  hodComment?: string;
}

// ─── Escalation ─────────────────────────────────────────────────
export type EscalationStatus = "Pending" | "In Progress" | "Resolved";
export type EscalationCategory =
  | "Disciplinary"
  | "Resource"
  | "Electrical"
  | "Plumbing"
  | "Equipment"
  | "Network"
  | "Cleanliness"
  | "Other";

export interface Escalation {
  id: string;
  raisedBy: string;
  raisedByRole: Role;
  category: EscalationCategory;
  description: string;
  status: EscalationStatus;
  resolvedBy?: string;
  createdAt: string;
  updatedAt: string;
  attachmentUrl?: string;
  resolutionNotes?: string;
}

// ─── Notice ─────────────────────────────────────────────────────
export interface Notice {
  id: string;
  title: string;
  body: string;
  targetRoles: Role[];
  postedBy: string;
  postedByRole: Role;
  createdAt: string;
  isUrgent: boolean;
  readBy?: string[];
}

// ─── Register Entries ────────────────────────────────────────────
export type RegisterType = "gate" | "lostfound" | "key" | "visitor";

export interface GateEntry {
  id: string;
  type: "gate";
  entryType: "Person" | "Vehicle" | "Visitor";
  name: string;
  vehicleNumber?: string;
  inTime: string;
  outTime?: string;
  loggedBy: string;
  isUrgent: boolean;
  timestamp: string;
}

export interface LostFoundEntry {
  id: string;
  type: "lostfound";
  itemName: string;
  description: string;
  foundDate: string;
  isClaimed: boolean;
  claimedBy?: string;
  loggedBy: string;
  timestamp: string;
}

export interface KeyEntry {
  id: string;
  type: "key";
  keyId: string;
  roomName: string;
  issuedTo: string;
  timeOut: string;
  timeIn?: string;
  loggedBy: string;
  timestamp: string;
}

export interface VisitorEntry {
  id: string;
  type: "visitor";
  visitorName: string;
  purpose: string;
  whomToMeet: string;
  inTime: string;
  outTime?: string;
  loggedBy: string;
  isUrgent: boolean;
  timestamp: string;
}

export type RegisterEntry =
  | GateEntry
  | LostFoundEntry
  | KeyEntry
  | VisitorEntry;

// ─── Lab Issue Report (Non-Teaching Staff) ──────────────────────
export type IssueStatus = "Pending" | "In Progress" | "Resolved";

export interface LabIssue {
  id: string;
  reportedBy: string;
  lab: string;
  category: EscalationCategory;
  description: string;
  photoUrl?: string;
  status: IssueStatus;
  createdAt: string;
  updatedAt: string;
  resolutionNotes?: string;
}

// ─── Dashboard Stats ─────────────────────────────────────────────
export interface StatCard {
  label: string;
  value: string | number;
  icon: string;
  trend?: { value: number; positive: boolean };
  color: "blue" | "green" | "amber" | "red" | "purple" | "slate";
}
