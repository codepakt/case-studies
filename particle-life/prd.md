# Particle Life — PRD

## What is this

A browser-based particle life simulation. Hundreds of colored particles exist in a 2D world. Each species has attraction or repulsion forces toward every other species (including itself). From these simple pairwise rules, complex emergent behavior appears: clustering, orbiting, chasing, chains, symbiosis.

No libraries. No build step. Open `index.html` in a browser.

## Why it's interesting

The rules are trivial — "red is attracted to blue at strength 0.5 within radius 200" — but the macro behavior is unpredictable and alive. You don't program the flocking or the hunting. It just happens.

## Core simulation

### Particles

- 400–800 particles total, split across 4–6 species (colors)
- Each particle: position (x, y), velocity (vx, vy), species
- Randomly placed on canvas at start

### Force rules

- A `rules` matrix: `rules[speciesA][speciesB]` = force strength (float, -1.0 to +1.0)
  - Positive = attraction
  - Negative = repulsion
- Each particle feels the sum of forces from all other particles within a `radius` (default ~150px)
- Force falls off with distance (linear falloff to zero at radius edge)
- A friction/damping factor (0.5–0.9) applied each frame to prevent infinite acceleration

### Physics update (per frame)

For each particle `a`:
1. Sum forces from all particles `b` within radius, weighted by `rules[a.species][b.species]` and distance
2. Apply force to velocity
3. Apply friction to velocity
4. Update position
5. Wrap around edges (toroidal world)

### Performance

- Spatial partitioning (grid-based) to avoid O(n^2) on every frame
- Target 60fps with 600 particles on a modern laptop
- Use `requestAnimationFrame`, draw on `<canvas>`

## Controls

### Visible on screen

- **Play / Pause** — toggle simulation
- **Randomize** — generate new random rules matrix and scatter particles
- **Speed** slider — simulation steps per frame (1–5)
- **Particle count** slider — 200 to 1000, live adjustment
- **Friction** slider — 0.3 to 0.99

### Rules matrix

- A small interactive grid showing the current rules matrix (species x species)
- Each cell is a colored indicator: red (repulsion) through white (neutral) through green (attraction)
- Click a cell to cycle or drag to adjust the force value
- Hovering a cell shows the numeric value

### Presets

A few named presets that produce reliably interesting behavior:

- **Chaos** — fully random rules
- **Symbiosis** — mutual attraction between pairs, self-repulsion
- **Hunters** — asymmetric: A chases B chases C chases A
- **Clusters** — strong self-attraction, mild inter-species repulsion
- **Orbits** — carefully tuned to produce circular chasing patterns

## Visual design

- Dark background (#0a0a0a)
- Particles are small filled circles (radius 2–3px) with a subtle glow/bloom
- Each species has a distinct, vibrant color against dark (no pastels)
- Optional: faint motion trails (draw with low-alpha, don't fully clear canvas each frame)
- The rules matrix panel sits in a corner, semi-transparent, doesn't dominate the screen
- Controls are minimal and stay out of the way — bottom edge or a collapsible side panel
- The simulation canvas fills the viewport

## Non-goals

- No 3D
- No sound
- No saving/loading state
- No mobile optimization (desktop-first, if it works on mobile great)
- No build tools, bundlers, or frameworks

## Done when

- Open `index.html`, see particles moving with emergent behavior
- Can randomize rules and get visually different behavior each time
- Can select presets and see distinct patterns
- Can click the rules matrix to tweak individual forces live
- Runs at 60fps with 600 particles on a 2020+ laptop
- Code is clean, commented where physics/math is non-obvious
