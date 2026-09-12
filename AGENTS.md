# CAREERREADY — ANTIGRAVITY DEVELOPMENT INSTRUCTIONS

## 1. PROJECT

Project name: CareerReady

Repository: SkillPlot

CareerReady is an AI-powered adaptive career readiness and recruitment simulation platform.

The application is a **responsive web application**.

Primary technology stack:

* Frontend: React + Vite
* Backend: Node.js + Express
* Database: MongoDB Atlas + Mongoose
* Authentication: JWT + bcrypt
* AI: Google Gemini API
* Coding execution: Judge0
* API testing: Postman
* Version control: Git + GitHub

The project is being developed by a team of four people.

Team roles:

* BL = Backend Lead
* A = Intake / Assessment pair-lead
* B = Interview / Intelligence pair-lead
* C = Float / Full-stack / QA / Integration

---

# 2. DOCUMENT AUTHORITY

Before doing any development work, read and understand ALL of these documents:

1. `docs/MASTER_PROJECT_PLAN.md`
2. `docs/FRONTEND_DEVELOPMENT.md`
3. `docs/BACKEND_DEVELOPMENT.md`
4. `docs/API_DOCUMENTATION.md`
5. `docs/DATABASE_DESIGN.md`

These documents are the primary source of truth for the current project requirements.

The current documentation provided to this project covers **PHASE 1**.

Do not invent additional Phase 1 requirements.

Do not silently change the architecture or task breakdown.

Do not duplicate project requirements unnecessarily inside this file.

This file defines **how development should be performed**.

The documentation defines **what should be built**.

If documentation and the existing repository appear inconsistent, inspect the repository and report the discrepancy before making a major architectural decision.

---

# 3. CURRENT DEVELOPMENT SCOPE

The immediate development scope is:

**PHASE 1 — FOUNDATION + CORE FLOW**

Phase 1 consists of Days 1–12 as defined in the project documentation.

The Phase 1 exit criteria are:

A user must be able to:

1. Register
2. Log in
3. Access protected routes
4. Manage their profile
5. Upload a resume
6. Extract resume text
7. Extract resume skills/education
8. Enter or upload a Job Description
9. Extract JD requirements
10. Calculate a deterministic resume-to-JD match score
11. See missing skills
12. See a static role-based recruitment workflow

Follow the exact daily task breakdown in the project documents.

Do not begin Phase 2 or Phase 3 unless explicitly instructed.

---

# 4. DAILY EXECUTION RULE — CRITICAL

Development MUST happen **one DAY at a time**.

Each day contains tasks for:

* BL
* A
* B
* C

When the developer instructs:

```text
START DAY X
```

complete the tasks for **ALL FOUR ROLES for that day** according to the documentation.

For example:

```text
START DAY 1
```

means:

1. Complete BL — Day 1 tasks
2. Complete A — Day 1 tasks
3. Complete B — Day 1 tasks
4. Complete C — Day 1 tasks
5. Integrate the work where necessary
6. Test the completed work
7. Report the day's results
8. STOP

Do NOT automatically begin Day 2.

After completing a day, wait for an explicit command:

```text
START DAY 2
```

The same rule applies to every day.

Never automatically progress from one day to the next.

The developer controls progression.

---

# 5. BEFORE STARTING IMPLEMENTATION

Before writing application code:

1. Read `AGENTS.md`.
2. Read all five documents in `docs/`.
3. Inspect the existing repository.
4. Inspect the existing frontend.
5. Inspect the existing backend.
6. Check the current Git branch.
7. Check Git status.
8. Check `.gitignore`.
9. Check whether `.env.example` exists.
10. Check whether `.env` exists.
11. Identify existing functionality before creating new functionality.

Do not recreate files or functionality that already exists without checking first.

Before implementing a significant task, explain:

* WHAT will be created/changed
* WHERE it will be created/changed
* WHY it is required
* HOW it will work
* HOW it will be tested

Then implement incrementally.

Do not dump an entire phase worth of code at once.

---

# 6. CODE COMMENTS AND TEAM UNDERSTANDING

The codebase must be understandable by all four team members.

When creating code, add **useful comments for non-obvious logic**.

Comments should be used where they help explain:

* Business rules
* Complex logic
* Authentication/security decisions
* AI prompt/schema decisions
* Data transformations
* Algorithms
* Integration behavior
* Important assumptions
* Non-obvious edge cases

Do NOT add meaningless comments to obvious lines.

Example of a poor comment:

```js
// Create user
const user = new User(data);
```

Example of a useful comment:

```js
// Hash the password before persistence.
// Plain-text passwords must never be stored in MongoDB.
const hashedPassword = await bcrypt.hash(password, 10);
```

The goal is readable, maintainable code that another team member can understand without the original developer being present.

---

# 7. ENVIRONMENT VARIABLES AND SECRETS

Never hard-code:

* API keys
* Database credentials
* JWT secrets
* Private tokens
* Passwords
* Environment-specific secrets

Use environment variables.

Maintain:

```text
.env.example
```

as the safe configuration template.

Whenever implementation requires a new environment variable:

1. Add the variable name to `.env.example`.
2. Explain what it is used for.
3. Use a safe placeholder/example value.
4. Tell the developer what real value must be placed in `.env`.
5. Verify `.env` is ignored by Git.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
JUDGE0_API_URL=your_judge0_api_url
```

Never generate or invent real credentials.

Never place real credentials in:

* Source code
* Documentation
* `AGENTS.md`
* `.env.example`
* Git commits
* GitHub

The real values belong only in the developer's local `.env`.

---

# 8. GIT AND GITHUB RULES — CRITICAL

The project is connected to GitHub.

The developer's working branch is:

```text
member-rohit
```

GitHub repository:

```text
https://github.com/VishalNarketpalli-ghub/SkillPlot
```

The branch to use for the developer's work is:

```text
member-rohit
```

## DO NOT AUTOMATICALLY COMMIT

Do NOT create a Git commit after every task.

Do NOT create a Git commit after every file.

Do NOT create a Git commit after every day.

Do NOT push automatically after completing work.

Development and Git operations are separate.

After completing a task/day:

* Show the changes made.
* Show the relevant Git status if useful.
* Do NOT automatically commit or push.

Only create a commit when the developer explicitly requests it.

For example:

```text
COMMIT DAY 1
```

or:

```text
COMMIT THESE CHANGES
```

---

# 9. GITHUB BRANCH SAFETY

All GitHub operations initiated for this developer must use:

```text
member-rohit
```

Never push directly to:

```text
main
develop
```

Never push to another team member's branch.

Never switch to another developer's branch unless explicitly instructed.

Never create a merge commit into another branch without explicit permission.

Never merge or create a pull request unless explicitly instructed.

Never force-push.

Never use destructive commands such as:

```text
git reset --hard
git clean -fd
git push --force
```

unless the developer explicitly authorizes the specific operation.

Before any push, verify:

```text
Current branch = member-rohit
```

If the current branch is not `member-rohit`, STOP and inform the developer.

---

# 10. COMMIT RULES

Only commit when explicitly instructed.

When asked to commit:

1. Check `git status`.
2. Review changed files.
3. Make sure `.env` and secrets are not included.
4. Make sure generated/unwanted files are not included.
5. Verify the current branch is `member-rohit`.
6. Create a meaningful commit.
7. Report the commit hash/message.

Preferred commit format:

```text
feat(auth): add user registration
feat(resume): add resume upload
feat(jd): add job description analysis
fix(auth): handle invalid credentials
docs(api): document authentication endpoints
```

Do not create unnecessary commits.

---

# 11. PUSH RULES

Only push when the developer explicitly asks.

Example:

```text
PUSH TO MY BRANCH
```

Before pushing:

1. Verify the current branch.
2. Verify it is `member-rohit`.
3. Check for secrets.
4. Check Git status.
5. Push only to `member-rohit`.

Never assume that completing a task means it should be pushed.

---

# 12. AI DEVELOPMENT RULES

Use Gemini only where the project documentation specifies AI functionality.

Do not use AI to replace deterministic business logic that is explicitly required to remain deterministic.

For structured AI output:

1. Define the expected schema.
2. Request structured output where supported.
3. Validate the response.
4. Handle malformed output.
5. Do not blindly trust model output.
6. Keep reusable prompts/schema logic centralized where practical.

AI-generated content must not directly compromise database integrity or application state.

---

# 13. BACKEND DEVELOPMENT RULES

Follow the backend architecture documented in:

```text
docs/BACKEND_DEVELOPMENT.md
docs/API_DOCUMENTATION.md
docs/DATABASE_DESIGN.md
```

Prefer separation between:

```text
routes
controllers
services
models
middleware
utils
prompts
validators
config
```

Do not place large amounts of business logic directly inside routes.

Reuse existing services/utilities where appropriate.

Do not introduce a new architectural pattern without a clear reason.

---

# 14. FRONTEND DEVELOPMENT RULES

Follow:

```text
docs/FRONTEND_DEVELOPMENT.md
```

Use reusable components.

Avoid unnecessary duplication.

Keep API communication organized.

Maintain responsive web behavior.

Do NOT create a separate mobile application.

---

# 15. TESTING RULE

Every completed task must be reasonably tested.

Backend testing may include:

* Server startup
* Endpoint testing
* Validation
* Authentication
* Database operations
* Error handling

Frontend testing may include:

* Rendering
* Navigation
* Forms
* Validation
* API integration
* Loading states
* Error states
* Responsive behavior

Integration testing should verify relevant connections such as:

```text
Frontend
    ↓
Backend
    ↓
Database
```

and where applicable:

```text
Backend
    ↓
Gemini
```

Do not claim something is working without testing it.

---

# 16. ERROR PROTOCOL — CRITICAL

If an error occurs:

**STOP DEVELOPMENT PROGRESSION.**

Do not move to another task simply because it is unrelated.

Instead:

1. Identify the error.
2. Explain the root cause.
3. Identify the affected file/component.
4. Explain the fix.
5. Apply the fix when appropriate.
6. Test again.
7. Report the result.

If the issue cannot be confidently resolved, stop and ask the developer for the required information.

Do not hide errors.

Do not work around an error without explaining the trade-off.

---

# 17. DAILY COMPLETION REPORT

After completing all tasks for the current day, provide:

## Day

```text
PHASE 1 — DAY X
```

## BL

* Completed tasks
* Files changed
* Tests performed

## A

* Completed tasks
* Files changed
* Tests performed

## B

* Completed tasks
* Files changed
* Tests performed

## C

* Completed tasks
* Files changed
* Tests performed

## Integration

* What was integrated
* What was tested

## Environment Variables

List any new variables added to `.env.example`.

## Git Status

Report relevant Git status.

Do NOT commit or push unless explicitly instructed.

## Issues

List unresolved issues.

## Day Status

End with:

```text
DAY X COMPLETE
WAITING FOR COMMAND TO START DAY X+1
```

Do not proceed automatically.

---

# 18. PHASE 1 CHECKPOINTS

## Day 3 Checkpoint

Authentication should work end-to-end.

## Day 8 Checkpoint

The complete Phase 1 flow should be integration-tested:

```text
Register
→ Login
→ Upload Resume
→ Enter JD
→ Resume/JD Analysis
→ Match Score
→ Missing Skills
→ Static Workflow
```

If a checkpoint fails, prioritize fixing it before proceeding.

---

# 19. SCOPE CONTROL

Do not add functionality outside the current documented task.

If an additional feature is suggested:

1. Identify the feature.
2. Estimate the implementation impact.
3. Explain what core task would be delayed or removed.
4. Wait for explicit approval.

Do not treat optional features as free additions.

Do not expand scope without approval.

---

# 20. DOCUMENTATION RULE

Documentation must reflect what is actually implemented.

Do not mark future functionality as completed.

Do not fabricate API endpoints, database fields, features, or implementation details.

When a task changes an API or database schema, update the relevant documentation when required by the project plan.

---

# 21. CONTEXT REFRESH COMMAND

If the developer says:

```text
REFRESH CONTEXT
```

Immediately stop development.

Do not write code.

Provide a concise state summary containing:

1. Current phase
2. Current day
3. Completed tasks
4. Current implementation state
5. Files changed
6. Pending tasks
7. Known issues
8. Environment variables/configuration required
9. Git branch/status
10. Next task

Then wait for further instructions.

---

# 22. FIRST REPOSITORY ACTION

When this project is opened for the first time:

DO NOT immediately write application code.

First:

1. Read this `AGENTS.md`.
2. Read all five documents in `docs/`.
3. Inspect the repository.
4. Inspect frontend/backend structure.
5. Check Git status.
6. Check the current branch.
7. Check `.gitignore`.
8. Check `.env.example`.
9. Identify what already exists.
10. Identify what is missing.

Then report:

```text
PROJECT UNDERSTANDING
REPOSITORY STATE
CURRENT BRANCH
CURRENT PHASE
CURRENT DAY
DOCUMENTS READ
DAY TASKS
FILES THAT MAY NEED TO BE CREATED/CHANGED
ENVIRONMENT VARIABLES REQUIRED
FIRST IMPLEMENTATION STEP
```

Do not begin implementation until the developer explicitly starts the work.

---

# 23. DEVELOPMENT COMMANDS

The developer controls execution.

Examples:

```text
START PHASE 1
```

Begin Phase 1 according to the documentation.

```text
START DAY 1
```

Execute all Day 1 tasks for BL, A, B, and C.

Then stop.

```text
START DAY 2
```

Execute all Day 2 tasks for BL, A, B, and C.

Then stop.

```text
COMMIT DAY 1
```

Commit the requested changes after verifying the branch and files.

```text
PUSH TO MY BRANCH
```

Push only to:

```text
member-rohit
```

```text
REFRESH CONTEXT
```

Stop development and provide the current project-state summary.

---

# 24. FINAL DEVELOPMENT PRINCIPLE

Build the project incrementally and carefully.

Prioritize:

* Correctness
* Understandability
* Maintainability
* Testability
* Team collaboration
* Clear architecture
* Secure configuration
* Controlled Git workflow
* Scope discipline

Do not optimize for writing the largest amount of code.

The objective is to create a codebase that all four team members can understand, test, maintain, and continue developing.
