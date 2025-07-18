---
# E2E-Next-Supabase Frontend

A Next.js frontend for End to End Transit Solutions, featuring authentication and user management, integrated with Supabase.
---

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**  
   Create a `.env.local` file in the root directory with the following variables (see below).

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:4021](http://localhost:4021).

---

## Environment Variables

Create a `.env.local` file in the root directory and add:

```env
# Supabase project URL
SUPABASE_URL=your-supabase-url

# Supabase anon/public key
SUPABASE_ANON_KEY=your-supabase-anon-key

# Backend API base URL (for authentication endpoints)
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.com
```

- `SUPABASE_URL` and `SUPABASE_ANON_KEY` are required for Supabase integration.
- `NEXT_PUBLIC_API_BASE_URL` is used for all authentication-related API calls (signup, login, OTP verification, password reset, user sync).

---

## Available Commands

| Command         | Description                               |
| --------------- | ----------------------------------------- |
| `npm run dev`   | Start the development server on port 4021 |
| `npm run build` | Build the application for production      |

---

## Project Structure & Routes

### Main Pages

- `/`  
  **Home page**: Landing page with a sign-up button.

- `/signup`  
  **Sign Up & Login**:

  - Sign up with email and password (calls `/auth/signup` on your backend).
  - Login with email and password (calls `/auth/login`).
  - Google OAuth login.
  - Link to password reset.

- `/verify`  
  **OTP Verification**:

  - Enter OTP sent to email to verify account (calls `/auth/verify`).

- `/forgotten-password`  
  **Password Reset**:

  - Request OTP for password reset.
  - Enter OTP and new password to reset (calls `/auth/forgot-password` and `/auth/verify`).

- `/profile`  
  **User Profile**:
  - Displays user info after login.
  - Syncs user data with backend (`/auth/syncuser`).

### Auth Callback Route

- `/auth/callback`  
  Handles Supabase OAuth callback and redirects to `/profile`.

---

## Tech Stack

- **Next.js** 15
- **React** 19
- **Supabase** (with SSR)
- **Tailwind CSS**
- **TypeScript**

---

## Notes

- All environment variables are required for the app to function.
- The project expects a backend API (specified by `NEXT_PUBLIC_API_BASE_URL`) for authentication endpoints.
- Supabase credentials are required for user authentication and session management.

---.
