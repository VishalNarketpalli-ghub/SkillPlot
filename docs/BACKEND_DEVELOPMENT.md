# BACKEND_DEVELOPMENT.md

# CareerReady Backend Development

## Platform
REST API backend for the CareerReady responsive web application.

## Stack
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcrypt
- Gemini API
- Judge0 in Phase 2

## Backend Responsibilities
- Authentication
- Authorization
- Validation
- Business logic
- Database operations
- AI calls
- Deterministic scoring
- Recommendation logic
- External API integration
- Error handling
- Security

## Suggested Structure

```text
backend/
└── src/
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── services/
    ├── utils/
    ├── prompts/
    ├── validators/
    ├── app.js
    └── server.js
```

Routes define endpoints. Controllers handle HTTP request/response concerns. Services contain business logic. Models define database structures. Middleware handles cross-cutting concerns.

---

# PHASE 1 — FOUNDATION + CORE FLOW

## DAY 1

### TASK 1.1 — Express Scaffold

**Objective:** Create the backend foundation.

**What:** Initialize Node project and Express application.

**Why:** Establish the API layer.

**Where:** `backend/`

**How:**
1. Initialize package configuration.
2. Create `src/app.js`.
3. Create `src/server.js`.
4. Create initial route structure.
5. Add environment configuration.

**Test:** Start server and call a health endpoint.

**Expected result:** Server starts without errors.

**Git commit:** `chore: scaffold backend`

### TASK 1.2 — Git and Environment Convention

Create:
- `.env`
- `.env.example`
- `.gitignore`

Never commit secrets.

Expected environment categories:
- server port
- MongoDB connection string
- JWT secret
- Gemini credential
- later Judge0 credentials

---

## DAY 2

### TASK 1.3 — MongoDB Connection

**What:** Connect Express to MongoDB Atlas through Mongoose.

**Why:** Persist users and Phase 1 data.

**Where:** `src/config/`

**Test:** Start backend and verify successful database connection.

### TASK 1.4 — User Model

Core fields:
- name
- email
- passwordHash
- education
- degree
- branch
- graduationYear
- skills
- targetRole
- experienceLevel
- resumeId
- personalityProfileId

`personalityProfileId` remains null until that optional module exists.

### TASK 1.5 — Register/Login

Implement:
- `POST /api/auth/register`
- `POST /api/auth/login`

Use bcrypt for password hashing.

Never return `passwordHash` to the client.

**Git commit:** `feat: add user authentication`

---

## DAY 3

### TASK 1.6 — JWT Middleware

Create authentication middleware that:
1. Reads bearer token.
2. Verifies JWT.
3. Identifies user.
4. Rejects missing/invalid tokens.

### TASK 1.7 — Validation and Error Middleware

Create consistent API errors.

Validation must occur before business logic.

### TASK 1.8 — Authentication Integration Test

Verify:
- registration
- duplicate email rejection
- login
- incorrect password rejection
- protected route without token
- protected route with valid token

**CHECKPOINT:** Auth works end-to-end.

---

## DAY 4

### TASK 1.9 — User Profile API

Implement:
- `GET /api/users/me`
- `PUT /api/users/me`

Allow CRUD/update of core profile fields.

### TASK 1.10 — Resume Model and Upload Endpoint

Implement:
- `POST /api/resume/upload`
- `GET /api/resume/:id`

Use Multer for multipart upload handling.

Store resume metadata and extracted information according to the selected storage approach.

---

## DAY 5

### TASK 1.11 — Resume Text Extraction

For PDF resumes:
- extract text using `pdf-parse`.
- normalize extracted text.
- perform initial regex-based skill extraction.

The regex stage is deterministic preprocessing. Gemini will provide the richer interpretation later.

### TASK 1.12 — Job Description Model

Create fields for:
- userId
- title
- company
- rawText
- requiredSkills
- preferredSkills
- experienceRequirements
- technicalRequirements
- competencies
- analysis

---

## DAY 6

### TASK 1.13 — Shared Gemini Prompt/Schema Utility

**Objective:** Create one reusable AI integration pattern.

**Rules:**
- Prompts live under `src/prompts/`.
- Structured outputs are validated.
- Controllers do not contain large prompts.
- Invalid AI output must result in retry or controlled error.

### TASK 1.14 — Resume Gemini Extraction

Input:
- extracted resume text

Output:
- structured skills
- education
- projects/experience if included in the implemented schema

Validate output before storage.

### TASK 1.15 — JD Gemini Analysis

Input:
- raw JD text

Output:
- required skills
- preferred skills
- experience requirements
- technical requirements
- relevant competencies

**Git commit:** `feat: add resume and jd ai analysis`

---

## DAY 7

### TASK 1.16 — Deterministic Match Score

**Critical rule:** Gemini does not calculate the authoritative match score.

Implement one deterministic approach:
- normalized keyword overlap
- or TF-IDF/cosine similarity

The selected formula must be documented.

Store enough evidence to explain:
- matched skills/terms
- missing skills/terms
- resulting score

### TASK 1.17 — Static Role Workflow

Create role-template data.

Example:

```text
Frontend Developer:
Resume → Vocabulary → Grammar → Technical MCQ → Coding
→ Technical Interview → HR Interview
```

The workflow is selected by role/template lookup.

It is **not AI-generated** in Phase 1.

### TASK 1.18 — Resume/JD Analysis Endpoint

Return:
- resume data
- JD data
- match score
- matched skills
- missing skills

---

## DAY 8

### TASK 1.19 — End-to-End Integration

Test:

`Register → Login → Profile → Resume → Parse → JD → Match → Workflow`

Record:
- bug
- severity
- owner
- reproduction steps
- fix
- retest status

**CHECKPOINT:** Phase 1 is integration-tested.

---

## DAY 9

### TASK 1.20 — Bug Fixing

Fix Day 8 issues.

BL reviews all backend PRs.

Do not add unrelated features.

---

## DAY 10

### TASK 1.21 — Buffer

Use for blockers, failed integration tests, refactoring and cleanup.

If the team is ahead, pull forward a small Phase 2 backend task.

---

## DAY 11

### TASK 1.22 — Documentation From Actual Implementation

Write:
- Phase 1 backend development documentation
- API documentation
- database design

Do not document proposed functionality as implemented.

---

## DAY 12

### TASK 1.23 — Phase 1 Sign-off

Verify:
- authentication
- profile
- resume upload
- extraction
- Gemini extraction
- JD analysis
- deterministic match score
- static workflow
- end-to-end flow

Tag the Phase 1 release.

---

# PHASE 2 — RECRUITMENT SIMULATION + AI EVALUATION

## TASK 2.1 — Assessment Architecture
Create assessment, question and attempt models.

## TASK 2.2 — Vocabulary
Gemini generates questions. Backend scores against expected answers deterministically.

## TASK 2.3 — Grammar
Gemini generates questions. Scoring remains deterministic.

## TASK 2.4 — Technical MCQs
Generate role/skill-specific questions, validate structure, tag difficulty.

## TASK 2.5 — Adaptive Difficulty
Implement:
- score >= 80% → increase
- score 50–79% → hold
- score < 50% → decrease

Do not implement Elo/IRT.

## TASK 2.6 — Coding
Create problem model and submission API. Send submissions to Judge0. Store status, test results, runtime and memory.

## TASK 2.7 — Technical Interview
Use shared prompt/schema utility.

Return structured:
- technicalCorrectness
- relevance
- completeness
- communication
- overallScore
- strengths
- weaknesses
- feedback
- followUpQuestion

Maximum one follow-up.

## TASK 2.8 — HR Interview
Use rubric:
- situation
- action
- result
- clarity
- professionalism
- relevance

## TASK 2.9 — Raw Results
Store and return raw scores per stage.

Do not calculate the overall readiness score in Phase 2.

## TASK 2.10 — Full Integration Test
Run the complete recruitment simulation and log all failures.

---

# PHASE 3 — INTELLIGENCE + PERSONALIZATION

## TASK 3.1 — Readiness Score Engine

Implement deterministic weighted scoring.

Weights are configuration data per role.

Do not ask Gemini to calculate the final score.

## TASK 3.2 — Competency Mapping

For every relevant skill, store evidence from:
- resume
- MCQ
- coding
- interview

Include score/confidence/gap level where supported.

## TASK 3.3 — Skill Gap Engine

Compare:
`role requirements` vs `candidate competency profile`

Classify:
- high
- medium
- low

Rank by importance and evidence.

## TASK 3.4 — Recommendation Engine

Use:
- skill-gap score
- role importance
- rule-based prioritization

Every recommendation must have evidence.

## TASK 3.5 — Roadmap Generation

Hybrid:
1. deterministic skill-gap/rule logic chooses priorities.
2. Gemini generates explanation/roadmap text.
3. backend validates/stores the result.

Gemini does not decide the underlying priority without deterministic evidence.

## TASK 3.6 — Explainability

Store:
- triggering skill
- score
- threshold
- role requirement
- recommendation
- reason

The UI receives a human-readable reason.

## TASK 3.7 — Final Security and Testing

Test:
- authentication
- authorization
- validation
- AI failures
- malformed AI JSON
- database failures
- external API failures
- rate/abuse controls where appropriate
- end-to-end flow

## TASK 3.8 — Deployment and Documentation

Complete:
- README
- architecture diagram
- API documentation
- database design
- AI architecture
- screenshots
- demo data
- GitHub cleanup
- viva notes
