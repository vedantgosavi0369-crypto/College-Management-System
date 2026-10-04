# College Management System

This is a Next.js demo of a college management portal with role-based dashboard views for administrators, principals, teachers, students, staff, and watchmen.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy to Vercel

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. In Vercel, select **Add New Project** and import the repository.
3. Keep the detected framework as **Next.js**.
4. Use the default install and build settings:
   - Install command: `npm install` (or leave blank)
   - Build command: `npm run build`
   - Output directory: leave blank
5. Deploy. This project does not currently require environment variables.

The production checks used before deployment are:

```bash
npm run lint
npm run build
```

## Demo limitations

This version is a frontend-only demo. Login credentials and sample data are bundled in the client, and changes are stored in each browser's `localStorage`. Data is not shared between users or devices and is not durable server-side storage.

Before using this as a real college system, add server-side authentication, role authorization, API/server actions, and a hosted database. Secrets and passwords must not be stored in client-side code.
