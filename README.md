# SkillAlign — Industry–Skill Intelligence & Curriculum Alignment Platform

> **Smart India Hackathon 2026** | **Problem Statement ID:** SIH26134  
> **Organization:** Government of Maharashtra  
> **Category:** Software | **Theme:** Miscellaneous  
> **Tagline:** *"From Industry Demand to Future-Ready Skills"*

---

## 1. Executive Summary & Problem Context

The Government of Maharashtra faces challenges in aligning technical, vocational, and higher education curricula (e.g. MSBTE polytechnics, ITIs, state engineering universities) with rapidly evolving industrial market demands. Emerging technologies such as Electric Vehicles (EV), Industry 4.0 automation, Robotics, Green Hydrogen, and Cloud Computing evolve on 12–18 month cycles, while traditional curricula revise on 4–5 year intervals.

### The Innovation: Continuous Feedback Architecture
**SkillAlign** is NOT a simple job board or static course repository. It establishes a real-time, closed-loop feedback engine connecting:
$$\text{Industry Demand} \longrightarrow \text{Job Market Signals} \longrightarrow \text{AI Skill Extraction \& Normalization} \longrightarrow \text{Curriculum Mapping} \longrightarrow \text{Skill Gap Scoring} \longrightarrow \text{Explainable Recommendations} \longrightarrow \text{Curriculum Upgrades} \longrightarrow \text{Student Upskilling} \longrightarrow \text{Government Decision Support}$$

---

## 2. Architecture & Tech Stack

```
                                 [ INDUSTRY / OEMS ]
                                          │
                         Hiring Requirements & Technical Specs
                                          ▼
                      ┌───────────────────────────────────────┐
                      │    AI / NLP Skill Extraction Engine   │
                      │  (Tokenization, Taxonomy Normalizer)  │
                      └───────────────────┬───────────────────┘
                                          │ Standardized Competencies
                                          ▼
                      ┌───────────────────────────────────────┐
                      │   Curriculum Gap Computation Engine   │
                      │  Gap = Demand * (1 - Coverage / 100)  │
                      └───────┬───────────────────────┬───────┘
                              │                       │
           Curriculum Gaps    ▼                       ▼    Demand Telemetry
         ┌─────────────────────────┐             ┌─────────────────────────┐
         │   Institute / MSBTE     │             │ Government / DTE Desk   │
         │ - Review Recommendations│             │ - 36-District Heatmap   │
         │ - Approve Module Update │             │ - State Skill Dossier   │
         └────────────┬────────────┘             └─────────────────────────┘
                      │ Updated Syllabi
                      ▼
         ┌─────────────────────────┐
         │    Student Dashboard    │
         │ - EV Tech Readiness: 68%│
         │ - 5-Step Active Roadmap │
         └─────────────────────────┘
```

### Technology Matrix
- **Frontend**: Next.js 14.2 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion, Recharts.
- **UI Design System**: Human-crafted, minimal Government-friendly palette (Navy `#0f172a`, Emerald `#059669`, Electric Blue `#2563eb`). Signature **Mirror / Light Reflection Effect** on buttons, Command Palette (`Ctrl+K`), Toast notification system, and Dark Mode.
- **Backend**: Next.js API Routes (`/api/...`), modular service-layer design.
- **Database & ORM**: Prisma ORM with SQLite for zero-friction local execution, with full 1-to-1 schema compatibility for PostgreSQL (Supabase / Render).
- **AI / NLP Pipeline**: Deterministic multi-word entity extraction, synonym normalizer (e.g. `BMS` $\rightarrow$ `Battery Management Systems`), TF-IDF keyword frequency scoring, and explainable AI recommendation synthesizer (`lib/nlp-engine.ts` + `python/nlp_engine.py`).
- **Security & RBAC**: Multi-role authorization (Student, Industry, Institute, Government, Admin) with bcrypt password hashing and HTTP-only session cookies.

---

## 3. Five Stakeholder Portals

1. **Government Dashboard (`/dashboard/government`)**:
   - Statewide Maharashtra overview across all 36 districts.
   - Interactive 36-district shortage heatmap with sector filters.
   - Active MSBTE curriculum revision docket with review actions.
   - Exportable State Skill Plan Dossier.

2. **Industry Portal (`/dashboard/industry`)**:
   - Organization management (e.g., Tata Motors EV Unit, Pune).
   - Interactive requirement posting with automated NLP extraction.
   - Talent availability index and regional vocational alignment score.

3. **Institute / Curriculum Desk (`/dashboard/institute` & `/curriculum`)**:
   - Course and syllabus module manager (AE-EV-302 Diploma in Automobile Engineering).
   - Course alignment meter (64% baseline alignment).
   - "Why this recommendation?" explainable AI popup (Why, Evidence, Confidence, Lab/Trainer specs).
   - One-click "Approve Curriculum Update" workflow that dynamically injects modules into the course.

4. **Student Career Roadmap (`/dashboard/student`)**:
   - Target Role: EV Technician & Diagnostic Specialist.
   - Job-Role Readiness score (68%).
   - Mastered competencies vs Critical deficits.
   - 5-step interactive learning roadmap with verified progress.
   - Direct industry openings matched in Pune automotive cluster.

5. **Admin Panel (`/dashboard/admin`)**:
   - User directory with verification badges.
   - Institutional and organizational moderation queue.
   - Maharashtra Skill Taxonomy registry and synonym manager.
   - Immutable security audit trail with timestamps and IP records.

---

## 4. Professional Social Networking & Direct Messaging

- **Connections (`/connections`)**:
  - Request, Accept, Reject, Remove, Mutual connections.
  - Connect with industry mentors and peer researchers across Maharashtra.
- **Direct Messaging (`/messages`)**:
  - Near real-time message stream with active contacts.
  - Thread persistence with read receipts.
- **Notifications Center**:
  - Automatic alerts for skill deficits, curriculum recommendations, and connection requests.

---

## 5. Folder Structure

```
SIH 134/
├── app/
│   ├── layout.tsx                    # Root layout, Navbar, Footer, CommandPalette, DemoBar
│   ├── page.tsx                      # Landing page with hero, pipeline, and live NLP widget
│   ├── globals.css                   # Design tokens & Button Mirror Reflection CSS
│   ├── login/page.tsx                # Authentication screen with 1-click demo pre-fills
│   ├── signup/page.tsx               # 4-role registration with district dropdown
│   ├── dashboard/
│   │   ├── government/page.tsx       # State dashboard & 36-district heatmap
│   │   ├── industry/page.tsx         # Employer demand desk & NLP requirement poster
│   │   ├── institute/page.tsx        # MSBTE syllabus manager & recommendation approvals
│   │   ├── student/page.tsx          # Career readiness & 5-step EV learning roadmap
│   │   └── admin/page.tsx            # Moderation, taxonomy registry, audit trail
│   ├── curriculum/page.tsx           # Deep curriculum mapping & live NLP workbench
│   ├── district-intelligence/page.tsx# Maharashtra 36-district geo-telemetry
│   ├── connections/page.tsx          # Professional networking & mutual connections
│   ├── messages/page.tsx             # Direct messaging conversation threads
│   └── api/
│       ├── auth/                     # Login, signup, logout, demo-switch
│       ├── skills/analyze/           # NLP skill extraction & synonym normalization
│       ├── skill-gap/analyze/        # Mathematical gap formula computation
│       ├── recommendations/          # Explainable AI recommendations & approvals
│       ├── industry/requirements/    # Demand posting & automatic skill linking
│       ├── curriculum/               # Courses, modules, and skills CRUD
│       ├── connections/              # Connection requests & mutuals
│       ├── messages/                 # Thread retrieval & message sending
│       └── notifications/            # User notification center
├── components/
│   ├── ui/                           # Button with mirror sheen, Card, Modal, Toast, Badge
│   ├── layout/                       # Navbar with active role state, Footer
│   ├── ai/                           # Explainable AI modal, Live Skill Extractor widget
│   ├── maps/                         # Interactive Maharashtra District Heatmap
│   └── demo/                         # Floating Judge Demo Controller bar
├── lib/
│   ├── db.ts                         # Prisma client singleton
│   ├── auth.ts                       # Bcrypt password hashing & session guards
│   ├── nlp-engine.ts                 # TypeScript NLP pipeline & gap formulas
│   ├── taxonomy.ts                   # Maharashtra Skill Taxonomy & District Registry
│   └── utils.ts                      # Formatting & severity color utilities
├── prisma/
│   ├── schema.prisma                 # Relational schema (22 models)
│   └── seed.ts                       # Seed script with EV case study & demo accounts
├── python/
│   └── nlp_engine.py                 # Standalone Python NLP script
└── tests/
    └── full-flow.test.ts             # 24 automated unit and integration tests
```

---

## 6. Environment Variables (`.env`)

```env
# Database Connection (SQLite by default for instant zero-dependency execution)
DATABASE_URL="file:./dev.db"

# Session & JWT Security Secret
JWT_SECRET="skillnova-sih26134-secure-production-secret-key-2026"

# Application Metadata
NEXT_PUBLIC_APP_NAME="Skill Nova"
NEXT_PUBLIC_SIH_ID="SIH26134"
NEXT_PUBLIC_STATE="Maharashtra"
NEXT_PUBLIC_ORG="Government of Maharashtra"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# AI / NLP Settings
NLP_ENGINE_MODE="hybrid"
```

---

## 7. Demo Accounts & Evaluation Guide

For Smart India Hackathon evaluation, 5 pre-configured demo stakeholder accounts are seeded with password `Demo@123`.

| Stakeholder Perspective | Email Address | Pre-configured Context |
|---|---|---|
| **Student** | `student@skillnova.gov.in` | Aarav Deshmukh, GP Pune, Target: EV Technician (68% Ready) |
| **Industry** | `industry@tatamotors.com` | Tata Motors EV Systems Unit, Pune Automotive Cluster |
| **Institute** | `institute@msbte.ac.in` | Government Polytechnic Pune (MSBTE Affiliated) |
| **Government** | `government@maharashtra.gov.in`| Directorate of Technical Education (DTE), Maharashtra |
| **Admin** | `admin@skillnova.gov.in` | Platform Administrator (Full system moderation) |

> **Tip for Judges**: Use the **floating Demo Controller** at the bottom-left corner to switch perspectives with 1 click without re-typing passwords!

---

## 8. Key Demonstration Scenario: "EV Technician"

1. **Industry Demand Posting**:
   - Switch to **Industry** perspective (`industry@tatamotors.com`).
   - Navigate to **Industry Hub** (`/dashboard/industry`).
   - Notice Tata Motors posting for EV Specialists. Submit a new requirement for *"EV Technician skilled in BMS diagnostics, cell balancing, and high-voltage safety"*.
   - The NLP engine automatically tokenizes the spec, extracts 4 competencies, and normalizes `BMS` to `Battery Management Systems`.
2. **Gap Detection**:
   - Switch to **Institute Desk** (`/dashboard/institute`).
   - Inspect Course `AE-EV-302: Diploma in Automobile Engineering`.
   - Notice the **64% alignment score**: Modules 1 to 4 cover vehicle dynamics and traction motors, but BMS is missing!
   - View the **Critical Skill Deficit** (85pt gap in BMS).
3. **Explainable AI Recommendation**:
   - Click **"Why this recommendation?"**.
   - Review transparent rationale: *94/100 Pune industry demand vs 10% MSBTE coverage, 180+ open positions, 91% confidence*.
   - Click **"Approve Curriculum Update"**.
   - Watch the module get dynamically added to the course and alignment score boosted!
4. **Statewide Policy Insights**:
   - Switch to **Government Desk** (`/dashboard/government`).
   - View Pune district on the **36-District Heatmap**, inspect the shortage metrics, and see the updated state curriculum docket.
5. **Student Upskilling**:
   - Switch to **Student Desk** (`/dashboard/student`).
   - Aarav Deshmukh's EV Technician roadmap highlights **Step 3: Battery Management Systems Lab** as the active next step!

---

## 9. Local Development & Verification

```bash
# 1. Install dependencies
npm install

# 2. Push database schema
npm run db:push

# 3. Seed realistic Maharashtra demo dataset
npm run db:seed

# 4. Run automated test suite (24 tests)
npm test

# 5. Build production bundle
npm run build

# 6. Start development server
npm run dev
```

Server runs on: `http://localhost:3000`

---

## 10. AI Safety & Data Transparency Notice

- **No Fake AI**: All skill extraction, alias resolution, and gap scoring utilize deterministic NLP algorithms and taxonomy dictionaries.
- **Explainable Recommendations**: Every recommendation provides clear evidence, underlying demand metrics, and review controls.
- **Synthetic Data Disclaimer**: All demo figures representing Maharashtra districts are synthetic prototypes demonstrating proposed architecture.
