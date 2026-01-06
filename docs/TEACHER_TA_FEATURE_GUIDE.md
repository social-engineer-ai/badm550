# BADM 550 Course Operating System
## Teacher & TA Feature Guide

**Version:** 1.0
**Last Updated:** January 2026
**System URL:** http://localhost:3001

---

## Table of Contents
1. [Getting Started](#1-getting-started)
2. [Dashboard Features](#2-dashboard-features)
3. [Project Management](#3-project-management)
4. [Team Management](#4-team-management)
5. [Course Roadmap (Weeks)](#5-course-roadmap-weeks)
6. [Grading & Submissions](#6-grading--submissions)
7. [Communication Tools](#7-communication-tools)
8. [Admin Panel](#8-admin-panel)
9. [Role Permissions Summary](#9-role-permissions-summary)

---

## 1. Getting Started

### 1.1 Logging In
- Navigate to the login page
- Enter your @illinois.edu email and password
- The system will automatically redirect you based on your role

### 1.2 Test Accounts
| Role | Email | Password |
|------|-------|----------|
| Teacher | prof@illinois.edu | password123 |
| TA | ta@illinois.edu | password123 |
| Student | student@illinois.edu | password123 |

### 1.3 Navigation
After login, you'll see a sidebar with:
- **Dashboard** - Overview of alerts, drafts, and team health
- **Projects** - Manage course projects and milestones
- **Teams** - View and manage student teams
- **Roadmap** - Configure weekly course structure
- **Admin** - System administration (Teacher only)

---

## 2. Dashboard Features

**URL:** `/instructor`

### 2.1 Alerts Panel
Displays AI-generated alerts requiring attention:
- **Missing Check-ins** - Teams that haven't submitted pulse checks
- **Discrepancies** - Analytical issues detected in submissions
- **Priority Levels:** High (red), Medium (yellow), Low (green)

**Actions:**
- Click alert to view details
- Resolve alerts after addressing issues

### 2.2 Team Health Overview
Visual status of all teams:
- **Green** - On track, no issues
- **Yellow** - Minor concerns
- **Red** - Requires immediate attention

**Metrics shown:**
- Alert count per team
- Overall sentiment from pulse checks

### 2.3 AI-Generated Email Drafts
The system automatically generates email drafts based on:
- Student questions via "Contact Professor"
- Detected issues in submissions
- Missing check-ins

**Actions:**
- **Edit** - Modify the draft content
- **Send** - Send the email (requires Gmail OAuth setup)

### 2.4 Sync Button
Manually trigger inbox sync and AI analysis:
- Processes incoming emails
- Clusters similar inquiries
- Generates draft responses

**Note:** Requires ANTHROPIC_API_KEY for full AI functionality

### 2.5 Recent Submissions
View latest student submissions across all teams:
- Submission type and URL
- Team name and timestamp
- Quick action buttons

---

## 3. Project Management

**URL:** `/instructor/projects`

### 3.1 Project List
View all course projects with:
- Project name and client
- Status (Draft, Active, Completed)
- Milestone count

### 3.2 Create New Project (Teacher Only)
1. Click "Create New Project"
2. Fill in:
   - Project Name
   - Client Name
   - Description
   - Status
3. Save to create

### 3.3 Edit Project
**URL:** `/instructor/projects/[id]/edit`

Three tabs available:

#### Details Tab
- Edit project name, client, description
- Change status (Draft → Active → Completed)

#### Milestones Tab
- View all weekly milestones
- Add new milestones with:
  - Week number
  - Title and theme
  - Description
  - Deliverables (name, type, points)
  - Resources (videos, documents, datasets)
  - Guidance notes
- Edit or delete existing milestones

#### Resources Tab
- Add project-level resources
- Resource types: YouTube Video, MediaSpace, Colab Notebook, Document, Dataset, Link
- Delete resources

### 3.4 Team Assignments
Assign teams to projects:
1. Go to Teams page
2. Click "Project Config" on a team
3. Select project to assign

---

## 4. Team Management

**URL:** `/instructor/teams`

### 4.1 Team Roster
View all teams with:
- Team name and assigned project
- Health status indicator
- Member list with roles (Lead, Member)

### 4.2 Search & Filter
- Search by team name or project
- Filter by health status

### 4.3 Team Actions

#### Audit Team Trail
View comprehensive team history:
- All submissions with timestamps
- Pulse check history and sentiment
- Alert history

#### Project Config
Assign or change team's project assignment

#### Health Override
Manually set team health status:
- Green, Yellow, or Red
- Useful for instructor judgment calls

### 4.4 Export Audit Trail
Download CSV of all teams with:
- Team name
- Project assignment
- Health status
- Member list

---

## 5. Course Roadmap (Weeks)

**URL:** `/instructor/roadmap`

### 5.1 Week Overview
Visual timeline of all course weeks:
- Week number and title
- Overview description
- Deliverable hints

### 5.2 Add New Week (Teacher Only)
1. Click "+ Add Week"
2. Auto-assigns next week number
3. Opens editor for customization

### 5.3 Edit Week
Click any week to edit:
- Title and overview
- Deliverable specifications
- Guidance hints for students

### 5.4 Delete Week (Teacher Only)
- Click "Delete Week" in editor
- Confirmation required
- Cannot be undone

---

## 6. Grading & Submissions

### 6.1 View Submissions
**Dashboard** shows recent submissions
**Projects → Submissions** shows all submissions for a project

Submission details:
- Team and student info
- Submission type (link, notebook, file)
- Submission URL
- Notes from student
- Status (Submitted, Reviewed, Graded)

### 6.2 Review Submissions
For each submission:
1. Click to view details
2. Add instructor feedback
3. Provide AI-assisted feedback
4. Assign score
5. Mark as reviewed

### 6.3 Grade Entry
**URL:** `/instructor/grades`
- View all grades by team/student
- Enter or update grades
- Export grade reports

---

## 7. Communication Tools

### 7.1 Email Drafts
AI-generated responses to student inquiries:
- Auto-drafted from student "Contact Professor" messages
- Edit before sending
- Track sent/unsent status

### 7.2 Pulse Blast (Teacher Only)
Send mass pulse check reminder:
- Triggers notification to all students
- Customizable message

### 7.3 Student Contact Messages
View messages from students:
- Subject and body
- AI-generated draft response
- Original context preserved

---

## 8. Admin Panel

**URL:** `/instructor/admin`
**(Teacher Only)**

### 8.1 Semester Management
- Create new semesters
- Set start/end dates
- Mark active semester

### 8.2 Project Administration
- Create/delete projects
- View all projects across semesters

### 8.3 Team Administration
- Create new teams
- Assign to projects
- Add/remove members
- Delete teams

### 8.4 Student Management
- View all enrolled students
- Create new student accounts
- Assign to teams
- Remove students

### 8.5 TA Management
- Add new TAs
- View all TAs
- Remove TA access

---

## 9. Role Permissions Summary

| Feature | Teacher | TA |
|---------|---------|-----|
| View Dashboard | ✅ | ✅ |
| View Alerts | ✅ | ✅ |
| View Team Health | ✅ | ✅ |
| View Submissions | ✅ | ✅ |
| View Projects | ✅ | ✅ |
| View Email Drafts | ✅ | ✅ |
| Edit Email Drafts | ✅ | ✅ |
| **Create Project** | ✅ | ❌ |
| **Edit Project** | ✅ | ❌ |
| **Delete Project** | ✅ | ❌ |
| **Create Milestone** | ✅ | ❌ |
| **Edit Milestone** | ✅ | ❌ |
| **Create Week** | ✅ | ❌ |
| **Edit Week** | ✅ | ❌ |
| **Delete Week** | ✅ | ❌ |
| **Sync Inbox** | ✅ | ❌ |
| **Pulse Blast** | ✅ | ❌ |
| **Admin Panel** | ✅ | ❌ |
| Override Team Health | ✅ | ✅ |
| Review Submissions | ✅ | ✅ |
| Export Audit Trail | ✅ | ✅ |

---

## Appendix: Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Esc` | Close modal dialogs |
| `Enter` | Submit forms |

---

## Support

For technical issues or feature requests:
- GitHub: https://github.com/social-engineer-ai/badm550
- Email: [System Administrator]
