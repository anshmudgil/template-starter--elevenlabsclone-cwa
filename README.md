# App Shell

A minimal Next.js app shell with Clerk auth, shadcn/ui, and a dashboard layout. Ready for you to build on.

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **Clerk** (authentication)
- **shadcn/ui** (components)
- **Tailwind CSS v4**
- **nuqs** (URL state)

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up Clerk (optional for local dev)**

   Copy `.env.example` to `.env` and add your [Clerk](https://dashboard.clerk.com) keys. Without keys, Clerk runs in keyless mode for development.

3. **Run the dev server**

   ```bash
   npm run dev
   ```

4. **Build for production**

   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Protected Mission Control routes
│   ├── sign-in/           # Clerk sign-in
│   └── sign-up/           # Clerk sign-up
├── components/
│   ├── ui/                # shadcn components
│   └── app-shell-sidebar.tsx
├── hooks/
└── lib/
```

## Customization

- **App name**: Update `APP_NAME` in `src/components/app-shell-sidebar.tsx` and metadata in `src/app/layout.tsx`
- **package.json**: Change `"name": "your-app-name"` to your project name
- **Nav items**: Edit `mainMenuItems` in `src/components/app-shell-sidebar.tsx`
