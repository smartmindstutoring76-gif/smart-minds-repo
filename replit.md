# Smart Minds - Digital Learning Platform

## Overview

Smart Minds is a digital learning platform designed for Grade 12 (matric) learners and those upgrading their results in South Africa. The platform provides curriculum-aligned video lessons, live classes, and interactive quizzes for subjects including Physical Sciences, Mathematics, Life Sciences, Geography, Accounting, Economics, Business Studies, and Mathematical Literacy. The pricing model is R250 per subject per month with Stripe payment integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: Wouter (lightweight React router)
- **Animations**: Framer Motion for page transitions and UI effects
- **State Management**: TanStack React Query for server state
- **Build Tool**: Vite with custom plugins for meta images and Replit integration

The frontend follows a pages-based structure with reusable components located in `client/src/components/`. Each page uses a shared Layout component for consistent navigation. Subject data and features are defined in `client/src/lib/data.ts`. The UI uses CSS variables for theming with a primary navy blue and teal accent color scheme.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js 20
- **API Design**: RESTful endpoints under `/api` prefix
- **Session Management**: express-session with secure cookies

The server handles authentication, payment processing, and quiz management. In development, Vite middleware serves the frontend with HMR support. In production, static files are served from the `dist/public` directory. Server code is located in `server/` with routes defined in `routes.ts` and database operations in `storage.ts`.

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Schema Location**: `shared/schema.ts` contains all table definitions

Key tables:
- `users` - User accounts with payment status and Stripe customer IDs
- `subscriptions` - Subject subscriptions linked to Stripe
- `quizzes` - Quiz definitions per subject
- `quiz_questions` - Multiple choice questions with explanations
- `quiz_attempts` - User quiz completion records

### Authentication Flow
1. Users register with email, password, name, and phone
2. Password hashing uses bcryptjs
3. Users must complete Stripe payment before login is allowed
4. Session-based auth stores userId, role, and payment status
5. Teachers can login without payment requirement

### Project Structure
```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components (layout, shadcn/ui)
│   │   ├── pages/          # Page components (home, subjects, pricing, etc.)
│   │   ├── lib/            # Utilities, data definitions, query client
│   │   └── hooks/          # Custom React hooks
│   └── index.html          # HTML template with SEO meta tags
├── server/                 # Express backend
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API routes (auth, payments, quizzes)
│   ├── storage.ts          # Database operations interface
│   ├── db.ts               # Database connection
│   └── static.ts           # Static file serving for production
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Drizzle schema definitions
└── public/                 # Legacy static HTML files
```

## External Dependencies

### Payment Processing
- **Stripe**: Handles subscription payments for subject access
- Stripe Checkout for payment flow
- Webhook handling for subscription status updates
- Customer and subscription management via Stripe API

### Database
- **PostgreSQL**: Primary database accessed via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and migrations
- **connect-pg-simple**: Session storage in PostgreSQL

### Required Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `STRIPE_SECRET_KEY` - Stripe API secret key
- `SESSION_SECRET` - Express session encryption key (optional, has default)

### Frontend Libraries
- React Query for API data fetching and caching
- Framer Motion for animations
- Lucide React for icons
- Radix UI primitives via shadcn/ui components