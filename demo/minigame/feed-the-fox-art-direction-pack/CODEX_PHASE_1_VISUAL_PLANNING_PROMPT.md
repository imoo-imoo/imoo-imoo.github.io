# CODEX PHASE 1 — VISUAL SYSTEM PLANNING ONLY

Review the complete Feed the Fox game and its curated art-direction pack.

Inputs:

- `production-project/`
- `STYLE_GUIDE.md`
- `ASSET_PLAN.md`
- `references/reference-sheet.jpg`
- all curated folders under `references/`
- `do-not-modify/current-production-assets/`

Important:

Everything in `do-not-modify/` is final production artwork.

Do not repaint, overwrite, rename, resize, recolor, regenerate, or replace those files.

This phase is planning only.

DO NOT:

- modify `index.html`
- modify `styles.css`
- modify `game.js`
- modify gameplay logic
- generate final production assets
- create placeholder assets
- change page flow
- change buttons
- change leaderboard logic
- alter any current artwork

Your task is to define the complete visual system for the next gameplay upgrade.

The agreed gameplay direction is:

1. Remove the Mission system because it does not meaningfully change player decisions.
2. Remove persistent target-score text.
3. Replace text-heavy feedback with visible persistent game states.
4. Create one Energy / Combo loop:
   - normal catch builds Energy
   - Perfect Catch builds more Energy
   - rare catch builds more Energy
   - miss reduces some Energy
   - full Energy triggers Fever
5. Fever becomes the main visible climax:
   - approximately 5 seconds
   - score boost
   - visible magnet behavior
   - stronger audio and effects
   - Fever fox state
   - Energy meter drains to zero
6. Perfect Catch should be understood through visual and sound feedback, not repeated large text.
7. Target/champion information should appear only near important thresholds.
8. Active power-ups should use one icon slot and clear countdown/state feedback.
9. Existing page flow, results, leaderboard, controls, saving, and all navigation remain unchanged.

Produce a planning package containing:

## 1. Visual System Overview

Explain the unified visual language for:

- Energy
- Combo
- Fever
- Perfect Catch
- Power-ups
- Champion / record pursuit

For each, describe:

- shape
- color
- lighting
- animation
- sound relationship
- hierarchy
- how it avoids text dependence

## 2. Exact Asset Inventory

For every new file, provide:

- filename
- purpose
- master pixel dimensions
- expected display dimensions
- transparent padding
- anchor point
- animation method
- whether it must be layered
- whether Canvas alone would be better

## 3. Energy Meter Specification

Define:

- exact placement on 1080 × 1920 canvas
- width and height
- fill direction
- number of visual segments
- empty state
- charging state
- almost-full state
- ready state
- Fever draining state
- reduced-motion state
- interaction with Combo display
- how it remains readable on iPhone Safari

## 4. Power-up Icon System

Define a consistent icon family for:

- Time bonus
- Energy boost
- optional Double Score
- optional Magnet
- Golden / rare catch

Explain:

- shared frame
- silhouette differentiation
- color differentiation
- how each remains understandable at 48 CSS px
- active-state countdown treatment

## 5. Champion Marker System

Define:

- default hidden state
- near-target threshold
- very-near-target threshold
- record-beaten state
- icon placement
- progress or pulse behavior
- how it avoids becoming another permanent HUD box

## 6. Fever Fox Specification

Compare current:

- idle
- run-left
- run-right
- happy

Define exact Fever variants.

For each variant specify:

- required canvas dimensions
- baseline alignment
- fox center
- bucket center
- bucket opening
- energy aura boundary
- expression change
- animation / replacement behavior

Do not redesign the fox.

## 7. Effect Strategy

Separate effects into:

- assets that should be PNG
- effects that should remain procedural Canvas
- effects that should use Web Audio only

Avoid unnecessary files.

## 8. UI Collision Safety

Propose exact safe zones so:

- Score
- Time
- Energy meter
- Combo
- active power icon
- temporary champion cue
- phase banner
- falling objects

never overlap.

Do not move existing buttons or result screens.

## 9. Three Concept Directions

Provide three closely related visual concepts for the Energy / Fever system.

They must all remain within the current art style:

A. Forest Battery
B. Recycling Power Core
C. Leaf Energy Gauge

For each concept, describe:

- visual construction
- strength
- weakness
- integration risk
- recommended use

Do not produce unrelated themes.

## 10. Final Recommendation

Choose one concept and explain why it best fits the existing game.

Then output a proposed folder tree for the generated assets.

This phase ends after the planning package.

Do not generate final PNG assets and do not modify the game.
