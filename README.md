# POC-wOS-remix

A modern, production-ready template for building full-stack React applications using React Router v7 with WorkOS authentication.

## Features

- 🚀 Server-side rendering (SSR)
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS + DaisyUI for styling
- 🔐 WorkOS authentication integrated
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- WorkOS account (sign up at [https://workos.com](https://workos.com))

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up your environment variables:

```bash
cp .env.example .env
```

3. Configure your `.env` file with your WorkOS credentials:

```env
WORKOS_CLIENT_ID=your_client_id_here
WORKOS_API_KEY=your_api_key_here
WORKOS_REDIRECT_URI=http://localhost:5173/workos/callback
WORKOS_COOKIE_PASSWORD=generate_a_secure_random_string
SESSION_SECRET=generate_another_secure_random_string
```

**To generate secure random strings:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### WorkOS Setup

1. Go to [WorkOS Dashboard](https://dashboard.workos.com/)
2. Create a new project or select an existing one
3. Navigate to **Authentication** → **Configure**
4. Set up your redirect URI: `http://localhost:5173/workos/callback`
5. Copy your **Client ID** and **API Key** to your `.env` file
6. Configure your authentication method (Email/Password, Google SSO, etc.)

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Authentication Flow

This application uses WorkOS AuthKit for authentication:

1. User clicks "Entrar com WorkOS" on landing page
2. Redirected to WorkOS Hosted Sign-in page
3. After authentication, WorkOS redirects back to `/workos/callback`
4. User is authenticated and redirected to `/home`

### Protected Routes

Routes under `_private.*` are protected and require authentication. Users will be automatically redirected to the WorkOS login page if not authenticated.

## Building for Production

Create a production build:

```bash
npm run build
```

## Project Structure

```
app/
├── routes/
│   ├── _public.tsx              # Public layout
│   ├── _public._index.tsx       # Landing page
│   ├── _private.tsx             # Protected layout
│   ├── _private.home.tsx        # Home page (protected)
│   ├── auth.login.ts            # WorkOS login initiation
│   ├── workos.callback.ts       # WorkOS callback handler
│   └── api.auth.logout.ts       # Logout handler
├── services/
│   └── authService.server.ts    # Authentication service
├── utils/
│   └── session.server.ts        # Session management
└── components/
    └── ...                       # UI components
```

## Technologies

- **React Router v7**: Framework mode with SSR, loaders, and actions
- **DaisyUI**: Component library with multiple themes
- **WorkOS**: Enterprise authentication platform
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first CSS framework

---

Built with ❤️ using React Router v7 and WorkOS.
