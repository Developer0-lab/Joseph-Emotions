# Joseph Emotions

Cinematic + Luxury + Editorial official artist website.

## Stack
- React 18
- Vite
- Appwrite Authentication and Storage
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

## Appwrite setup
Set these environment variables in the Appwrite Site deployment:

- `VITE_APPWRITE_ENDPOINT` — your Appwrite API endpoint
- `VITE_APPWRITE_PROJECT_ID` — project ID
- `VITE_APPWRITE_BUCKET_ID` — Storage bucket for website content and uploaded media
- `VITE_APPWRITE_ADMIN_TEAM_ID` — Appwrite Team ID for authorized studio administrators

Create an Appwrite Storage bucket. Enable file-level security. Allow authenticated users to create files; the studio assigns public read access to published media and the content document. Create an Appwrite Team for the website administrators and add the administrator account as a confirmed member. Only members of that team can enter `/studio`.

Never put an Appwrite API key or server secret in frontend environment variables.

## Artist Studio
Open `/studio` on the deployed website. Sign in using the Appwrite administrator account.

The studio supports:
- A separate homepage hero photograph
- A separate artist portrait and biography
- Music releases, artwork and listening links
- Video thumbnails, uploaded video files and video links
- Independent gallery photographs
- Photo updates with their own images and captions
- Social destinations

Media is browsed from the device and uploaded to Appwrite Storage. Website content is saved as a JSON file in the same bucket. After editing, select **Save Changes** to publish the saved content.

## Public website
The homepage hero, artist portrait, music releases, gallery, videos, updates, biography and Connect links read the saved studio content. Placeholder content remains visible until real artist content is added.
