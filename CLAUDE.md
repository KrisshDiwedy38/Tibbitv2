# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Start here: AGENTS.md

**`AGENTS.md` (repo root) is the canonical, actively-maintained project memory for this codebase** — codebase map, domain map, full data model schema, API surface, environment variable names, architectural decisions, active work, known tech debt, and off-limits files. Read it before scanning source files, and update it after any meaningful change (per its own header instructions). This CLAUDE.md is a thinner supplement covering commands and orientation that AGENTS.md doesn't include.

## Commands

### Frontend (`/frontend`)
```
npm run dev      # Next.js dev server
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # next lint
```

### Backend (`/backend`)
Standard Django management commands, run from `/backend`:
```
python manage.py runserver
python manage.py makemigrations
python manage.py migrate
python manage.py test                 # all tests
python manage.py test users           # single app
python manage.py test users.tests.SomeTestCase.test_method   # single test
python manage.py createsuperuser
python manage.py shell
```
`requirements-dev.txt` adds `pytest-django`, `coverage`, `faker`, and `django-debug-toolbar`, but no `pytest.ini`/`pyproject.toml` pytest config exists yet — use Django's built-in test runner (`manage.py test`) unless a pytest config is added.

There is no lint/format tooling configured for the backend (no flake8/black/ruff config found).

## Architecture

This is a Vercel monorepo with two independently-run apps unified only at deploy time by `vercel.json` (frontend via `@vercel/next`, backend via `@vercel/python` WSGI; `/api/*` routes to Django, everything else to Next.js). Locally, run the frontend (`frontend/`, port 3000 by default) and backend (`backend/`, Django dev server) as separate processes — there is no single top-level dev command.

**Backend** (`backend/`) is a Django 5 + DRF project split into domain apps under `backend/backend/settings.py`'s `INSTALLED_APPS`: `users`, `listings`, `messaging`, `transactions`, plus two apps present in `INSTALLED_APPS` but **not yet wired into `backend/backend/urls.py`**: `launchpad` and `community` — these currently only have `models.py`/`admin.py`/empty `views.py`/`tests.py`, no `urls.py` or `serializers.py`, and represent planned-but-unbuilt platform expansion (see "Active work" in AGENTS.md). Each wired app follows the same shape: `models.py`, `serializers.py`, `views.py` (DRF ViewSets + DefaultRouter), `urls.py`, `admin.py`. Real-time chat is handled outside the request/response cycle via `messaging/consumers.py` (Django Channels WebSocket consumer) and `messaging/routing.py`, using `InMemoryChannelLayer` in dev (must move to Redis for prod — WebSockets also won't work on Vercel's serverless backend, a known deployment limitation).

**Auth** is cookie-based JWT: `CookieJWTAuthentication` reads `access_token`/`refresh_token` HttpOnly cookies on the backend; the frontend's Axios client (`frontend/lib/api.ts`) has interceptors that silently refresh on 401 via `CookieTokenRefreshView`. Registration requires a university email match against the `University` model, followed by a 6-digit OTP emailed to the student (logged to console instead of sent when `DEBUG=True`). Transaction completion uses a *separate* dual-OTP flow (`transactions/models.py`) where buyer and seller each verify independently before a `Transaction` is marked complete.

**Frontend** (`frontend/`) is Next.js App Router + TypeScript + Tailwind. `app/marketplace/layout.tsx` gates everything under `/marketplace` behind the global `contexts/AuthContext.tsx`; standalone auth pages (`app/login`, `app/register`, `app/verify-otp`, `app/password-reset*`) live outside that gate. All modals extend `components/modals/BaseModal.tsx` for shared scroll-lock/Escape/backdrop behavior. All API calls should go through the centralized client in `lib/api.ts` rather than calling `axios`/`fetch` directly, so the 401-refresh interceptor and DRF error extraction stay consistent. TypeScript path alias `@/*` maps to the frontend project root.

For the full data model schema, complete API endpoint table, environment variable names, and the list of accepted tech debt / off-limits files (migrations, `.env`, `venv/`, `node_modules/`), see **AGENTS.md** — do not duplicate that detail here as it changes often; update AGENTS.md instead.
