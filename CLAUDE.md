# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run lint         # Run ESLint (eslint-config-next with TypeScript)
```

## Architecture

### Overview

Gacha Camera is a Next.js 16 application using App Router that transforms a camera feed into a gacha game experience. Users tap the screen to trigger a gacha animation with sound effects.

### Core Flow

1. **Camera capture** (`useCamera` hook) → Accesses device camera via MediaDevices API
2. **Tap trigger** → User interaction initiates gacha
3. **Gacha logic** (`useGacha` hook) → Determines rarity (SSR/SR/R/N) and selects character
4. **Animation sequence** (`GachaOverlay`) → Phases: flash → rolling → effect → rarity → cutin → serif → fadeout
5. **Sound playback** (`soundManager`) → Howler.js-based sound effects synchronized with animation

### Key Files

- [src/types/gacha.ts](src/types/gacha.ts) - Type definitions (`Rarity`, `GachaCharacter`, `GachaResult`) and `RARITY_CONFIG` with rates/colors
- [src/lib/gachaData.ts](src/lib/gachaData.ts) - Character pool data. Add new characters here
- [src/lib/sounds.ts](src/lib/sounds.ts) - Sound manager singleton using Howler.js
- [src/hooks/useGacha.ts](src/hooks/useGacha.ts) - Gacha pull logic with probability calculation
- [src/hooks/useCamera.ts](src/hooks/useCamera.ts) - Camera stream management with front/back switching
- [src/app/page.tsx](src/app/page.tsx) - Main page orchestrating all components

### Rarity System

Defined in `RARITY_CONFIG` ([src/types/gacha.ts](src/types/gacha.ts)):
- SSR: 3%, SR: 12%, R: 35%, N: 50%

### Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json)
