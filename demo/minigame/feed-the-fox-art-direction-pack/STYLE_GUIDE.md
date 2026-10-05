# Feed the Fox — Art Direction Style Guide

## 1. Purpose

This document is the visual source of truth for all future game assets.

Every new asset must look as though it has always belonged inside the existing game.  
Do not reinterpret, modernize, simplify, or restyle the current production artwork.

Primary visual references are stored in:

- `references/reference-sheet.jpg`
- `references/background/`
- `references/characters/`
- `references/collectibles/`
- `references/ui/`

Current final production artwork is duplicated under:

- `do-not-modify/current-production-assets/`

Everything in `do-not-modify/` is reference-only and must never be repainted, overwritten, resized, recolored, renamed, or replaced.

---

## 2. Overall Visual Identity

The game uses a polished, painterly casual-mobile-game illustration style with:

- warm storybook atmosphere
- rounded, child-friendly silhouettes
- soft dimensional shading
- clear readable forms
- bright natural colors
- gentle highlights and rim lighting
- subtle texture rather than flat fills
- premium casual-game finish

The visual language is playful and energetic, but not chaotic.

### Never use

- flat vector icon styling
- pixel art
- photorealism
- anime rendering
- dark cyberpunk styling
- hard sci-fi panels
- neon holographic UI
- metallic military interfaces
- thin technical line icons
- sharp angular industrial shapes
- unrelated stock illustration aesthetics

---

## 3. Shape Language

### Character and collectibles

- rounded and soft
- large readable masses
- minimal sharp corners
- slightly exaggerated proportions
- friendly and toy-like
- immediately recognizable at mobile size
- no overly thin details

### UI

- thick wooden frames
- carved or painted dimensional surfaces
- rounded corners
- leaf, vine, flower, and nature accents
- bold readable silhouettes
- thick visual weight
- soft highlights
- subtle dark drop shadows for separation

New UI must feel built from the same forest world, not laid over it by a separate software interface.

---

## 4. Color Language

Primary families:

- warm oranges
- honey yellows
- forest greens
- wood browns
- cream and parchment tones
- small accents of blue and flower colors

Energy and power effects may introduce brighter colors, but must remain harmonized with the existing palette.

### Energy

Preferred:

- leaf green
- warm yellow-green
- golden yellow
- restrained cyan accent only when needed for readability

Avoid:

- electric neon blue as the dominant color
- magenta sci-fi glow
- aggressive red alarm styling

### Fever

Fever should feel like:

- accumulated eco-energy
- warm golden-green power
- recycling energy
- magical forest momentum

It should not look like a futuristic weapon system.

---

## 5. Lighting and Rendering

- soft ambient daylight
- warm key light
- smooth volume
- gentle rim highlights
- soft cast shadows
- controlled contrast
- glossy highlights only where already appropriate
- no harsh black shadows
- no flat cel shading
- no heavy photographic texture

Edges should feel painted and clean, not mechanically vector-cut.

---

## 6. Character Rules

The fox is a locked production character.

Preserve:

- face proportions
- eye size
- ear shape
- muzzle and cheek volume
- orange and cream fur distribution
- tail proportions
- paw shape
- body scale
- bucket scale and position
- overall silhouette
- camera angle

New fox states must align to the current production sprite footprint.

For Fever variants:

- preserve the same fox identity
- preserve the same pose family
- add expression, glow, energy, and motion accents
- do not redesign the costume or body
- do not replace the bucket
- do not alter the character into a different illustration style

Required alignment data for each new character asset:

- canvas width and height
- foot baseline
- horizontal character center
- bucket opening center
- bucket opening width
- transparent or chroma-key background policy
- intended replacement state

---

## 7. Collectible Rules

Collectibles are painterly e-waste objects with:

- clean recognizable silhouettes
- soft dimensional shading
- restrained detail
- warm highlights
- clear separation from the background
- consistent visual weight

Power-up variants should preserve the underlying object.

Use overlays such as:

- symbols
- rings
- sparkles
- auras
- small floating emblems

Do not repaint the entire collectible into a different style.

---

## 8. UI Rules

All new UI must visually match the existing `ui-painted` assets.

Use:

- wooden or bark-like outer frames
- thick rounded borders
- warm cream inner surfaces
- leaves, vines, or subtle flowers
- soft glossy highlights
- dimensional edge lighting
- restrained shadows

New UI should remain readable on a 1080 × 1920 game canvas and on small iPhone screens.

Avoid unnecessary decorative clutter around gameplay-critical information.

---

## 9. Gameplay Visual Hierarchy

Permanent HUD priority:

1. Score
2. Time
3. Energy / Combo system
4. One active power-up indicator

Temporary feedback:

- only one major banner at a time
- Perfect Catch should primarily use effects and sound, not repeated large text
- target/champion feedback should appear only near important thresholds
- power-up states should be visible through icons, timers, and world effects

The visual system must reduce reading during active play.

---

## 10. New Asset Family Direction

### Energy Meter

The meter should resemble a small eco-energy device constructed from:

- carved wood
- leaves or vines
- glowing recyclable energy
- segmented fill chambers

It must be visually related to existing HUD plaques.

Recommended layers:

- frame
- empty track
- segment overlay
- fill
- ready glow
- Fever glow

The fill must be controllable programmatically.

### Power-up Icons

Required icons:

- time bonus
- energy boost
- optional double score
- optional magnet
- golden / rare state

Each icon must:

- remain readable at 40–60 CSS px
- have a distinct silhouette
- not rely only on color
- share one consistent icon frame
- use painterly dimensional rendering

### Champion Marker

Use a small:

- crown
- finish flag
- trophy leaf emblem

It should be compact and visually integrated with the existing HUD.

### Fever Effects

Preferred motifs:

- golden-green energy rings
- leaves and small sparks
- recycling arrows
- soft radial waves
- magnetic arcs
- warm particle trails

Effects should remain readable and lightweight.

---

## 11. Technical Asset Requirements

Unless a production need requires otherwise:

- PNG
- transparent background
- sRGB
- tightly cropped but with safe effect padding
- no baked-in text unless explicitly requested
- no drop shadow clipped by canvas bounds
- consistent naming
- no generic names such as `new.png`, `final2.png`, or `test.png`

For layered UI, export separate files instead of one flattened asset when JavaScript needs to animate fill, glow, or countdown state.

---

## 12. Naming Convention

Use lowercase kebab-case.

Examples:

- `ui-energy-frame.png`
- `ui-energy-fill.png`
- `ui-energy-segments.png`
- `ui-energy-ready-glow.png`
- `ui-power-time.png`
- `ui-power-energy.png`
- `ui-power-double.png`
- `ui-power-magnet.png`
- `ui-champion-marker.png`
- `fx-fever-ring.png`
- `fx-magnet-wave.png`
- `fx-energy-spark.png`
- `fox-fever-idle.png`
- `fox-fever-run-left.png`
- `fox-fever-run-right.png`

---

## 13. Final Approval Test

Before accepting any new asset, verify:

- Does it look like the current game made it?
- Does it match the same lighting?
- Does it match the same rendering density?
- Does it use the same rounded shape language?
- Is it readable at actual gameplay size?
- Does it avoid stealing attention from falling objects?
- Does it integrate with the existing background?
- Does it avoid flat-vector or sci-fi styling?
- Does it align correctly with existing sprites?
- Can it be animated cleanly in Canvas or CSS?

If any answer is no, revise the asset before integration.
