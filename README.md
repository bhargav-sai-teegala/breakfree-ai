# BreakFree AI - Habit Breaking Companion

BreakFree AI is an empathetic AI companion specializing in habit change and addiction recovery. It uses evidence-based techniques from Cognitive Behavioral Therapy (CBT) and motivational interviewing, powered by Google Gemini 1.5 Flash.

This project is built for the **PromptWars Hackathon**.

## 🚀 Features
- **AI Coach**: An empathetic, 24/7 AI companion (powered by Gemini) that uses CBT techniques to talk you through urges and relapses without shame or guilt.
- **Urge Tracking**: Log your urges with contextual data (triggers, mood, intensity) to understand your patterns.
- **Graceful Nudges**: Short, action-oriented AI nudges under 80 words to keep you on track.
- **Secure Authentication**: End-to-end authentication and database storage using Supabase.

## 🧪 Evaluator Testing Instructions

To thoroughly evaluate this project and ensure all features run end-to-end without being disqualified:

1. **Access the live URL** (deployed on Vercel).
2. **Login using the Test Credentials**:
   - **Email**: `evaluator@breakfree.ai`
   - **Password**: `Evaluator123!`
   *(Note: You can also create a new account, but this test account is pre-populated with data for easier testing).*
3. **Navigate to the AI Coach** and send a message about an urge you are having (e.g., "I'm having a strong urge to scroll social media right now"). The Gemini AI will stream a response instantly.
4. **Log an Urge** in the Urge tracking section.

### Important Note on Vercel
If you encounter a `500 Internal Server Error` on Vercel, please ensure that the environment variables from `.env.local` are correctly added to the Vercel project dashboard.

## 🛠️ Technology Stack
- **Framework**: Next.js 16 (App Router)
- **AI / LLM**: Google Generative AI (`gemini-flash-latest`)
- **Database & Auth**: Supabase (PostgreSQL, Supabase Auth)
- **Styling**: Tailwind CSS & Modern Glassmorphism UI

## 💻 Running Locally

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env.local` (ensure you have Supabase and Gemini API keys).
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏆 PromptWars Parameters Alignment
- **Problem Statement Alignment (High Impact)**: Directly targets the challenge of using AI to provide immediate, context-aware support for mental well-being and habit breaking.
- **Code Quality (High Impact)**: Clean, modular architecture using modern Next.js 16 Server Actions, React Server Components (RSC), and strongly-typed TypeScript.
- **Security (Medium Impact)**: Implements Next.js edge middleware (`proxy.ts`) for secure route protection and uses HTTP-only cookies via Supabase SSR.
- **Efficiency (Medium Impact)**: Implements streaming Server-Sent Events (SSE) for Gemini API responses to ensure extremely low latency.
