# Project Memory — Tibbit

> This file is the single source of truth for all agents working in this
> codebase. Read this before scanning any files. Update this after every
> meaningful change. Do not delete sections — update them in place.

---

## Last updated
<!-- AUTO-UPDATED by memory-agent -->
Date: 2026-07-22
Last change: Layer 3 completed: Updated Landing Page CTAs to /register & /login. Built Marketplace Feed, Create Listing (with S3 image upload), Listing Detail, and Saved Wishlist pages.

---

## Project overview

**What this project does:**
Tibbit is a student-only peer-to-peer marketplace and ecosystem platform. Students can trade goods, offer freelance services, message each other, and complete OTP-verified transactions — all gated by university email verification. Currently in pre-launch waitlist phase.

**Current status:**
Pre-launch — waitlist landing page is live on Vercel. Backend API and data models are built but not yet connected to the frontend beyond the waitlist endpoint.

**Stack:**
- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS 3, Space Grotesk font
- Backend: Django 5.0.1, Django REST Framework 3.14, Python
- Database: PostgreSQL (remote, SSL required)
- Auth: JWT via `djangorestframework-simplejwt` (access 15min, refresh 7d, rotation + blacklist)
- Real-time: Django Channels 4 + Daphne (WebSocket consumers for messaging)
- Hosting: Vercel (monorepo — frontend via `@vercel/next`, backend via `@vercel/python` WSGI)
- Other: Pillow (image handling), django-storages + boto3 (S3-ready), Celery (task queue, not yet configured), Redis (planned for Channels & Celery)

---

## Codebase map

> Agents: read this instead of scanning the file tree. Only open files
> you actually need for the current task.

### Frontend — `/frontend`
```
app/
├── globals.css           # Global styles — MD3 tokens, shake animation, custom cursors
├── layout.tsx            # Root layout — Space Grotesk font, metadata, dark mode
└── page.tsx              # Landing page — composes sections, single modal state

components/
├── effects/              # Visual/canvas effects
│   ├── BackgroundGridHover.tsx  # Interactive grid trail (capped at 50 items)
│   └── CursorTrail.tsx          # Mouse particle trail (skips touch devices)
├── landing/              # Landing page sections
│   ├── AnimatedIdeasDemo.tsx    # Flow visualization (Ideas → Tibbit → Students)
│   ├── CTASection.tsx           # Final call-to-action
│   ├── HeroRibbon.tsx           # Canvas particle ribbon background
│   ├── HeroSection.tsx          # Hero banner + CTA button
│   ├── LaunchpadSection.tsx     # Launchpad & Community section
│   ├── ManifestoSection.tsx     # Manifesto + tenets
│   ├── MarketplaceSection.tsx   # Marketplace showcase
│   └── ServicesSection.tsx      # Student services cards
├── layout/               # Shared layout components
│   ├── DynamicHUD.tsx           # Typewriter status bar
│   ├── Footer.tsx               # Footer with links + bug report
│   └── Navbar.tsx               # Sticky nav with mobile hamburger
├── magicui/              # Third-party design components
│   └── animated-beam.tsx        # MagicUI animated beam
└── modals/               # All modal components
    ├── BaseModal.tsx            # Shared shell (backdrop, scroll lock, Escape key)
    ├── SuccessToast.tsx         # Shared success overlay
    ├── WaitlistModal.tsx        # Waitlist signup
    ├── ContactModal.tsx         # Contact founder
    └── ReportBugModal.tsx       # Bug reporting

hooks/
├── useBodyScrollLock.ts  # Body scroll lock with cleanup
└── useTypewriter.ts      # Typewriter cycling effect

lib/
├── api.ts                # Centralized API client (apiPost, DRF error extraction)
└── utils.ts              # cn() utility (clsx + tailwind-merge)

public/
└── images/               # Landing page images

next.config.js            # Next.js config
tailwind.config.js        # Tailwind config with custom Material Design 3 color tokens
tsconfig.json             # TypeScript config (@ path alias configured)
```

### Backend — `/backend`
```
backend/                  # Django project config
├── settings.py           # Settings — DB, JWT, CORS, Channels, email, etc.
├── urls.py               # Root URL config — mounts all app routers under /api/
├── wsgi.py               # WSGI entry (used by Vercel)
└── asgi.py               # ASGI entry (for Channels/WebSocket)

users/                    # User & auth domain
├── models.py             # CustomUser, University, WaitlistEntry
├── views.py              # Registration, OTP verify, login, profile, waitlist
├── serializers.py        # DRF serializers
├── urls.py               # /api/users/* routes
├── managers.py           # Custom user manager
├── validators.py         # Custom validators
└── admin.py              # Admin config

listings/                 # Marketplace listings domain
├── models.py             # Category, Listings, ListingImage, SavedListing
├── views.py              # CategoryViewSet, ListingViewSet, SavedListingViewSet
├── serializers.py        # DRF serializers
├── urls.py               # /api/listings/* routes (DRF router)
└── admin.py              # Admin config

messaging/                # Real-time messaging domain
├── models.py             # Conversation, Message
├── views.py              # ConversationViewSet, MessageViewSet
├── consumers.py          # WebSocket consumer for real-time chat
├── routing.py            # WebSocket URL routing
├── serializers.py        # DRF serializers
├── urls.py               # /api/messaging/* routes (DRF router)
└── admin.py              # Admin config

transactions/             # Transaction & review domain
├── models.py             # Transaction (OTP-verified), Review
├── views.py              # TransactionViewSet, ReviewViewSet
├── serializers.py        # DRF serializers
├── urls.py               # /api/transactions/* routes (DRF router)
└── admin.py              # Admin config
```

### Other
```
Dev_Notes/                # Developer documentation
├── model_info.md         # Model descriptions and relationships
└── model_methods.md      # Model method documentation

marketing/                # Marketing assets
├── Intro_background.jpg  # Background image
└── Tibbit_Intro.png      # Intro graphic

vercel.json               # Vercel monorepo build config
requirements.txt          # Python dependencies
example.env               # Template for environment variables
TibbitToDo.txt            # Product feature backlog / notes
```

---

## Domain map

> What features exist and where they live. Update this every time a new
> feature is added or an existing one moves.

| Domain | Backend app | Backend views | Frontend route | Status |
|--------|------------|---------------|----------------|--------|
| Auth/Users | `users/` | `views.py` (Registration, Login, OTP, Profile) | `app/login`, `app/register`, `app/verify-otp`, `app/password-reset*` | Backend + Frontend Auth shell done |
| Waitlist | `users/` | `views.py` (WaitlistCreateView) | `app/page.tsx` + `WaitlistModal.tsx` | Done — live |
| Support | `users/` | `views.py` (ContactFounderView, ReportBugView) | `ContactModal.tsx`, `ReportBugModal.tsx` | Done |

| Listings | `listings/` | `views.py` (Category, Listing, SavedListing ViewSets) | — (no frontend yet) | Backend done |
| Messaging | `messaging/` | `views.py` + `consumers.py` (WebSocket) | — (no frontend yet) | Backend done |
| Transactions | `transactions/` | `views.py` (Transaction, Review ViewSets) | — (no frontend yet) | Backend done |

---

## Data models

> Current database schema. Update whenever a migration is added.

### University
```
id            auto        primary key
name          string(200)
email_domain  string(100) unique
location      string(200) nullable
is_active     bool        default True
is_verified   bool        default False
created_at    timestamp   auto
```

### CustomUser (extends AbstractUser)
```
id                auto        primary key
username          string(100) unique, nullable, auto-generated from email
email             email       unique, used as USERNAME_FIELD
university        FK→University  nullable, PROTECT
is_email_verified bool        default False
email_otp         string(6)   nullable
otp_created_at    timestamp   nullable
otp_attempts      int         default 0
phone_number      string(15)  nullable
profile_picture   image       upload to profile_pictures/
bio               text(500)   nullable
graduation_year   int         nullable, 2020-2035
first_name        string      required
last_name         string      required
created_at        timestamp   auto
updated_at        timestamp   auto
```

### WaitlistEntry
```
id              auto        primary key
email           email       unique
university_name string(200)
is_verified     bool        default False
created_at      timestamp   auto
```

### Category
```
id          auto        primary key
name        string(100) unique
description text        nullable
icon        string(50)  nullable
is_active   bool        default True
created_at  timestamp   auto
```

### Listings
```
id          auto        primary key
title       string(200)
description text
price       decimal(10,2) min 0
category    FK→Category   nullable, SET_NULL
condition   enum        new|like_new|good|fair|poor, default good
seller      FK→CustomUser CASCADE
location    string(200)
status      enum        active|sold|expired|deleted, default active
views_count int         default 0
created_at  timestamp   auto
updated_at  timestamp   auto
expires_at  timestamp   nullable
```

### ListingImage
```
id          auto        primary key
listing     FK→Listings CASCADE
image       image       upload to listing_images/
order       int         default 0 (first = thumbnail)
uploaded_at timestamp   auto
```

### SavedListing
```
id        auto        primary key
user      FK→CustomUser CASCADE
listing   FK→Listings   CASCADE
saved_at  timestamp   auto
unique_together: [user, listing]
```

### Conversation
```
id          auto        primary key
buyer       FK→CustomUser CASCADE
seller      FK→CustomUser CASCADE
listing     FK→Listings   CASCADE
created_at  timestamp   auto
updated_at  timestamp   auto
unique_together: [buyer, seller, listing]
```

### Message
```
id            auto        primary key
conversation  FK→Conversation CASCADE
sender        FK→CustomUser   CASCADE
content       text
is_read       bool        default False
timestamp     timestamp   auto
```

### Transaction
```
id                  auto        primary key
seller              FK→CustomUser CASCADE
buyer               FK→CustomUser CASCADE
listing             FK→Listings   nullable, SET_NULL
agreed_price        decimal(10,2)
status              enum        pending|completed|cancelled|disputed, default pending
seller_otp          string(6)   nullable
seller_otp_created_at timestamp nullable
seller_verified     bool        default False
seller_verified_at  timestamp   nullable
buyer_otp           string(6)   nullable
buyer_otp_created_at timestamp  nullable
buyer_verified      bool        default False
buyer_verified_at   timestamp   nullable
notes               text        nullable
created_at          timestamp   auto
completed_at        timestamp   nullable
cancelled_at        timestamp   nullable
```

### Review
```
id          auto        primary key
transaction FK→Transaction CASCADE
reviewer    FK→CustomUser  CASCADE
reviewee    FK→CustomUser  CASCADE
rating      int         1-5
comment     text        nullable
created_at  timestamp   auto
unique_together: [transaction, reviewer]
```

---

## API surface

> All active endpoints. Update whenever a route is added or changed.

### Users (`/api/users/`)
| Method | Path | Auth required | Description |
|--------|------|---------------|-------------|
| GET | `/api/users/universities` | No | List all universities |
| POST | `/api/users/register` | No | Create account (email + university) |
| POST | `/api/users/verify-otp` | No | Verify email with 6-digit OTP |
| POST | `/api/users/resend-otp` | No | Resend OTP to email |
| POST | `/api/users/login` | No | Login, returns JWT access + refresh |
| POST | `/api/users/token/refresh` | No | Refresh JWT access token |
| GET/PUT | `/api/users/profile` | Yes | Get or update user profile |
| POST | `/api/users/waitlist` | No | Join the waitlist |
| POST | `/api/users/contact` | No | Send message to founder (Resend) |
| POST | `/api/users/report-bug` | No | Report a bug (Resend) |


### Listings (`/api/listings/`)
| Method | Path | Auth required | Description |
|--------|------|---------------|-------------|
| GET/POST | `/api/listings/categories/` | Yes | List/create categories |
| GET/POST | `/api/listings/items/` | Yes | List/create listings |
| GET/PUT/DELETE | `/api/listings/items/{id}/` | Yes | Retrieve/update/delete listing |
| GET/POST | `/api/listings/saved/` | Yes | List/create saved listings |
| DELETE | `/api/listings/saved/{id}/` | Yes | Remove saved listing |

### Messaging (`/api/messaging/`)
| Method | Path | Auth required | Description |
|--------|------|---------------|-------------|
| GET/POST | `/api/messaging/conversations/` | Yes | List/create conversations |
| GET | `/api/messaging/conversations/{id}/` | Yes | Retrieve conversation |
| GET/POST | `/api/messaging/messages/` | Yes | List/send messages |
| WebSocket | `ws/chat/{conversation_id}/` | Yes | Real-time chat (Django Channels) |

### Transactions (`/api/transactions/`)
| Method | Path | Auth required | Description |
|--------|------|---------------|-------------|
| GET/POST | `/api/transactions/` | Yes | List/create transactions |
| GET/PUT | `/api/transactions/{id}/` | Yes | Retrieve/update transaction |
| GET/POST | `/api/transactions/reviews/` | Yes | List/create reviews |

---

## Environment variables

> What env vars exist and what they're for. Never put values here — just names.

### Backend (`.env`)
```
DATABASE-URL          PostgreSQL connection string (full URL)
DB_Host               Database host
DB_Pass               Database password
DB_Port               Database port
DB_Name               Database name
DB_User               Database username
SECRET_KEY            Django secret key
DEBUG                 Debug mode toggle ("True"/"False")
EMAIL_BACKEND         Email backend class
EMAIL_HOST            SMTP host
EMAIL_PORT            SMTP port
EMAIL_USE_TLS         TLS toggle
EMAIL_HOST_USER       SMTP username
EMAIL_HOST_PASSWORD   SMTP password
DEFAULT_FROM_EMAIL    From email address
RESEND_FOUNDER_API_KEY API key for Resend email service
FOUNDER_EMAIL         Destination email for contact/bug reports

```

---

## Key decisions & patterns

> Architectural decisions that affect how agents should write new code.
> Update this when a significant decision is made.

- **Auth pattern**: Secure `HttpOnly` cookies for JWTs (`access_token` and `refresh_token`). Handled by `CookieJWTAuthentication` on backend and Axios interceptors on frontend for silent token refreshes via `CookieTokenRefreshView`.
- **Email verification**: 6-digit OTP sent to student email, valid for 10 minutes, max 5 attempts before requiring re-request.
- **Transaction verification**: Dual-OTP system — both buyer and seller get separate OTPs (24h expiry). Transaction completes only when both verify.
- **User model**: Custom `AbstractUser` subclass with email as primary identifier. Username auto-generated from email prefix.
- **University gating**: Users linked to University model via email domain matching. University must be active and verified.
- **API style**: Django REST Framework ViewSets with DRF DefaultRouter. JWT auth required by default, overridden per-view as needed.
- **Real-time messaging**: Django Channels with WebSocket consumers. Currently using `InMemoryChannelLayer` (must switch to Redis for production).
- **File storage**: Dual Supabase S3 bucket configuration via `django-storages`. `MediaStorage` (`tibbit-media`) for general media/listings and `AvatarStorage` (`user-avatars`) for profile pictures.
- **Frontend approach**: Single landing page with waitlist modal. Space Grotesk font. Neobrutalist design with Material Design 3 color tokens via Tailwind.
- **Frontend architecture**: Global `AuthContext` wrapper. Auth uses dedicated pages (no modals) like `/login` and `/register`. Protected routes wrapped in `app/marketplace/layout.tsx` which enforces authentication. Centralized Axios client in `lib/api.ts` with 401 refresh interceptors. All modals extend `BaseModal` for DRY scroll lock, Escape key, and backdrop.
- **Path aliases**: TypeScript `@/*` alias maps to project root. All imports use `@/components/*`, `@/lib/*`, `@/hooks/*`.
- **Deployment**: Vercel monorepo — frontend via `@vercel/next`, backend via `@vercel/python` (WSGI). Known limitation: WebSockets won't work on Vercel serverless.
- **CORS**: Currently `CORS_ALLOW_ALL_ORIGINS = True` for waitlist phase. Must be restricted for production.
- **ALLOWED_HOSTS**: Currently `['*']` — must be restricted for production.
- **Email integration**: Using `django-anymail[resend]` for transactional emails. Contact and bug reports are routed to the founder's email.


---

## Active work

> What's currently being built or changed. Agents should be aware of
> work-in-progress to avoid conflicts or duplicate effort.

- [ ] Platform expansion design — marketplace, startup launchpad, community platform (architecture planned)
- [ ] Production deployment preparation — security audit, DNS config, infrastructure decisions
- [x] Frontend refactor — extracted sections, DRY modals, centralized API, reorganized file structure
- [x] Waitlist UX polish — "already on waitlist" message styling, ecosystem card interactions
- [x] Footer updates — build demo privacy/terms pages, remove Discord link, contact/bug report popups
- [x] StudentServices UI overhaul — glassmorphism, tinted overlays, and hover effects



---

## Known issues & tech debt

> Things that are intentionally imperfect right now. Agents should not
> "fix" these without being asked.

- WebSockets cannot work on Vercel serverless — need separate hosting for Channels/Daphne
- `InMemoryChannelLayer` is dev-only — must switch to `channels-redis` for production
- `CORS_ALLOW_ALL_ORIGINS = True` — acceptable for waitlist, must restrict before full launch
- `ALLOWED_HOSTS = ['*']` — same as above
- `SECRET_KEY` has a hardcoded fallback in settings.py — must be removed for production
- No Celery broker configured — Redis integration pending
- File uploads using local media — S3 migration pending
- No frontend pages exist beyond the waitlist landing page
- No tests written for any backend app
- `profile_picture` upload_to path includes `backend/media/` prefix — potentially incorrect nesting

---

## Off-limits

> Files or patterns agents must not modify without explicit instruction.

- `backend/*/migrations/` — never edit migration files, only create new ones
- `.env` files — never read, write, or log these
- `venv/` — virtual environment, never modify
- `node_modules/` — never modify
