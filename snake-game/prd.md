Here’s a compact but complete PRD you can hand to a developer.

# PRD — Simple Snake Game (Pure HTML/CSS/JavaScript)

## 1. Project Overview

Build a lightweight browser-based Snake game using only native web technologies:

- `HTML` for structure
- `CSS` for styling
- `JavaScript` for game logic

No external libraries, frameworks, canvas engines, or backend services.

The game should be simple, responsive enough for desktop play, visually clean, and easy to maintain.

---

## 2. Objective

Create a classic Snake game that:

- runs directly in the browser
- is implemented in a single-page frontend
- supports keyboard controls
- tracks score
- ends when the snake collides with itself or the wall
- allows restart without reloading the page

---

## 3. Scope

### In Scope

- Start screen or visible game area on load
- Snake movement on a fixed grid
- Food spawning randomly
- Snake growth after eating food
- Score tracking
- Collision detection
- Game over state
- Restart functionality
- Basic responsive layout
- Clean retro/minimal styling

### Out of Scope

- Multiplayer
- Touch/mobile gestures
- Sound effects
- High score persistence
- Levels/themes
- Backend/database
- Online leaderboard

---

## 4. Target Users

- Casual users playing in browser
- Students learning frontend game development
- Demo/portfolio viewers

---

## 5. Functional Requirements

### 5.1 Game Board

- Display a square game board centered on page
- Board should use a fixed-size grid, for example `20 x 20`
- Each cell should represent one movement step
- Visual distinction required for:
  - empty cells
  - snake head
  - snake body
  - food

### 5.2 Snake Behavior

- Snake starts with default length of 3 cells
- Initial direction should be right
- Snake moves automatically at a fixed interval
- User can change direction using keyboard:
  - Arrow keys
  - optionally `W A S D`

- Snake cannot reverse directly into itself

### 5.3 Food Behavior

- One food item visible at a time
- Food appears in a random empty cell
- When snake eats food:
  - score increases by 1
  - snake length increases by 1
  - new food spawns in a valid empty cell

### 5.4 Collision Rules

Game ends when:

- snake hits wall
- snake hits its own body

On game over:

- stop movement loop
- display “Game Over”
- show final score
- show restart button

### 5.5 Restart

- Restart button resets:
  - snake position
  - direction
  - score
  - food placement
  - game state

### 5.6 UI Information

Display:

- current score
- game title
- controls hint
- restart button
- game over message when applicable

---

## 6. Non-Functional Requirements

### Performance

- Should run smoothly in modern desktop browsers
- Minimal DOM overhead
- No unnecessary re-renders beyond grid updates

### Compatibility

- Chrome
- Edge
- Firefox
- Safari (modern versions)

### Maintainability

- Code should be modular and readable
- Clear separation between structure, styling, and logic

### Accessibility

- Sufficient contrast
- Buttons must be keyboard accessible
- Game info text should be readable and clear

---

## 7. Design Requirements

### 7.1 Visual Style

Use a simple retro/minimal design:

- dark background or light neutral background
- clear bordered play area
- snake head slightly different from body
- food in contrasting color like red
- score panel above board

### 7.2 Layout

Recommended structure:

- page wrapper centered vertically/horizontally
- title at top
- score and controls beneath title
- game board in center
- restart button below or above board

### 7.3 Responsive Behavior

- Desktop-first
- Board should remain fully visible on smaller screens
- Grid cells may scale down slightly for narrow viewports

### 7.4 Suggested Styling

- Use CSS Grid for board rendering
- Use consistent square cells
- Add subtle hover/focus states for buttons
- Keep typography simple and legible

---

## 8. Technical Requirements

### 8.1 File Structure

Recommended:

```text
/index.html
/style.css
/script.js
```

### 8.2 HTML Requirements

Should include:

- title/header
- score display
- controls text
- game board container
- status message area
- restart button

### 8.3 CSS Requirements

Should handle:

- page centering
- board grid styling
- snake and food cell styles
- button styling
- game over/status styles
- responsive adjustments

### 8.4 JavaScript Requirements

Main logic modules/functions should cover:

- initialize game state
- render board
- handle input
- update snake position
- detect food collision
- detect wall/self collision
- generate new food
- update score
- stop/start game loop
- restart game

### 8.5 State Model

Suggested state variables:

- `gridSize`
- `snake`
- `direction`
- `nextDirection`
- `food`
- `score`
- `gameOver`
- `gameInterval`

### 8.6 Game Loop

- Use `setInterval()` for fixed-tick movement
- Recommended initial speed: `150–200ms` per move
- Process order per tick:
  1. apply next direction
  2. compute new head
  3. check collisions
  4. move snake
  5. check food
  6. render board
  7. update score/status

---

## 9. User Flow

### Initial State

- User opens page
- Game board visible
- Snake and food rendered
- Score starts at 0

### Gameplay

- User presses arrow keys / WASD
- Snake moves continuously
- User avoids collisions and collects food

### End State

- User collides
- Game over shown
- Restart button available

### Restart

- User clicks restart
- Fresh game starts immediately

---

## 10. Testing Requirements

### 10.1 Functional Testing

Verify:

- snake starts correctly
- controls work correctly
- snake cannot reverse directly
- food spawns in valid empty cell
- score increments correctly
- snake grows after eating
- wall collision triggers game over
- self collision triggers game over
- restart fully resets state

### 10.2 UI Testing

Verify:

- board renders consistently
- snake/food visible clearly
- score updates visually
- game over message appears correctly
- restart button is clickable and keyboard accessible

### 10.3 Cross-Browser Testing

Test in:

- Chrome
- Firefox
- Edge
- Safari

### 10.4 Edge Cases

Test:

- rapid key presses
- key press before game loop tick
- food never spawns inside snake
- restart after immediate game over
- repeated restarts do not create multiple intervals

---

## 11. Acceptance Criteria

The feature is complete when:

- the game runs in browser without external dependencies
- snake moves smoothly on a grid
- food collection increases score and snake length
- collisions end the game correctly
- restart works without page refresh
- UI is clean and usable
- code is separated into HTML, CSS, and JS files

---

## 12. Suggested Developer Notes

- Prefer rendering the board from JS using CSS Grid cells
- Keep logic deterministic and simple
- Prevent duplicate intervals on restart
- Use event listeners carefully to avoid input bugs
- Keep code beginner-readable but production-clean

---

## 13. Future Enhancements

Optional later upgrades:

- mobile controls
- increasing difficulty
- pause/resume
- localStorage high score
- sound effects
- theme switcher
- wall wrapping mode

If you want, I can turn this into a more formal one-page PRD template or into a Claude Code–ready implementation brief.
