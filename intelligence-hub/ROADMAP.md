# Intelligence Hub + Alumni Portfolio Builder roadmap

## Where should it live?

### GitHub.io first

Use GitHub Pages for the public, experimental, evidence-rich layer:

- public research maps;
- public organisation/person directories;
- reproducible data;
- Three.js explorations;
- student and alumni portfolio demos;
- version history through Git.

Advantages: low cost, transparent changes, easy rollback, good fit for static HTML/JSON/JS.

### Main website later

Use the main website for the institutional layer:

- official explanation and trust;
- programme registration;
- alumni onboarding;
- events and contact;
- selected featured maps;
- links to GitHub.io projects.

Recommended relationship:

```text
Main website = front door / institutional trust
GitHub.io = public lab / portfolio / reproducible artefacts
Backend = private member data, only when needed
```

Do not move private alumni data into GitHub Pages. Keep private profiles, email addresses, applications and member-only notes behind authentication and a database.

## Alumni AI portfolio builder

The eventual product should not generate a portfolio from a blank prompt. It should build from an evidence inventory.

### Evidence-first input

Each alumnus supplies evidence such as:

- project title;
- problem addressed;
- role;
- actions taken;
- artefacts or links;
- measurable result;
- skills used;
- collaborators;
- lessons learned;
- permission level (public / alumni-only / private).

### Autonomous pipeline

```text
Evidence form / Markdown
        ↓
Evidence JSON
        ↓
AI extracts claims, skills, outcomes and themes
        ↓
Human review / approval
        ↓
Generated Markdown portfolio
        ↓
Generated HTML/CSS/JS portfolio
        ↓
Preview
        ↓
Optional GitHub Pages deployment
```

The AI should never invent achievements. Every generated claim must link back to an evidence item or be marked as a draft requiring approval.

### Portfolio outputs

Generate several views from the same evidence:

1. narrative portfolio;
2. project cards;
3. skills/evidence matrix;
4. timeline;
5. ecosystem/relationship map;
6. one-page CV or profile;
7. role-specific version for a job or grant application.

### MVP boundary

First pilot with 3–5 alumni and only:

- a Markdown evidence template;
- a JSON evidence schema;
- one AI transformation script;
- one HTML portfolio template;
- one manual preview/publish step.

Do not start with automatic public deployment. Add deployment only after the human review and privacy flow works.

## Governance requirements

- Human approves every public claim.
- Public/private visibility is explicit per evidence item.
- Private data never enters a public repository.
- AI-generated text is labelled until approved.
- Every project link is checked before publication.
- Alumni can revoke or update evidence.
- Generated sites remain editable by the alumnus.

## Proposed phases

### Phase 1 — public draft

Current `intelligence-hub/` folder: Three.js map, public graph JSON, search, filter and detail panel.

### Phase 2 — research build pipeline

Add validation and conversion:

```text
Markdown/CSV → validate → graph.json → static site
```

### Phase 3 — portfolio pilot

Test with 3–5 alumni using synthetic or explicitly public evidence.

### Phase 4 — private member service

Only if validated: authentication, database, private drafts, approval workflow and one-click publishing.

### Phase 5 — scale

Add reusable templates for different disciplines and connect portfolios to the public Intelligence Hub only when the alumnus opts in.
