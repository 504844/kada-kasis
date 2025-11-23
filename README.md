# Kada Krepsinis?

A minimalist, high-performance basketball score tracker built for speed and aesthetics. The design follows a "Cyber-Noir" visual identity inspired by tactical data terminals, prioritizing data density and clarity.

## Project Overview

This application provides real-time scores and game status for major basketball leagues including Euroleague, LKL, and the NBA. It is built to be "local-first," meaning user preferences like favorite teams and active filters are saved instantly to the browser without requiring a login.

## Core Features

- **Live Telemetry:** Real-time scores and game status updates.
- **Tactical UI:** Custom card design with procedural barcodes and dynamic tension gauges.
- **Smart Filtering:** Intersection-based logic allows users to drill down by League and Time simultaneously (e.g., "Euroleague" games happening "Today").
- **Clutch Mode:** Visual indicators (heartbeat animations and color shifts) trigger automatically during close games in the 4th quarter to draw attention to high-stakes moments.
- **Performance:** Aggressive memoization and deep-comparison state updates prevent unnecessary re-renders during data polling.

## Project Structure

The codebase is organized into logical domains to maintain clean separation of concerns.

### Components
The UI is split into three main categories:

- **features/**: Contains high-level functional blocks.
  - `favorites/`: Logic for the scrolling favorites bar.
  - `filters/`: The control bar for sorting games by league or status.
  - `game-list/`: Handles the rendering of game sections (Live, Today, Upcoming) and the toggle between Grid and Table views.
  - `settings/`: The modal for toggling visibility of specific leagues.
  
- **game-card/**: The core atomic unit of the application.
  - Broken down into sub-components (`Header`, `TeamRow`, `Footer`, `Effects`) to keep the main card logic lightweight.
  
- **layout/**: Global application shell components (Header, Footer).

### Hooks
Business logic is extracted from the UI to ensure components remain purely presentational.

- `useBasketballData`: Handles API polling, proxy fallbacks, and data transformation.
- `useAppPersistence`: Manages local storage for view modes, favorites, and settings.
- `useGameFiltering`: Contains the logic for sorting, grouping, and filtering raw game data based on user input.

## Tech Stack

- **Engine:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Icons:** Lucide React

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---
Solution by Martin Ciurlionis