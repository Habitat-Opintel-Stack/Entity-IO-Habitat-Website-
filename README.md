# KIT / Entity io

Marketing site for Kinetic Information Technology.

```bash
npm install
npm run dev
```

Waitlist posts to Resend when `RESEND_API_KEY` is set (see `.env.example`). Otherwise submissions are stored in `data/waitlist.json` during local development.

## Habitat product film

The Explore Habitat buttons open the product film overlay. Until the film is available, it displays a coming-soon message. To enable playback, set `NEXT_PUBLIC_HABITAT_FILM_URL` to the MP4 URL and `NEXT_PUBLIC_HABITAT_CAPTIONS_URL` to an English WebVTT captions URL, then restart or rebuild the site.
