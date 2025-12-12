# Smart Minds - Digital Learning Platform

## Overview

Smart Minds is a digital learning platform designed for Grade 12 (matric) learners and those upgrading their results in South Africa. The platform provides curriculum-aligned video lessons, live classes, and interactive quizzes for subjects including Physical Sciences, Mathematics, Life Sciences, Geography, Accounting, Economics, Business Studies, and Mathematical Literacy. The pricing model is R250 per subject per month with Stripe-based subscription payments.

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

The frontend follows a pages-based structure with reusable components. Each page uses a shared Layout component for consistent navigation. The UI uses CSS variables for theming with a primary navy blue and secondary teal color scheme.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js 20
- **API Design**: RESTful endpoints under `/api` prefix
- **Session Management**: express-session with secure cookies

The server handles authentication, payment processing, and quiz management. In development, Vite middleware serves the frontend with HMR support. In production, static files are served from the `dist/public` directory.

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

### Payment Integration
- **Provider**: Stripe (subscription-based)
- **Flow**: Register → Select subjects → Stripe checkout → Account activation
- **Webhook handling**: Updates user payment status on successful subscription

## External Dependencies

### Third-Party Services
- **Stripe**: Payment processing for monthly subscriptions (requires `STRIPE_SECRET_KEY`)
- **PostgreSQL**: Database storage (requires `DATABASE_URL`)

### Key NPM Packages
- `express` - Web server framework
- `drizzle-orm` / `drizzle-kit` - Database ORM and migrations
- `stripe` - Payment integration
- `bcryptjs` - Password hashing
- `express-session` - Session management
- `zod` - Schema validation
- `@tanstack/react-query` - Frontend data fetching
- `framer-motion` - Animations
- `wouter` - Client-side routing

### Build & Development
- `vite` - Frontend build tool
- `esbuild` - Server bundling for production
- `tsx` - TypeScript execution for development

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `STRIPE_SECRET_KEY` - Stripe API secret key
- `SESSION_SECRET` - Express session encryption key (optional, has default)