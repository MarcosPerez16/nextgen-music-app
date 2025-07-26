# NextGen Music App

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