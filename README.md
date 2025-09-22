# Zamoyskiego 2 - Panel Administracyjny

Aplikacja Next.js do zarządzania inwestycją mieszkaniową "Zamoyskiego 2" w Stalowej Woli.

## Wymagane zmienne środowiskowe

Aby aplikacja działała poprawnie, musisz skonfigurować następujące zmienne środowiskowe:

### W Vercel (Environment Variables):
```
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-87b84208ccf34255b805f85fec3df301.r2.dev
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
R2_ACCOUNT_ID=your_r2_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=your_r2_bucket_name
```

### Lokalnie (.env.local):
```bash
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-87b84208ccf34255b805f85fec3df301.r2.dev
MONGODB_URI=mongodb://localhost:27017/zamoyskiego2
JWT_SECRET=your_local_jwt_secret
R2_ACCOUNT_ID=your_r2_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=your_r2_bucket_name
```

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
