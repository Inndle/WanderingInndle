# Inndle

![alt text](./WanderingInndle.png)

---
Hosted on GitHub pages [here](https://inndle.github.io/WanderingInndle/)!

Based on the hit web serial [The Wandering Inn](https://wanderinginn.com/)! Try to guess the character of the day or play the infinite mode. 

## Things Left to Implement:
### Functionality (Listed in order of importance):

- Refactor code

Right now a lot of the logic for what the squares display and changing what they look like is handled inside `Guesses.tsx`. It might be cleaner and more "React-like" if we move the logic into `Game.tsx`. This is also a placeholder for other potential ways we can make the codebase cleaner.

### Appearance (Listed in order of importance):
- Add tooltips on hover
- Create transparent textures for behind squares
- Make search bar look nicer / remove autofill
- Find a better font
- Create stylized shading for background image 
- Style scrollbars to be more immersive

### Low Hanging Fruit:
- Add arrow keys to switch between search bar results
- Fix text resizing for mobile (e.g. Fighting Type too large for mobile, sometimes text overflows boxes, etc.)
- Correct Gear button spacing