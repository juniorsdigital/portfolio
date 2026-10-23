# John Swanson — portfolio

Freelance graphic design, video editing, and marketing. Live at https://www.johnswanson.co.

## Develop

```bash
npm install
npm run dev
```

## Where to edit things

| What | File |
|---|---|
| Site URL, email, location, reply-time promise | `lib/site.ts` |
| Cover art copy, alt text, homepage order | `lib/hero-covers.ts` |
| `/covers` price, revisions, turnaround, payment, rights, FAQ | `lib/covers.ts` |
| Work projects and metrics | `lib/projects.ts` |
| Contact form options and budget tiers | `lib/offerings.ts` |

Values in `[BRACKETS]` are placeholders. `npm run check:content` lists them, and fails if a cover's
"how it was made" note is empty or placeholder copy. It also runs automatically before every build.

Share images in `public/og/` are generated from the cover art with `npm run og`.

## Contact form

Delivery uses Resend. Set `RESEND_API_KEY` in the environment. Mail is sent to the address in `lib/site.ts`.
The sender defaults to the verified `hello@juniors.digital` address; set `CONTACT_FROM_EMAIL`
(e.g. `John Swanson <hello@johnswanson.co>`) once `johnswanson.co` is verified in Resend.

Successful submissions fire a `Contact submitted` Vercel Analytics event tagged with the selected service.
