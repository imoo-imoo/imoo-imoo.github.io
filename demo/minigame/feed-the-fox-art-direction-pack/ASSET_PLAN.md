# Feed the Fox — New Asset Plan

## Goal

Create a small, cohesive asset family that supports a clearer gameplay loop:

`Catch accurately → build Energy → enter Fever → attract e-waste → score rapidly → approach or beat the champion`

This plan intentionally removes visual dependence on repeated text banners.

---

## A. Required First-Priority Assets

### 1. Energy Meter

| File | Purpose | Recommended master size |
|---|---|---:|
| `ui-energy-frame.png` | Painted outer frame | 720 × 150 |
| `ui-energy-track.png` | Empty interior track | 620 × 70 |
| `ui-energy-fill.png` | Tileable or maskable fill | 620 × 70 |
| `ui-energy-segments.png` | Transparent segment overlay | 620 × 70 |
| `ui-energy-ready-glow.png` | Full-meter highlight | 760 × 190 |
| `ui-energy-fever-glow.png` | Fever active overlay | 800 × 220 |

Requirements:

- horizontal format
- readable at approximately 320–520 CSS px
- separate fill and frame
- no baked-in percentage text
- no giant label
- visually related to existing wooden HUD plaques

### 2. Power-up Icon Set

| File | Meaning | Master size |
|---|---|---:|
| `ui-power-time.png` | +3 seconds | 256 × 256 |
| `ui-power-energy.png` | instant Energy boost | 256 × 256 |
| `ui-power-double.png` | optional ×2 score state | 256 × 256 |
| `ui-power-magnet.png` | optional magnet state | 256 × 256 |
| `ui-power-golden.png` | golden / rare catch | 256 × 256 |

Requirements:

- same outer icon frame
- different central silhouettes
- transparent background
- readable at 48 CSS px
- not dependent on text alone

### 3. Champion Marker

| File | Purpose | Master size |
|---|---|---:|
| `ui-champion-marker.png` | compact score target / record marker | 256 × 256 |

Preferred motif:

- crown + small finish flag
- wood / leaf construction
- no large plaque

---

## B. Fever Character Assets

| File | Purpose |
|---|---|
| `fox-fever-idle.png` | Fever neutral state |
| `fox-fever-run-left.png` | Fever moving left |
| `fox-fever-run-right.png` | Fever moving right |
| `fox-fever-happy.png` | Optional Fever celebration |

Hard requirements:

- match existing sprite dimensions or document exact replacement dimensions
- preserve foot baseline
- preserve bucket center and opening
- preserve fox identity
- energy enhancements only
- no redesign

Recommended Fever treatment:

- excited eyes and expression
- warm golden-green rim light
- bucket energy glow
- small leaf or recycling sparks
- brighter tail edge
- restrained effect padding

---

## C. Effect Assets

| File | Purpose | Master size |
|---|---|---:|
| `fx-fever-ring.png` | rotating / pulsing Fever aura | 768 × 768 |
| `fx-magnet-wave.png` | magnetic attraction wave | 768 × 768 |
| `fx-energy-spark.png` | reusable energy spark | 128 × 128 |
| `fx-perfect-ring.png` | Perfect Catch contraction ring | 384 × 384 |
| `fx-champion-burst.png` | record-beaten burst | 512 × 512 |

These should supplement, not replace, Canvas particles.

---

## D. Gameplay Systems These Assets Will Support

### Remove

- Mission system
- persistent mission text
- persistent `BEAT ###` text
- repeated large Perfect text
- redundant power-state banners

### Add or strengthen

- Energy meter
- Energy-based Fever
- Fever magnet behavior
- clearer active power state
- Perfect Catch visual signature
- near-record champion cues
- Fever character state
- semantic audio hierarchy

---

## E. Recommended Integration Layout

1080 × 1920 logical game canvas:

- Score: current top-left HUD
- Time: current top-right HUD
- Energy meter: centered below Score/Time
- Active power icon: compact slot below or beside Energy meter
- Champion marker: hidden normally; appears near target threshold
- Combo: integrated into Energy meter or placed directly above it
- gameplay area: kept visually clear
- fox and controls: unchanged

---

## F. Approval Order

1. Energy meter concept
2. Power-up icon family
3. Champion marker
4. Fever fox alignment test
5. Fever and magnet effects
6. Gameplay integration

Do not generate the entire asset family before the first three visual concepts are approved.
