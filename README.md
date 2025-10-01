# NextGen Music

A full-stack music streaming app built with Next.js and the Spotify API. Create custom playlists, search tracks, and control playback with queue management.

**Demo Video:** https://youtu.be/RCgPrXIThOk  
**Live App:** nextgen-music-app-vynk.vercel.app

## Tech Stack

- Next.js 14, TypeScript, Tailwind CSS
- Prisma + PostgreSQL
- NextAuth.js with Spotify OAuth
- Spotify Web API & Web Playback SDK

## Features

- Custom playlist creation and management
- Track search and playback controls
- Like/save favorite tracks
- Queue management with playback context
- Responsive card-based UI

## Demo Access

**Note:** Full playback requires Spotify Premium. For demo access, email me at [your-email] and I'll add you as a test user.

**Browser Requirements:** Desktop Chrome, Firefox, Safari, or Edge (mobile browsers don't support Spotify Web Playback SDK).

## Screenshots



## Environment Setup

1. Copy `.env.example` to `.env`
2. Fill in your own values for each variable
3. See comments in `.env.example` for detailed instructions

## Getting Started
```bash
npm install
npm run dev# NextGen Music App

Brief description of what your app does

## Tech Stack
- Next.js
- Prisma + PostgreSQL  
- Spotify API
- etc.

## Environment Setup
1. Copy `.env.example` to `.env`
2. Fill in your own values for each variable
3. Contact [your-name] for the shared database URL
4. See comments in `.env.example` for detailed instructions

## Getting Started
npm install
npm run dev


## Git Workflow

This project uses a feature branch workflow to maintain code quality and enable collaboration.

### Branch Strategy
- **`main`** - Production-ready code only. Protected branch requiring pull requests.
- **`feature/description-name`** - New features and bug fixes. Branch off from main.

### Development Process
1. Create a new feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes and commit regularly
3. Push your feature branch: `git push origin feature/your-feature-name`
4. Create a Pull Request from your feature branch to `main`
5. Request review and address any feedback
6. Merge PR after approval
7. Delete feature branch after merge

### Branch Naming Convention
- Features: `feature/auth-setup`, `feature/playlist-creation`
- Bug fixes: `fix/login-redirect-issue`
- Documentation: `docs/api-documentation`

### Rules
- No direct pushes to `main` branch
- All changes must go through Pull Request review
- Feature branches should be deleted after successful merge
