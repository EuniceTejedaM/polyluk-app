This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Local Supabase setup

Create a `.env.local` file with these variables before running the app. The file is split into a local block and a commented Vercel block so you can reuse the same template for both environments:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` for browser usage. `NEXT_PUBLIC_SUPABASE_ANON_KEY` still works as a backward-compatible fallback.
- `SUPABASE_SERVICE_ROLE_KEY` for server-side operations only
- `NEXT_PUBLIC_SITE_URL=http://localhost:3000` locally, and your `https://*.vercel.app` URL in production

For Vercel, add the same values in Project Settings > Environment Variables. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only and do not expose it to the browser.

For photo uploads, the project already expects a private files bucket named `dog-photos`. The schema stores the image path in `dogs.photo_path`. Image transformation support is a paid-tier feature in this project, so keep the bucket private and upload original files for local testing.

## App routes

- `/` landing page
- `/login` user login
- `/register` user registration
- `/dashboard` operational panel

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
