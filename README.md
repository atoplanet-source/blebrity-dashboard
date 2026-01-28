# Blebrity Analytics Dashboard

A custom Next.js analytics dashboard for Blebrity, with password protection and real-time data updates.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Database:** Supabase
- **Hosting:** Netlify

## Features

- Total players, DAU, sessions, games, and points metrics
- Daily Active Users bar chart
- Retention cohort table (Day 0-7)
- Points leaderboard with sorting
- Games by type (pie chart) and over time (stacked bar)
- Homeschooled analysis (question accuracy, answer breakdown)
- Who's That analysis (win rate by clues, hardest celebrities)
- Engagement metrics (leaderboard opens, stats flips, shares)
- Recent events log
- Auto-refresh every 30 seconds
- Password protection

## Setup

1. Clone the repository
2. Copy `.env.local.example` to `.env.local` and fill in the values:

```bash
cp .env.local.example .env.local
```

3. Install dependencies:

```bash
npm install
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |
| `DASHBOARD_PASSWORD` | Password for dashboard access |

## Deployment to Netlify

1. Push to GitHub
2. Connect repository to Netlify
3. Set environment variables in Netlify dashboard
4. Deploy

The `netlify.toml` file is already configured for Next.js deployment.

## Development

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run start  # Start production server
npm run lint   # Run ESLint
```
