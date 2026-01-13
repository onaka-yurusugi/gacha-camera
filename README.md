# Gacha Camera

Turn your camera into a gacha game.

[Demo](https://gacha-camera.vercel.app) | [日本語](./README.ja.md)

## Features

- Real-time camera feed with gacha overlay
- SSR/SR/R/N rarity system with different effects
- Sound effects & smooth animations
- Works on mobile browsers (iOS Safari / Android Chrome)
- Front/back camera switching

## Quick Start

```bash
# Clone the repository
git clone https://github.com/onaka-yurusugi/gacha-camera.git
cd gacha-camera

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

1. Allow camera access when prompted
2. Tap anywhere on the screen
3. Watch the gacha animation
4. Get your character!

## Tech Stack

| Category | Technology | Notes |
|----------|------------|-------|
| Framework | Next.js 14+ (App Router) | Vercel optimized |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS | Utility-first |
| Animation | Framer Motion | Declarative animations |
| Sound | Howler.js | Cross-browser support |
| Camera | MediaDevices API | Standard Web API |

## Rarity System

| Rarity | Rate | Effect Color |
|--------|------|--------------|
| SSR | 3% | Rainbow |
| SR | 12% | Gold |
| R | 35% | Blue |
| N | 50% | White |

## Project Structure

```
src/
├── app/                    # Next.js App Router
├── components/
│   ├── Camera/            # Camera components
│   ├── Gacha/             # Gacha effect components
│   └── UI/                # UI components
├── hooks/                 # Custom hooks
├── lib/                   # Utilities & data
└── types/                 # TypeScript types
```

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Easy ways to contribute

- **Add new characters** - Edit `src/lib/gachaData.ts` and submit a PR
- **Improve animations** - Enhance the gacha effects
- **Add translations** - Help with i18n
- **Report bugs** - Open an issue

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

## Deployment

This project is optimized for [Vercel](https://vercel.com):

```bash
# Deploy to Vercel
vercel
```

## License

[MIT](./LICENSE)

## Acknowledgments

- Sound effects from [効果音ラボ](https://soundeffect-lab.info/) (placeholder)
- Inspired by mobile gacha games
