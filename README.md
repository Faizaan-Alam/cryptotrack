# CryptoTrack — Crypto Market Tracker

A full-featured cryptocurrency market tracker built with React, Vite, and Tailwind CSS. Powered by the [CoinGecko Public API](https://www.coingecko.com/en/api).

## Features

- **Dashboard** — Top 100 cryptocurrencies with live prices, market cap, 24h change, and volume
- **Search & Filter** — Search by name/symbol, filter gainers/losers, sort by price/market cap/change/volume
- **Coin Details** — Individual coin pages with stats, description, and 7/30-day price charts
- **Watchlist** — Star favorite coins, persisted in localStorage
- **Portfolio Tracker** — Track holdings, calculate total value, profit/loss, and growth %
- **Price Alerts** — Set target prices with browser notifications
- **Market Widgets** — Fear & Greed Index, trending coins, top gainers/losers, global stats
- **Performance** — Lazy-loaded routes, API caching, loading skeletons, error handling
- **Responsive** — Mobile, tablet, and desktop layouts

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite 8 |
| Styling | Tailwind CSS 4 |
| Charts | Recharts |
| Routing | React Router 7 |
| State | Context API + Custom Hooks |
| API | CoinGecko Public API |
| Icons | Lucide React |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── assets/          # Static assets (images, icons)
├── components/
│   ├── alerts/      # Price alert components
│   ├── dashboard/   # Dashboard widgets (Fear & Greed, Trending, etc.)
│   ├── layout/      # Header, Footer, Layout wrapper
│   ├── portfolio/   # Portfolio form and summary
│   └── ui/          # Reusable UI components (tables, charts, skeletons)
├── context/         # React Context providers (CryptoContext)
├── hooks/           # Custom hooks (useCoins, useLocalStorage, usePriceAlerts)
├── pages/           # Route-level page components
├── services/        # API service layer (coinGeckoApi.js)
└── utils/           # Helpers (formatters, cache, constants)
```

## Deployment

This app is deployment-ready for platforms like Vercel, Netlify, or GitHub Pages:

```bash
npm run build
# Deploy the `dist/` folder
```

For GitHub Pages, set `base` in `vite.config.js`:

```js
export default defineConfig({
  base: '/your-repo-name/',
  // ...
})
```

## API Rate Limits

CoinGecko's free API has rate limits (~10-30 calls/min). The app uses in-memory caching to minimize requests. For production, consider a [CoinGecko API key](https://www.coingecko.com/en/api/pricing).

## License

MIT