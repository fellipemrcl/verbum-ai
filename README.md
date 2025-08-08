This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Book Recommendation Website Setup

This project uses:

- Next.js (App Router, TypeScript)
- NextAuth.js (Authentication)
- Prisma ORM
- PostgreSQL (configure in .env)
- OpenAI API
- Open Library API
- Tailwind CSS
- Shadcn UI
- Lucide Icons
- Docker (optional for containerization)

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Project Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure your database in `.env` (see `prisma/schema.prisma` for models).
3. Run database migrations:

   ```bash
   npx prisma migrate dev --name init
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

## Useful Commands

- `npx prisma studio` – Visual database browser
- `npx prisma generate` – Regenerate Prisma client

## Customization

- Add your OpenAI API key to `.env` as `OPENAI_API_KEY`.
- Configure NextAuth providers in `src/app/api/auth/[...nextauth].ts`.

---

For more details, see the documentation for each library.
