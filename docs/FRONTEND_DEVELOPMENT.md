# FRONTEND_DEVELOPMENT.md

# CareerReady — Frontend Development Plan

## 1. Purpose

This document defines the frontend development architecture, responsibilities, implementation plan, UI standards, integration rules, testing expectations, and completion criteria for the CareerReady platform.

The frontend must provide a responsive web-based recruitment simulation experience covering:

- Authentication
- User profile
- Resume upload
- Job description input
- Resume–JD match results
- Recruitment workflow
- Vocabulary assessment
- Grammar assessment
- Technical MCQs
- Adaptive difficulty
- Coding assessment
- Technical interview
- HR interview
- Results and performance reporting
- Future learning and intelligence modules

The frontend must consume backend APIs and must not duplicate backend business logic.

---

# 2. Frontend Technology Stack

## Core

- React
- Vite
- JavaScript
- React Router

## Styling

- Tailwind CSS
- Responsive design
- Reusable UI components
- Centralized theme variables

## State Management

Use lightweight state management where necessary.

Preferred options:

- React Context for global authentication/session state
- Zustand where application-wide state becomes complex

Do not introduce unnecessary global state.

## API Communication

Use:

- Axios or the project's existing HTTP client
- Centralized API service modules

All backend communication should go through service functions.

Example structure:

```text
frontend/src/services/
├── api.js
├── authService.js
├── userService.js
├── resumeService.js
├── jobDescriptionService.js
├── analysisService.js
├── assessmentService.js
├── interviewService.js
└── codingService.js
```

The exact filenames may differ depending on the repository implementation.

---

# 3. Frontend Responsibilities

The frontend is responsible for:

* Rendering UI
* Collecting user input
* Client-side validation where appropriate
* Calling backend APIs
* Displaying API responses
* Managing local UI state
* Managing assessment timers
* Handling navigation
* Displaying loading states
* Displaying error states
* Displaying assessment progress
* Displaying assessment results
* Providing responsive layouts
* Providing accessible interaction patterns

The frontend is NOT responsible for:

* Authentication business logic
* Password hashing
* JWT generation
* Database operations
* Gemini API calls
* Authoritative scoring formulas
* Resume/JD matching calculations
* Recruitment workflow generation
* AI evaluation
* Code-execution provider credentials
* Backend authorization decisions

The frontend may display scores returned by the backend, but must not independently calculate authoritative scores.


# 4. Application Structure

Recommended structure:

```text
frontend/
└── src/
    ├── components/
    ├── screens/
    ├── navigation/
    ├── services/
    ├── hooks/
    ├── context/
    ├── utils/
    ├── constants/
    ├── theme/
    └── assets/
```

Responsibilities:

### components/

Reusable visual components.

Examples:

* Button
* Input
* Modal
* Card
* Loader
* ErrorMessage
* ProgressBar
* QuestionCard
* Timer
* AssessmentHeader
* ResultCard

### screens/

Page-level components.

Examples:

```text
Login
Register
Dashboard
Profile
ResumeUpload
JobDescription
MatchResult
Workflow
VocabularyAssessment
GrammarAssessment
TechnicalMCQ
CodingAssessment
TechnicalInterview
HRInterview
Results
```

### navigation/

React Router configuration and protected routes.

### services/

Backend API communication.

### hooks/

Reusable React hooks.

Examples:

* useAuth
* useAssessment
* useTimer
* useDebounce

### context/

Application-wide state.

Example:

```text
AuthContext
```

### utils/

Pure frontend helper functions.

Examples:

* formatting
* validation
* display helpers
* timer helpers

### constants/

Static frontend constants.

Examples:

* assessment types
* route names
* UI configuration

### theme/

Centralized styling/theme configuration where applicable.

---

# 5. Authentication UI

## Required Screens

### Register

Fields:

* Name
* Email
* Password
* Confirm password

The frontend performs basic validation.

The backend remains responsible for:

* Duplicate-user validation
* Password hashing
* User creation
* Authentication rules

### Login

Fields:

* Email
* Password

On successful login:

1. Store authentication state securely according to project implementation.
2. Update AuthContext/state.
3. Redirect to the authenticated dashboard.

### Protected Routes

Authenticated-only pages must be protected through frontend routing.

Example:

```text
ProtectedRoute
    ↓
Authentication state
    ↓
Allow / Redirect
```

Frontend route protection is only a UX/navigation layer.

The backend must independently enforce authorization.

---

# 6. Dashboard

The dashboard provides the user's entry point into the platform.

Possible sections:

* Profile summary
* Resume status
* Job description status
* Match score
* Recruitment workflow
* Assessment progress
* Interview progress
* Recent results

The dashboard should remain responsive across:

* Desktop
* Laptop
* Tablet
* Mobile browser

The platform is a responsive web application. A separate native mobile application is not part of the current project scope.

---

# 7. Profile UI

The profile page should support:

* Viewing profile
* Editing profile
* Updating relevant user information

Frontend responsibilities:

1. Load profile from backend.
2. Display current values.
3. Allow editing.
4. Validate basic input.
5. Submit changes.
6. Display success/error feedback.

The backend remains authoritative for validation and persistence.

---

# 8. Resume Upload UI

The resume upload screen should support:

* PDF file selection
* File validation
* Upload progress/loading state
* Upload success state
* Upload failure state

Recommended UI:

```text
Resume Upload
      ↓
File Selection
      ↓
Validation
      ↓
Upload
      ↓
Processing
      ↓
Extracted Information
```

The frontend should not attempt to perform authoritative PDF text extraction.

The backend performs:

* File handling
* PDF parsing
* Gemini-assisted structured extraction
* Persistence

The frontend only displays the resulting data.

---

# 9. Job Description UI

The Job Description screen should support:

* Text input
* Submission
* Loading state
* Extracted requirements display
* Error handling

Possible UI:

```text
Job Description
       ↓
Paste JD
       ↓
Analyze
       ↓
Required Skills
Preferred Skills
Role Information
       ↓
Continue
```

The backend performs Gemini-assisted extraction.

The frontend displays the structured result.

---

# 10. Resume–JD Match Result

The frontend displays the deterministic match score returned by the backend.

Example:

```text
Resume–Job Match

Match Score
     78%

Matched Skills
• JavaScript
• React
• Node.js

Missing Skills
• Docker
• Kubernetes
```

The frontend must not calculate or modify the authoritative match score.

The backend remains responsible for the deterministic calculation.

---

# 11. Recruitment Workflow UI

The workflow screen displays the assessment sequence generated by the backend.

Example:

```text
Recruitment Simulation

1. Vocabulary       ✓
2. Grammar          ✓
3. Technical MCQs  →
4. Coding
5. Technical Interview
6. HR Interview
7. Results
```

The frontend should visually communicate:

* Current stage
* Completed stages
* Pending stages
* Locked stages where applicable

The backend remains authoritative for workflow state.

---

# 12. Assessment UI Architecture

The assessment interface should use reusable components.

Recommended structure:

```text
AssessmentShell
├── AssessmentHeader
├── ProgressBar
├── Timer
├── QuestionCard
├── AnswerInput
├── NavigationControls
└── SubmitConfirmation
```

The same shell should be reused across:

* Vocabulary
* Grammar
* Technical MCQs

Where possible, avoid duplicating assessment UI logic.

---

# 13. Vocabulary Assessment

The vocabulary screen should support:

* Question display
* Answer selection/input
* Progress tracking
* Timer
* Next/Previous navigation where supported
* Submission
* Loading state
* Error state

Example:

```text
Vocabulary Assessment

Question 4 / 10

Choose the closest meaning:

"Concise"

○ Detailed
○ Brief
○ Complex
○ Confusing

[Previous] [Next]
```

The backend determines the authoritative score.

---

# 14. Grammar Assessment

The grammar screen should reuse the assessment shell.

Required UI:

* Question
* Options
* Progress
* Timer
* Navigation
* Submit

The frontend should not contain authoritative grammar evaluation logic.

---

# 15. Technical MCQ Assessment

Technical MCQs must support:

* Role-specific questions
* Skill tags where returned by backend
* Difficulty information where returned
* Answer selection
* Progress tracking
* Timer
* Submission
* Adaptive next-question flow

Example:

```text
Technical Assessment

Question 5 / 10

Topic: JavaScript
Difficulty: Medium

Which statement is correct?

○ Option A
○ Option B
○ Option C
○ Option D
```

The frontend displays difficulty metadata but must not independently determine the authoritative adaptive difficulty.

---

# 16. Adaptive Difficulty UI

Adaptive difficulty is backend-driven.

The frontend should:

1. Submit the current answer.
2. Receive the next question/difficulty from the backend.
3. Update the UI.
4. Continue the assessment.

Conceptually:

```text
User Answer
     ↓
Backend
     ↓
Evaluation
     ↓
Adaptive Engine
     ↓
Next Question
     ↓
Frontend
```

The frontend must not implement the authoritative adaptive thresholds.

---

# 17. Coding Assessment Screen

The coding screen should support:

* Problem statement
* Constraints
* Examples
* Language selector
* Code editor
* Run/Submit controls
* Submission state
* Test-case result display
* Runtime/memory result display where supplied by the backend
* Compilation/runtime error display
* Final score display

Recommended layout:

```text
------------------------------------------------
| Problem Statement | Code Editor              |
|                   |                          |
| Description       | function ...             |
| Constraints       |                          |
| Examples          |                          |
|                   |                          |
|                   | [Run] [Submit]           |
------------------------------------------------
| Test Results                                   |
------------------------------------------------
```

The frontend must remain provider-agnostic.

It must not contain:

* JDoodle credentials
* Future Judge0 credentials
* Provider-specific API calls
* Provider-specific authentication
* Provider-specific execution logic

The frontend communicates only with the backend coding API.

Current execution architecture:

```text
Frontend
   ↓
Backend Coding API
   ↓
Code Execution Service
   ↓
JDoodle Provider
   ↓
JDoodle API
```

Future architecture may introduce another provider without requiring frontend changes:

```text
Frontend
   ↓
Backend Coding API
   ↓
Code Execution Service
   ↓
Provider Selector
   ├── JDoodle
   └── Judge0
```

The frontend should consume a normalized backend response rather than provider-specific response formats.

---

# 18. Technical Interview UI

The technical interview screen should support:

* AI-generated question
* Candidate response input
* Submit response
* Evaluation/loading state
* Feedback display where appropriate
* Follow-up question
* Interview progress
* Completion state

Recommended flow:

```text
Technical Question
       ↓
Candidate Response
       ↓
Submit
       ↓
AI Evaluation
       ↓
Follow-up Question
       ↓
Candidate Response
       ↓
Final Evaluation
```

The frontend must not directly call Gemini.

All AI processing happens through backend APIs.

---

# 19. HR Interview UI

The HR interview follows a similar reusable structure.

Required UI:

* HR question
* Candidate response
* Submit
* Loading state
* Evaluation
* Follow-up question where supported
* Progress
* Completion

The interview UI should be reusable between:

```text
Technical Interview
HR Interview
```

Only interview-specific configuration should differ.

---

# 20. AI Interview Screen Components

Reusable components should be created where practical.

Example:

```text
AIInterviewShell
├── InterviewHeader
├── QuestionPanel
├── ResponseInput
├── SubmitButton
├── EvaluationPanel
├── FollowUpPanel
└── InterviewProgress
```

This reduces duplicated code between technical and HR interviews.

---

# 21. Timer System

Assessments that require time limits must use a reusable timer component.

Requirements:

* Countdown display
* Start/pause behavior where supported
* Automatic submission
* Warning state
* Cleanup on unmount
* Avoid duplicate timers
* Avoid memory leaks

Example:

```text
Time Remaining: 04:32
```

When time reaches zero:

```text
Timer
  ↓
Auto Submit
  ↓
Backend
```

The frontend timer is a UX mechanism.

The backend must not trust the client timer as the authoritative security mechanism.

---

# 22. Auto-Submit

When an assessment timer expires:

1. Stop the timer.
2. Prevent additional answer changes.
3. Submit the current state.
4. Show submission/loading state.
5. Navigate to the next stage after successful response.

Auto-submit logic must be protected against:

* Double submission
* Component unmount
* Race conditions
* Multiple timer callbacks

---

# 23. Loading States

Every asynchronous operation must have an appropriate loading state.

Examples:

```text
Analyzing Resume...
Generating Questions...
Submitting Answer...
Evaluating Response...
Executing Code...
Loading Results...
```

Avoid leaving the user with a blank screen while waiting for an API response.

---

# 24. Error Handling

Frontend errors should be understandable to the user.

Example:

```text
Unable to submit your answer.

Please try again.
```

Do not expose:

* API keys
* Stack traces
* Internal database errors
* Provider credentials
* Internal infrastructure details

Where the backend returns an error code, the frontend may map it to a user-friendly message.

---

# 25. API Service Layer

All backend communication should be centralized.

Example:

```text
components/screens
        ↓
service functions
        ↓
HTTP client
        ↓
backend API
```

Avoid direct Axios/fetch calls scattered across components.

Example:

```text
codingService.submitCode()
assessmentService.submitAnswer()
interviewService.submitResponse()
```

This keeps UI components focused on presentation and interaction.

---

# 26. Authentication State

Authentication state should be centralized.

Example:

```text
AuthContext
├── user
├── isAuthenticated
├── login()
├── logout()
└── refreshUser()
```

Protected routes consume this state.

Authentication implementation must remain aligned with the actual backend authentication mechanism.

---

# 27. Responsive Design

All frontend pages must support:

* Desktop
* Laptop
* Tablet
* Mobile browser

Use responsive layouts rather than separate mobile applications.

Important areas:

* Navigation
* Assessment cards
* Coding editor
* Interview interface
* Results
* Tables
* Dashboards

The coding screen requires special attention because the editor and problem statement must remain usable on smaller screens.

---

# 28. Accessibility

Where practical, use:

* Semantic HTML
* Labels for inputs
* Keyboard navigation
* Visible focus states
* Accessible buttons
* Appropriate contrast
* Meaningful error messages
* ARIA attributes where required

Interactive controls must not rely only on color to communicate state.

---

# 29. Results Screen

The Phase 2 Results screen displays raw per-stage results.

Example:

```text
Assessment Results

Vocabulary
Score: 8 / 10

Grammar
Score: 7 / 10

Technical MCQ
Score: 16 / 20

Coding
Score: 3 / 5

Technical Interview
Score: 7.5 / 10

HR Interview
Score: 8 / 10
```

Phase 2 does NOT calculate or display the final readiness score.

Readiness scoring belongs to Phase 3.

The frontend should display the raw values returned by the backend.

---

# 30. Results API Integration

The frontend should retrieve results through a dedicated service.

Example:

```text
Results Screen
      ↓
resultsService.getResults()
      ↓
GET /api/results
      ↓
Backend
      ↓
Raw stage scores
```

The frontend must not reconstruct missing scores or invent completion values.

If a score is unavailable, display an appropriate unavailable/pending state.

---

# 31. State Management Rules

Use local state for:

* Form fields
* Temporary UI state
* Current question
* Selected option
* Timer display

Use global state for:

* Authentication
* User session
* Cross-page application state where genuinely required

Avoid storing large assessment datasets globally unless necessary.

---

# 32. Security Rules

Never place secrets in frontend code.

Never expose:

```text
GEMINI_API_KEY
JDOODLE_CLIENT_ID
JDOODLE_CLIENT_SECRET
Future JUDGE0 credentials
MONGODB_URI
JWT secrets
```

All sensitive credentials belong on the backend.

Frontend environment variables must only contain values that are safe to expose to the browser.

---

# 33. Frontend Validation

Frontend validation improves user experience but is not a security boundary.

Examples:

```text
Required field validation
Email format
Password confirmation
File type
File size
Empty response prevention
```

Backend validation remains authoritative.

---

# 34. API Error Contract

The frontend should expect the backend to return a consistent error structure.

Example:

```json
{
  "success": false,
  "message": "Human-readable error",
  "code": "ERROR_CODE"
}
```

The frontend should use:

```text
message
```

for user-facing feedback where appropriate.

The `code` can be used for structured frontend handling.

---

# 35. Phase 1 Frontend Implementation

## Days 1–2

Implement:

* Project structure
* Routing
* Authentication screens
* Auth state
* Login/register integration

## Days 3–4

Implement:

* Dashboard
* Profile
* Profile editing
* Resume upload

## Days 5–6

Implement:

* Resume result display
* Job Description input
* JD result display

## Days 7–8

Implement:

* Match result
* Workflow display

## Days 9–10

Implement:

* Integration
* Loading states
* Error handling
* Navigation consistency

## Days 11–12

Implement:

* Phase 1 UI stabilization
* Responsive fixes
* Integration verification
* Regression testing

---

# 36. Phase 2 Frontend Implementation

## Day 1

Create reusable assessment UI shell.

Initial components:

```text
AssessmentShell
QuestionCard
ProgressBar
Timer
NavigationControls
```

## Day 2

Wire Vocabulary assessment.

## Day 3

Wire Grammar assessment.

## Day 4

Wire adaptive Technical MCQ UI.

## Day 5

Implement:

* Timer behavior
* Auto-submit
* Assessment flow

## Day 6

Fix assessment UI issues.

## Day 7

Integration checkpoint:

```text
Vocabulary
    ↓
Grammar
    ↓
Technical MCQ
    ↓
Adaptive flow
```

## Day 8

Create Coding Assessment screen.

## Day 9

Create reusable AI Interview screen components.

## Day 10

Wire Technical Interview.

## Day 11

Wire HR Interview.

## Day 12

Fix interview and coding UI issues.

## Day 13

Full-team integration:

```text
Assessments
    ↓
Coding
    ↓
Technical Interview
    ↓
HR Interview
```

## Days 14–15

Triage and UI stabilization.

## Day 16

Wire Results screen to backend raw-score endpoint.

## Day 17

Handle coding and results edge cases.

## Day 18

Responsive and cross-browser UX polish.

## Day 19

Prompt/output display consistency review.

## Day 20

Buffer.

## Day 21

Full end-to-end frontend integration checkpoint.

## Day 22

Triage.

## Day 23

Error/retry UI for AI and code execution provider paths.

## Day 24

Integration/regression.

## Day 25

Documentation verification.

## Day 26

Buffer.

## Day 27

Repeated full simulation verification.

## Day 28

Final demo/release preparation.

---

# 37. Frontend Testing

Testing should occur at multiple levels.

## Component Testing

Test:

* Inputs
* Buttons
* Timer
* Question cards
* Progress components
* Error states

## Integration Testing

Test:

```text
Login
 ↓
Dashboard
 ↓
Resume
 ↓
JD
 ↓
Match
 ↓
Workflow
 ↓
Assessment
 ↓
Coding
 ↓
Technical Interview
 ↓
HR Interview
 ↓
Results
```

## Browser E2E Testing

Where feasible, verify complete user journeys in a real browser.

Do not mark browser E2E as complete without actually executing it.

---

# 38. Frontend Testing Evidence

Every major feature should distinguish:

```text
CODE EXISTS
CONNECTED
EXECUTED
TESTED
E2E VERIFIED
```

Example:

```text
Coding Screen

CODE EXISTS: YES
CONNECTED: YES
EXECUTED: YES
TESTED: YES
E2E VERIFIED: NO
```

Do not claim E2E verification without evidence.

---

# 39. Error Protocol

If an important frontend integration error occurs:

1. Stop progression on the affected path.
2. Capture the exact error.
3. Identify the affected component/API.
4. Determine whether the issue is frontend, backend, AI, or external-provider related.
5. Fix only the relevant issue.
6. Re-test the affected path.
7. Run regression checks.
8. Report the result.

Do not silently work around an important failure.

---

# 40. Provider Independence

The frontend must remain independent of the code-execution provider.

Current provider:

```text
JDoodle
```

Future provider option:

```text
Judge0
```

The frontend should only know the backend coding API contract.

Provider-specific implementation belongs entirely to the backend.

Therefore, switching from JDoodle to a future Judge0 provider should not require frontend architectural changes.

---

# 41. UI Design Principles

Use a consistent design language.

Requirements:

* Consistent spacing
* Consistent typography
* Consistent button styles
* Consistent form controls
* Consistent cards
* Consistent error states
* Consistent loading indicators
* Consistent navigation

Avoid:

* Random colors
* Hardcoded theme values
* Duplicated component styles
* Inconsistent spacing
* Unnecessary animations

---

# 42. Performance

Avoid unnecessary rendering.

Use:

* React memoization where justified
* Lazy-loaded routes where useful
* Efficient API calls
* Debouncing where appropriate
* Cleanup of timers/listeners

Do not prematurely optimize.

Performance changes should be justified by observed behavior.

---

# 43. Code Quality

Frontend code should:

* Follow existing project conventions
* Use meaningful component names
* Avoid unnecessarily large components
* Separate presentation from API calls
* Avoid duplicated logic
* Use reusable components
* Keep business logic out of UI where possible

Comments should explain non-obvious WHY/PURPOSE/IMPORTANT BEHAVIOR rather than obvious syntax.

---

# 44. Scope Control

Do not implement future Phase 3 functionality during Phase 1 or Phase 2 unless explicitly approved.

Phase 3 includes:

* Intelligence engine
* Skill profiling
* Readiness score
* Learning roadmap
* Recommendations
* Advanced analytics

Phase 2 must focus on:

```text
Vocabulary
Grammar
Technical MCQs
Adaptive Difficulty
Coding
Technical Interview
HR Interview
Results
```

---

# 45. Frontend Completion Standard

A frontend feature is complete only when:

1. UI exists.
2. Components are integrated.
3. API calls are connected.
4. Loading state exists.
5. Error state exists.
6. Successful response is handled.
7. Responsive behavior is checked.
8. Relevant tests are executed.
9. No known regression is introduced.
10. Evidence is recorded.

For end-to-end features:

```text
UI
 ↓
API
 ↓
Backend
 ↓
Database / AI / Execution Provider
 ↓
Response
 ↓
UI
```

must be verified where the required external dependencies are available.

---

# 46. Documentation Accuracy

This document must reflect the actual frontend implementation.

If implementation changes:

1. Update the relevant section.
2. Do not leave obsolete architecture.
3. Do not document unimplemented functionality as completed.
4. Distinguish planned functionality from implemented functionality.
5. Keep provider-specific backend implementation out of frontend documentation except where necessary to explain provider independence.

---

# 47. Final Frontend Architecture

The final frontend architecture should follow:

```text
React Application
        │
        ├── Authentication
        │
        ├── Dashboard
        │
        ├── Profile
        │
        ├── Resume
        │
        ├── Job Description
        │
        ├── Match Analysis
        │
        ├── Recruitment Workflow
        │
        ├── Assessments
        │      ├── Vocabulary
        │      ├── Grammar
        │      └── Technical MCQ
        │
        ├── Coding
        │
        ├── AI Interviews
        │      ├── Technical
        │      └── HR
        │
        └── Results
                │
                ↓
          Backend API Layer
The frontend remains responsible for the user experience while the backend remains responsible for authoritative business logic, AI processing, scoring, persistence, authentication, and code execution.
```