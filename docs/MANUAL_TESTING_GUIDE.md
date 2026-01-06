# BADM 550 Course Operating System
## Manual Testing Guide

**Version:** 1.0
**Last Updated:** January 2026

---

## Testing Overview

This guide is divided into **6 independent test sections** that can be assigned to different testers. Each section takes approximately **15-30 minutes** to complete.

### Test Assignments
| Section | Estimated Time | Suggested Tester |
|---------|---------------|------------------|
| Section A: Authentication | 10 min | Tester 1 |
| Section B: Teacher Dashboard | 20 min | Tester 1 |
| Section C: Project Management | 25 min | Tester 2 |
| Section D: Team Management | 20 min | Tester 2 |
| Section E: Student Features | 25 min | Tester 3 |
| Section F: TA Permissions | 15 min | Tester 3 |

### Before Testing
1. Ensure the system is running at http://localhost:3001
2. Clear browser cache/cookies or use incognito mode
3. Have test credentials ready (see Section A)
4. Submit results via the feedback form after each section

---

# SECTION A: Authentication & Login
**Tester:** _______________
**Date:** _______________

## Test Credentials
| Role | Email | Password |
|------|-------|----------|
| Teacher | prof@illinois.edu | password123 |
| TA | ta@illinois.edu | password123 |
| Student | student@illinois.edu | password123 |

## Test Cases

### A1: Teacher Login
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Navigate to http://localhost:3001 | Login page displayed | | |
| 2 | Enter prof@illinois.edu / password123 | Credentials accepted | | |
| 3 | Click Login | Redirected to /instructor dashboard | | |
| 4 | Check sidebar navigation | Shows: Dashboard, Projects, Teams, Roadmap, Admin | | |

### A2: Teacher Logout
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Click user profile/logout | Logged out | | |
| 2 | Try to access /instructor | Redirected to login | | |

### A3: TA Login
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Login as ta@illinois.edu | Login successful | | |
| 2 | Check sidebar | Admin option NOT visible | | |
| 3 | Check profile shows "TA" role | Role displayed correctly | | |

### A4: Student Login
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Login as student@illinois.edu | Login successful | | |
| 2 | Verify redirected to /student | Student dashboard shown | | |
| 3 | Verify cannot access /instructor | Access denied or redirected | | |

### A5: Invalid Login
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Enter wrong password | Error message displayed | | |
| 2 | Enter non-existent email | Error message displayed | | |

**Section A Total: ___/5 tests passed**

---

# SECTION B: Teacher Dashboard
**Tester:** _______________
**Date:** _______________
**Login as:** prof@illinois.edu

## Test Cases

### B1: Dashboard Load
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Navigate to /instructor | Dashboard loads without errors | | |
| 2 | Verify alerts panel visible | Shows alerts or "No alerts" | | |
| 3 | Verify teams health visible | Shows team status cards | | |
| 4 | Verify drafts panel visible | Shows drafts or "No drafts" | | |

### B2: Alerts Panel
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | View alert list | Alerts show priority colors | | |
| 2 | Note alert count | Count displayed correctly | | |
| 3 | Click an alert | Details shown or expanded | | |

### B3: Teams Health Panel
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | View team health cards | Each team shows status | | |
| 2 | Verify color coding | Green/Yellow/Red visible | | |
| 3 | Click a team | Navigates to team detail | | |

### B4: Sync Button
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Click "Sync" button | Button shows loading state | | |
| 2 | Wait for completion | Success message or result | | |
| 3 | No 500 error | Check browser console | | |

### B5: Email Drafts
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | View drafts list | Drafts displayed with subject | | |
| 2 | Click "Edit" on draft | Edit modal opens | | |
| 3 | Modify subject/body | Changes reflected in fields | | |
| 4 | Click "Save Changes" | Success message shown | | |
| 5 | Click "Send" | Attempt to send (may show Gmail error) | | |

### B6: Recent Submissions
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | View submissions panel | Shows recent submissions | | |
| 2 | Verify submission details | Team, type, URL shown | | |

**Section B Total: ___/6 tests passed**

---

# SECTION C: Project Management
**Tester:** _______________
**Date:** _______________
**Login as:** prof@illinois.edu

## Test Cases

### C1: Projects List
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Navigate to /instructor/projects | Projects list displayed | | |
| 2 | Verify project cards | Name, client, status shown | | |
| 3 | Verify milestone count | Count displayed per project | | |

### C2: Create New Project
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Click "Create New Project" | Form/page displayed | | |
| 2 | Enter project name: "Test Project" | Field accepts input | | |
| 3 | Enter client: "Test Client" | Field accepts input | | |
| 4 | Enter description | Field accepts input | | |
| 5 | Click Save/Create | Project created, redirected | | |
| 6 | Verify in projects list | New project appears | | |

### C3: Edit Project Details
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Click edit on a project | Edit page loads | | |
| 2 | Select "Details" tab | Details form shown | | |
| 3 | Modify project name | Field updates | | |
| 4 | Click "Save Changes" | Success message | | |
| 5 | Refresh page | Changes persisted | | |

### C4: Manage Milestones
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Select "Milestones" tab | Milestones list shown | | |
| 2 | Click "+ Add Milestone" | Form appears | | |
| 3 | Enter week number: next available | Auto-suggested or manual | | |
| 4 | Enter title: "Test Milestone" | Field accepts input | | |
| 5 | Enter theme | Field accepts input | | |
| 6 | Enter description | Field accepts input | | |
| 7 | Enter guidance notes | Field accepts input | | |
| 8 | Click Save | Milestone created | | |
| 9 | Verify in milestone list | New milestone appears | | |

### C5: Edit Milestone
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Click "Edit" on a milestone | Edit form opens | | |
| 2 | Modify title | Field updates | | |
| 3 | Save changes | Success message | | |
| 4 | Verify changes persisted | Title updated in list | | |

### C6: Delete Milestone
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Click "Delete" on a milestone | Confirmation dialog | | |
| 2 | Confirm deletion | Milestone removed | | |
| 3 | Verify not in list | Milestone gone | | |

### C7: Manage Resources
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Select "Resources" tab | Resources form/list shown | | |
| 2 | Enter resource title | Field accepts input | | |
| 3 | Select resource type | Dropdown works | | |
| 4 | Enter URL | Field accepts input | | |
| 5 | Click "Add Resource" | Resource added to list | | |
| 6 | Click "Delete" on resource | Resource removed | | |

**Section C Total: ___/7 tests passed**

---

# SECTION D: Team Management
**Tester:** _______________
**Date:** _______________
**Login as:** prof@illinois.edu

## Test Cases

### D1: Teams List
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Navigate to /instructor/teams | Teams roster displayed | | |
| 2 | Verify team cards | Name, project, health shown | | |
| 3 | Verify member list | Members with roles shown | | |

### D2: Search Teams
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Enter team name in search | Results filtered | | |
| 2 | Enter project name | Results filtered | | |
| 3 | Clear search | All teams shown | | |

### D3: Audit Team Trail
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Click "Audit Team Trail" | Modal/panel opens | | |
| 2 | Verify submissions shown | List of team submissions | | |
| 3 | Verify pulse history | Sentiment data shown | | |
| 4 | Close audit modal | Modal closes | | |

### D4: Project Config
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Click "Project Config" | Modal opens | | |
| 2 | See current assignment | Current project shown | | |
| 3 | See available projects | Project list displayed | | |
| 4 | Click a project to assign | Assignment saved | | |
| 5 | Verify assignment changed | New project shown | | |

### D5: Health Override
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Open team audit/detail | Health controls visible | | |
| 2 | Click different health status | Confirmation shown | | |
| 3 | Verify status changed | Color updated | | |

### D6: Export Audit Trail
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Click "Export Audit Trail" | Download starts | | |
| 2 | Open downloaded file | CSV opens correctly | | |
| 3 | Verify data | Teams, projects, members listed | | |

**Section D Total: ___/6 tests passed**

---

# SECTION E: Student Features
**Tester:** _______________
**Date:** _______________
**Login as:** student@illinois.edu

## Test Cases

### E1: Student Dashboard
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Login and view dashboard | Dashboard loads | | |
| 2 | Verify team info shown | Team name and role visible | | |
| 3 | Verify weeks roadmap | Weekly milestones displayed | | |

### E2: View Projects
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Navigate to /student/projects | Projects list shown | | |
| 2 | Click on a project | Project detail page loads | | |
| 3 | Verify milestones shown | Weekly milestones listed | | |

### E3: View Milestone Detail
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Click on Week 4 milestone | Milestone page loads | | |
| 2 | Verify title and description | Content displayed | | |
| 3 | Verify deliverables shown | Requirements listed | | |
| 4 | Verify resources shown | Links/videos displayed | | |
| 5 | Verify guidance notes | Hints displayed | | |

### E4: Submit Deliverable
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Find submission form | Upload/URL field visible | | |
| 2 | Enter submission URL | Field accepts input | | |
| 3 | Enter notes | Field accepts input | | |
| 4 | Submit deliverable | Success message | | |
| 5 | Verify in my submissions | Submission listed | | |

### E5: Bi-Weekly Pulse
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Find pulse check section | Emoji buttons visible | | |
| 2 | Select sentiment emoji | Selection highlighted | | |
| 3 | Enter optional feedback | Field accepts input | | |
| 4 | Submit pulse | Success message | | |

### E6: Contact Professor
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Find contact form | Subject/body fields visible | | |
| 2 | Enter subject | Field accepts input | | |
| 3 | Enter message body | Field accepts input | | |
| 4 | Submit message | Success message | | |
| 5 | **As Teacher:** Check drafts | AI draft created | | |

### E7: Student Cannot Access Instructor
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Try /instructor URL | Access denied/redirect | | |
| 2 | Try /instructor/projects | Access denied/redirect | | |

**Section E Total: ___/7 tests passed**

---

# SECTION F: TA Permissions
**Tester:** _______________
**Date:** _______________
**Login as:** ta@illinois.edu

## Test Cases

### F1: TA Can View (Should Pass)
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | View /instructor dashboard | Dashboard loads | | |
| 2 | View alerts | Alerts displayed | | |
| 3 | View teams health | Health cards shown | | |
| 4 | View drafts | Drafts displayed | | |
| 5 | View /instructor/teams | Teams roster loads | | |
| 6 | View /instructor/projects | Projects list loads | | |
| 7 | View project submissions | Submissions visible | | |

### F2: TA Cannot Create/Edit Projects (Should Fail)
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Try to create new project | 403 Forbidden or hidden | | |
| 2 | Try to edit existing project | 403 Forbidden or hidden | | |
| 3 | Try to delete project | 403 Forbidden or hidden | | |

### F3: TA Cannot Modify Weeks (Should Fail)
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Navigate to /instructor/roadmap | Page loads (view only) | | |
| 2 | Try to add new week | 403 Forbidden or hidden | | |
| 3 | Try to edit week | 403 Forbidden or hidden | | |
| 4 | Try to delete week | 403 Forbidden or hidden | | |

### F4: TA Cannot Access Admin (Should Fail)
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Check sidebar | "Admin" not visible | | |
| 2 | Try /instructor/admin URL | 403 Forbidden or redirect | | |

### F5: TA Cannot Sync (Should Fail)
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Try to click Sync button | 403 Forbidden or hidden | | |

**Section F Total: ___/5 tests passed**

---

# Test Results Summary

| Section | Tests Passed | Total Tests | Pass Rate |
|---------|-------------|-------------|-----------|
| A: Authentication | | 5 | |
| B: Teacher Dashboard | | 6 | |
| C: Project Management | | 7 | |
| D: Team Management | | 6 | |
| E: Student Features | | 7 | |
| F: TA Permissions | | 5 | |
| **TOTAL** | | **36** | |

## Issues Found

| Issue # | Section | Test Case | Description | Severity |
|---------|---------|-----------|-------------|----------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |

**Severity Levels:**
- **Critical** - System crash, data loss, security issue
- **High** - Feature broken, blocking workflow
- **Medium** - Feature partially works, workaround exists
- **Low** - Cosmetic, minor UX issue

---

## Submit Results

After completing your assigned section(s), submit results via:

**Option 1: Web Form (Recommended)**
http://localhost:8000/api/v1/test-feedback/form

**Option 2: API Endpoint**
```bash
curl -X POST http://localhost:8000/api/v1/test-feedback \
  -H "Content-Type: application/json" \
  -d '{
    "tester_name": "Your Name",
    "section": "A",
    "tests_passed": 5,
    "tests_total": 5,
    "issues": [
      {"test_case": "A1", "description": "Issue description", "severity": "medium"}
    ],
    "notes": "Additional comments"
  }'
```

**Option 3: Email**
Send completed PDF/screenshot to [instructor email]
