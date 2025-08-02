# **SmartFeed – MVP Product Requirements Document (PRD)**

## **1\. Overview**

### **1.1 Vision**

Turn scattered **X (Twitter) posts** and **YouTube videos** you saved while doom‑scrolling into organized, searchable knowledge with instant AI summaries.

### **1.2 MVP Goal**

Ship a lightweight web app (with an optional iOS share‑sheet) that:

1. **Ingests** new saved X posts and YouTube “Watch Later” videos.  
2. **Automatically classifies** each item into one of five purpose‑driven feeds—**Learn, Plan, Ideate, Cook, Shop**.  
3. Generates a concise **AI summary** (≈150 words) for every item.  
4. Supports lightning‑fast **semantic search** across all saved content and summaries.  
   Target: **100 weekly‑active testers** with ≥70 % retention after Week 2.

---

## **2\. Target Users**

| Persona | Motivation |
| ----- | ----- |
| **Knowledge Hunter** | Quickly resurface tutorial threads & educational videos. |
| **Project Planner** | Find practical how‑to content for side projects. |
| **Home Cook / Shopper** | Save recipe posts or review videos and locate them later. |

---

## **3\. Problem Statement**

Saved tweets and “Watch Later” piles grow endlessly because:

1. They live in separate apps.  
2. Chronological lists offer no context or priority.  
3. Users can’t recall *why* something was saved.

---

## **4\. Solution Scope (MVP)**

1. **Unified Ingestion**  
   * X: Pull bookmarks via paid API or user‑token.  
   * YouTube: Pull “Watch Later” playlist via Data API.  
2. **AI Categorization**  
   * LLM assigns one of the five feeds (confidence score stored).  
   * User override via simple dropdown in item card.  
3. **AI Summary**  
   * X: Summarize tweet or full thread.  
   * YouTube: Use transcript → summary; if no transcript, fallback to title & description.  
4. **Semantic Search**  
   * Store embeddings for text \+ summary in Chroma.  
   * Query returns results ranked by cosine similarity (\<1 s).  
5. **Minimal Feed UI**  
   * Tabs for the five feeds \+ global search bar.  
   * Card shows platform icon, title, summary snippet, date, and override dropdown.

---

## **5\. Out of Scope (Phase 2+)**

* TikTok / Instagram / other platforms  
* Notes & collections  
* Notion or Apple Notes export  
* Team workspaces  
* Monetization mechanics

---

## **6\. Functional Requirements**

| ID | Requirement | Priority |
| ----- | ----- | ----- |
| **FR‑1** | System shall ingest new X bookmarks every 15 min via API. | Must |
| **FR‑2** | System shall ingest new YouTube “Watch Later” items on‑demand & nightly. | Must |
| **FR‑3** | System shall classify each item into one of five feeds with ≥90 % precision on validation set. | Must |
| **FR‑4** | System shall let users manually change a feed in ≤2 clicks. | Must |
| **FR‑5** | System shall generate and store a summary ≤150 words within 10 s of ingestion. | Must |
| **FR‑6** | Global semantic search shall return top 20 results in \<1 s (P95). | Must |
| **FR‑7** | UI shall display at least 20 cards per feed with P95 scroll latency \<100 ms. | Should |

---

## **7\. Non‑Functional Requirements**

* **Reliability**: 99.5 % API uptime, ingestion retries with exponential backoff.  
* **Security**: OAuth 2.0, encrypted at rest (AES‑256) & in transit (TLS 1.2+).  
* **Accessibility**: WCAG AA color contrast; full keyboard navigation; aria‑labels.  
* **Scalability**: Handle 10 k items/user; infra sized for 1 k DAUs; stateless services on ECS/Fargate.

---

## **8\. Success Metrics (MVP)**

| Metric | Target |
| ----- | ----- |
| Weekly Active Users (WAU) | ≥100 within 6 weeks |
| Median items reviewed per user / week | ≥15 |
| Manual override rate | \<15 % of items |
| Summary click‑through (user opens item from feed) | ≥30 % |

---

## **9\. Risks & Mitigations**

| Risk | Impact | Mitigation |
| ----- | ----- | ----- |
| X API price shift | Ingestion may become unaffordable | Offer browser extension fallback; cache tokens per user; periodically reassess plan tiers. |
| Summaries inaccurate | Erodes trust | Display source link prominently; allow “Regenerate” button; fine‑tune on user feedback. |
| YouTube transcript gaps | Summary quality drops | Use YouTube captions API; fallback to video description & key‑frame OCR later. |

---

## **10\. Open Questions**

1. Is a browser extension needed at MVP to avoid X API costs?  
2. Should summaries be pre‑computed or generated lazily on first view to reduce cost?  
3. Preferred length & tone for summaries (bullet vs. paragraph)?

---

## **11\. Indicative Timeline**

| Phase | Duration | Milestones |
| ----- | ----- | ----- |
| **Discovery** | 1 wk | User interviews, category name validation |
| **Alpha Build** | 3 wks | Ingestion, classification, summaries, basic UI |
| **Private Alpha** | 2 wks | 20 users, KPI tracking |
| **Beta Build** | 2 wks | Semantic search, polish, accessibility pass |
| **Public Waitlist Beta** | 2 wks | 100 users, success metric review |


## **12\. Tech Stack**
### Frontend
- Nextjs client
- shadcn
- typescript
- tailwindcss

### Backend
- supabase
- nextjs server side
- pinecone vector database
- composio for connecting to tools and orchestration

---

## **13\. Project Structure**

### **13.1 Directory Organization**

The SmartFeed application follows a modular, scalable architecture with clear separation of concerns:

```
smartfeed/
├── app/                          # Next.js 15 App Router
│   ├── api/                      # API routes (auth, content, search, etc.)
│   ├── feed/                     # Main feed page
│   ├── search/                   # Search results page
│   ├── analytics/                # Analytics dashboard
│   ├── settings/                 # User settings
│   └── onboarding/               # User onboarding flow
├── components/                   # React components
│   ├── ui/                       # Base UI components (shadcn/ui)
│   ├── feed/                     # Feed-specific components
│   ├── search/                   # Search components
│   ├── auth/                     # Authentication components
│   ├── analytics/                # Analytics components
│   └── settings/                 # Settings components
├── lib/                          # Utility libraries
│   ├── api/                      # API utilities
│   ├── auth/                     # Authentication utilities
│   ├── database/                 # Database utilities
│   ├── ai/                       # AI/ML utilities
│   ├── search/                   # Search utilities
│   ├── types/                    # TypeScript type definitions
│   └── constants/                # Application constants
├── hooks/                        # Custom React hooks
│   ├── api/                      # API-related hooks
│   ├── auth/                     # Authentication hooks
│   ├── search/                   # Search hooks
│   └── analytics/                # Analytics hooks
├── services/                     # External service integrations
│   ├── x-api/                    # X (Twitter) API integration
│   ├── youtube-api/              # YouTube API integration
│   ├── ai/                       # AI service integrations
│   ├── search/                   # Search service
│   └── analytics/                # Analytics service
├── types/                        # TypeScript type definitions
├── config/                       # Configuration files
├── utils/                        # Utility functions
├── tests/                        # Test files
├── docs/                         # Documentation
└── project-assets/               # Project documentation and assets
```

### **13.2 Key Architectural Decisions**

#### **API Layer Structure**
- **RESTful API Routes**: Organized by domain (`/api/auth/`, `/api/content/`, etc.)
- **Type Safety**: Full TypeScript coverage with shared type definitions
- **Error Handling**: Centralized error handling with consistent response formats
- **Middleware**: Authentication, validation, and rate limiting middleware

#### **Component Architecture**
- **Atomic Design**: UI components follow atomic design principles
- **Feature-Based Organization**: Components organized by feature/domain
- **Reusability**: Shared components in `components/ui/`
- **State Management**: React hooks for local state, server state via API

#### **Data Layer**
- **Supabase Integration**: Database, authentication, and real-time features
- **Type Safety**: Database types generated from schema
- **Row Level Security**: User-specific data access controls
- **Optimistic Updates**: UI updates before server confirmation

#### **External Services**
- **X API Integration**: OAuth authentication and bookmarks retrieval
- **YouTube API Integration**: Playlist access and video metadata
- **AI Services**: OpenAI for classification and summarization
- **Search Services**: Pinecone for vector search capabilities

### **13.3 Development Workflow**

#### **File Naming Conventions**
- **Components**: PascalCase (e.g., `ContentCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useContent.ts`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Types**: camelCase with `.ts` extension (e.g., `database.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `CATEGORIES`)
- **API Routes**: kebab-case (e.g., `content-items.ts`)

#### **Environment Configuration**
```bash
# Database
DATABASE_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Authentication
NEXTAUTH_URL=
NEXTAUTH_SECRET=

# X (Twitter) API
X_CLIENT_ID=
X_CLIENT_SECRET=
X_BEARER_TOKEN=

# YouTube API
YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=
YOUTUBE_API_KEY=

# AI Services
OPENAI_API_KEY=
OPENAI_ORGANIZATION_ID=

# Search
PINECONE_API_KEY=
PINECONE_ENVIRONMENT=
PINECONE_INDEX_NAME=
```

### **13.4 Testing Strategy**

#### **Test Organization**
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API endpoint and database operation testing
- **E2E Tests**: Complete user flow testing
- **Mock Data**: Comprehensive mock data for testing

#### **Quality Assurance**
- **TypeScript**: Strict type checking throughout
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks for quality checks

This project structure provides a scalable foundation for the SmartFeed application, following Next.js 15 best practices and organizing code by functionality for maintainability and team collaboration.