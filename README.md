# Fence Planner & Material Calculator

Free, no-account web utility from **A Double M**: draw or enter a fence layout, preview a stylized Dream View, and print a materials list. Revenue model is AdSense-ready display ads outside the tool canvas.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- SVG Plan View + isometric SVG Dream View
- Vitest for calculation engine tests
- Browser `localStorage` persistence (no backend)

## Scripts

```bash
npm run dev      # local development
npm run build    # production build
npm test         # calculation unit tests
npm run lint     # eslint
```

## Architecture

| Area | Path |
|------|------|
| Domain types & units | `src/domain/` |
| Calculators | `src/calc/` |
| Warnings | `src/warnings/` |
| Plan / Dream canvas | `src/canvas/` |
| Persistence | `src/persistence/` |
| Planner UI | `src/components/planner/` |
| Guides & examples | `src/content/` |

**Single source of truth:** `FenceProject` drives Plan View, Dream View, and materials. Calculators never live inside UI components.

## MVP fence systems

1. Preassembled panel  
2. Site-built wood privacy  
3. Chain-link  

## Assumptions (defaults)

- Internal units: inches  
- Panel width: 8 ft (panel-only + 4 in post unless mode is includes-post)  
- Wood post spacing: 8 ft, 3 rails/span  
- Concrete: cylindrical hole − square post volume; bag yield ≈ 0.33 ft³  
- Waste: visible/editable; not applied silently to all categories  

## Out of scope (MVP)

Live prices, retailer APIs, user accounts, paid features, satellite/lot detection, WebGL Dream View, property-image tracing.

## AdSense

`AdSlot` placeholders reserve space. Never place ads inside Plan/Dream canvases or print output.

## License / product

Always free. Planning estimates only — see Terms and Methodology pages.
