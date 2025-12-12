# Smart Minds - Digital Learning Platform

## Overview
Smart Minds is a digital learning platform designed for Grade 12 (matric) learners and those upgrading their results in South Africa. The platform offers subject-specific learning aligned with the CAPS curriculum.

## Current State
Full-stack application with React frontend and Express backend, featuring:
- User authentication with payment gating (only paid users can login)
- Stripe payment integration for subscriptions
- Multiple choice quizzes for theory subjects
- SEO-optimized pages for Google visibility

## Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS, Framer Motion, Wouter (routing)
- **Backend**: Express.js (Node.js 20), TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Payments**: Stripe (subscription-based)
- **Authentication**: Session-based with bcryptjs password hashing

## Project Structure
```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utilities and data
│   │   └── hooks/          # Custom React hooks
│   └── index.html          # HTML template with SEO tags
├── server/                 # Express backend
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Database operations
│   └── db.ts               # Database connection
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Drizzle schema definitions
├── public/                 # Static HTML files (legacy)
└── attached_assets/        # Generated images
```

## Features

### Authentication & Payments
- Users register and select subjects
- Payment via Stripe checkout
- Only paid users and teachers can login
- Session-based authentication

### Subjects (R250/month each)
1. Physical Sciences (Physics + Chemistry)
2. Mathematics (Algebra, Calculus, Geometry, Trig)
3. Life Sciences (Biology, Genetics, Anatomy)
4. Accounting (Financial + Managerial)
5. Geography (Theory + Mapwork)
6. Economics (Macro + Micro)
7. Business Studies (Environments + Ventures)
8. Mathematical Literacy (Finance, Data, Maps)

### Multiple Choice Quizzes
Theory subjects have interactive quizzes with:
- Green tick for correct answers
- Red X for wrong answers
- Explanation shown after each question
- Score summary at the end

Subjects with quizzes:
- Life Sciences (DNA, Human Evolution)
- Geography (Tropical Cyclones, Drainage Systems)
- Economics (Inflation, Perfect Markets)
- Business Studies (Business Ethics, Human Resources)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (requires payment for students)
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Payments
- `POST /api/create-checkout-session` - Create Stripe checkout
- `POST /api/webhooks/stripe` - Stripe webhook handler

### Quizzes
- `GET /api/quizzes/:subjectId` - Get quizzes for subject
- `GET /api/quiz/:quizId` - Get quiz with questions
- `POST /api/quiz/:quizId/submit` - Submit quiz answers
- `POST /api/admin/seed-quizzes` - Seed quiz data

## Database Schema
- `users` - User accounts with payment status
- `subscriptions` - User subscriptions
- `quizzes` - Quiz definitions
- `quiz_questions` - Multiple choice questions
- `quiz_attempts` - User quiz attempts

## Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `STRIPE_SECRET_KEY` - Stripe API key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `SESSION_SECRET` - Express session secret (optional)

## Contact
- Email: tsmartminds@gmail.com
- Phone: +27 81 699 1450
- Location: Pretoria, South Africa

## Recent Changes (December 2025)
- Added Stripe payment integration
- Implemented payment-gated login (only paid users can access)
- Created multiple choice quiz system for theory subjects
- Added SEO meta tags and structured data for Google visibility
- Updated email to tsmartminds@gmail.com
- Made pricing numbers non-clickable (display only)
