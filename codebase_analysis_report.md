# Codebase Analysis Report

## Overview

Prompt Atom Forge ("Prompt or Die") is a Vite + React application written in TypeScript. The project provides a visual prompt builder with drag‑and‑drop blocks, user authentication via Supabase, and interactive features such as a command terminal. Styling is handled with Tailwind CSS and Shadcn‑UI components. The application aims to let users create modular AI prompts, preview them, and manage projects.

### Technology Stack
- **Frontend**: React 18 with TypeScript (`@vitejs/plugin-react-swc`), Vite
- **Styling**: Tailwind CSS, Shadcn‑UI components
- **State/Utilities**: React Query, custom React hooks, Lucide icons
- **Backend services**: Supabase for auth/storage and database
- **External APIs**: OpenAI API integration

Key configuration is found in `vite.config.ts` which sets up React, component tagging and alias resolution【F:vite.config.ts†L1-L21】.

## Codebase Structure
```
/ (root)
├── index.html          # entry HTML
├── src/                # application source code
│   ├── components/     # React components (UI and custom)
│   ├── pages/          # Route pages
│   ├── hooks/          # React hooks for auth, theme, etc.
│   ├── lib/            # API helpers and utilities
│   └── index.css       # Tailwind base styles
├── supabase/           # database migrations
├── tailwind.config.ts  # Tailwind configuration
└── package.json        # project metadata & scripts
```
Entry point `src/main.tsx` mounts `<App />` inside `index.html`【F:src/main.tsx†L1-L6】. Routes are defined in `src/App.tsx` using React Router to render pages such as Dashboard, Gallery, Docs, and the Project Editor【F:src/App.tsx†L9-L37】.

### Modules
- **components/** – Contains UI pieces like `PromptBlock`, `BuilderPanel`, dialogs, and a custom command terminal. Many Shadcn‑derived components live in `components/ui`.
- **pages/** – Each route such as `Auth.tsx`, `Gallery.tsx`, `ProjectEditor.tsx`, and `UserDashboard.tsx` handles page layout and logic.
- **hooks/** – Custom hooks for auth management (`use-auth`), theme toggling, mobile detection, toasts, and terminal state.
- **lib/** – Utility modules: Supabase client, OpenAI request helper, DB types, and small helpers.
- **supabase/** – Contains SQL migration to enforce row-level security policies and triggers for project creation【F:supabase/migrations/20250604120702_cold_morning.sql†L1-L86】.

## Code Quality Analysis

### Style & Consistency
- Code follows TypeScript with React functional components.
- ESLint configuration extends `@eslint/js` and `typescript-eslint` recommended settings with React Hooks rules【F:eslint.config.js†L1-L29】.
- Tailwind and Shadcn‑UI are used consistently for styling, with custom animations defined in `tailwind.config.ts`【F:tailwind.config.ts†L1-L86】.

### Potential Issues & Bugs
- **Environment variable handling**: `src/lib/openai.ts` reads OpenAI keys from `import.meta.env` but also stores user‑entered keys in `localStorage` via `AIApiKeySetup` component. Missing keys produce console errors and toasts【F:src/lib/openai.ts†L12-L31】.
- **ESLint errors**: running `npm run lint` fails due to missing `@eslint/js` dependency in the environment, resulting in an error seen during analysis【d64a43†L1-L20】.
- **No network error handling** in OpenAI or Supabase requests besides console logging and toast messages; consider more robust user feedback.
- **Security**: API keys are stored in `localStorage`, which is vulnerable to XSS. Access tokens should be handled carefully.
- **CLI Terminal**: The command terminal processes user commands via text input and uses `useNavigate` to change routes. There may be security concerns if user-provided commands are not sanitized.

### Performance & Optimization
- Many components rely on heavy data (e.g., `Gallery.tsx` loads full dataset in the component). Could use pagination/lazy loading for performance.
- Some pages use static arrays and mock data; real backend calls will need caching and error handling with React Query.

## Technical Debt Assessment
- **Outdated Dependencies**: Many dependencies pinned to specific versions; ensure updates regularly in `package.json`.
- **Duplication**: Several components replicate logic, e.g., repeated toasts and icon usage. Could abstract repetitive patterns.
- **Documentation**: README primarily describes how to run the project but lacks API or architecture docs.
- **Tests**: No unit or integration tests present.

## Recommendations
1. **Fix ESLint / Prettier** to ensure linting works in CI. Install missing packages and run `npm run lint` routinely.
2. **Improve security**: avoid storing API keys in localStorage; use server-side environment variables or secure vaults.
3. **Add error boundaries** around pages to gracefully handle runtime errors.
4. **Implement tests**: add unit tests for hooks and components and integration tests for page flows.
5. **Optimize state**: use React Query for API data fetching across pages (e.g., Gallery, Dashboard) to reduce duplication.
6. **Documentation**: document component usage and API endpoints; add comments describing complex functions such as the command terminal.
7. **Accessibility**: ensure all interactive elements have proper aria labels.

## Action Items
### Immediate
- Install missing ESLint dependencies and resolve lint errors.
- Document environment variables required for Supabase and OpenAI.
- Review security around API key storage and consider server‑side proxy.

### Medium‑Term
- Refactor repeated toast logic and styles into reusable helpers.
- Implement unit tests for core hooks (`use-auth`, `use-command-terminal`) and components like `PromptBlock`.
- Paginate or lazily load gallery items and analytics data.

### Long‑Term
- Expand Supabase schema and migrations with version control.
- Implement robust error handling and loading states for all network calls.
- Consider migrating to context or Redux for complex state management if needed.
- Provide continuous deployment pipeline with testing and linting steps.

### Documentation
- Extend README with architecture overview and setup instructions.
- Add CONTRIBUTING guidelines and code style conventions.

---
*Generated on $(date -u)*
