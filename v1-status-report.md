# Tibbit — v1 Status Report

*Student-led campus marketplace. Vercel monorepo: Next.js frontend + Django/DRF backend, Supabase Postgres + S3.*

## What's live

**Accounts & auth**
- University-email-gated registration with 6-digit OTP verification (console-logged in DEBUG, sent via Resend in production from a verified custom domain).
- Cookie-based JWT auth (httpOnly `access_token`/`refresh_token`), silent refresh on 401.
- Password reset via the same OTP mechanism.
- Public + private profile pages, avatar upload, reputation score from received reviews.

**Marketplace listings**
- Create/edit/delete for two listing types: **products** (fixed price, condition, category) and **services** (always hourly-rate, no category — tutoring, design, coding, etc.).
- Quantity/stock tracking: a listing only flips to sold/booked-out once its quantity reaches zero, not after a single sale — supports "3 left" style stock, not just single-item listings.
- Photo uploads (up to 5 per listing, 5MB each, enforced server-side), save/wishlist, view counts, campus location, slug-based URLs.
- Feed with search, category filters, and a dedicated "Services & Tutoring" filter (services never carry a category, so this is a separate `listing_type` filter, not a category pill).
- Listing detail page: two-column layout from tablet width up, not just desktop.

**Messaging**
- Per-listing conversations between buyer and seller (also supports launchpad/community context, though those apps aren't wired into the live site yet).
- Real-time-feeling chat via HTTP polling (WebSockets don't work on Vercel's serverless backend — documented limitation, polling is the deliberate choice, not a stopgap).
- Delete-conversation support, blocked with a warning while a trade has an unverified exchange code outstanding.

**Safe on-campus trades**
- Dual-OTP physical exchange flow: buyer and seller each get a 6-digit code, shown to the other party in person to confirm the handoff — protects against no-shows/fraud without an escrow system.
- Guards against starting a trade on a sold-out listing or opening a second concurrent trade between the same two people on the same listing.
- Cancel-before-verification flow.
- Post-completion star ratings feed the public reputation score shown on profiles.

## What changed this session

Roughly chronological, in case any of this needs to be referenced later:

1. **Email delivery** — switched OTP/contact/bug-report emails off Resend's shared sandbox sender onto the verified `tibbit.kdiwedy.com` domain (SPF/DKIM/DMARC/MX all verified on Namecheap).
2. **Messaging bugs** — "Message Seller" was landing on the wrong (stale) conversation instead of the one for the listing just clicked, due to a one-shot init guard that didn't re-run on subsequent navigations to the same route. Added a loading spinner to the button. Fixed a "double loading spinner" on every page load caused by gating all page content behind the auth check instead of letting them load in parallel.
3. **Conversation deletion** — added the ability to delete a conversation, blocked with a clear warning if an active trade's exchange code hasn't been verified yet.
4. **The big one — "Initiate Trade" did nothing.** Root cause: Vercel's edge strips a request's trailing slash before it reaches Django. Every other endpoint under `/api/transactions/...` has something after the app prefix so this was invisible, but the bare create endpoint (`POST /api/transactions/`) has nothing after it — stripped, it stopped matching Django's route, which redirected back to the slash form, which Vercel stripped again, forever (`net::ERR_TOO_MANY_REDIRECTS`). Fixed by matching all four app URL prefixes with an optional trailing slash so this class of bug can't recur. Along the way: added visible error banners everywhere a trade/message action previously failed silently, cut redundant round-trips (4 → 2 network calls per trade action), and added `CONN_MAX_AGE` so a warm serverless instance reuses its DB connection instead of re-handshaking Supabase on every request.
5. **Listing features** — service pricing enforced as hourly at the model layer (not just trusted from the frontend form), quantity/stock field added end-to-end, "Services & Tutoring" removed as a product category (services never had one) and reinstated as its own feed filter, tablet layout, price removed from the trade-initiation chat message.
6. **Full-codebase security review** (max effort, verified by direct reading, not just a diff) surfaced and fixed 7 issues:
   - **WebSocket chat had no authentication at all**, and trusted a client-supplied sender id for every message — anyone could read or post into any conversation as anyone. Now authenticates the same way the REST API does (validates the JWT cookie) and requires the connecting user to be a participant.
   - **A routing bug silently broke the waitlist, contact-founder, and bug-report forms** in production — a catch-all "username" route was registered before them and swallowed all three.
   - **The on-campus trade OTP had no brute-force protection**, unlike the email OTP flow — added the same 5-attempt lockout.
   - OTP comparisons switched to constant-time (`secrets.compare_digest`).
   - Image uploads capped at 5 files / 5MB each server-side (previously unenforced beyond the frontend's own UI limit).
   - Category list no longer lazily seeds itself on every request — moved to a migration.
   - Deduplicated 8 copies of the same avatar-URL fallback logic into one model property.
   - Confirmed rate limiting is already applied uniformly (10/min anonymous, 100/min authenticated) across every endpoint with no gaps.

## Known limitations (by design or accepted debt)

- **WebSockets don't work on Vercel's serverless backend** — chat uses polling instead. Would need a persistent-connection host (or Redis + a separate WS service) to change this.
- **`launchpad` and `community` Django apps exist but aren't wired into `urls.py`** — models/admin only, no live endpoints. Planned future expansion, not a bug.
- **No separate local development database** — local `.env` points at the same Supabase project the deployed app uses. There is no throwaway local Postgres; `manage.py test` uses an isolated `test_<name>` database automatically, but `manage.py shell`/`runserver` touch real data.
- **One pre-existing failing test** (`UserReputationTestCase.test_reputation_calculation`, unrelated to this session's work) — a user's reputation score returns `None` instead of `0.0` before they have any reviews. Not fixed yet; flagged here so it doesn't get mistaken for a new regression.
- Editing a listing's photos currently replaces the *entire* photo set if any new photo is added, rather than appending — noticed in passing, not yet fixed.

## Everything is on `main`

All of the above is merged and deployed; the two new database migrations from this session's security fixes (OTP attempt-lockout fields, category seed data) have already been applied to the shared database.
