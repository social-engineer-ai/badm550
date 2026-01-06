# BADM 550: AI-Powered Course Operating System
## Product Requirements Document (PRD)

**Version:** 1.0
**Date:** January 6, 2026
**Author:** Prof. Ashish Khandelwal
**Status:** Ready for Development

---

## Executive Summary

BADM 550 (Business Practicum) is a project-based course where MSBA students work on real client projects. This PRD defines an AI-powered course operating system that transforms how the course is managed, enabling one instructor to effectively orchestrate 75+ students across multiple project types while providing personalized support at scale.

The system serves as the foundation for a larger experiential learning platform that will eventually support multiple courses (BADM 576, 558), multiple schools, and external company partnerships.

---

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [Project Types](#2-project-types)
3. [User Roles & Stories](#3-user-roles--stories)
4. [System Architecture](#4-system-architecture)
5. [Feature Specifications](#5-feature-specifications)
6. [Data Models](#6-data-models)
7. [AI Systems](#7-ai-systems)
8. [Week-by-Week Content Structure](#8-week-by-week-content-structure)
9. [Technical Specifications](#9-technical-specifications)
10. [Phase 1 Scope](#10-phase-1-scope)
11. [Future Enhancements](#11-future-enhancements)

---

## 1. Product Vision

### 1.1 Problem Statement

Current challenges in managing BADM 550:
- **Scale**: 75+ students across 12+ teams require personalized attention
- **Heterogeneity**: Motivated students need autonomy; struggling students need guidance
- **Communication overhead**: Email management, meeting scheduling, follow-ups consume instructor time
- **Signal detection**: Problems surface too late (team conflicts, students falling behind)
- **Grading consistency**: Difficult to fairly evaluate varying project types
- **Student experience**: Inconsistent support quality based on who asks for help

### 1.2 Solution

An AI-powered course operating system where:
- **Instructor acts as executive**: Reviews, approves, intervenes on exceptions
- **AI acts as operations manager**: Collects, summarizes, drafts, tracks, alerts
- **Students get consistent experience**: Structured support regardless of project type

### 1.3 Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Instructor hours/week on admin | 15+ | < 5 |
| Student issues detected early | ~30% | > 80% |
| Response time to student queries | 24-72 hrs | < 12 hrs |
| Student satisfaction with support | 3.89/5 | > 4.5/5 |
| Grade inflation signal | Low | Clear differentiation |

---

## 2. Project Types

BADM 550 supports three distinct project types, each with different levels of structure and AI involvement.

### 2.1 Type 1: UNSTRUCTURED (Real Client Projects)

```
Examples: Country Financial, Bosch, Celonis, Wolters Kluwer

Characteristics:
├── Vague client problem → student defines approach
├── Real data, real stakes, real client meetings
├── High ambiguity, high learning variance
├── Human grading required (no ground truth)
└── Best for: Experienced/motivated students, 2-term projects

AI Role:
├── Check-in monitoring and signal detection
├── Communication facilitation
├── Progress tracking
└── Alert generation when teams struggle
```

### 2.2 Type 2: STRUCTURED (Real Client, Guided Analysis)

```
Examples: AWG Price Gap Analysis

Characteristics:
├── Clear analytical questions, real data
├── Week-by-week scaffolded deliverables
├── Each team gets a data slice (division, time period)
├── Solution exists → auto-evaluation possible
├── Moderate ambiguity, consistent outcomes
└── Best for: Foundational learning, larger teams

AI Role:
├── All of Type 1, plus:
├── Auto-validation of submissions
├── Discrepancy detection and flagging
├── Progress tracking against milestones
└── Quick verification queries
```

### 2.3 Type 3: SIMULATED (AI Client, Full Scaffolding)

```
Examples: "RetailCo" (AWG-like simulation), future domain simulations

Characteristics:
├── AI personas act as client contacts
├── Synthetic data based on real patterns
├── Complete solution and analysis available
├── Maximum structure, guaranteed learning path
├── Auto-gradeable with Socratic guidance
└── Best for: Skill building, students needing scaffolding

AI Systems:
├── CLIENT_SIM: AI personas representing company roles
│   ├── Responds to student questions about requirements
│   ├── Gives feedback on deliverables
│   ├── Escalates to instructor when confused
│   └── Maintains consistent "company" personality
│
├── ASK_AI (Socratic Teacher):
│   ├── Never reveals solutions directly
│   ├── Asks guiding questions
│   ├── Points to relevant resources
│   ├── Nudges toward correct approach
│   └── Tracks what hints were given (for grading context)
│
└── AUTO_EVAL: Validates work against ground truth
```

### 2.4 Project Type Comparison

| Aspect | Unstructured | Structured | Simulated |
|--------|--------------|------------|-----------|
| Client | Real company | Real company | AI personas |
| Data | Real | Real (sliced) | Synthetic |
| Problem Definition | Student-driven | Instructor-defined | Pre-defined |
| Weekly Structure | Minimal | Moderate | Full scaffolding |
| Deliverable Evaluation | Human only | Auto + Human | Mostly auto |
| Guidance Available | Office hours | Check-ins + resources | ASK_AI + resources |
| Best For | Advanced students | Mixed skill levels | Skill building |

---

## 3. User Roles & Stories

### 3.1 Instructor (Professor Khandelwal)

**Role**: Executive decision-maker who reviews, approves, and intervenes on exceptions.

#### User Stories

```
COMMUNICATION
├── As instructor, I want all student messages collected and summarized 
│   so I can review 50 messages in 5 minutes instead of reading each one
│
├── As instructor, I want AI to cluster similar questions 
│   so I can answer 8 students with one response
│
├── As instructor, I want AI to draft responses for my review 
│   so I can approve/edit/send in one click
│
├── As instructor, I want to send batch emails with personalization 
│   so each student feels individually addressed
│
└── As instructor, I want follow-up tracking 
    so I never forget a promise I made to a student

MONITORING
├── As instructor, I want twice-weekly pulse checks sent automatically 
│   so I get continuous signal on student wellbeing
│
├── As instructor, I want alerts when students miss check-ins 
│   so I can intervene before problems escalate
│
├── As instructor, I want team health heatmaps 
│   so I can spot struggling teams at a glance
│
├── As instructor, I want sentiment analysis on responses 
│   so negative trends surface automatically
│
└── As instructor, I want conflict detection 
    when teammates report divergent experiences

MEETINGS
├── As instructor, I want students to request meetings through the system 
│   so all requests are tracked
│
├── As instructor, I want to approve/decline with one click 
│   and have calendar blocked automatically
│
├── As instructor, I want AI to suggest available slots 
│   based on my preferences
│
└── As instructor, I want daily agenda emails 
    summarizing my meetings and pending actions

EVALUATION
├── As instructor, I want auto-validation of structured project submissions 
│   so I only review flagged discrepancies
│
├── As instructor, I want to run quick queries against student data 
│   to verify their results
│
├── As instructor, I want AI to hypothesize causes of discrepancies 
│   so I can quickly diagnose issues
│
└── As instructor, I want clear audit trail of hints given by ASK_AI 
    so I can fairly adjust grades

DELEGATION
├── As instructor, I want to assign flagged items to TA 
│   with one click
│
├── As instructor, I want TA to handle routine queries 
│   while I focus on complex issues
│
└── As instructor, I want visibility into TA actions 
    so nothing falls through cracks
```

### 3.2 Student

**Role**: Learner working on project, needing varying levels of support.

#### User Stories

```
ORIENTATION
├── As student, I want to see my project type and team assignment 
│   clearly when I log in
│
├── As student, I want week-by-week guidance 
│   so I know what to focus on
│
├── As student, I want to download my team's data slice 
│   with clear documentation
│
└── As student, I want to understand deliverable expectations 
    before I start working

COMMUNICATION
├── As student, I want a "Contact Professor" button 
│   that guarantees my message is seen
│
├── As student, I want to request meetings (individual or team) 
│   and see available slots
│
├── As student, I want to ask "client" questions 
│   and get timely responses
│
├── As student, I want to respond to pulse checks easily 
│   (reply to email or web form)
│
└── As student, I want to report team issues confidentially 
    without fear of retaliation

LEARNING (Simulated Projects)
├── As student, I want to interact with AI client 
│   to clarify requirements
│
├── As student, I want ASK_AI to help when I'm stuck 
│   without giving away answers
│
├── As student, I want hints that guide me 
│   not solutions that do my work
│
└── As student, I want to know if I'm on the right track 
    before final submission

SUBMISSION
├── As student, I want to submit deliverables through the portal 
│   with clear confirmation
│
├── As student, I want auto-check feedback 
│   so I know if something is obviously wrong
│
├── As student, I want to resubmit if auto-check fails 
│   with guidance on what to fix
│
└── As student, I want to see my grades and feedback 
    in one place

TEAM
├── As student, I want to see my team's progress 
│   and who's doing what
│
├── As student, I want team communication tools 
│   (or integration with existing tools)
│
└── As student, I want fair evaluation 
    that reflects my individual contribution
```

### 3.3 Teaching Assistant (TA)

**Role**: Supports instructor by handling delegated tasks and routine queries.

#### User Stories

```
├── As TA, I want to see tasks assigned to me 
│   with priority and context
│
├── As TA, I want to respond to student queries 
│   with instructor-approved templates
│
├── As TA, I want to review flagged submissions 
│   and escalate if needed
│
├── As TA, I want to arrange client Q&A sessions 
│   when clustered questions warrant it
│
└── As TA, I want to track my completed actions 
    so instructor has visibility
```

---

## 4. System Architecture

### 4.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              BADM 550 SYSTEM                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                         WEB APPLICATION                                 │   │
│  │                                                                         │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │   │
│  │  │  Student    │  │ Instructor  │  │    TA       │  │   Public    │    │   │
│  │  │  Portal     │  │ Dashboard   │  │  Dashboard  │  │   Landing   │    │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                         │                                       │
│                                         ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                          API GATEWAY                                    │   │
│  │                      (FastAPI + Auth)                                   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                         │                                       │
│         ┌───────────────────────────────┼───────────────────────────────┐       │
│         │                               │                               │       │
│         ▼                               ▼                               ▼       │
│  ┌─────────────┐                 ┌─────────────┐                 ┌─────────────┐│
│  │ ORCHESTRATION│                │     AI      │                 │    DATA     ││
│  │   ENGINE    │                 │  SERVICES   │                 │   LAYER     ││
│  │             │                 │             │                 │             ││
│  │ • Email     │                 │ • CLIENT_SIM│                 │ • PostgreSQL││
│  │ • Calendar  │                 │ • ASK_AI    │                 │ • Redis     ││
│  │ • Scheduler │                 │ • AUTO_EVAL │                 │ • S3/Files  ││
│  │ • Alerts    │                 │ • Summarizer│                 │             ││
│  └─────────────┘                 └─────────────┘                 └─────────────┘│
│         │                               │                               │       │
│         └───────────────────────────────┼───────────────────────────────┘       │
│                                         │                                       │
│                                         ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                       EXTERNAL INTEGRATIONS                             │   │
│  │                                                                         │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │   │
│  │  │  Gmail API  │  │  Google     │  │   Claude    │  │   Canvas    │    │   │
│  │  │  (email)    │  │  Calendar   │  │   API       │  │   (future)  │    │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Component Details

#### 4.2.1 Web Application (Next.js 14)
```
Frontend Structure:
├── /app
│   ├── /student
│   │   ├── /dashboard          # Main student view
│   │   ├── /week/[weekNum]     # Week-by-week content
│   │   ├── /submit             # Deliverable submission
│   │   ├── /team               # Team dashboard
│   │   ├── /ask-ai             # ASK_AI interface (simulated only)
│   │   ├── /client             # CLIENT_SIM chat (simulated only)
│   │   └── /resources          # Resource library
│   │
│   ├── /instructor
│   │   ├── /dashboard          # Main instructor view
│   │   ├── /alerts             # Alert queue
│   │   ├── /drafts             # Draft approval queue
│   │   ├── /pulse              # Pulse summaries
│   │   ├── /meetings           # Meeting management
│   │   ├── /submissions        # Submission review
│   │   ├── /teams              # Team health view
│   │   ├── /queries            # Client query clusters
│   │   └── /settings           # Configuration
│   │
│   ├── /ta
│   │   ├── /dashboard          # TA task view
│   │   └── /assigned           # Assigned items
│   │
│   └── /auth                   # Authentication
│
├── /components
│   ├── /chat                   # Chat interfaces for AI
│   ├── /dashboard              # Dashboard widgets
│   ├── /forms                  # Input forms
│   └── /common                 # Shared components
│
└── /lib
    ├── /api                    # API client
    └── /utils                  # Utilities
```

#### 4.2.2 API Gateway (FastAPI)
```
Backend Structure:
├── /app
│   ├── /routers
│   │   ├── auth.py             # Authentication
│   │   ├── students.py         # Student operations
│   │   ├── teams.py            # Team management
│   │   ├── projects.py         # Project configuration
│   │   ├── weeks.py            # Week content
│   │   ├── submissions.py      # Deliverable handling
│   │   ├── checkins.py         # Pulse checks
│   │   ├── messages.py         # Communication
│   │   ├── meetings.py         # Meeting requests
│   │   ├── alerts.py           # Alert management
│   │   ├── drafts.py           # Draft queue
│   │   ├── ai_client.py        # CLIENT_SIM endpoints
│   │   ├── ai_teacher.py       # ASK_AI endpoints
│   │   └── evaluation.py       # Auto-eval endpoints
│   │
│   ├── /services
│   │   ├── email_service.py    # Gmail integration
│   │   ├── calendar_service.py # Calendar integration
│   │   ├── ai_service.py       # Claude API wrapper
│   │   ├── eval_service.py     # Auto-evaluation logic
│   │   └── scheduler_service.py# Scheduled tasks
│   │
│   ├── /models                 # SQLAlchemy models
│   ├── /schemas                # Pydantic schemas
│   └── /scripts                # Utility scripts
│
└── /alembic                    # Database migrations
```

#### 4.2.3 AI Services
```
AI Service Architecture:
├── CLIENT_SIM
│   ├── Persona definitions (YAML)
│   ├── Conversation state management
│   ├── Response generation (Claude)
│   └── Escalation logic
│
├── ASK_AI (Socratic Teacher)
│   ├── Solution knowledge base
│   ├── Hint generation logic
│   ├── Question-asking prompts
│   ├── Progress tracking
│   └── Hint audit trail
│
├── AUTO_EVAL
│   ├── Validation rule engine
│   ├── Statistical comparison
│   ├── Finding extraction (NLP)
│   ├── Discrepancy detection
│   └── Query generation
│
├── SUMMARIZER
│   ├── Email clustering
│   ├── Sentiment analysis
│   ├── Theme extraction
│   └── Digest generation
│
└── DRAFTER
    ├── Response templates
    ├── Personalization engine
    ├── Tone matching
    └── Follow-up tracking
```

---

## 5. Feature Specifications

### 5.0 Authentication & User Management

#### 5.0.1 Role Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           ROLE HIERARCHY                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  ADMIN (Platform Owner - You)                                           │   │
│  │  ─────────────────────────────                                          │   │
│  │  • Create/manage semesters                                              │   │
│  │  • Add/remove Teachers                                                  │   │
│  │  • View all data across all courses                                     │   │
│  │  • System configuration                                                 │   │
│  │  • Bulk operations                                                      │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                         │                                       │
│                                         ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  TEACHER (Instructor)                                                   │   │
│  │  ───────────────────                                                    │   │
│  │  • Manage their assigned courses/projects                               │   │
│  │  • Add/remove TAs for their courses                                     │   │
│  │  • Add/remove Students (individual or bulk CSV)                         │   │
│  │  • Assign students to teams/projects                                    │   │
│  │  • Full access to instructor dashboard                                  │   │
│  │  • Configure course settings (pulse schedule, templates, etc.)          │   │
│  │  • Grade submissions, respond to messages                               │   │
│  │  • View all student data for their courses                              │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                         │                                       │
│                                         ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  TA (Teaching Assistant)                                                │   │
│  │  ───────────────────────                                                │   │
│  │  • View assigned teams only                                             │   │
│  │  • Respond to delegated student queries                                 │   │
│  │  • Review flagged submissions (assigned by Teacher)                     │   │
│  │  • Cannot add/remove users                                              │   │
│  │  • Cannot change course settings                                        │   │
│  │  • Cannot see other TAs' assigned teams                                 │   │
│  │  • Can escalate to Teacher                                              │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                         │                                       │
│                                         ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  STUDENT                                                                │   │
│  │  ───────                                                                │   │
│  │  • View their own dashboard                                             │   │
│  │  • Access assigned project(s) only                                      │   │
│  │  • Submit deliverables                                                  │   │
│  │  • Send messages, request meetings                                      │   │
│  │  • Use ASK_AI, CLIENT_SIM (if simulated project)                        │   │
│  │  • Cannot see other teams' data                                         │   │
│  │  • Can belong to multiple projects                                      │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

#### 5.0.2 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         AUTHENTICATION FLOW                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  INITIAL SETUP (Admin creates Teacher)                                          │
│  ──────────────────────────────────────                                         │
│                                                                                 │
│  1. Admin logs in (pre-configured admin account)                                │
│  2. Admin creates Teacher account:                                              │
│     • Name, Email                                                               │
│     • Generated temporary password (shared securely)                            │
│     • Assigned courses/semesters                                                │
│  3. Teacher receives credentials via secure channel                             │
│  4. Teacher logs in → forced password change on first login                     │
│                                                                                 │
│  TEACHER ONBOARDS TA                                                            │
│  ───────────────────                                                            │
│                                                                                 │
│  1. Teacher goes to Settings → Manage TAs                                       │
│  2. Adds TA:                                                                    │
│     • Name, Email                                                               │
│     • Generated temporary password                                              │
│     • Assigned teams (can be changed later)                                     │
│  3. TA receives credentials                                                     │
│  4. TA logs in → forced password change                                         │
│                                                                                 │
│  TEACHER ONBOARDS STUDENTS                                                      │
│  ─────────────────────────                                                      │
│                                                                                 │
│  Option A: Individual Add                                                       │
│  1. Teacher goes to Students → Add Student                                      │
│  2. Enters: Name, Email, Team assignment                                        │
│  3. System generates credentials                                                │
│  4. Student receives welcome email with login info                              │
│                                                                                 │
│  Option B: Bulk CSV Upload (Recommended)                                        │
│  1. Teacher goes to Students → Bulk Import                                      │
│  2. Downloads CSV template                                                      │
│  3. Fills in student data                                                       │
│  4. Uploads CSV                                                                 │
│  5. System validates and creates accounts                                       │
│  6. All students receive welcome emails                                         │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

#### 5.0.3 Login Page

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│                         BADM 550 Learning Platform                              │
│                                                                                 │
│                    ┌─────────────────────────────────┐                          │
│                    │                                 │                          │
│                    │  📧 Email                       │                          │
│                    │  ┌───────────────────────────┐  │                          │
│                    │  │                           │  │                          │
│                    │  └───────────────────────────┘  │                          │
│                    │                                 │                          │
│                    │  🔒 Password                    │                          │
│                    │  ┌───────────────────────────┐  │                          │
│                    │  │                           │  │                          │
│                    │  └───────────────────────────┘  │                          │
│                    │                                 │                          │
│                    │  [        Sign In         ]     │                          │
│                    │                                 │                          │
│                    │  Forgot password?               │                          │
│                    │                                 │                          │
│                    └─────────────────────────────────┘                          │
│                                                                                 │
│                    First time? Check your email for                             │
│                    login credentials from your instructor.                      │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

#### 5.0.4 Admin Dashboard

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  ADMIN DASHBOARD                                                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  📊 PLATFORM OVERVIEW                                                   │   │
│  │                                                                         │   │
│  │  Semesters: 2 active    Teachers: 3    TAs: 8    Students: 245         │   │
│  │  Projects: 12           Teams: 42      Active this week: 89%           │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌────────────────────────────┐  ┌────────────────────────────┐               │
│  │  📅 SEMESTERS              │  │  👨‍🏫 TEACHERS               │               │
│  │                            │  │                            │               │
│  │  Spring 2026 (active)      │  │  Prof. Khandelwal          │               │
│  │  └── BADM 550              │  │  └── BADM 550, 576, 558    │               │
│  │  └── BADM 576              │  │                            │               │
│  │  └── BADM 558              │  │  Prof. Smith               │               │
│  │                            │  │  └── BADM 590              │               │
│  │  Fall 2025 (archived)      │  │                            │               │
│  │                            │  │  [+ Add Teacher]           │               │
│  │  [+ Add Semester]          │  │                            │               │
│  └────────────────────────────┘  └────────────────────────────┘               │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  ⚙️ SYSTEM SETTINGS                                                     │   │
│  │                                                                         │   │
│  │  [Email Configuration]  [AI API Keys]  [Storage Settings]              │   │
│  │  [Backup & Export]      [Audit Logs]   [Feature Flags]                 │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

#### 5.0.5 Teacher: User Management

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  MANAGE USERS - BADM 550 Spring 2026                                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  [TAs]  [Students]  [Teams]                                                     │
│                                                                                 │
│  ═══════════════════════════════════════════════════════════════════════════   │
│                                                                                 │
│  STUDENTS (75)                              [+ Add Student]  [📤 Bulk Import]  │
│                                                                                 │
│  Search: [_______________]  Filter by Team: [All Teams ▼]                      │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  Name              Email                    Team(s)         Status      │   │
│  │  ─────────────────────────────────────────────────────────────────────  │   │
│  │  Sarah Chen        schen@illinois.edu       AWG-3           Active ✓    │   │
│  │  John Davis        jdavis@illinois.edu      AWG-3           Active ✓    │   │
│  │  Mike Rodriguez    mrodriguez@illinois.edu  AWG-3, SIM-1    Active ✓    │   │
│  │  Emily Wang        ewang@illinois.edu       CF-1            Invited ⏳   │   │
│  │  ...                                                                    │   │
│  │                                                                         │   │
│  │  [Select All]  Selected: 0   [Remove Selected]  [Reassign Team]        │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

#### 5.0.6 Bulk CSV Import

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  BULK IMPORT STUDENTS                                                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Step 1: Download Template                                                      │
│  ─────────────────────────                                                      │
│                                                                                 │
│  [📥 Download CSV Template]                                                     │
│                                                                                 │
│  Template columns:                                                              │
│  • email (required) - Student's email address                                   │
│  • first_name (required) - Student's first name                                 │
│  • last_name (required) - Student's last name                                   │
│  • team (required) - Team name (e.g., "AWG-3")                                 │
│  • role (optional) - "member" or "lead" (default: member)                      │
│  • project_2 (optional) - Second project assignment if any                     │
│                                                                                 │
│  Example:                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ email,first_name,last_name,team,role,project_2                         │   │
│  │ schen@illinois.edu,Sarah,Chen,AWG-3,lead,                              │   │
│  │ jdavis@illinois.edu,John,Davis,AWG-3,member,                           │   │
│  │ mrodriguez@illinois.edu,Mike,Rodriguez,AWG-3,member,SIM-1              │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ─────────────────────────────────────────────────────────────────────────────  │
│                                                                                 │
│  Step 2: Upload CSV                                                             │
│  ──────────────────                                                             │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                                                                         │   │
│  │     📁 Drag and drop your CSV file here                                │   │
│  │        or [Browse Files]                                                │   │
│  │                                                                         │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ─────────────────────────────────────────────────────────────────────────────  │
│                                                                                 │
│  Step 3: Preview & Confirm                                                      │
│  ─────────────────────────                                                      │
│                                                                                 │
│  [After upload, shows preview table with validation status]                    │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  ✓ 72 students ready to import                                         │   │
│  │  ⚠ 3 warnings (duplicate emails - will skip)                           │   │
│  │  ✗ 0 errors                                                            │   │
│  │                                                                         │   │
│  │  Preview:                                                               │   │
│  │  Row  Email                   Name           Team    Status             │   │
│  │  1    schen@illinois.edu      Sarah Chen     AWG-3   ✓ Ready           │   │
│  │  2    jdavis@illinois.edu     John Davis     AWG-3   ✓ Ready           │   │
│  │  3    old@illinois.edu        Old Student    AWG-1   ⚠ Already exists  │   │
│  │  ...                                                                    │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ☑ Send welcome email with login credentials to new students                   │
│  ☐ Send "you've been added to a new project" email to existing students        │
│                                                                                 │
│  [Cancel]                                      [Import 72 Students]            │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

#### 5.0.7 Team Management

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  MANAGE TEAMS - BADM 550 Spring 2026                                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  [+ Create Team]  [📤 Bulk Create from CSV]                                    │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  PROJECT: AWG Price Gap Analysis                                        │   │
│  │  ───────────────────────────────                                        │   │
│  │                                                                         │   │
│  │  AWG-1 (4 members)     AWG-2 (4 members)     AWG-3 (4 members)         │   │
│  │  Data: KC, Q1-Q2       Data: SP, Q1-Q2       Data: OK, Q1-Q2           │   │
│  │  TA: Alex              TA: Alex              TA: Jordan                 │   │
│  │  [Edit] [View]         [Edit] [View]         [Edit] [View]             │   │
│  │                                                                         │   │
│  │  AWG-4 (4 members)     AWG-5 (3 members)     AWG-6 (4 members)         │   │
│  │  Data: GO, Q1-Q2       Data: GC, Q1-Q2       Data: NO, Q1-Q2           │   │
│  │  TA: Jordan            TA: Jordan            TA: Alex                   │   │
│  │  [Edit] [View]         [Edit] [View]         [Edit] [View]             │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  PROJECT: RetailCo Simulation                                           │   │
│  │  ────────────────────────────                                           │   │
│  │                                                                         │   │
│  │  SIM-1 (4 members)     SIM-2 (4 members)                               │   │
│  │  TA: Morgan            TA: Morgan                                       │   │
│  │  [Edit] [View]         [Edit] [View]                                   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  PROJECT: Country Financial (Unstructured)                              │   │
│  │  ─────────────────────────────────────────                              │   │
│  │                                                                         │   │
│  │  CF-1 (5 members)                                                       │   │
│  │  TA: Alex                                                               │   │
│  │  [Edit] [View]                                                          │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

#### 5.0.8 Edit Team Modal

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  EDIT TEAM: AWG-3                                                    [✕ Close] │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Team Name: [AWG-3___________]                                                  │
│                                                                                 │
│  Project: AWG Price Gap Analysis (cannot change)                               │
│                                                                                 │
│  Data Slice Configuration:                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  Division: [OK ▼]                                                       │   │
│  │  Quarters: ☑ Q1  ☑ Q2  ☐ Q3  ☐ Q4                                      │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  Assigned TA: [Jordan ▼]                                                        │
│                                                                                 │
│  Team Members:                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  👤 Sarah Chen (schen@illinois.edu)           [Lead ▼]    [Remove]     │   │
│  │  👤 John Davis (jdavis@illinois.edu)          [Member ▼]  [Remove]     │   │
│  │  👤 Mike Rodriguez (mrodriguez@illinois.edu)  [Member ▼]  [Remove]     │   │
│  │  👤 Lisa Park (lpark@illinois.edu)            [Member ▼]  [Remove]     │   │
│  │                                                                         │   │
│  │  [+ Add Member]                                                         │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  [Cancel]                                              [Save Changes]          │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

#### 5.0.9 Permission Matrix

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           PERMISSION MATRIX                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Action                          Admin   Teacher   TA      Student              │
│  ─────────────────────────────────────────────────────────────────────────────  │
│                                                                                 │
│  USER MANAGEMENT                                                                │
│  Create/edit semesters            ✓       ✗        ✗       ✗                   │
│  Add/remove teachers              ✓       ✗        ✗       ✗                   │
│  Add/remove TAs                   ✓       ✓        ✗       ✗                   │
│  Add/remove students              ✓       ✓        ✗       ✗                   │
│  Bulk import students             ✓       ✓        ✗       ✗                   │
│  Assign students to teams         ✓       ✓        ✗       ✗                   │
│  Assign TAs to teams              ✓       ✓        ✗       ✗                   │
│                                                                                 │
│  PROJECT MANAGEMENT                                                             │
│  Create/edit projects             ✓       ✓        ✗       ✗                   │
│  Configure week content           ✓       ✓        ✗       ✗                   │
│  Upload solution files            ✓       ✓        ✗       ✗                   │
│  Configure auto-eval rules        ✓       ✓        ✗       ✗                   │
│                                                                                 │
│  COMMUNICATION                                                                  │
│  View all messages                ✓       ✓        ◐*      ✗                   │
│  Respond to messages              ✓       ✓        ◐*      ✗                   │
│  Send announcements               ✓       ✓        ✗       ✗                   │
│  Configure pulse checks           ✓       ✓        ✗       ✗                   │
│  View pulse responses             ✓       ✓        ◐*      ✗                   │
│                                                                                 │
│  SUBMISSIONS                                                                    │
│  View all submissions             ✓       ✓        ◐*      ✗                   │
│  Grade submissions                ✓       ✓        ◐*      ✗                   │
│  Run verification queries         ✓       ✓        ✓       ✗                   │
│  Submit deliverables              ✗       ✗        ✗       ✓                   │
│                                                                                 │
│  ALERTS & FRUSTRATION                                                           │
│  View all alerts                  ✓       ✓        ◐*      ✗                   │
│  Assign tasks to TA               ✓       ✓        ✗       ✗                   │
│  View frustration reports         ✓       ✓        ✗       ✗                   │
│  Submit frustration reports       ✗       ✗        ✗       ✓                   │
│                                                                                 │
│  AI FEATURES                                                                    │
│  Use CLIENT_SIM                   ✗       ✗        ✗       ✓                   │
│  Use ASK_AI                       ✗       ✗        ✗       ✓                   │
│  View AI conversation logs        ✓       ✓        ◐*      ✗                   │
│  Configure AI personas            ✓       ✓        ✗       ✗                   │
│                                                                                 │
│  ANALYTICS                                                                      │
│  View platform-wide analytics     ✓       ✗        ✗       ✗                   │
│  View course analytics            ✓       ✓        ✗       ✗                   │
│  View team analytics              ✓       ✓        ◐*      ✗                   │
│  View own progress                ✗       ✗        ✗       ✓                   │
│                                                                                 │
│  ◐* = Only for assigned teams                                                   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

#### 5.0.10 Welcome Email Template

```
Subject: Welcome to BADM 550 - Your Login Credentials

─────────────────────────────────────────────────────────────────

Hi {first_name},

Welcome to BADM 550: Business Practicum for Spring 2026!

You've been assigned to:
• Project: {project_name}
• Team: {team_name}
• Teammates: {teammate_names}

YOUR LOGIN CREDENTIALS
──────────────────────
Platform: https://badm550.example.com
Email: {email}
Temporary Password: {temp_password}

⚠️ You'll be asked to change your password on first login.

GETTING STARTED
───────────────
1. Log in and change your password
2. Review Week 1 content
3. Meet your teammates
4. Check your team's data slice

Questions? Use the "Contact Professor" button in the platform.

Looking forward to a great semester!

Prof. Khandelwal

─────────────────────────────────────────────────────────────────
```

#### 5.1.1 Dashboard
```
┌─────────────────────────────────────────────────────────────────┐
│  STUDENT DASHBOARD                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Welcome, [Student Name]!                                       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  YOUR PROJECT                                            │   │
│  │                                                          │   │
│  │  Project: AWG Price Gap Analysis                         │   │
│  │  Type: Structured                                        │   │
│  │  Team: AWG-Team-3 (4 members)                           │   │
│  │  Data Slice: KC Division, Q1-Q2 2025                    │   │
│  │  Current Week: 4 of 14                                  │   │
│  │                                                          │   │
│  │  [View Week 4 →]                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  QUICK ACTIONS                                           │   │
│  │                                                          │   │
│  │  [📧 Contact Professor]  [📅 Request Meeting]           │   │
│  │  [❓ Ask Client]         [🤖 ASK_AI] (if simulated)     │   │
│  │  [📤 Submit Deliverable] [👥 Team Dashboard]            │   │
│  │                                                          │   │
│  │  [😤 Share Frustration] ← Private, no judgment          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  UPCOMING                                                │   │
│  │                                                          │   │
│  │  📅 Week 4 Deliverable due: Friday, Jan 24, 5pm         │   │
│  │  📊 Pulse check: Tuesday, Jan 21 (respond by Wed)       │   │
│  │  📞 Team meeting with Prof: Thursday, Jan 23, 2pm       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  RECENT ACTIVITY                                         │   │
│  │                                                          │   │
│  │  ✅ Pulse check submitted (Tuesday)                      │   │
│  │  📧 Message from Prof: "Great question about..."        │   │
│  │  📤 Week 3 deliverable: Passed auto-check               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 5.1.2 Week Content Page
```
Route: /student/week/[weekNum]

Content Structure:
├── Week Title & Overview
│   └── "Week 4: Baseline Price Gap Calculation"
│
├── Learning Objectives
│   ├── Objective 1
│   ├── Objective 2
│   └── Objective 3
│
├── Agenda (numbered steps)
│   ├── Step 1: Description + expected output
│   ├── Step 2: Description + expected output
│   └── Step N: Description + expected output
│
├── Your Data
│   ├── Data slice description
│   ├── Download link
│   └── Data dictionary link
│
├── Resources
│   ├── Relevant documentation
│   ├── Example code snippets
│   └── Past examples (sanitized)
│
├── Deliverable
│   ├── What to submit
│   ├── Format requirements
│   ├── Auto-check criteria (transparent)
│   └── [Submit] button
│
└── Need Help?
    ├── [ASK_AI] - Get guided help
    ├── [Ask Client] - Clarify requirements
    └── [Contact Professor] - Escalate issues
```

#### 5.1.3 Contact Professor
```
Trigger: Button click on any page

Modal/Form:
├── Subject (dropdown + custom)
│   ├── Question about project
│   ├── Request feedback
│   ├── Team issue (confidential)
│   ├── Personal matter
│   └── Other
│
├── Message (text area)
│   └── Placeholder: "Describe your question or concern..."
│
├── Urgency (optional)
│   ├── Normal (24-48 hr response)
│   ├── Urgent (same day)
│   └── Can wait until next office hours
│
└── [Send]

Backend Flow:
1. Store message in database
2. Send email to instructor immediately
3. Add to instructor's message queue
4. Create follow-up tracker
5. Confirm to student: "Message sent! Expected response: [time]"
```

#### 5.1.4 Request Meeting
```
Form:
├── Meeting Type
│   ├── Individual (just me)
│   └── Team (whole team attends)
│
├── Topic (brief description)
│
├── Duration preference
│   ├── 15 minutes
│   ├── 30 minutes
│   └── 45 minutes
│
├── Preferred times (select from available slots)
│   └── Shows instructor's available slots
│
└── [Request Meeting]

Backend Flow:
1. Store request in database
2. Notify instructor (added to meeting queue)
3. When approved:
   a. Block instructor's calendar
   b. Send confirmation to student(s)
   c. Generate ICS file if needed
4. Send reminders (24hr, 1hr before)
```

#### 5.1.5 Ask Client (Structured/Simulated Projects)
```
For Structured (Real Client):
├── Form similar to Contact Professor
├── Routed to instructor as "Client Query"
├── Instructor answers directly or delegates
└── Response tracked and delivered

For Simulated (AI Client):
├── Chat interface with CLIENT_SIM
├── AI persona responds in character
├── Conversation logged for grading context
├── Escalation to instructor if AI uncertain
└── See Section 7.1 for AI details
```

#### 5.1.6 ASK_AI (Simulated Projects Only)
```
Interface:
├── Chat-style conversation
├── Student asks questions about approach
├── AI responds Socratically (see Section 7.2)
├── Hints logged and visible to instructor
└── Rate-limited to prevent over-reliance

Example Interaction:
┌─────────────────────────────────────────────────────────────┐
│  ASK_AI - Your Socratic Guide                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Student: "I'm not sure how to calculate the price gap.    │
│  Should I use BSP or SRP?"                                  │
│                                                             │
│  ASK_AI: "Good question! Let's think about this:            │
│                                                             │
│  • BSP is the price stores pay AWG                         │
│  • SRP is what consumers pay at the store                  │
│                                                             │
│  Who is AWG trying to help with their pricing strategy -   │
│  the store owners or the end consumers? And which price    │
│  would matter most for that audience?                      │
│                                                             │
│  Also, look back at the project brief - does it ask for    │
│  one specific gap or both?"                                │
│                                                             │
│  [Type your response...]                                   │
└─────────────────────────────────────────────────────────────┘
```

#### 5.1.7 Submit Deliverable
```
Form:
├── Week/Milestone selection
├── File upload (CSV, XLSX, PDF, ZIP)
├── Findings summary (text or file)
├── Self-assessment (optional)
│   └── "How confident are you in this submission? 1-5"
└── [Submit for Auto-Check]

Auto-Check Flow:
1. Validate file format
2. Run validation rules (row count, columns, etc.)
3. Compare against solution (within tolerance)
4. Extract findings and compare to expected
5. Return immediate feedback:
   ├── ✅ All checks passed
   ├── ⚠️ Warnings (minor discrepancies)
   └── ❌ Errors (needs attention)
6. If errors: Allow resubmission with guidance
7. Flag for instructor review if discrepancies
```

### 5.2 Instructor Dashboard

#### 5.2.1 Main Dashboard
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  INSTRUCTOR DASHBOARD - BADM 550 Spring 2026                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Quick Stats:  75 students | 12 teams | Week 4 of 14 | 3 alerts                │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  🚨 ALERTS (3)                                              [View All]  │   │
│  │  • Team AWG-7: 2 members no response in 6 days                         │   │
│  │  • Submission discrepancy: Team AWG-3 row count                        │   │
│  │  • Confidential: Team conflict reported                                │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌────────────────────────────┐  ┌────────────────────────────┐               │
│  │  📬 DRAFT QUEUE (12)       │  │  📅 TODAY'S MEETINGS (3)   │               │
│  │  [Review & Send →]         │  │  • 2:00pm - Team AWG-2     │               │
│  │                            │  │  • 3:30pm - Sarah Chen     │               │
│  │  8 similar questions       │  │  • 4:00pm - Office Hours   │               │
│  │  4 meeting confirmations   │  │                            │               │
│  └────────────────────────────┘  └────────────────────────────┘               │
│                                                                                 │
│  ┌────────────────────────────┐  ┌────────────────────────────┐               │
│  │  📊 PULSE SUMMARY          │  │  ✅ SUBMISSIONS            │               │
│  │  Tuesday check-in          │  │  Week 4 Deliverable        │               │
│  │                            │  │                            │               │
│  │  Response: 68/75 (91%)     │  │  Submitted: 8/12 teams     │               │
│  │  😊 77%  😐 18%  😟 6%      │  │  Auto-pass: 6/8            │               │
│  │                            │  │  Flagged: 2/8              │               │
│  │  [View Details →]          │  │  [Review Flagged →]        │               │
│  └────────────────────────────┘  └────────────────────────────┘               │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  📈 TEAM HEALTH                                                         │   │
│  │                                                                         │   │
│  │  AWG-1 🟢  AWG-2 🟢  AWG-3 🟡  AWG-4 🟢  AWG-5 🟡  AWG-6 🟢           │   │
│  │  AWG-7 🔴  AWG-8 🟢  AWG-9 🟡  SIM-1 🟢  SIM-2 🟢  CF-1 🟢            │   │
│  │                                                                         │   │
│  │  🟢 On track (8)  🟡 Needs attention (3)  🔴 Struggling (1)            │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  😤 FRUSTRATION REPORTS (2 new)                            [View All]   │   │
│  │                                                                         │   │
│  │  🔴 Sarah C. (AWG-3) - Team + Project - "affecting me" - 2hrs ago      │   │
│  │  🟡 Anonymous - Course workload - "response appreciated" - yesterday   │   │
│  │                                                                         │   │
│  │  [Review Reports]                                                       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  📊 ISSUE ANALYTICS (Semester)          [Full Report]                   │   │
│  │                                                                         │   │
│  │  Top Email Issues:          Frustration Sources:                        │   │
│  │  1. requirements_unclear    TEAM:    ████████ 47%                       │   │
│  │  2. data_incomplete         PROJECT: ████ 24%                           │   │
│  │  3. contribution_imbalance  CLIENT:  ██ 12%                             │   │
│  │                             COURSE:  ██ 12%                             │   │
│  │  Peak: Week 4               SUPPORT: █ 6%                               │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

#### 5.2.2 Alert Queue
```
Route: /instructor/alerts

Alert Types:
├── Non-response (pulse check missed)
├── Submission discrepancy
├── Sentiment flag (negative pulse)
├── Team conflict report
├── Divergent teammate reports
├── ASK_AI escalation
├── CLIENT_SIM confusion
└── Meeting no-show

Alert Card:
┌─────────────────────────────────────────────────────────────┐
│  ⚠️ SUBMISSION DISCREPANCY                    Priority: Med │
├─────────────────────────────────────────────────────────────┤
│  Team: AWG-3                                                │
│  Issue: Row count mismatch                                  │
│  Expected: 847 | Submitted: 721 | Diff: -15%               │
│                                                             │
│  AI Hypothesis: "Team may have filtered products without   │
│  national brand equivalents. Pattern suggests WHERE clause │
│  excluded NULLs."                                          │
│                                                             │
│  Quick Actions:                                             │
│  [Run Verify Query] [View Submission] [View Solution]      │
│  [Assign to TA] [Mark Resolved] [Contact Team]             │
└─────────────────────────────────────────────────────────────┘
```

#### 5.2.3 Draft Queue
```
Route: /instructor/drafts

Features:
├── Grouped by type (responses, meeting confirms, announcements)
├── Similar messages clustered
├── One-click approve
├── Edit before sending
├── Discard with reason
├── Individualize (split cluster into separate)
├── Batch approve all

Draft Card:
┌─────────────────────────────────────────────────────────────┐
│  📧 RESPONSE: Data Format Question              Cluster: 8  │
├─────────────────────────────────────────────────────────────┤
│  To: 8 students (click to see list)                         │
│  Re: Q2 data column question                                │
│                                                             │
│  "Hi [Name],                                                │
│                                                             │
│  Great question! The Q2 data uses the same column          │
│  structure as Q1. The 'BSP_Q2' column contains April       │
│  pricing. The column naming convention is:                  │
│  [METRIC]_Q[QUARTER] (e.g., BSP_Q1, SRP_Q2).               │
│                                                             │
│  Let me know if you have other questions!                   │
│                                                             │
│  Best,                                                      │
│  Prof. K"                                                   │
│                                                             │
│  [✓ Approve All] [✏️ Edit] [👤 Individualize] [🗑️ Discard] │
└─────────────────────────────────────────────────────────────┘
```

#### 5.2.4 Pulse Summary
```
Route: /instructor/pulse

View:
├── Response rate chart (over time)
├── Sentiment distribution
├── Word cloud of common themes
├── Flagged responses (expandable)
├── Non-responders list
├── Compare to previous weeks
└── Drill-down to individual responses

Actions:
├── [Draft Announcement] - based on common themes
├── [Send Reminder] - to non-responders
├── [Contact Flagged] - batch draft to concerning responses
└── [Schedule Office Hours] - if many need help
```

#### 5.2.5 Meeting Management
```
Route: /instructor/meetings

Views:
├── Pending requests (approve/decline)
├── Today's schedule
├── This week calendar
├── Past meetings log

Pending Request Card:
┌─────────────────────────────────────────────────────────────┐
│  📅 MEETING REQUEST                                         │
├─────────────────────────────────────────────────────────────┤
│  From: Team AWG-2 (4 members)                               │
│  Topic: "Mid-project direction check"                       │
│  Duration: 30 minutes                                       │
│  Requested: Jan 20, 2026                                    │
│                                                             │
│  Available Slots:                                           │
│  [Approve: Tue 3pm] [Approve: Thu 11am]                    │
│  [Decline with message] [Delegate to TA]                   │
│  [Suggest Office Hours]                                     │
└─────────────────────────────────────────────────────────────┘
```

#### 5.2.6 Submission Review
```
Route: /instructor/submissions

Features:
├── Filter by: Week, Team, Status (passed/flagged/pending)
├── Bulk actions (approve all passed)
├── Drill-down to individual submission
├── Side-by-side comparison with solution
├── Query tool for verification
├── Grade assignment

Flagged Submission View:
┌─────────────────────────────────────────────────────────────┐
│  Team AWG-3 - Week 4 Submission                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Auto-Check Results:                                        │
│  ✅ File format: Valid CSV                                  │
│  ✅ Required columns: All present                           │
│  ⚠️ Row count: 721 (expected 847, -15%)                    │
│  ✅ BSP gap mean: 0.183 (expected 0.187, within tolerance) │
│  ⚠️ Products below target: 98 (expected 156)               │
│                                                             │
│  AI Hypothesis:                                             │
│  "The 126 missing rows likely correspond to products       │
│  without national brand equivalents. Student may have      │
│  used: WHERE national_brand_id IS NOT NULL instead of      │
│  including them with gap = NULL or gap = N/A."             │
│                                                             │
│  Verification Query:                                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ SELECT COUNT(*) FROM solution                       │   │
│  │ WHERE national_brand_id IS NOT NULL;                │   │
│  │ -- Result: 721 ✓ (matches student submission)       │   │
│  └─────────────────────────────────────────────────────┘   │
│  [Run Query] [View Student Code] [View Full Submission]    │
│                                                             │
│  Actions:                                                   │
│  [✅ Approve (minor issue)] [📧 Request Revision]          │
│  [👤 Assign to TA] [📝 Add Feedback]                       │
│                                                             │
│  Grade: [___] / 100   Feedback: [________________]         │
│  [Save & Next]                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 5.2.7 Client Query Clusters
```
Route: /instructor/queries

Features:
├── Clustered by topic
├── Answerable in bulk
├── Track which students received answer
├── Option to schedule Q&A session

Cluster Card:
┌─────────────────────────────────────────────────────────────┐
│  ❓ CLIENT QUERY CLUSTER: "Always Save positioning"        │
├─────────────────────────────────────────────────────────────┤
│  Students asking (6):                                       │
│  Sarah C., Mike R., Team AWG-5 (3), John D.                │
│                                                             │
│  Sample questions:                                          │
│  • "What exactly is Always Save's market positioning?"     │
│  • "How does Always Save differ from Best Choice?"         │
│  • "Is Always Save supposed to be cheaper than BC?"        │
│                                                             │
│  Suggested response:                                        │
│  "Always Save is AWG's 'opening price point' brand -       │
│  the lowest price option in each category. Best Choice     │
│  is the 'comparable quality, better price' brand that      │
│  competes with national brands. For your analysis..."      │
│                                                             │
│  [Answer All (edit)] [Schedule Q&A Session]                │
│  [Assign to TA] [Forward to Actual Client]                 │
└─────────────────────────────────────────────────────────────┘
```

#### 5.2.8 Settings
```
Route: /instructor/settings

Sections:
├── Pulse Check Schedule
│   ├── Frequency (2x/week, weekly, custom)
│   ├── Days and times
│   ├── Question templates
│   └── Reminder settings
│
├── Auto-Response Rules
│   ├── Out-of-office message
│   ├── FAQ auto-responses
│   └── Escalation thresholds
│
├── Calendar Integration
│   ├── Available slots definition
│   ├── Buffer between meetings
│   ├── Calendar sync (Google/ICS)
│   └── Booking limits per day
│
├── TA Permissions
│   ├── Which TAs for which teams
│   ├── What they can approve
│   └── Escalation rules
│
├── Email Templates
│   ├── Pulse check templates
│   ├── Reminder templates
│   ├── Announcement templates
│   └── Response templates
│
└── Evaluation Settings
    ├── Auto-check tolerances
    ├── Grading weights
    └── Late submission policy
```

### 5.3 TA Dashboard

```
Route: /ta/dashboard

Features:
├── Assigned tasks queue
├── Student query responses (with templates)
├── Submission review (flagged items)
├── Meeting scheduling assistance
├── Escalation to instructor
└── Activity log

Task Card:
┌─────────────────────────────────────────────────────────────┐
│  📋 ASSIGNED TASK                         From: Prof. K     │
├─────────────────────────────────────────────────────────────┤
│  Type: Review flagged submission                            │
│  Team: AWG-3                                                │
│  Issue: Row count mismatch                                  │
│  Instructions: "Verify if they filtered NULLs correctly.   │
│  If intentional, approve with note. If error, send         │
│  revision request."                                         │
│                                                             │
│  [Start Review] [Ask Instructor] [Mark Complete]           │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Data Models

### 6.1 Core Entities

```python
# Authentication & Users
class User:
    id: UUID
    email: str (unique)
    password_hash: str
    first_name: str
    last_name: str
    role: Enum['admin', 'teacher', 'ta', 'student']
    is_active: bool
    must_change_password: bool  # True on first login
    last_login: datetime (nullable)
    created_at: datetime
    created_by: UUID (FK, nullable)  # Who created this user
    
class AdminProfile:
    id: UUID
    user_id: UUID (FK)
    # Admin has access to everything, no additional config needed

class TeacherProfile:
    id: UUID
    user_id: UUID (FK)
    assigned_semesters: JSON  # List of semester IDs they can manage
    
class TAProfile:
    id: UUID
    user_id: UUID (FK)
    teacher_id: UUID (FK)  # Which teacher they report to
    assigned_teams: JSON  # List of team IDs they can see
    
class StudentProfile:
    id: UUID
    user_id: UUID (FK)
    canvas_id: str (optional)  # For future Canvas integration

# Course Structure
class Semester:
    id: UUID
    name: str  # "Spring 2026"
    start_date: date
    end_date: date
    is_active: bool
    created_by: UUID (FK)
    created_at: datetime
    
class Project:
    id: UUID
    semester_id: UUID (FK)
    name: str  # "AWG Price Gap Analysis"
    type: Enum['unstructured', 'structured', 'simulated']
    client_name: str
    description: text
    data_config: JSON  # How to slice data for teams
    created_by: UUID (FK)
    created_at: datetime
    
class Team:
    id: UUID
    project_id: UUID (FK)
    name: str  # "AWG-Team-3"
    data_slice: JSON  # {"division": "KC", "quarters": ["Q1", "Q2"]}
    assigned_ta: UUID (FK, nullable)  # TA responsible for this team
    health_status: Enum['green', 'yellow', 'red']
    created_at: datetime
    
class TeamMembership:
    id: UUID
    student_id: UUID (FK)  # Links to StudentProfile
    team_id: UUID (FK)
    role: Enum['member', 'lead']
    joined_at: datetime
    # Note: A student can have multiple TeamMemberships (multiple projects)

# Week Structure
class Week:
    id: UUID
    project_id: UUID (FK)
    week_number: int
    title: str
    overview: text
    objectives: JSON  # List of objectives
    agenda: JSON  # List of steps
    resources: JSON  # Links and files
    deliverable_spec: JSON  # What to submit
    solution_file: str  # Path to solution
    validation_rules: JSON  # Auto-check rules
    expected_findings: JSON  # For AI comparison
    due_date: datetime

# Communication
class Message:
    id: UUID
    sender_id: UUID (FK)
    recipient_type: Enum['instructor', 'ta', 'client']
    subject: str
    body: text
    urgency: Enum['normal', 'urgent', 'low']
    category: Enum['question', 'meeting_request', 'team_issue', 'client_query', 'other']
    status: Enum['pending', 'read', 'responded', 'closed']
    created_at: datetime
    responded_at: datetime (nullable)
    
class MessageCluster:
    id: UUID
    messages: List[UUID]  # FK to Message
    topic: str
    draft_response: text
    status: Enum['pending', 'approved', 'sent']

class Draft:
    id: UUID
    type: Enum['response', 'meeting_confirm', 'announcement', 'reminder']
    recipients: JSON  # List of student IDs or "all"
    subject: str
    body: text
    personalization: JSON  # Fields to personalize
    status: Enum['pending', 'approved', 'sent', 'discarded']
    created_at: datetime
    sent_at: datetime (nullable)

# Meetings
class MeetingRequest:
    id: UUID
    requester_id: UUID (FK)
    request_type: Enum['individual', 'team']
    team_id: UUID (FK, nullable)
    topic: str
    duration_minutes: int
    preferred_slots: JSON  # List of datetime options
    status: Enum['pending', 'approved', 'declined', 'completed']
    scheduled_at: datetime (nullable)
    
class Meeting:
    id: UUID
    request_id: UUID (FK)
    scheduled_at: datetime
    duration_minutes: int
    attendees: JSON  # List of student IDs
    notes: text (nullable)
    status: Enum['scheduled', 'completed', 'cancelled', 'no_show']

# Check-ins
class PulseCheck:
    id: UUID
    semester_id: UUID (FK)
    type: Enum['tuesday', 'friday', 'custom']
    sent_at: datetime
    questions: JSON
    
class PulseResponse:
    id: UUID
    pulse_check_id: UUID (FK)
    student_id: UUID (FK)
    responses: JSON  # Answers to questions
    sentiment_score: float  # -1 to 1
    flags: JSON  # Keywords/issues detected
    responded_at: datetime

# Submissions
class Submission:
    id: UUID
    team_id: UUID (FK)
    week_id: UUID (FK)
    submitted_by: UUID (FK)
    file_path: str
    findings_text: text
    auto_check_results: JSON
    auto_check_status: Enum['passed', 'flagged', 'failed']
    ai_hypothesis: text (nullable)
    grade: float (nullable)
    feedback: text (nullable)
    graded_by: UUID (FK, nullable)
    submitted_at: datetime
    graded_at: datetime (nullable)

# Alerts
class Alert:
    id: UUID
    type: Enum['non_response', 'submission_issue', 'sentiment', 'conflict', 'escalation']
    priority: Enum['low', 'medium', 'high', 'critical']
    related_entity_type: str  # 'student', 'team', 'submission'
    related_entity_id: UUID
    title: str
    description: text
    ai_suggestion: text (nullable)
    status: Enum['new', 'viewed', 'actioned', 'resolved', 'dismissed']
    assigned_to: UUID (FK, nullable)  # TA assignment
    created_at: datetime
    resolved_at: datetime (nullable)

# AI Interactions (Simulated Projects)
class ClientSimConversation:
    id: UUID
    student_id: UUID (FK)
    project_id: UUID (FK)
    messages: JSON  # List of {role, content, timestamp}
    escalated: bool
    created_at: datetime
    updated_at: datetime

class AskAIConversation:
    id: UUID
    student_id: UUID (FK)
    week_id: UUID (FK)
    messages: JSON  # List of {role, content, timestamp}
    hints_given: JSON  # List of hint types/content for grading
    created_at: datetime
    updated_at: datetime

# Email Classification
class EmailClassification:
    id: UUID
    message_id: UUID (FK)
    message_types: JSON  # List of types: question, concern, frustration, etc.
    project_context: JSON  # {project_name, week_number, deliverable}
    issue_categories: JSON  # List: data_incomplete, requirements_unclear, etc.
    urgency_detected: Enum['low', 'medium', 'high', 'critical']
    sentiment_score: float  # -1 to 1
    entities_mentioned: JSON  # {teammates: [], ta: str, client: str, tools: []}
    ai_summary: text
    classified_at: datetime

# Frustration Reports
class FrustrationReport:
    id: UUID
    student_id: UUID (FK, nullable)  # Null if anonymous
    is_anonymous: bool
    frustration_areas: JSON  # {project: [], team: [], client: [], course: [], support: []}
    message: text (nullable)
    urgency: Enum['venting', 'response_appreciated', 'talk_soon', 'affecting_me']
    status: Enum['new', 'acknowledged', 'in_progress', 'resolved']
    instructor_notes: text (nullable)
    created_at: datetime
    acknowledged_at: datetime (nullable)
    resolved_at: datetime (nullable)

# Follow-up Tracking
class FollowUp:
    id: UUID
    related_message_id: UUID (FK, nullable)
    related_meeting_id: UUID (FK, nullable)
    promise: text  # What was promised
    due_date: date
    status: Enum['pending', 'completed', 'overdue']
    completed_at: datetime (nullable)
```

### 6.2 Configuration Data

```yaml
# config/projects/awg_spring2026.yaml
project:
  name: "AWG Price Gap Analysis"
  type: "structured"
  client: "Associated Wholesale Grocers"
  
  data_slicing:
    strategy: "by_division_and_quarter"
    slices:
      - name: "KC_Q1Q2"
        division: "KC"
        quarters: ["Q1", "Q2"]
      - name: "SP_Q1Q2"
        division: "SP"
        quarters: ["Q1", "Q2"]
      # ... more slices
      
  weeks:
    - week: 1
      title: "Project Kickoff & Data Exploration"
      # ... full week config
    - week: 2
      title: "Data Cleaning & Validation"
      # ...

# config/projects/retailco_sim.yaml
project:
  name: "RetailCo Pricing Optimization"
  type: "simulated"
  client: "RetailCo (Simulated)"
  
  client_sim:
    personas:
      - name: "Jennifer Walsh"
        role: "VP of Merchandising"
        personality: "Results-oriented, data-driven"
        knowledge_areas: ["pricing strategy", "brand positioning"]
        
      - name: "Marcus Chen"
        role: "Category Manager"
        personality: "Detail-oriented, cautious"
        knowledge_areas: ["product data", "competitive analysis"]
        
  ask_ai:
    solution_path: "solutions/retailco/"
    hint_strategy: "socratic"
    max_hints_per_week: 5
```

---

## 7. AI Systems

### 7.1 CLIENT_SIM (Simulated Client Personas)

#### Purpose
Provides realistic client interactions for students on simulated projects, allowing them to ask questions about requirements, get feedback on approaches, and experience client communication without real client availability constraints.

#### Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT_SIM                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐                                        │
│  │ PERSONA CONFIG  │ ← YAML definitions                     │
│  │                 │   - Name, role, personality            │
│  │                 │   - Knowledge areas                    │
│  │                 │   - Communication style                │
│  └────────┬────────┘                                        │
│           │                                                 │
│           ▼                                                 │
│  ┌─────────────────┐                                        │
│  │ CONTEXT BUILDER │                                        │
│  │                 │ ← Project description                  │
│  │                 │ ← Data documentation                   │
│  │                 │ ← Conversation history                 │
│  │                 │ ← Student's current week               │
│  └────────┬────────┘                                        │
│           │                                                 │
│           ▼                                                 │
│  ┌─────────────────┐                                        │
│  │ CLAUDE API      │                                        │
│  │                 │ → Generate response in persona         │
│  │                 │ → Detect confusion/escalation          │
│  │                 │ → Log interaction                      │
│  └────────┬────────┘                                        │
│           │                                                 │
│           ▼                                                 │
│  ┌─────────────────┐                                        │
│  │ RESPONSE        │                                        │
│  │ PROCESSOR       │ → Format for chat display              │
│  │                 │ → Check for escalation triggers        │
│  │                 │ → Update conversation state            │
│  └─────────────────┘                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### System Prompt Template
```
You are {persona_name}, {persona_role} at {company_name}.

PERSONALITY:
{personality_description}

YOUR KNOWLEDGE:
- You know the company's business context: {business_context}
- You know the project goals: {project_goals}
- You know about: {knowledge_areas}
- You DO NOT know: specific analytical methods students should use

COMMUNICATION STYLE:
- {communication_style}
- Be realistic - sometimes you're busy and give brief answers
- Sometimes ask clarifying questions back
- Express preferences and constraints like a real client would

CURRENT CONTEXT:
- The student is in Week {week_number}: {week_title}
- They should be working on: {week_objectives}
- Their team is: {team_name}

BOUNDARIES:
- DO answer questions about business requirements, data meaning, priorities
- DO give feedback on proposed approaches (from business perspective)
- DO express preferences ("I'd like to see X broken down by Y")
- DO NOT tell them how to do technical analysis
- DO NOT give them the solution
- If you're unsure or the question is too technical, say "That's a good question 
  for Prof. Khandelwal" and flag for escalation

ESCALATION:
If the student seems very confused, frustrated, or is asking questions you 
can't answer, respond helpfully but add [ESCALATE] at the end of your message.
```

#### Example Interaction
```
Student: "Hi Jennifer, I'm trying to understand the pricing data. What's the 
difference between BSP and SRP? And which one matters more for your analysis?"

Jennifer (CLIENT_SIM): "Great question! BSP is what our member stores pay us - 
think of it as the wholesale price. SRP is what we suggest they charge 
consumers - the shelf price.

For this project, both matter but in different ways. The BSP gap tells us if 
we're giving stores a good enough margin to want to carry our brands. The SRP 
gap tells us if consumers see value compared to national brands.

I'd actually love to see both in your analysis - can you show me how the gaps 
compare? Sometimes we have a great BSP gap but lose at the shelf, or vice versa.

What specific categories are you looking at?"
```

#### Escalation Flow
```
1. AI detects confusion/frustration/out-of-scope question
2. Response includes [ESCALATE] tag
3. System creates Alert for instructor
4. Alert includes: conversation context, student, question
5. Instructor can: respond directly, arrange meeting, or provide guidance to AI
```

### 7.2 ASK_AI (Socratic Teacher)

#### Purpose
Provides guided help for students on simulated projects, using Socratic questioning to nudge students toward solutions without revealing answers directly.

#### Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                        ASK_AI                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐                                        │
│  │ SOLUTION        │ ← Pre-loaded for each week             │
│  │ KNOWLEDGE BASE  │   - Correct approach                   │
│  │                 │   - Common mistakes                    │
│  │                 │   - Key insights to discover           │
│  │                 │   - Hint progression                   │
│  └────────┬────────┘                                        │
│           │                                                 │
│           ▼                                                 │
│  ┌─────────────────┐                                        │
│  │ CONTEXT BUILDER │                                        │
│  │                 │ ← Student's question                   │
│  │                 │ ← Their current progress               │
│  │                 │ ← Hints already given                  │
│  │                 │ ← Their submission attempts            │
│  └────────┬────────┘                                        │
│           │                                                 │
│           ▼                                                 │
│  ┌─────────────────┐                                        │
│  │ HINT SELECTOR   │                                        │
│  │                 │ → Determine appropriate hint level     │
│  │                 │ → Select relevant hint content         │
│  │                 │ → Frame as Socratic question           │
│  └────────┬────────┘                                        │
│           │                                                 │
│           ▼                                                 │
│  ┌─────────────────┐                                        │
│  │ RESPONSE GEN    │                                        │
│  │ (Claude API)    │ → Generate Socratic response           │
│  │                 │ → Ask guiding questions                │
│  │                 │ → Point to resources if relevant       │
│  └────────┬────────┘                                        │
│           │                                                 │
│           ▼                                                 │
│  ┌─────────────────┐                                        │
│  │ HINT LOGGER     │                                        │
│  │                 │ → Log hint type and content            │
│  │                 │ → Track hints per student/week         │
│  │                 │ → Make available for grading           │
│  └─────────────────┘                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### System Prompt Template
```
You are ASK_AI, a Socratic teaching assistant for BADM 550.

YOUR ROLE:
- Help students discover answers through guided questions
- NEVER give direct solutions or do their work
- Ask questions that lead them to insights
- Point to relevant resources when helpful
- Be encouraging but maintain academic integrity

SOLUTION KNOWLEDGE (CONFIDENTIAL - NEVER REVEAL DIRECTLY):
Week {week_number}: {week_title}
- Correct approach: {approach_summary}
- Key calculations: {key_calculations}
- Common mistakes: {common_mistakes}
- Key insights they should discover: {key_insights}

STUDENT CONTEXT:
- Student: {student_name}
- Team: {team_name}
- Current question: {question}
- Hints already given this week: {hints_given}
- Remaining hint budget: {hints_remaining}

SOCRATIC TECHNIQUES:
1. Ask clarifying questions: "What have you tried so far?"
2. Challenge assumptions: "Why did you choose that approach?"
3. Guide to resources: "The week 4 documentation has a section on..."
4. Analogies: "Think about it like..."
5. Break down problems: "Let's start with just the first step..."
6. Reflect back: "So you're saying..."

HINT LEVELS:
- Level 1 (gentle): Ask a guiding question
- Level 2 (moderate): Point to specific resource or concept
- Level 3 (direct): Explain the general approach without specifics
- Level 4 (explicit): Show a simplified example (use sparingly)

RESPONSE FORMAT:
After each response, include a hidden tag for logging:
[HINT_LOG: level={1-4}, topic="{topic}", hint_type="{type}"]

BOUNDARIES:
- Max {max_hints} hints per student per week
- If student seems to be trying to extract solution, redirect
- If student is frustrated after multiple attempts, suggest office hours
- If question is about team issues or non-academic, redirect to Contact Professor
```

#### Example Interaction
```
Student: "I calculated the price gap but I'm getting negative numbers for 
some products. Is that wrong?"

ASK_AI: "Interesting observation! Negative numbers can definitely happen - 
the question is whether they make sense.

Let me ask you a few things:
1. How did you set up your gap calculation? What's in the numerator and 
   denominator?
2. What would a negative gap mean in business terms? (Think about what 
   it says about Best Choice vs. the national brand price)
3. How many products have negative gaps? Is it a few outliers or many?

Take a look at a specific example - pick one product with a negative gap 
and trace through the calculation manually. What do you see?

[HINT_LOG: level=1, topic="negative_gap_interpretation", 
hint_type="clarifying_questions"]"
```

#### Hint Audit Trail
```json
{
  "student_id": "uuid",
  "week_id": "uuid", 
  "hints": [
    {
      "timestamp": "2026-01-20T14:30:00Z",
      "question_summary": "Negative price gaps",
      "hint_level": 1,
      "hint_topic": "negative_gap_interpretation",
      "hint_type": "clarifying_questions",
      "full_response": "..."
    },
    {
      "timestamp": "2026-01-20T14:45:00Z",
      "question_summary": "Which price to use",
      "hint_level": 2,
      "hint_topic": "bsp_vs_srp",
      "hint_type": "resource_pointer",
      "full_response": "..."
    }
  ],
  "total_hints_used": 2,
  "max_hints_allowed": 5
}
```

### 7.3 AUTO_EVAL (Automatic Evaluation Engine)

#### Purpose
Automatically validates student submissions against known solutions, flags discrepancies, and provides hypotheses about errors to reduce instructor grading burden.

#### Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                       AUTO_EVAL                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  INPUT                                                      │
│  ├── Student submission (CSV/XLSX)                          │
│  ├── Student findings (text)                                │
│  ├── Solution file                                          │
│  └── Validation rules (JSON)                                │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ STAGE 1: FILE VALIDATION                                ││
│  │ ├── File format check                                   ││
│  │ ├── Required columns present                            ││
│  │ ├── Data types correct                                  ││
│  │ └── Basic integrity (no obvious corruption)             ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ STAGE 2: QUANTITATIVE COMPARISON                        ││
│  │ ├── Row count (with tolerance)                          ││
│  │ ├── Summary statistics (mean, median, std)              ││
│  │ ├── Distribution comparison                             ││
│  │ └── Key metric calculations                             ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ STAGE 3: FINDING EXTRACTION (Claude)                    ││
│  │ ├── Extract key claims from student text                ││
│  │ ├── Compare to expected findings                        ││
│  │ ├── Identify missing insights                           ││
│  │ └── Flag contradictions                                 ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ STAGE 4: DISCREPANCY ANALYSIS (Claude)                  ││
│  │ ├── Analyze patterns in differences                     ││
│  │ ├── Generate hypothesis about cause                     ││
│  │ ├── Suggest verification query                          ││
│  │ └── Determine severity (minor/moderate/major)           ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  OUTPUT                                                     │
│  ├── Status: passed | flagged | failed                      │
│  ├── Check results (detailed)                               │
│  ├── AI hypothesis (if flagged)                             │
│  ├── Verification query (if flagged)                        │
│  └── Suggested grade range                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Validation Rules Configuration
```yaml
# config/evaluations/week4_price_gap.yaml
week: 4
title: "Price Gap Analysis"

file_validation:
  required_format: ["csv", "xlsx"]
  required_columns:
    - product_id
    - bsp_gap
    - srp_gap
    - category
  optional_columns:
    - subcategory
    - national_brand_id
    
quantitative_checks:
  row_count:
    expected: 847
    tolerance_percent: 5
    severity_if_fail: "moderate"
    
  summary_stats:
    - column: bsp_gap
      metric: mean
      expected: 0.187
      tolerance: 0.01
      
    - column: srp_gap
      metric: mean
      expected: 0.203
      tolerance: 0.01
      
    - column: bsp_gap
      metric: std
      expected: 0.089
      tolerance: 0.02
      
  derived_metrics:
    - name: products_below_target
      calculation: "COUNT WHERE bsp_gap < 0.20"
      expected: 156
      tolerance: 10
      
expected_findings:
  must_mention:
    - topic: "dairy_low_gap"
      keywords: ["dairy", "lowest", "12%", "gap"]
      importance: "high"
      
    - topic: "snacks_exceed_target"
      keywords: ["snacks", "exceed", "target", "20%"]
      importance: "medium"
      
  should_mention:
    - topic: "negative_gaps"
      keywords: ["negative", "higher", "best choice expensive"]
      
common_mistakes:
  - pattern: "row_count ~721"
    hypothesis: "Filtered out products without national brand equivalent"
    suggestion: "Check WHERE clause for NULL handling"
    
  - pattern: "bsp_gap mean ~0.25"
    hypothesis: "May have calculated gap as (BC-NB)/BC instead of (NB-BC)/NB"
    suggestion: "Verify gap formula direction"
```

#### Verification Query Generator
```python
# When discrepancy detected, generate SQL to verify

def generate_verification_query(discrepancy_type: str, student_stats: dict) -> str:
    """Generate a SQL query to help instructor verify student work."""
    
    if discrepancy_type == "row_count_low":
        return f"""
        -- Check if student filtered NULLs
        SELECT 
            COUNT(*) as total_rows,
            COUNT(CASE WHEN national_brand_id IS NOT NULL THEN 1 END) as with_nb,
            COUNT(CASE WHEN national_brand_id IS NULL THEN 1 END) as without_nb
        FROM solution
        WHERE division = '{{team_division}}'
        AND quarter IN ({{team_quarters}});
        
        -- Student reported: {student_stats['row_count']} rows
        -- Expected: 847 rows
        -- If with_nb ≈ {student_stats['row_count']}, hypothesis confirmed
        """
    
    elif discrepancy_type == "gap_calculation":
        return f"""
        -- Sample 5 products to manually verify gap calculation
        SELECT 
            product_id,
            best_choice_bsp,
            national_brand_bsp,
            (national_brand_bsp - best_choice_bsp) / national_brand_bsp as expected_gap
        FROM solution
        WHERE national_brand_id IS NOT NULL
        LIMIT 5;
        
        -- Compare these to student's values for same product_ids
        """
    
    # ... more patterns
```

### 7.4 EMAIL_CLASSIFIER (Inbound Email Intelligence)

#### Purpose
Every incoming email is automatically analyzed and tagged for topic, issue type, sentiment, and urgency. This creates a searchable, filterable log of all student communications that enables end-of-semester analysis of what went wrong and pattern detection across the course.

#### Classification Taxonomy
```yaml
# Every email gets tagged with multiple dimensions

message_type:
  - question              # Seeking information
  - concern               # Expressing worry
  - complaint             # Expressing dissatisfaction
  - request               # Asking for something (meeting, extension, etc.)
  - update                # Informing about progress
  - confusion             # Unclear about something
  - frustration           # Emotional distress (see dedicated system below)

project_context:
  - project_name: "AWG" | "Country Financial" | "Bosch" | etc.
  - week_number: 1-14
  - deliverable: "Week 4 Price Gap" | null

issue_category:
  # Data Issues
  - data_incomplete       # Missing data they expected
  - data_unclear          # Don't understand data structure
  - data_quality          # Found errors/inconsistencies
  - data_access           # Can't access/download data
  
  # Guidance Issues  
  - context_lacking       # Don't understand business context
  - requirements_unclear  # Don't know what's expected
  - approach_uncertain    # Don't know how to proceed
  - feedback_needed       # Want validation on approach
  
  # Technical Issues
  - tool_problem          # Software/environment issues
  - code_error            # Programming problems
  - submission_issue      # Can't submit deliverable
  
  # Team Issues
  - coordination_problem  # Team not syncing well
  - contribution_imbalance # Someone not pulling weight
  - communication_gap     # Team not communicating
  - conflict              # Interpersonal issues
  
  # Client Issues
  - client_unresponsive   # Client not replying
  - client_unclear        # Client requirements confusing
  - client_changed        # Scope/requirements changed
  
  # Course Issues
  - deadline_concern      # Worried about timeline
  - workload_heavy        # Too much work
  - grading_question      # About grades/evaluation
  - resource_missing      # Need materials not provided

urgency_detected:
  - low                   # General inquiry
  - medium                # Needs response within 48hrs
  - high                  # Blocking progress
  - critical              # Emotional distress or major blocker

entities_mentioned:
  - teammates: ["John D.", "Sarah C."]
  - ta: "TA Name"
  - client: "Jennifer at AWG"
  - tools: ["Python", "Excel", "Tableau"]
```

#### Classification Flow
```
┌─────────────────────────────────────────────────────────────┐
│  INCOMING EMAIL                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  From: student@illinois.edu                                 │
│  Subject: RE: Week 4 deliverable question                   │
│  Body: "Hi Prof K, I've been trying to calculate the       │
│  price gaps but I'm getting really frustrated. The data    │
│  seems incomplete - there are products in the pricing      │
│  file that don't appear in the sales file. My teammate     │
│  John hasn't responded to my messages in 3 days and I'm    │
│  doing all the work. I don't know what to do."             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  AI CLASSIFICATION (Claude)                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  message_type: [frustration, concern, question]             │
│  project_context:                                           │
│    project_name: "AWG"                                      │
│    week_number: 4                                           │
│    deliverable: "Price Gap Analysis"                        │
│  issue_category:                                            │
│    - data_incomplete                                        │
│    - contribution_imbalance                                 │
│    - communication_gap                                      │
│  urgency_detected: high                                     │
│  sentiment_score: -0.7 (frustrated)                         │
│  entities_mentioned:                                        │
│    teammates: ["John"]                                      │
│                                                             │
│  AI_SUMMARY: "Student frustrated with data gaps and        │
│  unresponsive teammate. Dual issue: technical (data)       │
│  and team (contribution). High urgency due to emotional    │
│  distress and blocking progress."                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  STORED & INDEXED                                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  → Added to message database with all tags                  │
│  → Alert generated (high urgency + frustration)             │
│  → Visible in instructor dashboard                          │
│  → Searchable in end-of-semester analysis                   │
│  → Contributes to pattern detection                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Dashboard Views Enabled

```
ISSUE ANALYTICS (End of Semester)
─────────────────────────────────

Top Issues by Frequency:
┌─────────────────────────────────────────────────────────────┐
│  1. requirements_unclear      47 emails (23%)               │
│  2. data_incomplete           38 emails (19%)               │
│  3. approach_uncertain        31 emails (15%)               │
│  4. contribution_imbalance    28 emails (14%)               │
│  5. deadline_concern          22 emails (11%)               │
└─────────────────────────────────────────────────────────────┘

Issues by Week:
┌─────────────────────────────────────────────────────────────┐
│  Week 1: ████░░░░░░ (onboarding confusion)                 │
│  Week 2: ██░░░░░░░░ (settling in)                          │
│  Week 3: ███░░░░░░░ (data questions start)                 │
│  Week 4: ████████░░ (PEAK - deliverable crunch)            │
│  Week 5: █████░░░░░ (feedback requests)                    │
│  ...                                                        │
└─────────────────────────────────────────────────────────────┘

Issues by Project:
┌─────────────────────────────────────────────────────────────┐
│  AWG:              ████████░░ (mostly data issues)         │
│  Country Financial: ██████████ (client unresponsive)       │
│  Bosch:            ██████░░░░ (requirements unclear)       │
│  RetailCo (Sim):   ███░░░░░░░ (fewer issues - scaffolded)  │
└─────────────────────────────────────────────────────────────┘

Issues by Team:
┌─────────────────────────────────────────────────────────────┐
│  Team AWG-7: 🔴 23 issues (team conflict dominant)         │
│  Team AWG-3: 🟡 12 issues (data questions)                 │
│  Team AWG-1: 🟢 4 issues (on track)                        │
│  ...                                                        │
└─────────────────────────────────────────────────────────────┘
```

### 7.5 FRUSTRATION CAPTURE (Safe Venting System)

#### Purpose
Provide students a private, judgment-free channel to express frustration. This surfaces emotional signals early, builds trust, and gives you actionable data on what/who is causing problems.

#### Student Interface
```
┌─────────────────────────────────────────────────────────────┐
│  😤 SHARE YOUR FRUSTRATION                                  │
│  (Private & Judgment-Free)                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Sometimes things are frustrating. That's okay.             │
│  This goes directly to Prof. K - no judgment, no           │
│  impact on your grade. Just a way to let me know           │
│  something isn't working.                                   │
│                                                             │
│  What's frustrating you? (select all that apply)            │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 😤 THE PROJECT                                       │   │
│  │ ○ Data is confusing/incomplete                       │   │
│  │ ○ Requirements are unclear                           │   │
│  │ ○ Scope is too big                                   │   │
│  │ ○ Don't know where to start                          │   │
│  │ ○ Other: _______________                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 😤 THE TEAM                                          │   │
│  │ ○ Teammate not responding                            │   │
│  │ ○ Unequal contribution                               │   │
│  │ ○ Communication breakdown                            │   │
│  │ ○ Conflict/disagreement                              │   │
│  │ ○ Other: _______________                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 😤 THE CLIENT                                        │   │
│  │ ○ Not responsive                                     │   │
│  │ ○ Unclear expectations                               │   │
│  │ ○ Keeps changing requirements                        │   │
│  │ ○ Difficult to work with                             │   │
│  │ ○ Other: _______________                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 😤 THE COURSE                                        │   │
│  │ ○ Workload is too heavy                              │   │
│  │ ○ Deadlines too tight                                │   │
│  │ ○ Not enough guidance                                │   │
│  │ ○ Resources missing                                  │   │
│  │ ○ Other: _______________                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 😤 SUPPORT (Optional - only if comfortable)         │   │
│  │ ○ TA is not helpful                                  │   │
│  │ ○ TA is unresponsive                                 │   │
│  │ ○ Professor feedback unclear                         │   │
│  │ ○ Not getting enough attention                       │   │
│  │ ○ Other: _______________                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Tell me more (optional):                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                      │   │
│  │                                                      │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  How urgent is this?                                        │
│  ○ Just venting (no action needed)                          │
│  ○ Would appreciate a response when you have time           │
│  ○ Would like to talk soon                                  │
│  ● This is really affecting me - please reach out           │
│                                                             │
│  [Submit Anonymously]  [Submit with My Name]                │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│  🔒 This is completely private. It will never affect your  │
│  grade or how I see you. I genuinely want to help.         │
└─────────────────────────────────────────────────────────────┘
```

#### Instructor Alert View
```
┌─────────────────────────────────────────────────────────────┐
│  🚨 FRUSTRATION ALERT                         Priority: High │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  From: Sarah Chen (AWG-Team-3)      Time: 2 hours ago       │
│  Urgency: "This is really affecting me"                     │
│                                                             │
│  Frustration Areas:                                         │
│  ├── 😤 TEAM: Teammate not responding, Unequal contribution│
│  └── 😤 PROJECT: Don't know where to start                  │
│                                                             │
│  Their Message:                                             │
│  "John hasn't done anything in 2 weeks and won't respond   │
│  to Slack. I'm trying to do the whole project myself but   │
│  I don't even understand the data. I'm really stressed     │
│  and don't know what to do."                                │
│                                                             │
│  Context (AI-generated):                                    │
│  • Sarah has submitted 3 pulse checks - sentiment declining │
│  • John hasn't responded to last 2 pulse checks            │
│  • Team AWG-3 flagged as 🟡 last week                       │
│  • Sarah also emailed about data issues on Tuesday         │
│                                                             │
│  Suggested Actions:                                         │
│  [Schedule 1:1 with Sarah] [Contact John separately]       │
│  [Arrange team intervention] [Acknowledge receipt]          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Frustration Analytics
```
FRUSTRATION PATTERNS (Semester View)
────────────────────────────────────

Total Frustration Reports: 34

By Category:
┌─────────────────────────────────────────────────────────────┐
│  TEAM:      ████████████████░░░░ (16 reports, 47%)         │
│  PROJECT:   ████████░░░░░░░░░░░░ (8 reports, 24%)          │
│  CLIENT:    ████░░░░░░░░░░░░░░░░ (4 reports, 12%)          │
│  COURSE:    ████░░░░░░░░░░░░░░░░ (4 reports, 12%)          │
│  SUPPORT:   ██░░░░░░░░░░░░░░░░░░ (2 reports, 6%)           │
└─────────────────────────────────────────────────────────────┘

Specific Issues (Team):
┌─────────────────────────────────────────────────────────────┐
│  Teammate not responding:     8 reports                     │
│  Unequal contribution:        6 reports                     │
│  Communication breakdown:     4 reports                     │
│  Conflict:                    2 reports                     │
└─────────────────────────────────────────────────────────────┘

By Week:
┌─────────────────────────────────────────────────────────────┐
│  W1  W2  W3  W4  W5  W6  W7  W8  W9  W10 W11 W12 W13 W14   │
│   1   0   2   8   4   3   5   2   3   2   2   1   1   0    │
│       ░   ░   █   ░   ░   ░   ░   ░   ░   ░   ░   ░        │
│  ────────────────────────────────────────────────────────  │
│  Peak at Week 4 (first major deliverable)                  │
│  Secondary peak at Week 7 (mid-project complexity)         │
└─────────────────────────────────────────────────────────────┘

Students Who Haven't Vented (but might need to):
┌─────────────────────────────────────────────────────────────┐
│  These students show frustration signals in emails/pulse   │
│  but haven't used the frustration channel:                 │
│                                                             │
│  • Mike R. (AWG-5) - 3 negative pulse responses            │
│  • Team CF-2 - all 4 members declining sentiment           │
│  • Anonymous pulse: "everything is fine" but low scores    │
│                                                             │
│  [Send gentle nudge about frustration channel?]            │
└─────────────────────────────────────────────────────────────┘

INSIGHT FOR NEXT SEMESTER:
─────────────────────────
• 47% of frustration is team-related → Consider better team formation
• Week 4 is peak frustration → Add more scaffolding before first deliverable
• "Teammate not responding" is #1 issue → Add team communication norms earlier
• Only 2 reports about support → TA performance is good
```

### 7.6 SUMMARIZER (Email & Response Processing)

#### Purpose
Processes incoming student communications, clusters similar messages, extracts themes, and prepares summaries for instructor review.

#### Functions
```python
class Summarizer:
    
    def cluster_messages(self, messages: List[Message]) -> List[MessageCluster]:
        """
        Group similar messages together for batch response.
        Uses semantic similarity (embeddings) + keyword matching.
        """
        
    def extract_themes(self, responses: List[PulseResponse]) -> ThemeSummary:
        """
        Analyze pulse check responses to extract common themes.
        Returns: themes with frequency, sentiment distribution, flags
        """
        
    def generate_digest(self, 
                       alerts: List[Alert],
                       drafts: List[Draft],
                       submissions: List[Submission],
                       pulse: Optional[PulseCheck]) -> DailyDigest:
        """
        Generate daily digest email for instructor.
        Prioritizes items needing attention.
        """
        
    def detect_sentiment(self, text: str) -> SentimentResult:
        """
        Analyze sentiment of student response.
        Returns: score (-1 to 1), flags (concerning keywords)
        """
```

### 7.5 DRAFTER (Response Generation)

#### Purpose
Generates draft responses for instructor review, handling personalization and tone matching.

#### Functions
```python
class Drafter:
    
    def draft_response(self, 
                      message: Message,
                      context: dict,
                      template: Optional[str] = None) -> Draft:
        """
        Generate response draft for a student message.
        Uses message context, student history, and appropriate tone.
        """
        
    def draft_batch_response(self,
                            cluster: MessageCluster,
                            personalization_fields: List[str]) -> Draft:
        """
        Generate response for clustered similar messages.
        Includes personalization tokens for each recipient.
        """
        
    def draft_meeting_confirmation(self,
                                  request: MeetingRequest,
                                  approved_slot: datetime) -> Draft:
        """
        Generate meeting confirmation with calendar details.
        """
        
    def draft_pulse_check(self,
                         pulse_type: str,
                         week_context: dict) -> Draft:
        """
        Generate pulse check email with appropriate questions.
        """
        
    def draft_announcement(self,
                          topic: str,
                          audience: str,
                          key_points: List[str]) -> Draft:
        """
        Generate class announcement based on topic and points.
        """
```

---

## 8. Week-by-Week Content Structure

### 8.1 AWG Structured Project (14 Weeks)

```yaml
# Week-by-week structure for AWG Price Gap Analysis

weeks:
  - week: 1
    title: "Project Kickoff & Data Exploration"
    objectives:
      - Understand AWG business model and brand positioning
      - Explore data structure and relationships
      - Set up development environment
    agenda:
      - step: 1
        title: "Read project brief"
        description: "Understand Always Save vs Best Choice positioning"
        output: "Notes on brand strategy"
      - step: 2
        title: "Load and explore data files"
        description: "Load Product Details and Sales Data files"
        output: "Data profiling report"
      - step: 3
        title: "Understand data schema"
        description: "Map relationships between products, pricing, divisions"
        output: "Data dictionary notes"
    deliverable:
      title: "Data Exploration Summary"
      format: "1-2 page PDF"
      components:
        - Data overview (row counts, columns)
        - Initial observations
        - Questions for client
      auto_check: false  # Human graded
    resources:
      - "AWG Brand Positioning Document"
      - "Data Dictionary"
      - "Python pandas cheat sheet"

  - week: 2
    title: "Data Cleaning & Validation"
    objectives:
      - Clean and validate data quality
      - Handle missing values appropriately
      - Create analysis-ready dataset
    agenda:
      - step: 1
        title: "Identify data quality issues"
        description: "Check for nulls, duplicates, outliers"
        output: "Quality issue log"
      - step: 2
        title: "Clean data"
        description: "Handle missing values, standardize formats"
        output: "Cleaned dataset"
      - step: 3
        title: "Validate cleaning"
        description: "Verify no data loss, relationships intact"
        output: "Validation report"
    deliverable:
      title: "Cleaned Dataset + Quality Report"
      format: "CSV + PDF"
      components:
        - Cleaned data file
        - Quality issues found and resolution
        - Row count reconciliation
      auto_check: true
      validation_rules:
        row_count:
          min: 4000
          max: 4400
        required_columns: [product_id, brand, category, bsp, srp]
    resources:
      - "Data cleaning best practices"
      - "pandas data cleaning guide"

  - week: 3
    title: "Product Matching"
    objectives:
      - Match Best Choice products to National Brand equivalents
      - Handle unmatched products appropriately
      - Validate matching quality
    # ... continue structure

  - week: 4
    title: "Baseline Price Gap Calculation"
    objectives:
      - Calculate BSP and SRP gaps
      - Identify products below 20% target
      - Summarize by category
    agenda:
      - step: 1
        title: "Calculate BSP gap"
        description: "Gap = (NB_BSP - BC_BSP) / NB_BSP for matched products"
        output: "BSP gap column"
      - step: 2
        title: "Calculate SRP gap"
        description: "Same formula for SRP"
        output: "SRP gap column"
      - step: 3
        title: "Flag below-target products"
        description: "Identify where gap < 20%"
        output: "Target compliance flag"
      - step: 4
        title: "Summarize by category"
        description: "Average gaps and compliance by category"
        output: "Category summary table"
    deliverable:
      title: "Price Gap Analysis"
      format: "CSV + Findings document"
      components:
        - Product-level gap data
        - Category summary
        - Top 3 findings
      auto_check: true
      validation_rules:
        row_count:
          expected: 847
          tolerance_percent: 5
        summary_stats:
          - column: bsp_gap
            metric: mean
            expected: 0.187
            tolerance: 0.01
        expected_findings:
          - "Dairy category has lowest gaps"
          - "Snacks exceed target"
    resources:
      - "Price gap calculation guide"
      - "Example gap analysis"

  # Weeks 5-14 continue with similar structure...
  
  - week: 5
    title: "Cost Change Impact Analysis"
    
  - week: 6
    title: "Cross-Brand Price Dynamics"
    
  - week: 7
    title: "Sales Impact Analysis"
    
  - week: 8
    title: "Mid-Project Review & Client Feedback"
    
  - week: 9
    title: "Deep Dive Analysis"
    
  - week: 10
    title: "Recommendation Development"
    
  - week: 11
    title: "Visualization & Storytelling"
    
  - week: 12
    title: "Draft Presentation"
    
  - week: 13
    title: "Presentation Practice & Refinement"
    
  - week: 14
    title: "Final Presentation & Reflection"
```

### 8.2 Simulated Project (RetailCo)

Similar structure to AWG, but with:
- AI client personas instead of real client
- ASK_AI available for all weeks
- More scaffolded hints and resources
- Synthetic data with controlled characteristics

---

## 9. Technical Specifications

### 9.1 Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Frontend | Next.js 14, React 18, TypeScript | Consistent with existing repos (StakeholderSim) |
| Styling | Tailwind CSS | Rapid development, consistent design |
| Backend | Python 3.11, FastAPI | Consistent with existing repos, strong async |
| Database | PostgreSQL 15 | Relational data, strong query support |
| Cache | Redis 7 | Session management, rate limiting |
| AI | Claude API (claude-sonnet-4-20250514) | Best for nuanced conversations |
| Email | Gmail API | Instructor's course email |
| Calendar | Google Calendar API / ICS | Meeting management |
| Storage | S3 / Local | Data files, submissions |
| Deployment | Docker, Docker Compose | Consistent with existing repos |

### 9.2 API Endpoints (Key)

```yaml
# Authentication
POST /auth/login                       # Login, returns JWT
POST /auth/logout                      # Logout, invalidate token
POST /auth/change-password             # Change password
POST /auth/forgot-password             # Request password reset
POST /auth/reset-password              # Reset with token
GET  /auth/me                          # Get current user info

# Admin - User Management
GET  /admin/teachers                   # List all teachers
POST /admin/teachers                   # Create teacher
PUT  /admin/teachers/{id}              # Update teacher
DELETE /admin/teachers/{id}            # Remove teacher
GET  /admin/semesters                  # List semesters
POST /admin/semesters                  # Create semester
PUT  /admin/semesters/{id}             # Update semester

# Teacher - User Management
GET  /users/tas                        # List TAs for teacher's courses
POST /users/tas                        # Create TA
PUT  /users/tas/{id}                   # Update TA
DELETE /users/tas/{id}                 # Remove TA
POST /users/tas/{id}/assign-teams      # Assign teams to TA

GET  /users/students                   # List students (filterable)
POST /users/students                   # Create single student
POST /users/students/bulk              # Bulk import from CSV
PUT  /users/students/{id}              # Update student
DELETE /users/students/{id}            # Remove student
POST /users/students/{id}/assign-team  # Assign student to team

# Teams
GET  /teams                            # List all teams
POST /teams                            # Create team
POST /teams/bulk                       # Bulk create teams
PUT  /teams/{id}                       # Update team
DELETE /teams/{id}                     # Remove team
GET  /teams/{id}/members               # List team members
POST /teams/{id}/members               # Add member to team
DELETE /teams/{id}/members/{student_id} # Remove member from team

# Students (Student's own view)
GET  /students/{id}
GET  /students/{id}/team
GET  /students/{id}/progress
POST /students/{id}/messages           # Contact professor
POST /students/{id}/meeting-requests   # Request meeting
GET  /students/{id}/submissions

# Teams
GET  /teams
GET  /teams/{id}
GET  /teams/{id}/members
GET  /teams/{id}/health
GET  /teams/{id}/submissions

# Weeks
GET  /weeks                            # All weeks for project
GET  /weeks/{week_num}                 # Week content
GET  /weeks/{week_num}/deliverable     # Deliverable spec
POST /weeks/{week_num}/submissions     # Submit deliverable

# Check-ins
GET  /checkins                         # All pulse checks
GET  /checkins/latest                  # Most recent
POST /checkins/{id}/respond            # Submit response

# Messages (Instructor view)
GET  /messages                         # All messages
GET  /messages/clusters                # Clustered messages
POST /messages/{id}/respond            # Send response
POST /messages/batch                   # Batch response

# Drafts
GET  /drafts                           # All pending drafts
POST /drafts/{id}/approve              # Approve and send
POST /drafts/{id}/edit                 # Edit draft
DELETE /drafts/{id}                    # Discard

# Meetings
GET  /meetings/requests                # Pending requests
POST /meetings/requests/{id}/approve   # Approve
POST /meetings/requests/{id}/decline   # Decline
GET  /meetings/schedule                # Calendar view

# Alerts
GET  /alerts                           # All alerts
POST /alerts/{id}/action               # Take action
POST /alerts/{id}/assign               # Assign to TA
POST /alerts/{id}/resolve              # Mark resolved

# Submissions
GET  /submissions                      # All submissions
GET  /submissions/flagged              # Flagged only
POST /submissions/{id}/grade           # Grade submission
POST /submissions/{id}/verify          # Run verification

# AI Services
POST /ai/client-sim/chat               # CLIENT_SIM conversation
POST /ai/ask-ai/chat                   # ASK_AI conversation
POST /ai/evaluate                      # AUTO_EVAL submission
GET  /ai/conversations/{student_id}    # Conversation history

# Frustration & Classification
POST /frustration                      # Submit frustration report
GET  /frustration                      # All reports (instructor)
GET  /frustration/{id}                 # Single report
POST /frustration/{id}/acknowledge     # Acknowledge report
POST /frustration/{id}/resolve         # Mark resolved
GET  /frustration/analytics            # Frustration analytics

GET  /messages/{id}/classification     # Get email classification
GET  /issues/analytics                 # Issue analytics (by type, week, project)
GET  /issues/by-category               # Issues grouped by category
GET  /issues/by-week                   # Issues over time
GET  /issues/by-project                # Issues by project

# Admin
GET  /admin/stats                      # Dashboard stats
POST /admin/pulse-check                # Trigger pulse check
POST /admin/announcement               # Send announcement
```

### 9.3 Integration Points

#### Gmail API
```python
# Email service integration

class GmailService:
    def __init__(self, credentials_path: str):
        self.service = build('gmail', 'v1', credentials=credentials)
        
    async def send_email(self, to: str, subject: str, body: str):
        """Send email via Gmail API"""
        
    async def get_inbox(self, query: str = None) -> List[Email]:
        """Fetch emails from inbox"""
        
    async def watch_inbox(self, callback: Callable):
        """Set up webhook for new emails"""
```

#### Calendar API
```python
# Calendar service integration

class CalendarService:
    def __init__(self, credentials_path: str):
        self.service = build('calendar', 'v3', credentials=credentials)
        
    async def get_available_slots(self, 
                                  start: datetime, 
                                  end: datetime,
                                  duration: int) -> List[TimeSlot]:
        """Get available meeting slots"""
        
    async def create_event(self, 
                          title: str,
                          start: datetime,
                          duration: int,
                          attendees: List[str]) -> Event:
        """Create calendar event"""
        
    async def generate_ics(self, event: Event) -> str:
        """Generate ICS file for download"""
```

### 9.4 Scheduled Tasks

```python
# Scheduler configuration

SCHEDULED_TASKS = [
    {
        "name": "tuesday_pulse",
        "schedule": "0 9 * * 2",  # Tuesday 9am
        "function": "send_pulse_check",
        "args": {"type": "tuesday"}
    },
    {
        "name": "friday_pulse",
        "schedule": "0 9 * * 5",  # Friday 9am
        "function": "send_pulse_check",
        "args": {"type": "friday"}
    },
    {
        "name": "daily_digest",
        "schedule": "0 18 * * *",  # 6pm daily
        "function": "send_instructor_digest"
    },
    {
        "name": "pulse_reminder",
        "schedule": "0 9 * * 3,6",  # Wed & Sat 9am
        "function": "send_pulse_reminder"
    },
    {
        "name": "meeting_reminder",
        "schedule": "0 * * * *",  # Every hour
        "function": "send_meeting_reminders"
    },
    {
        "name": "followup_check",
        "schedule": "0 10 * * *",  # Daily 10am
        "function": "check_overdue_followups"
    }
]
```

---

## 10. Phase 1 Scope

### 10.1 MVP Features (Build First)

For Spring 2026 semester launch:

#### Must Have (P0)

```
STUDENT PORTAL
├── Dashboard with project info and quick actions
├── Week-by-week content pages (AWG structured)
├── Contact Professor button (immediate email)
├── Request Meeting (individual and team)
├── Submit Deliverable with auto-check
├── Pulse check response (via email reply or web form)

INSTRUCTOR DASHBOARD
├── Alert queue (non-response, discrepancies, conflicts)
├── Draft queue (review and send)
├── Pulse summary view
├── Meeting request management
├── Submission review with auto-check results
├── Team health overview

AI SYSTEMS
├── AUTO_EVAL for structured project submissions
├── Email parsing and clustering (SUMMARIZER)
├── Response drafting (DRAFTER)
├── Pulse sentiment analysis

ORCHESTRATION
├── Gmail API integration (send/receive)
├── Scheduled pulse checks (Tue/Fri)
├── Daily digest email
├── Basic calendar (available slots, ICS generation)
```

#### Should Have (P1)

```
├── ASK_AI (Socratic teacher) for simulated projects
├── CLIENT_SIM for simulated projects
├── Client query clustering
├── TA dashboard and task assignment
├── Advanced calendar integration (Google Calendar API)
├── Follow-up tracking
```

#### Nice to Have (P2)

```
├── Verification query runner (against student data)
├── Canvas grade export
├── Student portfolio generation
├── Cross-team analytics
├── Hint audit trail viewer
```

### 10.2 Data to Prepare

Before semester:
1. **AWG project configuration** (all 14 weeks)
2. **Solution files** for each week's deliverable
3. **Validation rules** for auto-checking
4. **Team data slices** (which team gets which division/quarter)
5. **Email templates** (pulse checks, reminders, common responses)
6. **Available slots** for meetings

### 10.3 Timeline

```
Week -4 (Dec 16-20): Core infrastructure
├── Database schema
├── Basic API endpoints
├── Authentication
└── Gmail API integration

Week -3 (Dec 23-27): Student portal
├── Dashboard
├── Week content pages
├── Contact/Meeting forms
├── Submission form

Week -2 (Dec 30-Jan 3): Instructor dashboard
├── Alert queue
├── Draft queue
├── Submission review
├── Team health view

Week -1 (Jan 6-10): AI systems & polish
├── AUTO_EVAL implementation
├── SUMMARIZER
├── DRAFTER
├── Pulse check scheduling
├── Testing & bug fixes

Week 0 (Jan 13-17): Launch prep
├── Load AWG project config
├── Create teams and assignments
├── Send welcome emails
├── Monitor and fix issues

Semester Start (Jan 20): Go live
```

---

## 11. Future Enhancements

### 11.1 Phase 2: Simulated Projects
- Full CLIENT_SIM with multiple personas
- ASK_AI Socratic teacher
- Simulated project configuration (RetailCo)
- Synthetic data generator

### 11.2 Phase 3: Cross-Course Integration
- Unified authentication across BADM 550/558/576
- Shared student profiles
- Cross-course instructor dashboard
- Portfolio generation across courses

### 11.3 Phase 4: External Expansion
- Company portal for project posting
- Multi-school student enrollment
- External instructor onboarding
- Project marketplace
- Non-profit entity formalization

### 11.4 Future AI Enhancements
- Voice input for pulse checks
- Video avatar personas for CLIENT_SIM
- Real-time collaboration detection
- Predictive intervention (identify struggling students before they ask)
- Automated office hours scheduling based on demand patterns

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| Pulse Check | Regular (2x/week) check-in with students |
| ASK_AI | Socratic teaching AI that guides without revealing answers |
| CLIENT_SIM | AI personas simulating client contacts |
| AUTO_EVAL | Automatic submission validation against solutions |
| Data Slice | Subset of data assigned to a specific team |
| Draft Queue | Pending AI-generated responses for instructor approval |
| Alert | System-generated notification requiring attention |

---

## Appendix B: Reference Repositories

- **JobSearchDS**: https://github.com/social-engineer-ai/JobSearchDS
- **DS_Bus_RolePlyr**: https://github.com/social-engineer-ai/DS_Bus_RolePlyr
- **Practicum_site (legacy)**: https://github.com/social-engineer-ai/Practicum_site

---

*Document Version: 1.0*
*Last Updated: January 6, 2026*
*Status: Ready for Development*
