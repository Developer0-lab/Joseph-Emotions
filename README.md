# Joseph Emotions

Cinematic + Luxury + Editorial official artist website.

## Stack
- React 18
- Vite
- Appwrite JavaScript SDK
- Lucide icons

## Local development
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
```

## Appwrite environment
Copy `.env.example` to `.env.local` and configure:
- `VITE_APPWRITE_ENDPOINT`
- `VITE_APPWRITE_PROJECT_ID`
- `VITE_APPWRITE_DATABASE_ID`
- `VITE_APPWRITE_BUCKET_ID`

Never put an Appwrite API key or server secret in frontend environment variables.

## Current implementation
The initial public-facing design foundation includes the homepage, Music, Videos, Gallery, Updates, About and Connect views, responsive navigation, scroll reveal animations and a starter Appwrite client configuration.

The artist's real photographs, releases, videos, biography and social destinations must replace the clearly temporary demonstration content. The private artist studio and persistent Appwrite content workflows are the next implementation phase.
