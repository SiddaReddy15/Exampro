# 🎓 ExamPro: Advanced Assessment SaaS Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-blue?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Turso](https://img.shields.io/badge/Turso-LibSQL-teal?style=for-the-badge&logo=sqlite)](https://turso.tech/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

**ExamPro** is a state-of-the-art, production-ready SaaS platform designed to streamline the entire assessment lifecycle. From technical coding evaluations to general proficiency MCQs, ExamPro provides a seamless experience for both administrators and candidates.

---

## ✨ Key Features

### 🏛️ Administrative Excellence
- **Unified Exam Lifecycle**: Full control over "Go Live" and "Unpublish" states with real-time synchronization to student portals.
- **Dynamic Assessment Management**: Create and edit assessments with precision—titles, categories, passing scores, and scheduling windows.
- **Bulk Repository Import**: Massive question bank updates via Excel workbooks with automated validation.
- **Real-time Analytics**: High-fidelity dashboard displaying attempt trends, pass/fail rates, and student performance metrics.
- **Leaderboard Management**: Global ranking system based on cumulative performance.

### ✍️ Candidate Experience
- **Premium Exam Interface**: A distraction-free, timed assessment environment with a "focus-first" design.
- **Smart Autosave**: Advanced background synchronization ensuring no progress is lost, even during network instability.
- **Technical Versatility**: Supports **MCQs**, **Short Answers**, and **Coding Challenges** with a high-performance workspace.
- **Instant Feedback**: Immediate result processing and detailed performance breakdown upon submission.
- **Personalized Dashboard**: Tailored greetings and progress tracking for every student.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 14, Tailwind CSS, Framer Motion, TanStack Query, Sonner (Toasts) |
| **Backend** | Node.js, Express, TypeScript, JWT (Auth), Multer (FileUpload) |
| **Database** | Turso (LibSQL), SQLite-compatible edge storage |
| **Design** | Indigo & Slate Palette, Glassmorphism, Micro-animations |

---

## 🚀 Getting Started

### 1. Backend Infrastructure
```bash
cd backend
npm install
npm run dev
```
*Environment Variables (`backend/.env`):*
- `PORT=5000`
- `DATABASE_URL`: Your Turso DB URL
- `DATABASE_AUTH_TOKEN`: Your Turso Auth Token
- `JWT_SECRET`: Secure encryption key

### 2. Frontend Interface
```bash
cd frontend
npm install
npm run dev
```
*Environment Variables (`frontend/.env.local`):*
- `NEXT_PUBLIC_API_URL=http://localhost:5000/api`

---

## 📂 Project Structure

- `backend/src/controllers`: Core business logic and API handlers.
- `backend/src/routes`: Express API routing.
- `frontend/src/app`: Next.js 14 App Router (Admin & Student zones).
- `frontend/src/services`: Centralized API communication layer.
- `frontend/src/context`: Global Authentication and Theme state.

---

## 🛡️ Security & Reliability
- **RBAC**: Strict Role-Based Access Control between Admin and Student domains.
- **Data Integrity**: Optimized SQL queries with explicit type safety and JSON parsing.
- **Error Resilience**: Robust exception handling and professional UI feedback states.

---
Developed with ❤️ for Advanced Agentic Coding.
