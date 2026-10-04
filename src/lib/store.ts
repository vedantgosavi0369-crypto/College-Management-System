"use client";
import { useState, useEffect } from "react";
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
  Role,
} from "./types";
import {
  MOCK_USERS,
  MOCK_NOTICES,
  MOCK_ATTENDANCE,
  MOCK_RECHECK_REQUESTS,
  MOCK_ESCALATIONS,
  MOCK_LAB_ISSUES,
  MOCK_GATE_ENTRIES,
  MOCK_VISITOR_ENTRIES,
  MOCK_LOSTFOUND_ENTRIES,
  MOCK_KEY_ENTRIES,
} from "./mock-data";

export interface AuditLogEntry {
  id: string;
  actor: string;
  role: Role;
  action: string;
  category: "Attendance" | "Escalation" | "Recheck" | "Register" | "Notice" | "User";
  details: string;
  timestamp: string;
}

const INITIAL_AUDIT_LOG: AuditLogEntry[] = [
  {
    id: "log-1",
    actor: "Prof. Arun Kumar",
    role: "teacher",
    action: "Marked Attendance",
    category: "Attendance",
    details: "Marked attendance for CS-301 DBMS (48 Present, 12 Absent)",
    timestamp: "2026-09-21T09:15:00Z",
  },
  {
    id: "log-2",
    actor: "Dr. Priya Mehta",
    role: "principal",
    action: "Approved Recheck",
    category: "Recheck",
    details: "Approved dispute request #r2 for Riya Sharma (Machine Learning)",
    timestamp: "2026-09-21T08:45:00Z",
  },
  {
    id: "log-3",
    actor: "Ramesh Gupta",
    role: "watchman",
    action: "Gate Flag Urgent",
    category: "Register",
    details: "Flagged unauthorized vehicle near Gate 2 as urgent security alert",
    timestamp: "2026-09-21T08:30:00Z",
  },
  {
    id: "log-4",
    actor: "Suresh Yadav",
    role: "staff",
    action: "Reported Lab Issue",
    category: "Escalation",
    details: "Reported network outage in Computer Lab 2",
    timestamp: "2026-09-21T08:00:00Z",
  },
  {
    id: "log-5",
    actor: "Admin Singh",
    role: "admin",
    action: "User Account Modified",
    category: "User",
    details: "Updated department mapping for Prof. Arun Kumar",
    timestamp: "2026-09-20T16:20:00Z",
  },
];

// Generate 60 students for Class: B.Tech CSE - 5th Sem (Section A)
export interface ClassStudent {
  rollNo: string;
  name: string;
  email: string;
  currentAttendancePercent: number;
}

export const CLASS_ROSTER_60: ClassStudent[] = [
  { rollNo: "CSE001", name: "Aarav Patel", email: "aarav@cms.edu", currentAttendancePercent: 88.5 },
  { rollNo: "CSE002", name: "Aanya Gupta", email: "aanya@cms.edu", currentAttendancePercent: 92.0 },
  { rollNo: "CSE003", name: "Aditya Verma", email: "aditya.v@cms.edu", currentAttendancePercent: 68.0 },
  { rollNo: "CSE004", name: "Akash Nair", email: "akash@cms.edu", currentAttendancePercent: 79.4 },
  { rollNo: "CSE005", name: "Ananya Roy", email: "ananya@cms.edu", currentAttendancePercent: 84.1 },
  { rollNo: "CSE006", name: "Anika Sen", email: "anika@cms.edu", currentAttendancePercent: 62.5 },
  { rollNo: "CSE007", name: "Arjun Mehta", email: "arjun@cms.edu", currentAttendancePercent: 77.8 },
  { rollNo: "CSE008", name: "Arman Khan", email: "arman@cms.edu", currentAttendancePercent: 81.3 },
  { rollNo: "CSE009", name: "Bhavya Joshi", email: "bhavya@cms.edu", currentAttendancePercent: 71.4 },
  { rollNo: "CSE010", name: "Chirag Sethi", email: "chirag@cms.edu", currentAttendancePercent: 85.0 },
  { rollNo: "CSE011", name: "Deepak Choudhary", email: "deepak@cms.edu", currentAttendancePercent: 76.2 },
  { rollNo: "CSE012", name: "Diya Deshmukh", email: "diya@cms.edu", currentAttendancePercent: 94.7 },
  { rollNo: "CSE013", name: "Eshan Kapoor", email: "eshan@cms.edu", currentAttendancePercent: 64.0 },
  { rollNo: "CSE014", name: "Gaurav Bhatt", email: "gaurav@cms.edu", currentAttendancePercent: 83.3 },
  { rollNo: "CSE015", name: "Harsh Vardhan", email: "harsh@cms.edu", currentAttendancePercent: 80.0 },
  { rollNo: "CSE016", name: "Ishaan Reddy", email: "ishaan@cms.edu", currentAttendancePercent: 89.2 },
  { rollNo: "CSE017", name: "Ishita Saxena", email: "ishita@cms.edu", currentAttendancePercent: 70.0 },
  { rollNo: "CSE018", name: "Jatin Malhotra", email: "jatin@cms.edu", currentAttendancePercent: 86.4 },
  { rollNo: "CSE019", name: "Karan Iyer", email: "karan@cms.edu", currentAttendancePercent: 74.5 },
  { rollNo: "CSE020", name: "Kavya Menon", email: "kavya@cms.edu", currentAttendancePercent: 91.1 },
  { rollNo: "CSE021", name: "Kiran Das", email: "kiran@cms.edu", currentAttendancePercent: 78.6 },
  { rollNo: "CSE022", name: "Lakshay Gambhir", email: "lakshay@cms.edu", currentAttendancePercent: 66.7 },
  { rollNo: "CSE023", name: "Manish Tiwari", email: "manish@cms.edu", currentAttendancePercent: 82.5 },
  { rollNo: "CSE024", name: "Meera Nair", email: "meera@cms.edu", currentAttendancePercent: 87.0 },
  { rollNo: "CSE025", name: "Mohit Bansal", email: "mohit@cms.edu", currentAttendancePercent: 73.0 },
  { rollNo: "CSE026", name: "Nakul Sharma", email: "nakul@cms.edu", currentAttendancePercent: 80.5 },
  { rollNo: "CSE027", name: "Navya Pillai", email: "navya@cms.edu", currentAttendancePercent: 93.3 },
  { rollNo: "CSE028", name: "Nikhil Rao", email: "nikhil@cms.edu", currentAttendancePercent: 75.0 },
  { rollNo: "CSE029", name: "Payal Singhania", email: "payal@cms.edu", currentAttendancePercent: 88.0 },
  { rollNo: "CSE030", name: "Pranav Goel", email: "pranav@cms.edu", currentAttendancePercent: 69.5 },
  { rollNo: "CSE031", name: "Pooja Hegde", email: "pooja@cms.edu", currentAttendancePercent: 84.0 },
  { rollNo: "CSE032", name: "Rahul Soni", email: "rahul.s@cms.edu", currentAttendancePercent: 77.2 },
  { rollNo: "CSE033", name: "Rajat Mishra", email: "rajat@cms.edu", currentAttendancePercent: 82.0 },
  { rollNo: "CSE034", name: "Riya Sharma", email: "student@cms.edu", currentAttendancePercent: 75.1 }, // demo student
  { rollNo: "CSE035", name: "Rohan Kulkarni", email: "rohan@cms.edu", currentAttendancePercent: 63.8 },
  { rollNo: "CSE036", name: "Rohit Chauhan", email: "rohit.c@cms.edu", currentAttendancePercent: 79.0 },
  { rollNo: "CSE037", name: "Sakshi Agarwal", email: "sakshi@cms.edu", currentAttendancePercent: 90.5 },
  { rollNo: "CSE038", name: "Samir Ghosh", email: "samir@cms.edu", currentAttendancePercent: 72.4 },
  { rollNo: "CSE039", name: "Sanjay Nambiar", email: "sanjay@cms.edu", currentAttendancePercent: 81.0 },
  { rollNo: "CSE040", name: "Sanya Grover", email: "sanya@cms.edu", currentAttendancePercent: 86.8 },
  { rollNo: "CSE041", name: "Shikha Pandey", email: "shikha@cms.edu", currentAttendancePercent: 67.2 },
  { rollNo: "CSE042", name: "Shivam Dubey", email: "shivam@cms.edu", currentAttendancePercent: 83.5 },
  { rollNo: "CSE043", name: "Shreya Mukherjee", email: "shreya@cms.edu", currentAttendancePercent: 95.0 },
  { rollNo: "CSE044", name: "Siddharth Jain", email: "sid@cms.edu", currentAttendancePercent: 74.0 },
  { rollNo: "CSE045", name: "Simran Kaur", email: "simran@cms.edu", currentAttendancePercent: 89.0 },
  { rollNo: "CSE046", name: "Sneha Rao", email: "sneha@cms.edu", currentAttendancePercent: 76.5 },
  { rollNo: "CSE047", name: "Sourabh Das", email: "sourabh@cms.edu", currentAttendancePercent: 71.0 },
  { rollNo: "CSE048", name: "Sparsh Rastogi", email: "sparsh@cms.edu", currentAttendancePercent: 85.3 },
  { rollNo: "CSE049", name: "Tanmay Deshpande", email: "tanmay@cms.edu", currentAttendancePercent: 78.0 },
  { rollNo: "CSE050", name: "Tarun Bajaj", email: "tarun@cms.edu", currentAttendancePercent: 61.0 },
  { rollNo: "CSE051", name: "Trisha Roy", email: "trisha@cms.edu", currentAttendancePercent: 88.2 },
  { rollNo: "CSE052", name: "Utkarsh Sinha", email: "utkarsh@cms.edu", currentAttendancePercent: 82.4 },
  { rollNo: "CSE053", name: "Vaibhav Kaushik", email: "vaibhav@cms.edu", currentAttendancePercent: 73.5 },
  { rollNo: "CSE054", name: "Varun Nair", email: "varun@cms.edu", currentAttendancePercent: 80.0 },
  { rollNo: "CSE055", name: "Vedika Mathur", email: "vedika@cms.edu", currentAttendancePercent: 96.0 },
  { rollNo: "CSE056", name: "Vidhi Chawla", email: "vidhi@cms.edu", currentAttendancePercent: 87.5 },
  { rollNo: "CSE057", name: "Vikas Rawat", email: "vikas@cms.edu", currentAttendancePercent: 65.0 },
  { rollNo: "CSE058", name: "Yash Singhal", email: "yash@cms.edu", currentAttendancePercent: 79.8 },
  { rollNo: "CSE059", name: "Yuvraj Rajput", email: "yuvraj@cms.edu", currentAttendancePercent: 70.5 },
  { rollNo: "CSE060", name: "Zoya Farooqui", email: "zoya@cms.edu", currentAttendancePercent: 91.4 },
];

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("cms-storage-update"));
  } catch (err) {
    console.error("Storage save failed", err);
  }
}

export function useCMSData() {
  const [recheckRequests, setRecheckRequestsState] = useState<RecheckRequest[]>([]);
  const [escalations, setEscalationsState] = useState<Escalation[]>([]);
  const [labIssues, setLabIssuesState] = useState<LabIssue[]>([]);
  const [notices, setNoticesState] = useState<Notice[]>([]);
  const [gateEntries, setGateEntriesState] = useState<GateEntry[]>([]);
  const [visitorEntries, setVisitorEntriesState] = useState<VisitorEntry[]>([]);
  const [lostFoundEntries, setLostFoundEntriesState] = useState<LostFoundEntry[]>([]);
  const [keyEntries, setKeyEntriesState] = useState<KeyEntry[]>([]);
  const [users, setUsersState] = useState<User[]>([]);
  const [auditLog, setAuditLogState] = useState<AuditLogEntry[]>([]);
  const [attendanceRecords, setAttendanceRecordsState] = useState<AttendanceRecord[]>([]);

  const reloadData = () => {
    setRecheckRequestsState(getStored("cms_recheck_requests", MOCK_RECHECK_REQUESTS));
    setEscalationsState(getStored("cms_escalations", MOCK_ESCALATIONS));
    setLabIssuesState(getStored("cms_lab_issues", MOCK_LAB_ISSUES));
    setNoticesState(getStored("cms_notices", MOCK_NOTICES));
    setGateEntriesState(getStored("cms_gate_entries", MOCK_GATE_ENTRIES));
    setVisitorEntriesState(getStored("cms_visitor_entries", MOCK_VISITOR_ENTRIES));
    setLostFoundEntriesState(getStored("cms_lostfound_entries", MOCK_LOSTFOUND_ENTRIES));
    setKeyEntriesState(getStored("cms_key_entries", MOCK_KEY_ENTRIES));
    setUsersState(getStored("cms_users", MOCK_USERS));
    setAuditLogState(getStored("cms_audit_log", INITIAL_AUDIT_LOG));
    setAttendanceRecordsState(getStored("cms_attendance_records", MOCK_ATTENDANCE));
  };

  useEffect(() => {
    reloadData();
    const handleUpdate = () => reloadData();
    window.addEventListener("cms-storage-update", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("cms-storage-update", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const addAudit = (actor: string, role: Role, action: string, category: AuditLogEntry["category"], details: string) => {
    const current = getStored("cms_audit_log", INITIAL_AUDIT_LOG);
    const newEntry: AuditLogEntry = {
      id: "log-" + Date.now(),
      actor,
      role,
      action,
      category,
      details,
      timestamp: new Date().toISOString(),
    };
    const updated = [newEntry, ...current];
    setStored("cms_audit_log", updated);
  };

  // Recheck Actions
  const addRecheckRequest = (req: Omit<RecheckRequest, "id" | "submittedAt" | "status">) => {
    const current = getStored("cms_recheck_requests", MOCK_RECHECK_REQUESTS);
    const newReq: RecheckRequest = {
      ...req,
      id: "r" + (Date.now() % 100000),
      submittedAt: new Date().toISOString(),
      status: "Pending",
    };
    const updated = [newReq, ...current];
    setStored("cms_recheck_requests", updated);
    addAudit(req.studentName, "student", "Raised Recheck Request", "Recheck", `Dispute for ${req.subject} on ${req.date}`);
    return newReq;
  };

  const updateRecheckStatus = (
    id: string,
    status: RecheckRequest["status"],
    comment?: string,
    byActor = "Reviewer",
    role: Role = "teacher"
  ) => {
    const current = getStored("cms_recheck_requests", MOCK_RECHECK_REQUESTS);
    const updated = current.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          status,
          ...(role === "teacher" ? { teacherComment: comment || r.teacherComment } : {}),
          ...(role === "principal" ? { hodComment: comment || r.hodComment } : {}),
        };
      }
      return r;
    });
    setStored("cms_recheck_requests", updated);
    addAudit(byActor, role, `Recheck ${status}`, "Recheck", `Recheck request #${id} marked as ${status}`);
  };

  // Escalation Actions
  const addEscalation = (esc: Omit<Escalation, "id" | "createdAt" | "updatedAt" | "status">) => {
    const current = getStored("cms_escalations", MOCK_ESCALATIONS);
    const newEsc: Escalation = {
      ...esc,
      id: "e" + (Date.now() % 100000),
      status: "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newEsc, ...current];
    setStored("cms_escalations", updated);
    addAudit(esc.raisedBy, esc.raisedByRole, "Raised Escalation", "Escalation", `Category: ${esc.category}`);
    return newEsc;
  };

  const resolveEscalation = (id: string, status: Escalation["status"], notes: string, byActor: string) => {
    const current = getStored("cms_escalations", MOCK_ESCALATIONS);
    const updated = current.map((e) => {
      if (e.id === id) {
        return {
          ...e,
          status,
          resolutionNotes: notes,
          resolvedBy: byActor,
          updatedAt: new Date().toISOString(),
        };
      }
      return e;
    });
    setStored("cms_escalations", updated);
    addAudit(byActor, "principal", `Escalation ${status}`, "Escalation", `Escalation #${id} set to ${status}: ${notes}`);
  };

  // Lab Issues Actions
  const addLabIssue = (issue: Omit<LabIssue, "id" | "createdAt" | "updatedAt" | "status">) => {
    const current = getStored("cms_lab_issues", MOCK_LAB_ISSUES);
    const newIssue: LabIssue = {
      ...issue,
      id: "l" + (Date.now() % 100000),
      status: "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newIssue, ...current];
    setStored("cms_lab_issues", updated);
    addAudit(issue.reportedBy, "staff", "Reported Facility Issue", "Escalation", `${issue.lab} - ${issue.category}`);
    return newIssue;
  };

  const updateLabIssueStatus = (id: string, status: LabIssue["status"], notes: string, byActor: string) => {
    const current = getStored("cms_lab_issues", MOCK_LAB_ISSUES);
    const updated = current.map((l) => {
      if (l.id === id) {
        return {
          ...l,
          status,
          resolutionNotes: notes,
          updatedAt: new Date().toISOString(),
        };
      }
      return l;
    });
    setStored("cms_lab_issues", updated);
    addAudit(byActor, "principal", `Lab Issue ${status}`, "Escalation", `Issue #${id} in lab marked ${status}`);
  };

  // Register Actions
  const addGateEntry = (entry: Omit<GateEntry, "id" | "type" | "timestamp">) => {
    const current = getStored("cms_gate_entries", MOCK_GATE_ENTRIES);
    const newEntry: GateEntry = {
      ...entry,
      id: "g" + (Date.now() % 100000),
      type: "gate",
      timestamp: new Date().toISOString(),
    };
    const updated = [newEntry, ...current];
    setStored("cms_gate_entries", updated);
    addAudit(entry.loggedBy, "watchman", "Logged Gate Entry", "Register", `${entry.entryType}: ${entry.name} ${entry.isUrgent ? "(URGENT)" : ""}`);
    return newEntry;
  };

  const addVisitorEntry = (entry: Omit<VisitorEntry, "id" | "type" | "timestamp">) => {
    const current = getStored("cms_visitor_entries", MOCK_VISITOR_ENTRIES);
    const newEntry: VisitorEntry = {
      ...entry,
      id: "v" + (Date.now() % 100000),
      type: "visitor",
      timestamp: new Date().toISOString(),
    };
    const updated = [newEntry, ...current];
    setStored("cms_visitor_entries", updated);
    addAudit(entry.loggedBy, "watchman", "Logged Visitor Entry", "Register", `Visitor: ${entry.visitorName} to meet ${entry.whomToMeet}`);
    return newEntry;
  };

  const checkoutVisitor = (id: string, outTime: string, actor: string) => {
    const current = getStored("cms_visitor_entries", MOCK_VISITOR_ENTRIES);
    const updated = current.map((v) => (v.id === id ? { ...v, outTime } : v));
    setStored("cms_visitor_entries", updated);
    addAudit(actor, "watchman", "Checked Out Visitor", "Register", `Visitor entry #${id} marked exited at ${outTime}`);
  };

  const addLostFoundEntry = (entry: Omit<LostFoundEntry, "id" | "type" | "timestamp">) => {
    const current = getStored("cms_lostfound_entries", MOCK_LOSTFOUND_ENTRIES);
    const newEntry: LostFoundEntry = {
      ...entry,
      id: "lf" + (Date.now() % 100000),
      type: "lostfound",
      timestamp: new Date().toISOString(),
    };
    const updated = [newEntry, ...current];
    setStored("cms_lostfound_entries", updated);
    addAudit(entry.loggedBy, "watchman", "Logged Lost & Found", "Register", `Item: ${entry.itemName}`);
    return newEntry;
  };

  const claimLostFound = (id: string, claimedBy: string, actor: string) => {
    const current = getStored("cms_lostfound_entries", MOCK_LOSTFOUND_ENTRIES);
    const updated = current.map((lf) => (lf.id === id ? { ...lf, isClaimed: true, claimedBy } : lf));
    setStored("cms_lostfound_entries", updated);
    addAudit(actor, "watchman", "Claimed Lost Item", "Register", `Item #${id} claimed by ${claimedBy}`);
  };

  const addKeyEntry = (entry: Omit<KeyEntry, "id" | "type" | "timestamp">) => {
    const current = getStored("cms_key_entries", MOCK_KEY_ENTRIES);
    const newEntry: KeyEntry = {
      ...entry,
      id: "k" + (Date.now() % 100000),
      type: "key",
      timestamp: new Date().toISOString(),
    };
    const updated = [newEntry, ...current];
    setStored("cms_key_entries", updated);
    addAudit(entry.loggedBy, "watchman", "Issued Key", "Register", `Key ${entry.keyId} (${entry.roomName}) issued to ${entry.issuedTo}`);
    return newEntry;
  };

  const returnKey = (id: string, timeIn: string, actor: string) => {
    const current = getStored("cms_key_entries", MOCK_KEY_ENTRIES);
    const updated = current.map((k) => (k.id === id ? { ...k, timeIn } : k));
    setStored("cms_key_entries", updated);
    addAudit(actor, "watchman", "Returned Key", "Register", `Key entry #${id} returned at ${timeIn}`);
  };

  // Notice Actions
  const addNotice = (notice: Omit<Notice, "id" | "createdAt" | "readBy">) => {
    const current = getStored("cms_notices", MOCK_NOTICES);
    const newNotice: Notice = {
      ...notice,
      id: "n" + (Date.now() % 100000),
      createdAt: new Date().toISOString(),
      readBy: [],
    };
    const updated = [newNotice, ...current];
    setStored("cms_notices", updated);
    addAudit(notice.postedBy, notice.postedByRole, "Published Notice", "Notice", `"${notice.title}" for ${notice.targetRoles.join(", ")}`);
    return newNotice;
  };

  const markNoticeRead = (noticeId: string, userId: string) => {
    const current = getStored("cms_notices", MOCK_NOTICES);
    const updated = current.map((n) => {
      if (n.id === noticeId) {
        const readBy = n.readBy || [];
        if (!readBy.includes(userId)) {
          return { ...n, readBy: [...readBy, userId] };
        }
      }
      return n;
    });
    setStored("cms_notices", updated);
  };

  // User Actions (Admin)
  const addUser = (newUser: Omit<User, "id">) => {
    const current = getStored("cms_users", MOCK_USERS);
    const userWithId: User = {
      ...newUser,
      id: "u" + (Date.now() % 100000),
    };
    const updated = [...current, userWithId];
    setStored("cms_users", updated);
    addAudit("Admin Singh", "admin", "Created User Account", "User", `${newUser.name} (${newUser.role})`);
    return userWithId;
  };

  const deleteUser = (userId: string) => {
    const current = getStored("cms_users", MOCK_USERS);
    const target = current.find((u) => u.id === userId);
    const updated = current.filter((u) => u.id !== userId);
    setStored("cms_users", updated);
    if (target) {
      addAudit("Admin Singh", "admin", "Deactivated User", "User", `${target.name} (${target.role})`);
    }
  };

  return {
    recheckRequests,
    escalations,
    labIssues,
    notices,
    gateEntries,
    visitorEntries,
    lostFoundEntries,
    keyEntries,
    users,
    auditLog,
    attendanceRecords,
    addRecheckRequest,
    updateRecheckStatus,
    addEscalation,
    resolveEscalation,
    addLabIssue,
    updateLabIssueStatus,
    addGateEntry,
    addVisitorEntry,
    checkoutVisitor,
    addLostFoundEntry,
    claimLostFound,
    addKeyEntry,
    returnKey,
    addNotice,
    markNoticeRead,
    addUser,
    deleteUser,
    addAudit,
  };
}
