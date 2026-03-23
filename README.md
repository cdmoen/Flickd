# Flickd

Flickd is a social movie discovery web app built with React, Firebase, and the TMDB API.Users can search for films, view detailed movie information, manage a personal watchlist, and connect with friends to share recommendations.The app includes a secure TMDB proxy, real‑time social features, and a clean, responsive UI with theme switching.

# Features

## Authentication

Firebase Authentication (email/password)

Persistent login state

## Movie Search

Search TMDB’s movie database via a secure Vercel serverless proxy

Results include poster, release date, genres, and quick‑add actions

Smooth animations for search results

## Movie Detail Pages

Each movie page includes:

YouTube trailer embed

Description / overview

Director

Top three starring cast members

Runtime

Release date

## Watchlist

Add/remove movies from your personal watchlist

Stored in Firebase Realtime Database

Synced across devices

## Friends System

Search for users by username

Send, accept, reject, and cancel friend requests

View incoming and outgoing requests

View your friend list

Real‑time updates via Firebase listeners

## Groups (Shared Film Lists)

Users can create or delete groups

Add films to a group’s shared list

Group film entries include:

Ratings per user

Seen status per user

Comments with timestamps

Bottom‑sheet modals for comments, ratings, and seen status

# UI / UX

Responsive layout

Theme switching (light/dark)

CSS Modules for scoped styling

Smooth animations for cards, modals, and transitions

React Portals for modals

# Tech Stack

## Frontend

React (Vite)

CSS Modules

React Portals

Custom hooks (useWatchlist, useGroups, useAuth, etc.)

## Backend / Services

Firebase Authentication

Firebase Realtime Database

Vercel Serverless Functions

TMDB API (proxied through Vercel)

# APIs

/api/tmdb — secure proxy to TMDB

Prevents exposing API keys

Accepts a path query parameter

Example:

/api/tmdb?path=/movie/550

# Project Setup

1. Clone the repository

git clone https://github.com/yourusername/flickd.git
cd flickd

2. Install dependencies

npm install

3. Environment variables

Create a .env file with:

VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_DATABASE_URL=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

No TMDB key is needed on the client — it is handled by the Vercel backend.

4. Run the development server

npm run dev

5. Deployment

Frontend can be deployed to Vercel or Netlify

Serverless TMDB proxy runs automatically on Vercel under /api/tmdb

📡 API Documentation

GET /api/tmdb

A serverless proxy to TMDB’s API.

Query Parameters

Name

Description

path

The TMDB API path (e.g., /movie/550)

Example

/api/tmdb?path=/search/movie&query=blade+runner

Notes

Automatically attaches the TMDB Bearer token server‑side

Prevents exposing API keys in the client bundle

Subject to TMDB rate limits

Folder Structure (with explanations)

src/
├── components/ # Reusable UI components shared across pages
│ ├── AddFilmSheet/ # Bottom-sheet UI for adding films to groups
│ ├── Layout/ # Global layout wrapper (header, spacing, theming)
│ └── NavBar/ # Top navigation bar (links, theme toggle, auth)
│
├── contexts/ # React Context providers (AuthContext, ThemeContext)
│
├── database node references/ # Reference-only folder documenting Firebase paths
│ ├── friends/ # Structure of friend-related database nodes
│ └── users/ # Structure of user-related database nodes
│
├── hooks/ # Custom hooks for modular logic (watchlist, groups, auth)
│
├── modules/ # Business logic separated by domain
│ ├── friends/ # sendFriendRequest, acceptFriendRequest, etc.
│ ├── groups/ # group creation, film management, comments, ratings
│ └── users/ # username lookups, user helpers
│
├── pages/ # Route-level pages (each page = one screen)
│ ├── AboutPage/ # Static about page
│ ├── FriendsPage/ # Friend list + incoming/outgoing requests
│ ├── GroupPage/ # Individual group with shared film list
│ ├── GroupsPage/ # List of groups the user belongs to
│ ├── HomePage/ # Landing page
│ ├── LoginPage/ # Authentication
│ ├── MoviePage/ # Movie detail page (trailer, cast, director)
│ ├── MovieSearchPage/ # Search UI for movies
│ ├── RegisterPage/ # Account creation
│ └── UserAccountPage/ # User settings (theme, logout)
│
└── routes/ # Route guards and wrappers
├── AuthRedirect/ # Redirects logged-in users away from login/register
└── ProtectedRoute/ # Blocks access to pages unless authenticated

Architecture Diagram

                   ┌──────────────────────────────┐
                   │            Pages              │
                   │  (UI Screens / Route Views)   │
                   └───────────────┬──────────────┘
                                   │
                                   ▼
                   ┌──────────────────────────────┐
                   │            Hooks              │
                   │  (useWatchlist, useGroups,   │
                   │   useAuth, useUsernames...)  │
                   └───────────────┬──────────────┘
                                   │
                                   ▼
                   ┌──────────────────────────────┐
                   │           Modules             │
                   │  (friends/, groups/, users/)  │
                   │  Pure functions for business  │
                   │  logic: addFilm, sendRequest, │
                   │  getUsername, etc.            │
                   └───────────────┬──────────────┘
                                   │
                                   ▼
                   ┌──────────────────────────────┐
                   │      Firebase Realtime DB     │
                   │  (data storage + listeners)   │
                   └──────────────────────────────┘

Known Limitations / Bugs

🔸 TMDB Rate Limits

Heavy searching may temporarily block requests.

🔸 Groups

Users can create or delete groups, but cannot leave a group they didn’t create.

🔸 Search / Navigation

Going “Back” after viewing a movie page clears the previous search results.

No sorting or filtering options for movie lists or search results.

🔸 Firebase Rules

Realtime Database security rules are not fully locked down yet.

🔸 UI / UX

Some modals and animations need refinement

No user profile pages yet

Future Improvements

Add sorting/filtering for search and watchlist

Add pagination or infinite scroll

Add user profile pages

Improve database security rules

Add ability to leave groups

Add caching for TMDB responses

Add search history or recent searches

Improve mobile layout and animations
