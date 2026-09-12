# DATABASE_DESIGN.md — Phase 1

## Database

MongoDB Atlas with Mongoose.

## Phase 1 Collections

Only the collections required by Phase 1 should be created.

---

# 1. users

## Purpose
Stores authentication and core candidate profile information.

## Core Fields

```text
_id
name
email
passwordHash
education
degree
branch
graduationYear
skills[]
targetRole
experienceLevel
resumeId
personalityProfileId
createdAt
updatedAt
```

## Rules
- `email` should be unique.
- `passwordHash` must never be returned to the frontend.
- `personalityProfileId` remains null until the optional personality module is implemented.

## Relationships
- User → Resume through `resumeId`.
- Future assessment/interview data will reference `userId`.

---

# 2. resumes

## Purpose
Stores uploaded resume metadata and extracted information.

## Core Fields

```text
_id
userId
fileName
fileType
storageReference
extractedText
extractedSkills[]
education[]
projects[]
experience[]
certifications[]
analysis
createdAt
updatedAt
```

The exact fields must match the implemented schema.

## Relationships
- Many resume records may belong to a user over time if versioning is supported.
- User can reference the current resume.

---

# 3. jobDescriptions

## Purpose
Stores the JD submitted for analysis.

## Core Fields

```text
_id
userId
title
company
rawText
requiredSkills[]
preferredSkills[]
experienceRequirements
technicalRequirements[]
competencies[]
analysis
createdAt
updatedAt
```

## Relationships
- Job description belongs to a user.
- Resume-vs-JD match information may be stored in the JD analysis or an explicitly created match structure if required by implementation.

---

# Phase 1 Relationships

```text
USER
 │
 ├── resumeId ──> RESUME
 │
 └── userId <──── JOB DESCRIPTION
```

## Indexes

At minimum:
- unique index on `users.email`
- index on `resumes.userId`
- index on `jobDescriptions.userId`

Only add additional indexes when query patterns justify them.

---

# Embedded vs Referenced

### Embed
Use embedded structures for small, tightly coupled information such as:
- education
- extracted skill arrays
- simple analysis metadata

### Reference
Use references for entities that grow independently or are accessed separately:
- user → resume
- future assessments
- future interviews
- future performance reports

The final choice must follow the implemented schema rather than this planning document.

---

# Phase 1 Data Flow

```text
User Registration
      ↓
users

Resume Upload
      ↓
resumes
      ↓
Text Extraction
      ↓
Gemini Structured Extraction
      ↓
Stored Resume Analysis

JD Submission
      ↓
jobDescriptions
      ↓
Gemini Structured Extraction
      ↓
Required/Preferred Skills

Resume + JD
      ↓
Deterministic Match Engine
      ↓
Match Score + Evidence
```
