# CAREERREADY — ANTIGRAVITY DEVELOPMENT INSTRUCTIONS

## 1. PROJECT IDENTITY

Project name: CareerReady

Repository: SkillPlot

Repository owner/project workspace:

```text
VishalNarketpalli-ghub/SkillPlot
```

Developer's working branch:

```text
member-rohit
```

CareerReady is an AI-powered Adaptive Career Readiness & Recruitment Simulation Platform.

The application is a **responsive web application**.

Primary technology stack:

* Frontend: React + Vite
* Backend: Node.js + Express
* Database: MongoDB Atlas + Mongoose
* Authentication: JWT + bcrypt
* AI: Google Gemini API
* Coding execution: JDoodle (current) with local Judge0 Docker planned as a future alternative provider
* API testing: Postman
* Version control: Git + GitHub

The project is being developed by a team of four:

* BL = Backend Lead
* A = Intake / Assessment pair-lead
* B = Interview / Intelligence pair-lead
* C = Float / Full-stack / QA / Integration

---

# 2. PURPOSE OF THIS FILE

This file defines **HOW development must be performed**.

It does NOT contain the detailed implementation plan for every project phase.

The actual requirements and daily tasks are defined in the relevant documents inside:

```text
docs/
```

Therefore:

```text
AGENTS.md
    = HOW to work

Phase documentation
    = WHAT to build

Repository
    = WHAT has actually been built
```

Do not duplicate the entire phase plans inside this file.

---

# 3. DOCUMENT AUTHORITY

Before beginning work on any phase, read:

1. `AGENTS.md`
2. `docs/MASTER_PROJECT_PLAN.md`
3. All relevant phase-specific development documents
4. Relevant frontend/backend/API/database documentation

Expected project documentation may include:

```text
docs/
├── MASTER_PROJECT_PLAN.md
├── FRONTEND_DEVELOPMENT.md
├── BACKEND_DEVELOPMENT.md
├── API_DOCUMENTATION.md
├── DATABASE_DESIGN.md
├── PHASE1_DEVELOPMENT.md
├── PHASE2_DEVELOPMENT.md
└── PHASE3_DEVELOPMENT.md
```

Not all phase-specific files may exist at the same time.

Only use phase documents that actually exist in the repository.

The current phase is determined by the developer's explicit instruction.

For example:

```text
START PHASE 1
START PHASE 2
START PHASE 3
```

When a phase is started:

1. Locate the documentation for that phase.
2. Read the complete phase documentation.
3. Understand the entire phase before implementing the current day.
4. Follow the documented day-by-day task breakdown.

The documentation is the source of truth for **what must be built**.

Do not silently invent requirements.

Do not silently remove requirements.

Do not replace documented architecture with a different architecture without discussing it with the developer.

If documentation and the existing implementation conflict, identify the discrepancy before making a major change.

---

# 4. PHASE CONTROL

The project has three phases.

Do not start a phase unless the developer explicitly instructs you to do so.

Examples:

```text
START PHASE 1
START PHASE 2
START PHASE 3
```

Once a phase has started, work only within that phase.

Do NOT automatically start the next phase after completing the current phase.

The developer decides when to transition.

For example:

```text
PHASE 1 COMPLETE
        ↓
WAIT
        ↓
Developer says START PHASE 2
        ↓
Begin Phase 2
```

Never assume permission to continue.

---

# 5. DAILY EXECUTION RULE — CRITICAL

Every phase is divided into daily tasks.

Each day contains tasks for:

* BL
* A
* B
* C

When the developer says:

```text
START DAY X
```

complete the tasks assigned to **ALL FOUR ROLES for that day** according to the current phase documentation.

Example:

```text
START DAY 1
```

means:

1. Complete BL's Day 1 tasks.
2. Complete A's Day 1 tasks.
3. Complete B's Day 1 tasks.
4. Complete C's Day 1 tasks.
5. Integrate the work where necessary.
6. Test the completed work.
7. Report the day's results.
8. STOP.

Do NOT automatically start Day 2.

Wait for:

```text
START DAY 2
```

The same rule applies to every day of every phase.

The developer controls daily progression.

---

# 6. DAY NUMBERING

Day numbers are relative to the current phase.

For example:

```text
PHASE 1
Day 1
Day 2
...
Day 12
```

and:

```text
PHASE 2
Day 1
Day 2
...
Day 28
```

These are separate phase schedules.

Always identify the current phase together with the day.

Use:

```text
PHASE 1 — DAY 5
```

rather than simply:

```text
DAY 5
```

when reporting progress.

---

# 7. BEFORE IMPLEMENTING A DAY

Before writing application code:

1. Read `AGENTS.md`.
2. Read the relevant project documentation.
3. Read the complete current phase plan.
4. Locate the current day's tasks.
5. Inspect the existing repository.
6. Inspect the existing frontend.
7. Inspect the existing backend.
8. Check existing routes.
9. Check existing models.
10. Check existing services/components.
11. Check the current Git branch.
12. Check Git status.
13. Check `.gitignore`.
14. Check `.env.example`.
15. Determine what already exists before creating new functionality.

Do not recreate existing functionality without checking first.

Before making significant changes, explain:

### WHAT

What will be created or changed?

### WHERE

Which files/directories will be affected?

### WHY

Why is the change required by the current task?

### HOW

How will the implementation work?

### TEST

How will the implementation be verified?

Then implement incrementally.

Do not dump an entire phase worth of code at once.

---

# 7. CODE EXECUTION PROVIDER RULES

The current active code-execution provider is JDoodle.

JDoodle is responsible for executing submitted code through the backend code-execution service/provider boundary.

The application must distinguish at minimum between:

- Successful execution
- Compilation error
- Runtime error
- Timeout
- Invalid submission/request
- Code-execution provider failure

Do not treat every code-execution provider failure as a wrong coding answer.

The coding controller and frontend must remain provider-agnostic.

Provider-specific request/response handling belongs inside the provider/service layer.

Current architecture:

```text
codingController
    ↓
codeExecutionService
    ↓
jdoodleProvider
    ↓
JDoodle API
```

Future architecture may support:

```text
codeExecutionService
    ↓
provider selector
    ├── JDoodle
    └── Judge0
          ↓
       Local Docker
```

Local Judge0 Docker is future/planned work.

Do NOT implement the Judge0 provider or Docker infrastructure unless the developer explicitly instructs you to do so.

Keep JDoodle credentials in `.env`.

Expected credential variables:

```text
JDOODLE_CLIENT_ID
JDOODLE_CLIENT_SECRET
```

Never hardcode API credentials.

Never expose API credentials in:

* frontend code
* source files
* comments
* logs
* screenshots
* API responses
* Git history

Do not expose actual credential values in reports.

Provider-specific secrets must remain backend-only.

The frontend must communicate only with the backend coding API.

The frontend must never call JDoodle directly.

---

# 8. CODE COMMENTS

The codebase must be understandable by all four team members.

When creating or modifying code, add **useful comments for non-obvious logic**.

Comments should explain things such as:

* Business rules
* Complex algorithms
* Authentication/security decisions
* AI prompt/schema decisions
* Data transformations
* Integration behavior
* Important assumptions
* Edge cases
* Non-obvious implementation decisions

Do NOT add meaningless comments to obvious code.

Bad:

```js
// Create user
const user = new User(data);
```

Good:

```js
// Hash the password before persistence.
// Plain-text passwords must never be stored in MongoDB.
const hashedPassword = await bcrypt.hash(password, 10);
```

Comments must improve understanding rather than create noise.

---

# 9. ENVIRONMENT VARIABLES AND SECRETS

Never hard-code:

* API keys
* Database credentials
* JWT secrets
* Passwords
* Private tokens
* Environment-specific credentials

Use environment variables.

Maintain:

```text
.env.example
```

as the safe configuration template.

The real configuration belongs in:

```text
.env
```

The `.env` file must NOT be committed to GitHub.

Whenever a new environment variable is required:

1. Add its variable name to `.env.example`.
2. Add a safe placeholder.
3. Explain what it is used for.
4. Tell the developer what real value must be placed in `.env`.
5. Verify `.env` is ignored by Git.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
JDOODLE_CLIENT_ID=your_jdoodle_client_id
JDOODLE_CLIENT_SECRET=your_jdoodle_client_secret
```

Never invent real credentials.

Never expose actual secret values in reports.

When reporting environment configuration, report only variable names.

---

# 10. GIT / GITHUB RULES — CRITICAL

The project is connected to GitHub.

Repository:

```text
VishalNarketpalli-ghub/SkillPlot
```

Developer's branch:

```text
member-rohit
```

All GitHub work performed for this developer must use:

```text
member-rohit
```

## NO AUTOMATIC COMMITS

Do NOT automatically commit:

* after every file
* after every task
* after every role
* after every day
* after every successful test

Completing a task does NOT mean a Git commit should be created.

Do not automatically push to GitHub.

After completing work, report the Git status instead.

---

# 11. COMMIT RULE

Only create a Git commit when the developer explicitly asks.

Examples:

```text
COMMIT DAY 1
```

```text
COMMIT THESE CHANGES
```

Before committing:

1. Run `git status`.
2. Review changed files.
3. Check for `.env`.
4. Check for secrets.
5. Check for `node_modules`.
6. Check for build artifacts.
7. Check for unwanted generated files.
8. Verify the current branch is `member-rohit`.
9. Create a meaningful commit.
10. Report the commit message and hash.

Preferred commit style:

```text
feat(auth): add user registration
feat(resume): add resume upload
feat(jd): add job description analysis
fix(auth): handle invalid credentials
docs(api): document authentication endpoints
```

Do not create unnecessary commits.

---

# 12. PUSH RULE

Only push to GitHub when the developer explicitly asks.

Example:

```text
PUSH TO MY BRANCH
```

Before pushing:

1. Verify the current branch.
2. The current branch MUST be:

```text
member-rohit
```

3. Check for secrets.
4. Check Git status.
5. Push only to `member-rohit`.

Never push automatically.

Never push to:

```text
main
develop
```

Never push to another team member's branch.

Never merge branches unless explicitly instructed.

Never create a pull request unless explicitly instructed.

Never force-push.

Do not use destructive Git commands unless the developer explicitly authorizes the exact operation.

Examples of destructive commands requiring explicit authorization:

```text
git reset --hard
git clean -fd
git push --force
```

If the current branch is not `member-rohit` when a push is requested:

**STOP and inform the developer.**

---

# 13. FRONTEND RULES

The application is a **responsive web application**.

Do NOT create a separate mobile application.

Follow the frontend architecture defined by the project documentation.

Prefer:

* Reusable components
* Consistent design system
* Centralized API communication
* Clear state management
* Proper loading states
* Proper error states
* Responsive layouts

Do not duplicate UI logic unnecessarily.

Do not rewrite working components merely for stylistic preference.

---

# 14. BACKEND RULES

Follow the backend architecture defined by the project documentation.

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

Routes should not contain large amounts of business logic.

Controllers should coordinate request/response behavior.

Services should contain reusable business logic.

Models should define database structures.

Middleware should handle cross-cutting concerns.

AI prompts and schemas should be reusable where appropriate.

Do not introduce unnecessary architectural complexity.

---

# 15. AI VS DETERMINISTIC LOGIC

Respect the AI/deterministic boundaries defined by the current phase documentation.

Do not use AI to replace deterministic business logic when the project specification explicitly requires deterministic calculation.

AI may be used for tasks such as:

* Natural-language understanding
* Information extraction
* Question generation
* Interview generation
* Interview evaluation
* Explanatory text
* Roadmap explanations

Deterministic application logic should remain responsible for calculations and business rules explicitly defined as deterministic.

Do not allow AI output to directly compromise database integrity.

---

# 16. STRUCTURED AI OUTPUT

Whenever an AI feature requires structured output:

1. Define the expected schema.
2. Keep the schema consistent.
3. Use structured output where supported.
4. Validate the returned data.
5. Handle malformed responses.
6. Handle missing fields.
7. Handle invalid score ranges.
8. Handle API failures.
9. Keep prompts/schema definitions reusable.
10. Do not blindly trust model output.

If multiple AI features use related schemas, ensure field names, data types, and score ranges remain consistent.

Do not independently invent incompatible schemas for different features.

---

# 17. TESTING RULE

Every completed task must be tested.

Do not claim that functionality works merely because:

* The file exists
* The function exists
* The server compiles
* The frontend renders
* The API returns a response once

Test the actual behavior.

### Backend

Where applicable, test:

* Server startup
* Endpoint behavior
* Validation
* Authentication
* Authorization
* Database operations
* Error handling
* External API integrations

### Frontend

Where applicable, test:

* Rendering
* Navigation
* Forms
* Validation
* API integration
* Loading states
* Error states
* Responsive behavior

### Integration

Test relevant flows such as:

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

or:

```text
Backend
    ↓
Judge0
```

---

# 18. TEST WITH REALISTIC SAMPLE DATA

When a task requires functional testing, use realistic fictional sample data.

Do not use real people's private information.

For example:

```text
Name:
CareerReady Test User

Email:
testuser@careerready.local
```

Use realistic fictional resumes, JDs, interview answers, coding submissions, and assessment responses where required.

Testing should exercise the actual application flow rather than only isolated functions when an end-to-end test is appropriate.

---

# 19. ERROR PROTOCOL — CRITICAL

If an error occurs:

**STOP DEVELOPMENT PROGRESSION.**

Do not continue to another task while ignoring the error.

First:

1. Identify the error.
2. Determine the likely root cause.
3. Identify the affected file/component/service.
4. Explain the cause.
5. Explain the fix.
6. Apply the fix when appropriate.
7. Test the fix.
8. Report the result.

If the issue cannot be confidently resolved:

STOP and ask the developer for the required information.

Never hide errors.

Never claim success when an important test is failing.

---

# 20. SCOPE CONTROL

Work only on the tasks defined for the current phase and current day.

Do not add unrelated features.

Do not introduce optional features simply because there is available development time.

If a new feature is proposed:

1. Explain what it requires.
2. Estimate its impact.
3. Identify which CORE task would be delayed, reduced, or removed.
4. Wait for explicit developer approval.

No feature is considered "free".

Do not sacrifice core functionality for optional features without explicit approval.

---

# 21. CHECKPOINTS AND BUFFERS

If the current phase documentation defines:

* Checkpoints
* Buffer days
* Integration days
* Sign-off days
* Regression testing
* Reliability testing

they must be preserved.

Do not silently remove a buffer day.

Do not convert a checkpoint into normal feature development.

Do not skip an integration test because individual components appear to work.

If a checkpoint fails:

1. Report the failure.
2. Identify the blocking issues.
3. Prioritize the fixes.
4. Do not blindly continue to the next stage.

---

# 22. DOCUMENTATION RULE

Documentation must reflect what is **actually implemented**.

Never mark future functionality as completed.

Never fabricate:

* APIs
* Database fields
* Features
* Test results
* Architecture
* Configuration
* AI behavior

When implementation changes documented behavior, update the appropriate documentation when required.

When completing documentation tasks, document what was actually built rather than what was originally planned if there were deviations.

---

# 23. DAILY COMPLETION REPORT

At the end of every day, provide a report.

Use:

```text
PHASE X — DAY Y
```

Then:

## BL

* Completed tasks
* Files created/changed
* Tests performed

## A

* Completed tasks
* Files created/changed
* Tests performed

## B

* Completed tasks
* Files created/changed
* Tests performed

## C

* Completed tasks
* Files created/changed
* Tests performed

## Integration

* What was integrated
* What was tested

## Environment Variables

List only variable names that were added/required.

Do not reveal values.

## Git

Report:

* Current branch
* Working-tree status
* Relevant changed files

Do not commit or push unless explicitly instructed.

## Issues

List unresolved issues.

## Day Status

End with:

```text
DAY Y COMPLETE
WAITING FOR COMMAND TO START THE NEXT DAY
```

Then STOP.

---

# 24. PHASE COMPLETION REPORT

When the final day of a phase is completed, do NOT automatically begin the next phase.

Perform the phase's documented sign-off activities.

Then report:

```text
PHASE X COMPLETE
```

Include:

* Exit criteria status
* Features implemented
* Integration status
* Testing status
* Known issues
* Documentation status
* Git status
* Environment requirements
* Recommended next step

Then STOP.

Wait for the developer to explicitly start the next phase.

---

# 25. CONTEXT REFRESH COMMAND

If the developer says:

```text
REFRESH CONTEXT
```

immediately stop development.

Do not write code.

Provide a concise project-state summary containing:

1. Current phase
2. Current day
3. Completed days/tasks
4. Current implementation state
5. Files created/modified
6. Pending tasks
7. Known issues
8. Environment variables/configuration required
9. Current Git branch
10. Git working-tree status
11. Next task

Then STOP and wait.

---

# 26. FIRST ACTION WHEN OPENING THE PROJECT

When first opening the project or when the developer asks you to initialize/re-understand the project:

Do NOT immediately write application code.

First:

1. Read `AGENTS.md`.
2. Read `docs/MASTER_PROJECT_PLAN.md`.
3. Identify the current phase.
4. Read the documentation for that phase.
5. Inspect the repository.
6. Inspect frontend/backend structure.
7. Check the current Git branch.
8. Check Git status.
9. Check `.gitignore`.
10. Check `.env.example`.
11. Identify existing functionality.
12. Identify missing prerequisites.

Then report:

```text
PROJECT UNDERSTANDING
CURRENT PHASE
CURRENT DAY
REPOSITORY STATE
CURRENT GIT BRANCH
DOCUMENTS READ
CURRENT PHASE OBJECTIVE
CURRENT DAY TASKS
FILES LIKELY TO CHANGE
ENVIRONMENT VARIABLES REQUIRED
POTENTIAL RISKS/BLOCKERS
FIRST IMPLEMENTATION STEP
```

Do not modify application code during this initial inspection.

Wait for the developer's explicit command.

---

# 27. DEVELOPMENT COMMANDS

The developer controls execution.

## Start a phase

```text
START PHASE 1
```

or:

```text
START PHASE 2
```

or:

```text
START PHASE 3
```

Read the relevant phase documentation and report your understanding before implementation if this is the first time entering that phase.

## Start a day

```text
START DAY X
```

Execute ALL four roles for the current phase's Day X:

```text
BL
A
B
C
```

Then:

```text
Integrate
Test
Report
STOP
```

Never automatically continue.

## Commit

```text
COMMIT THESE CHANGES
```

or:

```text
COMMIT DAY X
```

Commit only after checking the branch and files.

## Push

```text
PUSH TO MY BRANCH
```

Push only to:

```text
member-rohit
```

## Refresh context

```text
REFRESH CONTEXT
```

Stop and provide the current project-state summary.

---

# 28. IMPORTANT GIT SAFETY REMINDER

The developer's branch is:

```text
member-rohit
```

Never assume that the currently checked-out branch is safe.

Before any requested Git push:

```text
CHECK CURRENT BRANCH
        ↓
Must equal member-rohit
        ↓
Check for secrets
        ↓
Check Git status
        ↓
Push only to member-rohit
```

If any condition fails:

**STOP.**

---

# 29. FINAL DEVELOPMENT PRINCIPLE

Build CareerReady incrementally.

Prioritize:

* Correctness
* Security
* Understandability
* Maintainability
* Testability
* Team collaboration
* Clear architecture
* Reliable integrations
* Explainable AI behavior
* Controlled Git workflow
* Scope discipline

Do not optimize for the amount of code written.

Optimize for a working, understandable, testable system that all four team members can continue developing.

The developer controls:

* Phase progression
* Day progression
* Feature additions
* Commits
* GitHub pushes
* Branch operations
* Final sign-off

# CODE DOCUMENTATION AND COMMENTS — CRITICAL

The codebase must be understandable to all four team members.

Whenever creating or modifying code, add useful explanatory comments for logic that is not immediately obvious from the code itself.

Comments must explain the reasoning, purpose, or behavior of the code rather than merely restating the syntax.

## What comments should explain

Add comments when appropriate for:

* Business rules
* Complex algorithms
* Non-obvious control flow
* Authentication and security decisions
* Data transformations
* Database operations with important assumptions
* API integration behavior
* Gemini/API prompt decisions
* Structured AI output schemas
* AI response validation
* Error handling decisions
* Code-execution provider behavior (JDoodle / future Judge0 Docker)
* Adaptive assessment logic
* Scoring calculations
* Important state-management decisions
* Edge cases
* Fallback behavior
* Important architectural decisions
* Workarounds for external API limitations
* Any implementation detail that another developer would need to understand when maintaining the code

## Comment quality

Comments should answer questions such as:

* Why is this being done?
* Why was this approach chosen?
* What important rule is being enforced?
* What assumption does this code depend on?
* What happens in an important edge case?
* Why is this validation necessary?
* Why must this operation happen before another operation?

Avoid comments that simply describe obvious syntax.

Bad:

```js
// Create user
const user = new User(data);
```

Bad:

```js
// Loop through questions
questions.forEach(...)
```

Good:

```js
// Never persist the raw password.
// Authentication later depends on comparing the submitted password
// against this bcrypt hash.
const hashedPassword = await bcrypt.hash(password, 10);
```

Good:

```js
// Keep the follow-up count bounded to one so the interview
// remains adaptive without allowing the AI to generate an
// unbounded conversational loop.
if (followUpCount >= 1) {
    return null;
}
```

## Existing code audit

When entering a new phase, inspect the existing implementation relevant to the current work.

If previously written code contains important non-obvious logic but lacks useful explanatory comments:

1. Identify the missing documentation.
2. Add concise explanatory comments.
3. Do not rewrite working logic merely to add comments.
4. Do not add comments to every line.
5. Preserve existing behavior.
6. Test the affected functionality after making the documentation changes.

Existing code does NOT need to be fully rewritten or commented line-by-line.

The goal is to make important logic understandable, not to maximize the number of comments.

## New code requirement

Every new or substantially modified non-trivial function, service, controller, model, component, utility, algorithm, AI prompt/schema, or integration must be reviewed for whether an explanatory comment is needed.

If the implementation contains a non-obvious decision, document that decision close to the relevant code.

## AI-specific requirement

For AI-related code, comments should explain important decisions such as:

* What the prompt is intended to achieve
* Why a particular schema exists
* Why a field is required
* Why validation is performed
* Why malformed AI output is handled in a particular way
* Why deterministic logic is kept outside the AI
* Why a retry/fallback mechanism exists

Do NOT place sensitive information, API keys, credentials, tokens, or private user data inside comments.

## Documentation standard

Comments are part of maintainability.

A future team member should be able to understand the important reasoning behind the implementation without having to reverse-engineer every non-obvious section of the code.

Prioritize:

Correctness → Clarity → Maintainability → Concise comments

Do not optimize for comment quantity.
Optimize for useful explanation.
