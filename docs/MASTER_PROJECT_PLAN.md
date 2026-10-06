# CAREERREADY — MASTER PROJECT PLAN

## Project
**CAREERREADY — AI-Powered Adaptive Career Readiness & Recruitment Simulation Platform**

## Current Platform
Responsive web application.

## Team
- **BL — Backend Lead:** backend only; reviews all PRs including frontend.
- **A — Intake/Assessment pair-lead:** full-stack.
- **B — Interview/Intelligence pair-lead:** full-stack.
- **C — Float:** full-stack; unblocks whoever is behind; doubles as QA/integration.

## 60-Day Delivery Strategy

The project is completed in exactly three phases.

### Phase 1 — Foundation + Core Flow
**Days 1–12**

Exit criteria:
A user can register, log in, upload a resume, get it parsed, paste/upload a JD, get a deterministic resume-vs-JD match score, and see a static role-based workflow on the dashboard.

### Phase 2 — Recruitment Simulation + AI Evaluation
**Days 13–40**

Exit criteria:
A user can run the full recruitment simulation from start to finish and see raw scores per stage.

### Phase 3 — Intelligence + Personalization + Final Polish
**Days 41–60**

Exit criteria:
The readiness story is real: deterministic readiness score, per-skill competency evidence, deterministic skill gaps, and an explainable personalized roadmap.

## Parked Unless Phase 3 Core Is Finished Early
- Personality/MBTI
- AI mentor chat
- Interview history trend view
- Voice interview

No optional feature is added without identifying a CORE feature to cut.

---

# PHASE 1 — FOUNDATION + CORE FLOW

## Phase 1 Exit Criteria

A user can:

1. Register.
2. Log in.
3. Access protected routes using JWT.
4. Maintain core profile fields.
5. Upload a resume.
6. Extract resume text.
7. Extract skills/education with Gemini-assisted structured output.
8. Paste/upload a job description.
9. Extract required/preferred skills with Gemini.
10. Calculate a deterministic resume-vs-JD match score.
11. View missing/relevant skills.
12. See a static workflow selected by role.

## Day-by-Day Plan

### DAY 1
**BL**
- Scaffold Express backend.
- Establish `.env` convention.
- Establish Git branching: `main`, `develop`, `feature/*`.

**A**
- Scaffold React + Vite.
- Set up routing.

**B**
- Create shared theme/design tokens.
- Build Button, Input, Card.

**C**
- Create task board.
- Write the 12-feature Phase 1 breakdown.

### DAY 2
**BL**
- Connect MongoDB.
- Create User model.
- Implement register/login endpoints.

**A**
- Build login/register screens against mocked API.

**B**
- Build ScoreCard, ProgressBar, Header.

**C**
- Pair with BL to create shared Gemini prompt/JSON-schema utility.
- Keep the utility reusable for Phase 2.

### DAY 3
**BL**
- JWT middleware.
- bcrypt.
- Standard validation/error middleware.

**A**
- Connect auth UI to real API.
- End-to-end auth test.

**B**
- Navigation shell.
- Protected route wrapper.
- Empty dashboard.

**C**
- Finish prompt/schema utility.
- Run one dummy Gemini call.

**CHECKPOINT**
Auth works end-to-end and all four understand the skeleton.

### DAY 4
**BL**
- Review first backend PRs.
- Define database schema documentation.

**A**
- Resume upload endpoint.
- Multer/file storage.
- Resume model.

**B**
- Draft interview/analytics route stubs and schema design only.

**C**
- `/api/users/me` GET/PUT.
- Profile screen.

### DAY 5
**BL**
- Review PRs and unblock.

**A**
- Resume text extraction using `pdf-parse`.
- Regex-based skill extraction.

**B**
- JD paste/upload screen.
- JobDescription model.

**C**
- Test authentication/profile flow.
- Log bugs.

### DAY 6
**BL**
- Pair with A on Gemini-assisted resume parsing.

**A**
- Gemini structured extraction for resume skills/education.

**B**
- JD analysis endpoint.
- Gemini extraction of required/preferred skills.

**C**
- Fix Day 5 bugs.

### DAY 7
**BL**
- Review resume/JD AI schema consistency.

**A**
- Deterministic resume-vs-JD match score.
- Use keyword overlap and/or cosine similarity.
- No AI in score calculation.

**B**
- Static per-role workflow lookup.
- Route + role-template data.
- Do not generate workflows with AI.

**C**
- Resume-analysis results screen.
- Score + missing skills.

### DAY 8
**BL**
- Review/unblock.

**A**
- Connect JD UI to backend.

**B**
- Connect workflow steps to dashboard.

**C**
- Full integration test:
  register → login → resume → JD → workflow.
- Log every bug.

**CHECKPOINT**
Phase 1 flow is integration-tested end-to-end.

### DAY 9
All:
- Fix Day 8 bugs.
- BL reviews and merges PRs.

### DAY 10
All:
- Buffer/catch-up.
- If no catch-up work exists, pull a Phase 2 task forward.
- Do not eliminate the buffer from the overall plan.

### DAY 11
**BL**
- Review documentation accuracy.

**A/B**
- Write Phase 1 backend development entries for their slices.

**C**
- Write API documentation and database design from what is actually built.

### DAY 12
**BL**
- Full-team demo.
- Sign off Phase 1 checklist.
- Tag release.

**A/B/C**
- Attend demo.
- Run retro.
- Decide whether role split needs adjustment before Phase 2.

## Phase 1 Tracking
Record:
1. Actual date/day of Day 3 checkpoint.
2. Actual date/day of Day 8 checkpoint.
3. Number of A/B backend PRs rejected or returned by BL.
4. Whether C was pulled into backend work.

---

# PHASE 2 — RECRUITMENT SIMULATION + AI EVALUATION

**Days 13–40**

## Exit Criteria
The user can complete:

Resume/JD
→ Workflow
→ Vocabulary
→ Grammar
→ Technical MCQs
→ Coding
→ Technical Interview
→ HR Interview
→ Results

Results show raw scores per stage. No overall aggregation yet.

## Code Execution Provider Strategy

Phase 2 coding execution uses **JDoodle** as the current active execution provider.

The coding implementation must use a minimal provider boundary so that provider-specific API behavior does not leak into the coding controller, database schema, or frontend.

### Current Architecture

```text
Coding Controller
      ↓
Code Execution Service
      ↓
JDoodle Provider
      ↓
JDoodle API
````

### Future Architecture

```text
Coding Controller
      ↓
Code Execution Service
      ↓
Provider Selector
   ├── JDoodle Provider
   └── Judge0 Provider
          ↓
      Local Judge0 Docker
```

### Current Rules

* JDoodle is the active Phase 2 coding execution provider.
* JDoodle credentials remain backend-only.
* The frontend must not contain JDoodle credentials.
* The coding controller remains responsible for test-case iteration, expected-vs-actual comparison, scoring, persistence and frontend response formatting.
* Provider-specific API parsing belongs inside the provider layer.
* The code execution service returns a normalized provider-independent result.
* The frontend remains provider-agnostic.
* Database schemas remain provider-agnostic.
* Do not batch multiple test cases into one JDoodle request unless explicitly approved.
* The current implementation may perform one provider execution per test case.
* Repeated failure-path testing may use controlled/mock provider responses where appropriate.
* Real JDoodle executions must still be used to verify the actual integration.

### Normalized Execution Contract

The provider layer should expose a result similar to:

```js
{
  executionSuccess: boolean,
  compileError: boolean,
  runtimeError: boolean,
  timedOut: boolean,
  stdout: string,
  stderr: string,
  compileOutput: string,
  providerError: null | {
    type: string,
    message: string
  }
}
```

The exact JDoodle response format must not propagate beyond the provider layer.

### Future Judge0 Support

Judge0 is a planned/future alternative execution provider.

The future Judge0 implementation may use local Judge0 Docker.

A future Judge0 provider must implement the same normalized execution contract as the JDoodle provider.

Do not build local Judge0 Docker or a Judge0 provider as part of the current JDoodle implementation unless explicitly added to the active scope.

## Core Work

* Gemini-generated vocabulary and grammar questions.
* Deterministic answer scoring.
* Gemini-generated technical MCQs filtered by role/skills and tagged by difficulty.
* Threshold-based adaptive difficulty:

  * > =80%: increase
  * 50–79%: hold
  * <50%: decrease
* Coding problems and provider-independent execution/test-case scoring using JDoodle as the active provider.
* Technical interview with structured Gemini output.
* Maximum one follow-up question.
* HR interview with structured Gemini output.
* Results screen with raw per-stage scores.
* Full integration testing and bug logging.

## Interview Technical Rubric

Structured output must include:

* technicalCorrectness
* relevance
* completeness
* communication
* overallScore
* strengths
* weaknesses
* feedback
* followUpQuestion

## HR Rubric

Evaluate:

* situation
* action
* result
* clarity
* professionalism
* relevance

---

# PHASE 3 — INTELLIGENCE + PERSONALIZATION + FINAL POLISH

**Days 41–60**

## Exit Criteria

The system can:

1. Calculate a deterministic role-configured readiness score.
2. Build a per-skill competency evidence table.
3. Detect and rank skill gaps deterministically.
4. Generate an explainable roadmap using hybrid logic.
5. Show recommendation reasons backed by stored scores/thresholds.

## Core Work

* Config-driven weighted readiness score.
* Competency mapping.
* Skill-gap engine.
* Rule-based prioritization.
* Gemini-generated roadmap explanation text.
* Recommendation evidence storage.
* Final README.
* Architecture diagram.
* Screenshots.
* Demo data.
* GitHub cleanup.
* Viva preparation.

## Protected Priority

If Phase 3 slips, protect in this order:

1. Readiness score engine.
2. Competency mapping.
3. Skill-gap detection.
4. Explainability.
5. Roadmap.
6. Optional features only after the above are complete.

---

# Development Rules

* Build incrementally.
* Do not dump the whole application at once.
* Do not claim a feature is implemented until it is actually implemented.
* Explain code before providing it.
* Keep frontend and backend responsibilities separate.
* Use deterministic code for deterministic business logic.
* Use AI for language understanding/generation/evaluation where it adds genuine value.
* Validate structured AI output before storage/use.
* Keep secrets in `.env`.
* Never commit `.env`.
* Test continuously.
* Use meaningful Git commits.
* Every important user action needs loading, success, and error states.
* Academic claims must be technically defensible.

## State Tracking

Every development response begins:

`[CURRENT PHASE: X | CURRENT TASK: Y | NEXT TASK: Z]`

If an error is pasted, stop progression and debug it before continuing.

If `REFRESH CONTEXT` is sent, stop development and provide a 200-word state summary without code.
