# Software Requirements Specification
## College Management System (CMS)

**Version:** 1.0
**Prepared for:** [College Name]
**Date:** [Insert Date]

---

## 1. Introduction

### 1.1 Purpose
This document specifies the functional and non-functional requirements for a **College Management System (CMS)** — a web-based platform that digitizes attendance tracking, notices, gate/register management, and grievance escalation across five user roles: Admin, Student, Teacher, Watchman, and Non-Teaching Staff.

### 1.2 Scope
The CMS will:
- Centralize attendance marking and viewing.
- Allow controlled recheck/escalation workflows instead of informal complaints.
- Digitize physical registers (gate entry, lost & found, key management).
- Provide role-based access control (RBAC) so each user sees only what's relevant to them.
- Route escalations (from teachers, students, non-teaching staff) to a defined higher authority instead of a vague "higher authority" black box.

### 1.3 Definitions
| Term | Meaning |
|---|---|
| RBAC | Role-Based Access Control |
| HOD | Head of Department |
| Escalation | A request routed upward for review/decision |
| Register | A digitized log (gate, lost & found, keys, etc.) |

### 1.4 Intended Audience
Developers, project guide/mentor, and evaluators (e.g., hackathon/SIH judges) reviewing the system design.

---

## 2. Overall Description

### 2.1 Product Perspective
CMS is a standalone web/mobile application with a central database and role-specific dashboards. It is not dependent on any pre-existing college ERP but should expose APIs for future integration.

### 2.2 Gap Identified & New Role Proposed
Two of your existing roles create **escalations with no defined recipient**:
- Teacher → "check on something with higher authority"
- Non-teaching staff → "report lab problem to higher authority"
- Student → attendance recheck (needs someone to *approve*, not just Admin)

Rather than routing everything to Admin (which conflates "system admin" with "academic authority"), the SRS adds:

**6) Principal / HOD (Approving Authority)**
- Reviews and approves/rejects student attendance-recheck requests escalated by teachers.
- Reviews and resolves teacher escalations and lab-issue reports from non-teaching staff.
- Can view department-level (not full-database) reports and analytics.
- Can post official notices college-wide.

This keeps Admin as a *system-level* role (data, access, configuration) and HOD/Principal as the *academic/administrative decision-maker* — a common and necessary split in real institutions.

### 2.3 User Classes and Characteristics
| Role | Technical Proficiency | Primary Goal |
|---|---|---|
| Admin | High | System configuration, data integrity, access control |
| Principal/HOD | Low–Medium | Approve escalations, view reports, post notices |
| Teacher | Medium | Mark attendance, raise concerns |
| Student | Medium–High | View attendance/notices, raise disputes |
| Watchman | Low | Log entries in registers |
| Non-Teaching Staff | Low | Report facility issues |

### 2.4 Constraints
- Must support role-based login (single login page, redirect by role).
- Attendance disputes must retain proof (image/document) attached to the request.
- All registers must be timestamped and immutable once submitted (edit = new entry + audit trail, not overwrite).

### 2.5 Assumptions
- One student can view only their own attendance; no peer visibility.
- Notices can be role-targeted (e.g., only-students, only-teachers, all).
- The system starts with one campus/college; multi-campus is a future enhancement.

---

## 3. Functional Requirements

### 3.1 Admin
| ID | Requirement |
|---|---|
| FR-A1 | Admin can create, update, deactivate any user account across all roles. |
| FR-A2 | Admin can view/query the full database (read access to all tables). |
| FR-A3 | Admin can define new "registration types" (e.g., new register categories, new complaint categories) without code changes — i.e., a dynamic form/schema builder. |
| FR-A4 | Admin can assign/reassign the Principal/HOD role and department mappings. |
| FR-A5 | Admin can view system logs and audit trails. |
| FR-A6 | Admin can configure notice-board categories and visibility rules. |
| FR-A7 | Admin can generate institution-wide reports (attendance %, register activity, escalation resolution time). |

### 3.2 Principal / HOD *(new)*
| ID | Requirement |
|---|---|
| FR-P1 | Can view and act on (approve/reject/comment) student attendance-recheck requests forwarded by a teacher. |
| FR-P2 | Can view and resolve teacher escalations. |
| FR-P3 | Can view and resolve lab-issue reports from non-teaching staff. |
| FR-P4 | Can post official/urgent notices visible to all or selected roles. |
| FR-P5 | Can view department-level attendance and escalation analytics (not full DB). |

### 3.3 Student
| ID | Requirement |
|---|---|
| FR-S1 | Can view personal attendance (subject-wise, date-wise). |
| FR-S2 | Can view notices relevant to their class/department. |
| FR-S3 | Can raise an attendance-recheck request with proof (document/photo upload) against a specific date/subject. |
| FR-S4 | Can track the status of a submitted recheck request (Pending / Forwarded / Approved / Rejected). |
| FR-S5 | *(new)* Can receive notifications when a request status changes or a new notice is posted. |
| FR-S6 | *(new)* Can view a personal attendance percentage/threshold indicator (e.g., "You are below the 75% requirement"). |

### 3.4 Teacher
| ID | Requirement |
|---|---|
| FR-T1 | Can mark attendance for assigned classes/subjects. |
| FR-T2 | Can edit attendance within a defined correction window (with reason logged). |
| FR-T3 | Can view/respond to student attendance-recheck requests before forwarding to Principal/HOD. |
| FR-T4 | Can raise an escalation/query to the Principal/HOD (e.g., disciplinary issue, resource need). |
| FR-T5 | *(new)* Can view attendance defaulter list for their subject/class. |
| FR-T6 | *(new)* Can post subject/class-specific notices (e.g., "Test postponed"). |

### 3.5 Watchman
| ID | Requirement |
|---|---|
| FR-W1 | Can log entries in the Gate Register (entry/exit, vehicle, visitor). |
| FR-W2 | Can log entries in the Lost & Found Register (item, date, claimed status). |
| FR-W3 | Can log entries in the Key Management Register (key ID, issued to, time out/in). |
| FR-W4 | Can search/filter past register entries by date or keyword. |
| FR-W5 | *(new)* Can flag an entry as urgent/suspicious, auto-notifying Admin/Security in-charge. |
| FR-W6 | *(new)* Can log a **Visitor Register** (name, purpose, whom-to-meet, in/out time) — a natural extension of gate duty. |

### 3.6 Non-Teaching Staff (Lab/Facility)
| ID | Requirement |
|---|---|
| FR-N1 | Can report a facility/lab problem with description and optional photo. |
| FR-N2 | Can track status of a submitted report (Pending / In Progress / Resolved). |
| FR-N3 | *(new)* Can categorize the report (electrical, plumbing, equipment, network, cleanliness) for faster routing. |
| FR-N4 | *(new)* Can view a log of previously reported and resolved issues for their assigned lab/room. |

### 3.7 Cross-Role / System-Wide *(new)*
| ID | Requirement |
|---|---|
| FR-X1 | **Notice Board module**: role-targeted, timestamped, with read/unread tracking. |
| FR-X2 | **Escalation/Grievance engine**: a common backend workflow (raised → forwarded → resolved) reused by student recheck requests, teacher escalations, and non-teaching staff reports, so all three funnel into one auditable pipeline instead of three separate ad-hoc flows. |
| FR-X3 | **Notification system**: in-app (and optionally email/SMS) alerts on status changes. |
| FR-X4 | **Audit trail**: every attendance edit, register entry, and escalation action is logged with actor, timestamp, and reason. |
| FR-X5 | **Dashboard per role**: summary view on login (e.g., student sees attendance %; teacher sees today's classes; watchman sees today's register counts). |

---

## 4. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Security | Role-based access control; passwords hashed; proof documents stored securely with access limited to relevant approvers. |
| Availability | System should be available during college hours (8 AM–6 PM) with ≥99% uptime target. |
| Scalability | Should support at least 3,000 concurrent student records and 200 staff accounts without redesign. |
| Usability | Watchman and non-teaching staff interfaces must be simple (large buttons, minimal typing) given lower technical proficiency. |
| Auditability | No hard deletes on registers or attendance — all changes are append-only with audit logs. |
| Data Retention | Attendance and register data retained for at least the academic year, configurable by Admin. |
| Performance | Attendance marking for a class of 60 students should complete in a single view without pagination lag. |

---

## 5. Data Entities (High-Level)

- **User** (id, name, role, department, contact)
- **Attendance** (student_id, subject_id, date, status, marked_by, edited_log)
- **RecheckRequest** (student_id, attendance_id, proof_url, status, forwarded_to, resolution_notes)
- **Escalation** (raised_by, role, category, description, status, resolved_by)
- **Register** — polymorphic: GateEntry, LostFound, KeyManagement, Visitor (each with its own fields, but sharing id, timestamp, logged_by)
- **Notice** (title, body, target_roles, posted_by, timestamp)
- **RegistrationType** (Admin-defined dynamic schema for new register/complaint categories)

---

## 6. Future Enhancements (Out of Scope for v1)
- Parent role with read-only access to their child's attendance and notices.
- Timetable/scheduling module.
- Leave management for students and staff.
- Mobile app with push notifications.
- Multi-campus support.

---

## 7. Summary of Added Value

| You defined | Added in this SRS |
|---|---|
| Admin, Student, Teacher, Watchman, Non-Teaching Staff | + Principal/HOD role to close the "higher authority" gap |
| Separate escalation mentions per role | Unified Escalation/Grievance engine (FR-X2) so all three funnel into one trackable pipeline |
| Registers listed individually | Added Visitor Register; flag-as-urgent for Watchman |
| Attendance/notices for students | Added attendance % threshold indicator, notifications |
| — | Notice Board module, audit trail, per-role dashboards as system-wide backbone requirements |
