# portas.vercel.app

A minimalist, high-performance basketball score tracker built for speed and aesthetics. Designed with a "Cyber-Noir" visual identity inspired by tactical data terminals.

## Core Features

- **Live Telemetry:** Real-time scores and game status for Euroleague, LKL, NBA, and more.
- **Tactical UI:** Custom "Ticket-Stub" card design with procedural barcodes and dynamic tension gauges.
- **Smart Filtering:** Intersection-based logic to drill down by League AND Time (e.g., "Euroleague" + "Today").
- **Clutch Mode:** Visual indicators (Heartbeat animations) triggered automatically during close games in the 4th quarter.
- **Local-First:** Favorites, view modes, and league preferences are persisted instantly to local storage.

## Tech Stack

- **Engine:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS (Custom utility architecture)
- **Animation:** Framer Motion (Layout transitions, entrance effects)
- **Icons:** Lucide React

## Architecture

- **No UI Libraries:** Every component (Modals, Toggles, Cards) is custom-built for precise control over the "Noir" aesthetic.
- **Performance:** Aggressive memoization and deep-comparison state updates to prevent unnecessary re-renders during data polling.

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

