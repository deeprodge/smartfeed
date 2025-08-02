# SmartFeed Project Structure

## **Overview**

This document outlines the complete directory structure for the SmartFeed application, organized by functionality and following Next.js 15 conventions with TypeScript.

## **Root Directory Structure**

```
smartfeed/
├── app/                          # Next.js 15 App Router
├── components/                    # React components
├── lib/                          # Utility libraries and configurations
├── hooks/                        # Custom React hooks
├── services/                     # External service integrations
├── types/                        # TypeScript type definitions
├── config/                       # Configuration files
├── utils/                        # Utility functions
├── tests/                        # Test files
├── docs/                         # Documentation
├── project-assets/               # Project documentation and assets
├── public/                       # Static assets
└── [config files]               # Next.js, TypeScript, etc.
```

## **Detailed Directory Structure**

### **📁 app/ (Next.js App Router)**

```
app/
├── api/                          # API routes
│   ├── auth/                     # Authentication endpoints
│   │   ├── callback/
│   │   ├── login/
│   │   └── logout/
│   ├── users/                    # User management
│   │   ├── profile/
│   │   └── preferences/
│   ├── content/                  # Content CRUD operations
│   │   ├── items/
│   │   ├── categories/
│   │   └── search/
│   ├── categories/               # Category management
│   ├── search/                   # Search functionality
│   ├── ingestion/                # Content ingestion
│   │   ├── x/
│   │   └── youtube/
│   └── analytics/                # Analytics endpoints
├── feed/                         # Main feed page
├── search/                       # Search results page
├── analytics/                    # Analytics dashboard
├── ideate/                       # Ideate feature page
├── settings/                     # User settings page
├── onboarding/                   # User onboarding flow
├── globals.css                   # Global styles
├── layout.tsx                    # Root layout
└── page.tsx                      # Home page (redirects to feed)
```

### **📁 components/ (React Components)**

```
components/
├── ui/                           # Base UI components (shadcn/ui)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── badge.tsx
│   ├── progress.tsx
│   ├── scroll-area.tsx
│   ├── separator.tsx
│   ├── sheet.tsx
│   ├── sidebar.tsx
│   ├── skeleton.tsx
│   └── tooltip.tsx
├── feed/                         # Feed-specific components
│   ├── feed-layout.tsx
│   ├── feed-content.tsx
│   ├── content-card.tsx
│   ├── filter-chips.tsx
│   └── feed-header.tsx
├── search/                       # Search components
│   ├── search-bar.tsx
│   ├── search-results.tsx
│   ├── search-filters.tsx
│   └── search-suggestions.tsx
├── auth/                         # Authentication components
│   ├── login-form.tsx
│   ├── oauth-buttons.tsx
│   └── auth-guard.tsx
├── analytics/                    # Analytics components
│   ├── analytics-dashboard.tsx
│   ├── metrics-card.tsx
│   └── charts/
├── settings/                     # Settings components
│   ├── settings-layout.tsx
│   ├── platform-connection.tsx
│   └── preferences-form.tsx
├── onboarding/                   # Onboarding components
│   ├── onboarding-flow.tsx
│   ├── platform-setup.tsx
│   └── welcome-screen.tsx
├── navigation.tsx                # Main navigation
├── chat-sidebar.tsx              # Chat/ideate sidebar
├── ideate-chat.tsx               # Ideate chat component
└── mobile-chat-overlay.tsx       # Mobile chat overlay
```

### **📁 lib/ (Utility Libraries)**

```
lib/
├── api/                          # API utilities
│   ├── client.ts                 # API client configuration
│   ├── endpoints.ts              # API endpoint definitions
│   └── middleware.ts             # API middleware
├── auth/                         # Authentication utilities
│   ├── supabase.ts               # Supabase client
│   ├── oauth.ts                  # OAuth utilities
│   └── session.ts                # Session management
├── database/                     # Database utilities
│   ├── client.ts                 # Database client
│   ├── queries.ts                # Database queries
│   └── migrations.ts             # Database migrations
├── ai/                           # AI/ML utilities
│   ├── openai.ts                 # OpenAI client
│   ├── classification.ts         # Content classification
│   ├── summarization.ts          # Content summarization
│   └── embeddings.ts             # Embedding generation
├── search/                       # Search utilities
│   ├── pinecone.ts               # Pinecone client
│   ├── vector-search.ts          # Vector search logic
│   └── search-utils.ts           # Search utilities
├── utils.ts                      # General utilities
├── types/                        # Type definitions
│   ├── database.ts               # Database types
│   ├── api.ts                    # API types
│   ├── auth.ts                   # Auth types
│   └── ai.ts                     # AI types
└── constants/                    # Application constants
    ├── categories.ts             # Category definitions
    ├── platforms.ts              # Platform definitions
    └── config.ts                 # General config
```

### **📁 hooks/ (Custom React Hooks)**

```
hooks/
├── api/                          # API-related hooks
│   ├── use-content.ts            # Content management
│   ├── use-search.ts             # Search functionality
│   └── use-analytics.ts          # Analytics data
├── auth/                         # Authentication hooks
│   ├── use-auth.ts               # Authentication state
│   ├── use-user.ts               # User data
│   └── use-oauth.ts              # OAuth flow
├── search/                       # Search hooks
│   ├── use-search-query.ts       # Search query management
│   └── use-search-results.ts     # Search results
├── analytics/                    # Analytics hooks
│   ├── use-metrics.ts            # Metrics data
│   └── use-events.ts             # Event tracking
└── use-mobile.ts                 # Mobile detection
```

### **📁 services/ (External Service Integrations)**

```
services/
├── x-api/                        # X (Twitter) API integration
│   ├── client.ts                 # X API client
│   ├── bookmarks.ts              # Bookmarks retrieval
│   ├── tweets.ts                 # Tweet processing
│   └── auth.ts                   # X authentication
├── youtube-api/                  # YouTube API integration
│   ├── client.ts                 # YouTube API client
│   ├── playlists.ts              # Playlist retrieval
│   ├── videos.ts                 # Video processing
│   ├── transcripts.ts            # Transcript extraction
│   └── auth.ts                   # YouTube authentication
├── ai/                           # AI service integrations
│   ├── openai-service.ts         # OpenAI service
│   ├── classification-service.ts  # Classification service
│   ├── summarization-service.ts  # Summarization service
│   └── embedding-service.ts      # Embedding service
├── search/                       # Search service
│   ├── pinecone-service.ts       # Pinecone service
│   ├── vector-search-service.ts  # Vector search
│   └── search-index-service.ts   # Search indexing
└── analytics/                    # Analytics service
    ├── tracking-service.ts        # Event tracking
    ├── metrics-service.ts         # Metrics collection
    └── reporting-service.ts       # Analytics reporting
```

### **📁 types/ (TypeScript Type Definitions)**

```
types/
├── database/                     # Database types
│   ├── schema.ts                 # Database schema types
│   ├── queries.ts                # Query result types
│   └── migrations.ts             # Migration types
├── api/                          # API types
│   ├── requests.ts               # Request types
│   ├── responses.ts              # Response types
│   └── errors.ts                 # Error types
├── auth/                         # Authentication types
│   ├── user.ts                   # User types
│   ├── session.ts                # Session types
│   └── oauth.ts                  # OAuth types
└── ai/                           # AI types
    ├── classification.ts          # Classification types
    ├── summarization.ts          # Summarization types
    └── embeddings.ts             # Embedding types
```

### **📁 config/ (Configuration Files)**

```
config/
├── database/                     # Database configuration
│   ├── schema.sql                # Database schema
│   ├── migrations/               # Database migrations
│   └── seed.ts                   # Seed data
├── auth/                         # Authentication configuration
│   ├── oauth.ts                  # OAuth configuration
│   ├── supabase.ts               # Supabase configuration
│   └── policies.ts               # RLS policies
├── ai/                           # AI configuration
│   ├── openai.ts                 # OpenAI configuration
│   ├── prompts.ts                # AI prompts
│   └── models.ts                 # Model configurations
└── search/                       # Search configuration
    ├── pinecone.ts               # Pinecone configuration
    ├── indexes.ts                # Search indexes
    └── embeddings.ts             # Embedding configuration
```

### **📁 utils/ (Utility Functions)**

```
utils/
├── validation/                   # Validation utilities
│   ├── schemas.ts                # Zod schemas
│   ├── validators.ts             # Custom validators
│   └── sanitizers.ts             # Input sanitization
├── formatting/                   # Formatting utilities
│   ├── dates.ts                  # Date formatting
│   ├── text.ts                   # Text formatting
│   └── numbers.ts                # Number formatting
├── encryption/                   # Encryption utilities
│   ├── tokens.ts                 # Token encryption
│   ├── keys.ts                   # Key management
│   └── hashing.ts                # Hashing utilities
└── analytics/                    # Analytics utilities
    ├── events.ts                 # Event tracking
    ├── metrics.ts                # Metrics calculation
    └── reporting.ts              # Report generation
```

### **📁 tests/ (Test Files)**

```
tests/
├── unit/                         # Unit tests
│   ├── components/               # Component tests
│   ├── hooks/                    # Hook tests
│   ├── utils/                    # Utility tests
│   └── services/                 # Service tests
├── integration/                  # Integration tests
│   ├── api/                      # API tests
│   ├── database/                 # Database tests
│   └── auth/                     # Auth tests
├── e2e/                          # End-to-end tests
│   ├── flows/                    # User flows
│   ├── scenarios/                # Test scenarios
│   └── fixtures/                 # Test data
└── mocks/                        # Mock data and utilities
    ├── data/                     # Mock data
    ├── services/                 # Service mocks
    └── utils/                    # Mock utilities
```

### **📁 docs/ (Documentation)**

```
docs/
├── api/                          # API documentation
│   ├── endpoints.md              # API endpoints
│   ├── authentication.md         # Auth documentation
│   └── examples.md               # API examples
├── deployment/                   # Deployment docs
│   ├── production.md             # Production setup
│   ├── environment.md            # Environment variables
│   └── monitoring.md             # Monitoring setup
└── development/                  # Development docs
    ├── setup.md                  # Development setup
    ├── architecture.md           # Architecture overview
    └── contributing.md           # Contributing guidelines
```

## **Key Configuration Files**

```
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── next.config.ts                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── components.json               # shadcn/ui configuration
├── eslint.config.mjs             # ESLint configuration
├── postcss.config.mjs            # PostCSS configuration
├── .env.local                    # Local environment variables
├── .env.example                  # Environment variables template
└── .gitignore                    # Git ignore rules
```

## **Environment Variables Structure**

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

# Analytics
ANALYTICS_API_KEY=
TRACKING_ID=
```

## **Development Workflow**

1. **Feature Development**: Create feature branches from `main`
2. **Component Development**: Place components in appropriate directories
3. **API Development**: Create API routes in `app/api/`
4. **Testing**: Write tests alongside code in `tests/`
5. **Documentation**: Update docs in `docs/` directory
6. **Deployment**: Use environment-specific configurations

## **File Naming Conventions**

- **Components**: PascalCase (e.g., `ContentCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useContent.ts`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Types**: camelCase with `.ts` extension (e.g., `database.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `CATEGORIES`)
- **API Routes**: kebab-case (e.g., `content-items.ts`)

This structure provides a scalable foundation for the SmartFeed application, following Next.js 15 best practices and organizing code by functionality for maintainability and team collaboration. 