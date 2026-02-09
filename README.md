# Teman - Global Community Platform

A community platform for foreigners in Korea and Koreans interested in international exchange.
Built with **Next.js 15**, **Supabase (PostgreSQL & Storage)**, and **Prisma**.

## 🚀 Getting Started for Collaborators

### 1. Prerequisites
-   Node.js 18+ installed.
-   Git installed.

### 2. Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/musudang/teman.git
cd teman
npm install --legacy-peer-deps
```
*Note: We use `--legacy-peer-deps` because of a version conflict between React 19 and react-quill.*

### 3. Environment Setup (.env)
You need environment variables to connect to the database.
1.  Copy the example file:
    ```bash
    cp .env.example .env
    ```
2.  Open `.env` and fill in the values.
    -   **Ask the project owner (Mark)** for the `DATABASE_URL`, `DIRECT_URL`, and Supabase keys.
    -   Or, create your own Supabase project for local testing.

### 4. Database Setup
Once `.env` is ready, generate the Prisma client:

```bash
npx prisma generate
npx prisma db push
```

### 5. Running the App
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠 Features
-   **Authentication**: Sign up/Login with JWT & Cookies.
-   **Posts**: Create, read, delete posts with Rich Text Editor (Images supported).
-   **Interactions**: Like and Comment on posts.
-   **My Page**: Manage your profile and view your history.
-   **Admin System**: Special dashboard for admins to manage content.

## 📦 Deployment
This project is deployed on **Vercel**.
-   Pushing to `main` branch automatically triggers a deployment.
-   Ensure all Environment Variables are set in Vercel Project Settings.
