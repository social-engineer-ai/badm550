# Implementation Plan: BADM 550 Course OS

## 1. Project Vision
A dual-stack (FastAPI/Next.js) Operating System designed to handle the high-volume operational overhead of the MSBA Business Practicum. Features automated AI triage for instructor inboxes, real-time student sentiment pulses, and structured submission validation.

## 2. Tech Stack
-   **Frontend**: Next.js 14, Tailwind/Vanilla CSS, Lucide Icons.
-   **Backend**: FastAPI, SQLAlchemy, PostgreSQL, APScheduler.
-   **AI**: Claude 3.5 Sonnet (Anthropic SDK).
-   **Email**: Google Gmail API (OAuth2).

## 3. Progress Tracking

### 3.1 Backend Architecture (Complete)
-   [x] **Database Schema**: Unified User, StudentProfile, Team, Submission, and Alert models.
-   [x] **Auth Layer**: JWT-based role-checker for Student vs Instructor.
-   [x] **Gmail Service**: OAuth2 handshake with database-backed token persistence.

### 3.2 Design System (Complete)
-   [x] **The Obsidian Palette**: Dark-mode glassmorphism.
-   [x] **Component Library**: Glass-cards, animated badges, and gradient text utilities.

### 3.3 Student Portal (Complete)
-   [x] **Dashboard**: Roadmap visualization and Professor contact form.
-   [x] **Submission Flow**: File upload + AI validation UI.
-   [x] **Pulse Check**: Sentiment capturing (Emoji-based).
-   [x] **Team Space**: Collaborative dashboard with confidential friction reporting and meeting requests.
-   [x] **Roadmap**: Visual progress tracker for student deliverables.

### 3.4 Instructor Suite (Complete)
-   [x] **Insight Dashboard**: AI-clustered email triage, alert queue, and draft management.
-   [x] **Daily Digest**: Automated 8:00 AM AI sync and executive summary banner.
-   [x] **Team Registry**: Comprehensive "Audit Trail" with submission archive, sentiment trends, and manual health overrides.
-   [x] **Course Architect**: Roadmap editor for managing weekly content and AI evaluation rules.
-   [x] **Taco Tuesday**: Automated 10:00 AM pulse check invitations to all students.

### 3.5 AI & Orchestration (Complete)
- [x] **Executive Triage**: Claude-powered inbox clustering and 3-sentence summary generation.
- [x] **Dispatch Engine**: Direct Gmail API sender for approved drafts.
- [x] **Auto-Scheduler**: Background worker (APScheduler) for persistent daily tasks.

### 3.6 Grades & Evaluation (Complete)
- [x] **Registry**: Global matrix of student scores across weeks.
- [x] **Assessment Audit**: Modal for high-fidelity scoring and qualitative feedback.
- [x] **Student Ledger**: Personal performance view with cumulative analytics.

## 4. Current Phase: Finalizing
1.  [x] **TA View**: Role-based access for Teaching Assistants implemented (Operational Hub vs Executive Terminal).
2.  [ ] **Deployment**: Dockerization and prod-ready configuration.

---

**Protocol Reference**: This OS follows the "Premium Design" and "Agentic Autonomy" principles.
