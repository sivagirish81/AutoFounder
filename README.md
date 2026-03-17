# AutoFounder
Autonomous AI Agents That Turn Ideas Into Deployed Products

AutoFounder is a hackathon-ready multi-agent system that takes a startup idea, plans a product website with NVIDIA Nemotron, generates the site using Vercel v0, and iterates until the Stop Agent ships a polished version.

## Highlights
- Autonomous agent loop with strategist, UX, prompt engineer, critic, optimizer, and stop decision.
- Live dashboard showing reasoning, iteration history, and deployment URLs.
- Vercel-native workflow with deploy visibility baked into every cycle.

## Tech Stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- NVIDIA Nemotron for reasoning and critique
- Vercel v0 for site generation
- Vercel deployments

## Quick Start
1. Install dependencies: `npm install`
2. Create env file: `cp .env.example .env.local`
3. Run the dev server: `npm run dev`
4. Open `http://localhost:3000`

## Demo Flow
1. Enter a startup idea.
2. Run an iteration to see the autonomous plan, generation, deploy, and critique loop.
3. Repeat until the Stop Agent ships.

## Environment Variables
See `.env.example` for placeholders. You must wire real keys to enable live Nemotron, v0, and Vercel calls.

Required for live calls:
- `NEMOTRON_API_KEY` (NVIDIA API key)
- `V0_API_KEY` (v0 Model API key)

Recommended for deployments:
- `VERCEL_GENERATED_DEPLOY_HOOK_URL` (deploy hook tied to the generated-site Vercel project)
- `VERCEL_GENERATED_CANONICAL_URL` (the stable live URL shown in the dashboard)

## Two-Project Setup (Option B)
AutoFounder now writes v0 output into `generated-app/` and triggers a deploy hook for that folder.

Steps:
1. Create a second Vercel project for the generated site.
2. Set the project root to `generated-app/` in Vercel.
3. Create a Deploy Hook for that project and set it as `VERCEL_GENERATED_DEPLOY_HOOK_URL`.
4. Set `VERCEL_GENERATED_CANONICAL_URL` to the production URL for the generated site.

## Architecture
- `app/`: Next.js UI and API routes
- `components/`: dashboard UI components
- `lib/agents/`: agent responsibilities and orchestration helpers
- `lib/models/`: Nemotron reasoning wrappers
- `lib/orchestrator/`: state machine and iteration runner
- `lib/v0/`: v0 prompt and generation client
- `lib/deploy/`: Vercel deployment client
- `lib/scoring/`: scoring weights
- `types/`: shared types

## TODOs For Real Integrations
- Replace `lib/models/nemotron.ts` with actual Nemotron API calls.
- Replace `lib/v0/client.ts` with a real v0 generation request.
- Replace `lib/deploy/vercel.ts` with actual Vercel deployment logic.

## License
MIT
