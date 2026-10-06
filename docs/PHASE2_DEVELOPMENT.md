
## 2. PHASE2_DEVELOPMENT.md

# CareerReady — Phase 2 Daily Plan (Simulation + AI Evaluation)

28 days. Roles: **BL** = Backend Lead (reviews all PRs incl. frontend) · **A** = Intake/Assessment lead · **B** = Interview/Intelligence lead · **C** = Float (unblocks whoever's behind; QA/integration owner)

Starting context: Phase 1 finished 1 day late, zero backend PR reworks, C spent all 12 days on frontend/QA with no backend reps. No banked buffer entering Phase 2.

---

## Phase 2 Code Execution Provider Strategy

Phase 2 coding execution currently uses **JDoodle** as the active execution provider.

The architecture must keep provider-specific logic isolated so that a future provider can be introduced without rewriting the coding controller, database schema, or frontend.

### Current architecture

```text
Coding Controller
      ↓
Code Execution Service
      ↓
JDoodle Provider
      ↓
JDoodle API
````

### Future architecture

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

### Current implementation rules

* JDoodle is the active provider for Phase 2.
* The current implementation should use a minimal provider abstraction.
* The coding controller remains responsible for:

  * iterating through test cases
  * comparing expected vs actual output
  * calculating passed test cases
  * calculating/persisting the coding score
  * storing submission details
  * returning the frontend response
* The provider is responsible only for:

  * sending source code and input to the execution provider
  * interpreting provider-specific execution results
  * normalizing compile/runtime/timeout/provider errors
* Frontend code must remain provider-agnostic.
* Database schemas must remain provider-agnostic.
* JDoodle credentials must remain backend-only.
* Do not batch multiple test cases into one JDoodle request unless explicitly approved later.
* The current implementation may execute one provider request per test case.
* Repeated failure-path testing should prefer mocked/controlled provider responses where appropriate so that external API usage is not unnecessarily consumed.
* A small number of real JDoodle executions must still be used to verify the real integration.

### Normalized execution contract

The provider layer should return a normalized result similar to:

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

The exact JDoodle response fields must not leak into the rest of the application.

### Future Judge0 migration

Judge0 remains a planned/future execution alternative.

The future implementation may use local Judge0 Docker rather than the previously considered hosted RapidAPI dependency.

For that future migration:

```text
codingController
      ↓
codeExecutionService
      ↓
judge0Provider
      ↓
local Judge0 Docker
```

The future Judge0 provider must implement the same normalized execution contract as the JDoodle provider.

**Do not build the local Judge0 Docker environment or Judge0 provider during this JDoodle migration unless explicitly added to the active day's scope.**

---

## Day 1

**BL — Extend shared AI schema layer + JDoodle setup**

* What: Add JSON schema definitions for assessment-question generation and interview-evaluation output to the existing `prompts/` utility built in Phase 1. Establish the `aiProvider.js` abstraction boundary that encapsulates the Gemini API connection. Establish JDoodle execution configuration and the minimal provider boundary used by the coding flow. Confirm one real JDoodle execution succeeds from Postman/curl before anyone codes against it.
* Why: Every AI feature this phase (vocab, grammar, MCQ, both interviews) routes through this schema layer and the `aiProvider` boundary. This isolates Gemini-specific errors (e.g., 404/Quota) from the domain logic. For coding, isolate provider-specific execution behavior early so the controller does not become coupled to JDoodle.
* Files: `backend/src/prompts/assessmentPrompts.js`, `backend/src/providers/aiProvider.js`, `backend/src/config/jdoodle.js`, `backend/src/services/codeExecutionService.js`, `backend/src/services/providers/jdoodleProvider.js`.
* Test: Call JDoodle with a trivial "hello world" submission and confirm you receive an actual execution result containing output/status information — not just a successful HTTP response. Confirm the provider maps the response into the normalized execution contract.

**A — Vocabulary assessment**

* What: Build the Question model (role, skill, difficulty, question text, options, correct answer) and an endpoint that calls Gemini through the shared prompt layer to generate 5 vocabulary questions for a given role.
* Why: Vocabulary is the simplest assessment type — good first real use of the AI schema layer before tackling adaptive MCQs.
* Files: `backend/src/models/Question.js`, `backend/src/controllers/assessmentController.js`, `backend/src/routes/assessment.js`.
* Test: Hit the endpoint with Postman for 2-3 different roles, confirm the returned JSON matches the Question schema every time, not just usually.

**B — AI interview rubric schema + model**

* What: Define the fixed JSON shape every interview evaluation must return (technicalCorrectness, relevance, completeness, communication, overallScore, strengths, weaknesses, feedback, followUpQuestion) and the Interview/InterviewResponse Mongo models to store it.
* Why: This schema is the backbone of Days 2-13 — get the field names and types locked before anyone builds against them.
* Files: `backend/src/models/Interview.js`, `backend/src/models/InterviewResponse.js`, `backend/src/prompts/interviewPrompts.js` (shared with BL).
* Test: Write the schema down in `docs/API_DOCUMENTATION.md` and get BL to sign off on it before Day 2 starts — this is the one thing worth a 10-minute sync rather than discovering a mismatch on Day 5.

**C — Reusable assessment UI shell**

* What: Build the shared components every assessment screen needs: a countdown Timer, QuestionCard, ProgressBar, and a generic AssessmentLayout wrapper.
* Why: Vocab, grammar, and MCQ all need the same shell — building it once now saves A from re-implementing it three times.
* Files: `frontend/src/components/Timer.jsx`, `QuestionCard.jsx`, `ProgressBar.jsx`, `AssessmentLayout.jsx`.
* Test: Render each component in isolation with mock data (Storybook-style or just a throwaway test page) — don't wait for A's real API to check they look right.

---

## Day 2

**BL — Review + JDoodle real test**

* What: Review A's and B's Day 1 output against the schemas agreed yesterday. Run one real JDoodle submission with a small actual program (not "hello world") that has a test case that should fail, to see what a failure response actually looks like.
* Why: You need to know JDoodle's failure-response shape before A builds the submission endpoint on Day 9, not after.
* Files: `backend/src/config/jdoodle.js`, `backend/src/services/codeExecutionService.js`, `backend/src/services/providers/jdoodleProvider.js`.
* Test: Confirm you can distinguish "compile error," "wrong answer," and "runtime error" from the normalized provider result — document which provider-specific fields map to each, for A to use later.

**A — Grammar assessment**

* What: Same pattern as vocabulary — Gemini-generated grammar/sentence-correction questions, plus deterministic scoring (compare submitted answer against the stored correct answer; no AI needed for scoring itself).
* Why: Keeps deterministic logic (RULE 11) out of the AI layer — scoring is a lookup, not a language-understanding task.
* Files: same controller/route files as vocabulary, extended with a `type` field on Question.
* Test: Submit a correct and an incorrect answer manually, confirm the score reflects it exactly — no off-by-one or case-sensitivity bugs.

**B — First AI interview question**

* What: Build the endpoint that starts a technical interview: takes a role + skill profile, calls Gemini through the prompt layer, returns the first structured question.
* Why: This is your first real exercise of the interview schema from Day 1 — confirm it survives contact with a real Gemini call before building evaluation on top of it.
* Files: `backend/src/controllers/interviewController.js`, `backend/src/services/interviewEngine.js`.
* Test: Call it 5 times for the same role, confirm questions vary (not identical every time) but stay on-topic for the role.

**C — Wire vocabulary screen**

* What: Connect the Day 1 UI shell to A's real vocabulary endpoint — fetch questions, render them, handle answer selection, submit.
* Why: First end-to-end slice of the assessment flow; surfaces integration mismatches early while they're cheap to fix.
* Files: `frontend/src/screens/VocabularyAssessment.jsx`, `frontend/src/api/assessment.js`.
* Test: Complete a full vocabulary quiz as a user would — start to finish, including the submit button actually posting to the backend.

---

## Day 3

**BL — Review, unblock**

* What: Review Day 2 PRs from A and B. Spend remaining time available to whoever's stuck rather than starting new work.
* Why: With zero Phase 1 reworks, don't assume Phase 2 stays that clean — JDoodle/provider integration and multi-turn interview logic are new territory for this team.
* Test: n/a — this is a review day.

**A — Technical MCQs**

* What: Extend the Question model/generation to MCQs tagged by role, skill, and difficulty level (not just role like vocab/grammar).
* Why: Difficulty tagging here is what Day 4's adaptive logic will read from.
* Files: extend `Question.js` schema with a `difficulty` enum field; extend the generation prompt to request difficulty-appropriate questions.
* Test: Generate MCQs at "easy," "medium," and "hard" for the same skill, manually eyeball that hard ones are actually harder — a subjective check, but catch it now, not after adaptive logic depends on it.

**B — Interview response evaluation**

* What: Build the endpoint that takes a candidate's answer to the Day 2 question, sends it to Gemini for evaluation, and returns it in the Day 1 rubric schema.
* Why: This is the core AI evaluation logic — the part your project's "explainability" claim depends on.
* Files: `backend/src/services/interviewEngine.js`, `backend/src/prompts/interviewPrompts.js`.
* Test: Submit a strong answer and a weak answer to the same question, confirm the scores meaningfully differ — if a weak answer scores as well as a strong one, the prompt needs work before you move on.

**C — Wire grammar screen**

* What: Same pattern as Day 2's vocabulary wiring, applied to grammar.
* Files: `frontend/src/screens/GrammarAssessment.jsx`.
* Test: Full grammar quiz completion, backend round-trip confirmed.

---

## Day 4

**BL — Pair on adaptive difficulty**

* What: Sit with A while they build the threshold rule (correct → harder, incorrect → easier/same). Decide together: what's the starting difficulty for question 1, and what happens at the boundary (exactly 50%, exactly 80%)?
* Why: This is your first stateful, per-user-session logic — a boundary bug here silently produces a wrong readiness input all through Phase 3, and it's cheaper to catch it in pairing than in a Day 21 integration test.
* Files: `backend/src/services/adaptiveEngine.js`.
* Test: Manually trace through a sequence of answers (e.g., correct-correct-wrong-correct) and confirm the difficulty path matches what you both agreed on paper.

**A — Implement adaptive difficulty on MCQ**

* What: Wire the `adaptiveEngine.js` logic into the MCQ flow — after each answer, decide the next question's difficulty and fetch/generate accordingly.
* Files: `backend/src/controllers/assessmentController.js`.
* Test: Run through a full 10-question MCQ session with a mix of right/wrong answers, print the difficulty sequence, sanity-check it against the rule.

**B — Bounded follow-up question logic**

* What: After an interview answer is evaluated, decide (based on the rubric scores) whether to ask exactly one follow-up question or move to the next planned question. Never allow a second follow-up.
* Why: You explicitly scoped this as bounded, not open-ended multi-turn — enforce that in code, don't rely on the prompt alone to behave.
* Files: `backend/src/services/interviewEngine.js`.
* Test: Force a low-completeness score and confirm exactly one follow-up fires, then confirm a second low score afterward does NOT trigger another follow-up.

**C — Wire MCQ screen with adaptive flow**

* What: Connect the MCQ UI to the adaptive backend — each next-question fetch needs to reflect the difficulty decision made server-side.
* Files: `frontend/src/screens/TechnicalMCQ.jsx`.
* Test: Play through a session getting questions deliberately wrong, confirm the UI visibly reflects easier questions following (even just via difficulty label shown for debugging).

---

## Day 5

**BL — Review adaptive-difficulty edge cases**

* What: Specifically test the boundaries A built on Day 4 — what happens on question 1 (no prior answer to adapt from), what happens at exactly the threshold score, what happens if a user answers everything correctly (does difficulty cap out gracefully or crash trying to fetch a "harder than hard" question)?
* Test: Try to break it with these three specific scenarios before approving the PR.

**A — End-to-end test + bugfix on assessment stage**

* What: Run vocab → grammar → MCQ back to back as a real user session, log every bug.
* Test: This IS the test — full session, no skipped steps.

**B — AI HR Interview question generation**

* What: Same pattern as Day 2's technical interview start, but with STAR-oriented behavioral prompts (situation/action/result framing) instead of technical questions.
* Files: `backend/src/prompts/interviewPrompts.js` (new HR question template), `interviewController.js`.
* Test: Generate 5 HR questions for a role, confirm they're behavioral ("Tell me about a time...") not technical.

**C — Timer + auto-submit**

* What: Add auto-submit-on-timeout behavior across vocab/grammar/MCQ screens — if the timer hits zero, the current answer state submits automatically rather than hanging.
* Files: `frontend/src/components/Timer.jsx`, wired into each assessment screen.
* Test: Let a timer run out mid-question deliberately, confirm it submits and moves on rather than freezing.

---

## Day 6

**BL — Review**

* Review Day 5 output; no new build.

**A — Buffer/polish on assessment stage**

* What: Use any slack to harden vocab/grammar/MCQ against bad input — empty submissions, network retry on a failed generate call.
* Test: Manually submit an empty answer, confirm it's handled (error message, not a crash).

**B — AI HR Interview evaluation**

* What: Build the evaluation endpoint for HR answers, scoring situation/action/result/clarity/professionalism per your rubric (section L of the original spec).
* Files: `backend/src/services/interviewEngine.js`, extended prompt.
* Test: Submit a well-structured STAR answer and a rambling one, confirm the scores differ meaningfully.

**C — Bugfixes from Day 5**

* What: Work through whatever the Day 5 end-to-end test surfaced.

---

## Day 7 — CHECKPOINT

**BL — Merge + cross-schema review**

* What: Merge the week's PRs into `develop`. Specifically re-read every AI prompt file written so far (vocab, grammar, MCQ, technical interview, HR interview) side by side — confirm they all return JSON in a genuinely consistent shape (field naming, score ranges 0-10 vs 0-100, etc.), not just individually-valid-but-inconsistent schemas.
* Why: Four people writing prompts independently for a week is exactly how you end up with three different scoring scales that Phase 3's readiness formula then has to awkwardly reconcile.

**A/B/C — Team integration test**

* What: Run vocab → grammar → MCQ (with adaptive difficulty) end to end as a team, everyone watching, log every bug live rather than each person testing alone.
* Expected result at this checkpoint: assessment generation and interview generation/evaluation logic exist in isolation; coding assessment and the full interview flow (frontend wiring) don't exist yet — that's normal, don't panic if it feels incomplete.

---

## Day 8

**BL — Fix Day 7 bugs with the team**

* What: Join wherever the integration test found the worst bugs rather than staying purely in review mode today.

**A — Coding problem model + fetch endpoint**

* What: Build the CodingProblem model (role, skill, difficulty, problem statement, test cases, starter code) and an endpoint to fetch role-appropriate problems.
* Files: `backend/src/models/CodingProblem.js`, `codingController.js`.
* Test: Seed 3-4 real problems manually (don't AI-generate these yet — hand-write a couple to start, since correctness matters more than volume here), fetch by role, confirm the right ones come back.

**B — Wire multi-turn technical interview flow**

* What: Chain the pieces built Days 2-4 into one flow: question → answer → evaluate → optional follow-up → next planned question, tracked by interview session state.
* Files: `backend/src/services/interviewEngine.js`, `interviewController.js`.
* Test: Run a full 3-question interview session via Postman, confirm state carries correctly between calls (the engine knows which question it's on).

**C — Coding assessment screen**

* What: Build the code editor UI (a simple textarea or lightweight code editor component) and problem display screen.
* Files: `frontend/src/screens/CodingAssessment.jsx`.
* Test: Render a fetched problem with its description and starter code correctly.

---

## Day 9

**BL — Pair with A on JDoodle submission — stress-test, don't just review**

* What: Sit with A while building the submission endpoint: send code to JDoodle through the execution-service/provider boundary, receive the execution result, normalize it, and handle the response. Deliberately submit code that times out, code that doesn't compile, and code that runs but fails test cases — confirm each is handled distinctly, not lumped into one generic "error."
* Why: This is the single piece of Phase 2 most likely to blow the estimate. A quick approve-on-first-look here is exactly the risk I flagged from Phase 1's zero-rework pattern.
* Files: `backend/src/services/codeExecutionService.js`, `backend/src/services/providers/jdoodleProvider.js`, `codingController.js`.
* Test: The three deliberate-failure submissions above, plus one that succeeds — confirm your coding endpoint distinguishes all four outcomes correctly in its response.

**B — Wire AI Technical Interview frontend**

* What: Connect the Day 8 backend flow to a real screen — question display, answer input, "evaluating..." loading state while waiting on Gemini, feedback display.
* Files: `frontend/src/screens/TechnicalInterview.jsx`.
* Test: Full 3-question interview as a user, including seeing the loading state (don't let it feel frozen during the Gemini call).

**C — AI interview screen UI (shared components)**

* What: Build the reusable InterviewQuestionCard, AnswerInput, and FeedbackDisplay components B is wiring into the technical interview screen.
* Files: `frontend/src/components/InterviewQuestionCard.jsx`, etc.
* Test: Render with mock data before B needs them wired to real state.

---

## Day 10

**BL — Review JDoodle/provider error handling specifically**

* What: Don't just check "does it work" — check the failure paths again with fresh eyes: what does the UI eventually show a user whose code times out? Is there a path where a failed JDoodle call just hangs forever with no user-facing error? Confirm provider-specific failures are normalized before reaching the controller.
* Test: Simulate a JDoodle timeout/provider failure (or temporarily point at a bad URL in a controlled test) and confirm the user sees an error state, not an infinite spinner.

**A — Test-case scoring logic**

* What: Turn normalized execution results from the provider into a score (e.g., 7/10 test cases passed → 70%), stored against the submission.
* Files: `backend/src/services/codeExecutionService.js`, `codingController.js`.
* Test: Submit code that passes some but not all test cases, confirm the stored score matches the actual pass count.

**B — Wire AI HR Interview flow**

* What: Same pattern as Day 9's technical interview wiring, applied to HR.
* Files: `frontend/src/screens/HRInterview.jsx`.
* Test: Full HR interview session as a user.

**C — HR interview screen UI**

* What: Build/adapt the shared interview components for HR's STAR-structured display if it differs visually from technical.
* Test: Render with mock HR question/answer data.

---

## Day 11

**BL — Review**

* Review Day 10 PRs.

**A — Wire coding screen to submission/scoring**

* What: Connect the Day 8 editor UI to the Day 9-10 backend — submit button sends code, shows "running..." during provider execution, then displays pass/fail per test case.
* Files: `frontend/src/screens/CodingAssessment.jsx`.
* Test: Submit a correct solution and an incorrect one, confirm the UI shows accurate results for both.

**B — Bugfixes on interview flow**

* What: Address whatever Days 9-10 wiring surfaced.

**C — Wire HR interview screen to backend**

* What: Complete the HR interview frontend-backend connection.
* Test: Full HR session, backend round-trip confirmed.

---

## Day 12

**BL — Merge + mixed-batch JDoodle/provider review**

* What: Merge the week's PRs. Run a mixed batch of coding submissions through the full pipeline — some correct, some wrong, one malformed (syntax error), one that times out — back to back, confirm each produces the right outcome without needing a server restart or leaving stale state between submissions.
* Test: The mixed batch above, run twice in a row to check for state leakage between submissions. Use real JDoodle calls for a small representative set and controlled/mocked provider results for repeated failure-path coverage where appropriate.

**A — Bugfixes on coding assessment**

* What: Address whatever the Day 12 mixed-batch review surfaced.

**B — Manual end-to-end test of both interview flows**

* What: Full technical + HR interview sessions, back to back, as a real candidate would experience them.

**C — Bugfixes on interview screens**

---

## Day 13 — CHECKPOINT

**BL — Review**

**A/B/C — Team integration test: coding + both interviews end-to-end**

* What: Everyone together, run coding assessment through to a completed technical and HR interview, log bugs live.
* Expected result: All seven assessment/interview stages functionally exist; none are polished yet. Compare your pace here against Phase 1's Day-8 checkpoint — if you're clearly behind that curve, flag it to BL now rather than hoping Days 14-20 absorb it silently.

---

## Day 14

**BL — Triage Day 13 bugs**

* What: Sort bugs by severity/owner, assign rather than letting people self-select only the easy ones.

**A — Fix coding bugs** · **B — Fix interview bugs** · **C — Fix UI bugs**

* What: Work the Day 14 triage list.

---

## Day 15

**BL — Review fixes**

**A — Buffer on assessment** · **B — Buffer on interviews**

* What: Use slack for hardening, not new features — retry logic on failed AI calls, better error messages.

**C — Results screen shell**

* What: Build the Results screen showing raw per-stage scores as they come back from each stage's API — explicitly NOT an aggregated readiness score yet, that's Phase 3.
* Files: `frontend/src/screens/Results.jsx`.
* Test: Render with mock data covering all seven stages.

---

## Day 16

**BL — Pair with C on the Results endpoint**

* What: Build the endpoint that aggregates a candidate's raw scores from all seven stages into one response payload. Keep this purely a database read + reshape — no LLM call belongs here, it's data aggregation, not language understanding.
* Files: `backend/src/controllers/performanceController.js`.
* Test: Complete a full simulation, hit the Results endpoint, confirm every stage's score appears correctly.

**A — Expose assessment scores for Results**

* What: Ensure vocab/grammar/MCQ/coding scores are queryable in the shape the Day 16 Results endpoint needs.

**B — Expose interview scores for Results**

* What: Same, for technical and HR interview scores.

**C — Wire Results screen to backend**

* What: Connect the Day 15 shell to the real endpoint.
* Test: Full simulation → Results screen shows real, correct per-stage scores.

---

## Day 17

**BL — Review**

**A — Edge-case testing: coding**

* What: Timeouts, malformed code, an empty MCQ pool for an obscure role — confirm graceful handling, not crashes.

**B — Edge-case testing: AI evaluation**

* What: Deliberately send a request that makes Gemini return malformed JSON (or mock one), confirm the retry-then-controlled-error logic from your original spec actually fires rather than silently storing garbage.
* Test: This is the test — force a bad response and watch the retry happen.

**C — Polish Results screen**

* What: Score cards, per-stage breakdown visuals, clean layout.

---

## Day 18

**BL — Review, merge**

**A — Polish assessment UX**

* What: Loading and error states across vocab/grammar/MCQ/coding, per your own RULE 13.

**B — Polish interview UX**

* What: Loading state while AI evaluates an answer (this can take a few seconds — don't let it look frozen), error states if Gemini fails.

**C — Cross-device/browser test**

* What: Run the full flow on at least one other browser and one mobile-width viewport, since it's a web app now, not native.

---

## Day 19

**BL — Full-team prompt consistency review**

* What: Walk every prompt file (vocab, grammar, MCQ, technical interview, HR interview, and anything else) as a group, checking field names, score scales, and tone are consistent — this is the thing that quietly diverges when two people write prompts independently for two weeks.

**A/B/C — Address review feedback**

---

## Day 20 — BUFFER

* Protect this day. You have zero banked slack from Phase 1's slip — if nothing is behind, pull a Phase 3 readiness-score task forward rather than deleting the buffer.

---

## Day 21 — CHECKPOINT

**BL — Review outstanding items**

**A/B/C — Full end-to-end test**

* What: register → resume/JD → vocab → grammar → MCQ → coding → tech interview → HR interview → results, run by the whole team, every bug logged.
* Expected result: the full simulation runs start to finish.

---

## Day 22

**BL — Triage**

**A — Fix assessment bugs** · **B — Fix interview bugs** · **C — Fix UI/results bugs**

---

## Day 23

**BL — Review fixes, re-test JDoodle + AI-evaluation retry paths specifically again**

* What: Don't assume Days 9-17's fixes to these paths are still solid after two more weeks of surrounding changes — re-run the mixed-batch JDoodle/provider test and a forced-malformed-JSON test one more time. Verify both the real provider path and the normalized provider error boundary.

**A/B/C — Fix remaining bugs in their slice**

---

## Day 24

**BL — Merge**

**A/B/C — Regression test**

* What: Re-run the Day 21 full flow to confirm this week's fixes didn't break anything else.

---

## Day 25

**BL — Review docs for accuracy**

**A — Write BACKEND_DEVELOPMENT.md Phase 2 entries (assessment/coding)**

**B — Write BACKEND_DEVELOPMENT.md Phase 2 entries (interviews)**

**C — Update API_DOCUMENTATION.md and FRONTEND_DEVELOPMENT.md**

* What: Document what was actually built, in the TASK X.X format, not what was originally planned — note any deviations (e.g., trimmed vocabulary/grammar question banks, adjusted difficulty thresholds, or provider-specific execution details). Document JDoodle as the active provider and keep future Judge0 support clearly identified as planned rather than implemented.

---

## Day 26 — BUFFER

* Your third and last explicit buffer this phase. Same rule: use it or pull Phase 3 work forward, don't delete it.

---

## Day 27

**BL — Reliability check**

* What: Run a clean end-to-end simulation more than once, back to back, to confirm it isn't just a "worked once on a good day" result.

**A/B/C — Final bug sweep**

---

## Day 28 — PHASE 2 SIGN-OFF

**BL — Full-team demo, sign off Phase 2 checklist, tag release**

**A/B/C — Retro**

* Same three questions as Phase 1 (checkpoint pacing, PR rework count, whether C got pulled into backend), plus: did C's zero backend exposure from Phase 1 become a real problem anywhere in Phase 2, specifically around the code-execution provider integration? Use the honest answer to decide whether C needs deliberate backend reps before Phase 3's readiness-scoring engine, which is also backend-heavy.
