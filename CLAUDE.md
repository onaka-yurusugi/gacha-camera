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

虹演出カメラ (Niji Ensyutsu Camera) is a Next.js 16 application using App Router that transforms a camera feed into a gacha game experience. Users tap the screen to trigger a gacha animation with sound effects, then save or share the result.

### Core Flow

1. **Camera capture** (`useCamera` hook) → Accesses device camera via MediaDevices API
2. **Tap trigger** → User interaction initiates gacha
3. **Gacha logic** (`useGacha` hook) → Determines rarity (SSR/SR/R/N) and selects character
4. **Animation sequence** (`GachaOverlay`) → Phases: flash → rolling → effect → rarity → cutin → serif → fadeout
5. **Sound playback** (`soundManager`) → Howler.js-based sound effects synchronized with animation
6. **Result actions** (`ResultActions`) → Save image or share via Web Share API

### Key Files

- [src/types/gacha.ts](src/types/gacha.ts) - Type definitions (`Rarity`, `GachaCharacter`, `GachaResult`, `GachaSettings`) and `RARITY_CONFIG` with rates/colors
- [src/lib/gachaData.ts](src/lib/gachaData.ts) - Character pool data. Add new characters here
- [src/lib/sounds.ts](src/lib/sounds.ts) - Sound manager singleton using Howler.js
- [src/hooks/useGacha.ts](src/hooks/useGacha.ts) - Gacha pull logic with probability calculation
- [src/hooks/useCamera.ts](src/hooks/useCamera.ts) - Camera stream management with front/back switching
- [src/hooks/useGachaSettings.ts](src/hooks/useGachaSettings.ts) - Custom settings management with localStorage persistence
- [src/app/page.tsx](src/app/page.tsx) - Main page orchestrating all components

### Components

#### Gacha Components (`src/components/Gacha/`)

- `GachaOverlay.tsx` - Animation orchestration and phase management
- `SummonGate.tsx` - Summoning gate + crystal display
- `CrystalShatter.tsx` - Crystal shatter animation
- `SSRExplosion.tsx` - SSR-exclusive explosion effect
- `RainbowEffect.tsx` - Background effects based on rarity
- `CharacterCutin.tsx` - Character cut-in display
- `SerifDisplay.tsx` - Serif text display
- `RarityBadge.tsx` - Rarity badge display
- `NameReveal.tsx` - Character name reveal animation
- `ResultActions.tsx` - Save/share buttons using modern-screenshot

#### UI Components (`src/components/UI/`)

- `Header.tsx` - App header with settings button
- `TapToSummon.tsx` - Tap instruction overlay
- `SettingsModal.tsx` - Custom character settings modal

### Rarity System

Defined in `RARITY_CONFIG` ([src/types/gacha.ts](src/types/gacha.ts)):
- SSR: 3%, SR: 12%, R: 35%, N: 50%

### Gacha Modes

- `random` - Pulls from character pool defined in gachaData.ts
- `custom` - Uses user-defined character settings (stored in localStorage)

### Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json)
