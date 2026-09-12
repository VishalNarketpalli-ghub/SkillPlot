# FRONTEND_DEVELOPMENT.md

# CareerReady Frontend Development

## Platform
Responsive web application.

## Stack
- React
- Vite
- React Router
- Shared reusable UI components
- REST API integration

## Frontend Responsibilities
- UI
- Navigation
- Client state
- User interaction
- API calls
- Loading/error/success states
- Displaying backend results

Do not put authentication logic, scoring formulas, Gemini calls, database logic, or Judge0 credentials in the frontend.

---

# PHASE 1 — FOUNDATION + CORE FLOW

## DAY 1

### TASK 1.1 — React Project Setup

**Objective:** Create the frontend project.

**What:** Scaffold React with Vite.

**Why:** Establish the web application foundation.

**Where:** `frontend/`

**How:**
1. Create the React/Vite project.
2. Verify the development server.
3. Establish the initial `src/` structure.

**How to test:** Start the development server and open the local URL.

**Expected result:** React application loads successfully.

**Git commit:** `chore: scaffold frontend`

### TASK 1.2 — Routing

Create the initial routing structure for:
- Login
- Register
- Dashboard
- Profile
- Resume
- Job Description

Protect authenticated routes later after backend authentication is available.

**Git commit:** `feat: add frontend routing`

---

## DAY 2

### TASK 1.3 — Theme and Design Tokens

**What:** Define reusable typography, spacing, borders, radii, layout rules and application-level design tokens.

**Why:** Prevent inconsistent UI across the application.

**Where:** `src/theme/`

**How:** Create a central theme/token definition and use it from reusable components.

**Expected result:** Screens can share the same visual system.

### TASK 1.4 — Base Components

Build:
- Button
- Input
- Card
- ScoreCard
- ProgressBar
- Header

Each component must support loading/disabled/error states where relevant.

**Git commit:** `feat: add shared ui components`

---

## DAY 3

### TASK 1.5 — Authentication Screens

Build:
- Login
- Register

Initially these can use mocked API responses, then connect to the real API.

### TASK 1.6 — Protected Route Wrapper

Create the client-side route guard.

**Important:** This is a UX/navigation guard, not the real security boundary. The backend JWT middleware remains authoritative.

**Expected result:** Unauthenticated users cannot navigate into protected application screens through normal UI flow.

**Git commit:** `feat: add authentication screens`

---

## DAY 4–5

### TASK 1.7 — Profile

Build profile UI for:
- Name
- Education
- Degree
- Branch
- Graduation year
- Skills
- Target role
- Experience/fresher status

Implement GET/PUT against `/api/users/me`.

**Expected result:** User can view and update core profile fields.

### TASK 1.8 — Resume Upload UI

Create:
- File selection
- Upload state
- Upload success state
- Upload error state
- Parsed-result display area

Do not perform parsing in the frontend.

---

## DAY 5–6

### TASK 1.9 — Job Description UI

Support:
- Paste JD
- Upload JD if supported by backend
- Submit
- Loading state
- Analysis result
- Error state

---

## DAY 7

### TASK 1.10 — Resume Analysis Results

Display:
- Resume parsing status
- Extracted skills
- Extracted education
- Relevant/missing skills
- Deterministic match score

The frontend only displays the score received from the backend. It must not recalculate the authoritative score.

### TASK 1.11 — Workflow Dashboard

Display the static role workflow returned by the backend.

Example:

`Resume → Vocabulary → Grammar → Technical MCQ → Coding → Technical Interview → HR Interview`

Do not generate the workflow in the frontend.

---

## DAY 8

### TASK 1.12 — Full Frontend Integration

Connect:

`Register → Login → Dashboard → Profile → Resume → JD → Analysis → Workflow`

Test:
- successful requests
- invalid input
- expired/invalid authentication
- loading states
- API errors

---

## DAY 9

### TASK 1.13 — Bug Fixes

Fix integration bugs from Day 8.

Do not introduce unrelated UI features.

---

## DAY 10

### TASK 1.14 — Buffer

Use only for:
- catching up
- fixing blockers
- improving unstable Phase 1 work

If completely free, pull a small Phase 2 frontend task forward.

---

## DAY 11

### TASK 1.15 — Documentation

Document only what has actually been built.

For each completed frontend task record:
- Objective
- What
- Why
- Files
- Implementation
- Testing
- Expected result
- Common errors
- Git commit
- Completion checklist

---

## DAY 12

### TASK 1.16 — Demo and Sign-off

Verify:
- Register works.
- Login works.
- Protected dashboard works.
- Profile works.
- Resume upload works.
- Resume analysis displays.
- JD submission works.
- Match score displays.
- Workflow displays.

---

# PHASE 2 — RECRUITMENT SIMULATION

## Frontend Modules

### TASK 2.1 — Vocabulary Assessment
Build question display, answer selection/input, progress and submission.

### TASK 2.2 — Grammar Assessment
Build grammar question interface and deterministic result display.

### TASK 2.3 — Technical MCQs
Build:
- Question card
- Options
- Difficulty indicator
- Progress
- Submit/next controls

### TASK 2.4 — Adaptive Difficulty
The frontend displays the current difficulty supplied by the backend. Difficulty calculation remains backend logic.

### TASK 2.5 — Coding Screen
Build:
- Problem statement
- Constraints
- Language selector
- Code editor area
- Run/submit
- Test result display
- Runtime/memory result display

### TASK 2.6 — Technical Interview
Build:
- Current question
- Answer input
- Evaluation/loading state
- Follow-up question
- Final evaluation

Limit the UI flow to the backend's maximum one follow-up.

### TASK 2.7 — HR Interview
Same general interaction model, with HR rubric results.

### TASK 2.8 — Results Screen
Show raw scores:
- Vocabulary
- Grammar
- Technical MCQ
- Coding
- Technical Interview
- HR Interview

Do not display an aggregated readiness score yet.

### TASK 2.9 — Integration Test
Run the complete Phase 2 flow and log every bug.

---

# PHASE 3 — INTELLIGENCE + PERSONALIZATION

## TASK 3.1 — Analytics Dashboard
Display stored performance metrics.

## TASK 3.2 — Readiness Score
Display backend-calculated readiness score and role context.

## TASK 3.3 — Competency Profile
Show each skill with evidence from:
- Resume
- MCQs
- Coding
- Interview

## TASK 3.4 — Skill Gaps
Show:
- High priority
- Medium priority
- Low priority

## TASK 3.5 — Explainable Recommendations
Every recommendation should display a reason derived from stored evidence.

Example:
`SQL is high priority because the role requires SQL and your SQL-related assessment evidence is below the configured threshold.`

## TASK 3.6 — Learning Roadmap
Display:
- priority skill
- learning objective
- recommended activities
- explanation
- progress

## TASK 3.7 — Final Polish
Improve:
- consistency
- responsive layout
- loading states
- error states
- empty states
- accessibility
- visual hierarchy

## TASK 3.8 — Final Demo Flow

`Register → Resume/JD → Workflow → Assessments → Coding → Interviews → Results → Readiness → Skills → Gaps → Roadmap`

---

# Frontend Completion Standard

A task is not complete until:
- UI exists.
- API integration works where required.
- Loading state exists.
- Error state exists.
- Success state exists.
- Main user path is tested.
- Changes are committed.
- BL has reviewed the PR where applicable.
