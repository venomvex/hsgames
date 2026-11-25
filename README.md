# HSGames — Social Gaming Solutions Marketplace

HSGames is a commercial digital marketplace engineered to sell original, un-obfuscated native Android multiplayer game source codes (developed in Kotlin with Jetpack Compose) for social voice-chat applications and live audio streaming platforms.

---

## 📁 Repository Structure

```
D:\hsgames\
├── hsgames-website\             # React + Vite + TypeScript + Tailwind CSS Frontend
│   ├── src\
│   │   ├── components\          # UI Components (Navbar, Footer, GameCard, Demo Modal)
│   │   ├── pages\               # Home, Games, Bundles, GameDetail, Cart, Dashboard, Admin
│   │   ├── services\            # Central Reactive Store & Local Storage Persistence
│   │   ├── types\               # TypeScript Definitions
│   │   └── data\                # Initial Seed Data (Categories, Games, Bundles)
│   ├── public\
│   │   ├── brand\               # Official HSGames Logos & Favicon
│   │   ├── games\greedy-markhor # 34 HD Drawables & Sound Effects from Android Project
│   │   └── downloads\           # Standalone Demo APK (GreedyMarkhor-v1.0-demo.apk)
│   └── dist\                    # Production Build ready for Cloudflare Pages
├── supabase\
│   └── migrations\              # Full PostgreSQL Schema, 8 Categories & RLS Policies
├── android-demo-service\        # Zero-Cost Demo Architecture & Platform Audit
├── GreedyMarkhor-v1.0-demo.apk  # Pre-compiled Standalone Demo APK (38.6 MB)
└── README.md
```

---

## 🎮 First Flagship Product: Greedy Markhor

- **Category**: Greedy Series
- **Language**: 100% Kotlin
- **UI Framework**: Jetpack Compose (Declarative Android UI)
- **Architecture**: MVI with Clean Architecture & StateFlow
- **Cycle**: 38-second continuous synchronized loop (30s betting, 4s spinning, 4s showing)
- **Multipliers**: Burger (15x), Pizza (25x), Chicken (45x), Fish (10x), Lemon (5x), Apple (5x), Mango (5x), Strawberry (5x)
- **Categories**: Fruit (5x), Feast (10x), Mix (25x)
- **Jackpot**: Midnight daily progressive jackpot pool (Top 15 leaderboard)
- **Chests**: 8 Tiered Wager Milestones (5M, 10M, 50M, 100M, 500M, 1B, 2.5B, 5B)
- **Backend Migration**: Ready-to-run PostgreSQL / Supabase migration script with 6 secure RPCs
- **Zero-Cost Demo**: Interactive browser simulation + downloadable standalone APK

---

## 🚀 Running the Website Locally

1. Open terminal and navigate to the website directory:
   ```bash
   cd D:\hsgames\hsgames-website
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173/` in your browser.

---

## 🌐 Deploying to Cloudflare Pages (Free Tier)

1. Create a free account at [cloudflare.com](https://cloudflare.com).
2. Go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git** (or direct upload of the `dist` folder).
3. Set build configuration:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Set custom domain or use `hsgames.pages.dev`.

---

## 🛡️ Administrative Portal

The website includes a built-in Administrative Command Center accessible at `/admin-dashboard`.
- Review incoming manual orders and inspect payment receipt screenshots.
- One-click **"Approve Payment"** button mints unique commercial license keys and unlocks private source downloads in the customer's portal.
- Manage products across the 8 finalized categories:
  1. All Games
  2. Card Battles
  3. Greedy Series
  4. Roulette & Wheels
  5. Crash Aviator
  6. Fruit Slots
  7. Jackpots & Classic Multiplayer
  8. Ludo
