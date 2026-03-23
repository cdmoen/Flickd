# Flickd

Flickd is a social movie discovery web app built with React, Firebase, and the TMDB API.Users can search for films, view detailed movie information, manage a personal watchlist, and connect with friends to share recommendations.The app includes a secure TMDB proxy, real‑time social features, and a clean, responsive UI with theme switching.

---

# FEATURES

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

---

# UI / UX

Responsive layout

Theme switching (light/dark)

CSS Modules for scoped styling

Smooth animations for cards, modals, and transitions

React Portals for modals

---

# TECH STACK

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

---

# APIs

/api/tmdb — secure proxy to TMDB

Prevents exposing API keys

Accepts a path query parameter

Example:
/api/tmdb?path=/movie/550

---

# PROJECT SETUP

1. Clone the repository

`git clone https://github.com/cdmoen/Flickd.git`

2. Navigate to the project directory

`cd Flickd`

3. Install dependencies

`npm install`

4. Enable TMDB Fetches Locally
   1. Navigate to src/modules/fetchers.js
   2. Comment out lines 102-127 (production fetchers)
   3. Uncomment lines 135-171 (fetchers for local development)
   4. Add your own TMDB Auth Token in line 135

5. Run the development server

`npm run dev`

---

# KNOWN LIMITATIONS

## TMDB Rate Limits

Heavy searching may temporarily block requests.

## Groups

Users can create or delete groups, but cannot leave a group they didn’t create.

## Search / Navigation

Going “Back” after viewing a movie page clears the previous search results.
No sorting or filtering options for movie lists or search results.

## Firebase Rules

Realtime Database security rules are not fully secure for real-world deployment.

## UI / UX

No user profile pages yet

---

# FUTURE IMPROVEMENTS

Add sorting/filtering for search and watchlist

Add user profile pages

Improve database security rules

Add ability to leave groups

Add search history or recent searches
