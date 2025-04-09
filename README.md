# Innordle

![alt text](./WanderingInndle.png)

## Things Left to Implement:
### Functionality (Listed in order of importance):

- Give up button only shows up in free play
- Volume Filter

- Refactor code

Right now a lot of the logic for what the squares display and changing what they look like is handled inside `Guesses.tsx`. It might be cleaner and more "React-like" if we move the logic into `Game.tsx`. This is also a placeholder for other potential ways we can make the codebase cleaner.

### Appearance (Listed in order of importance):
- Get a better logo
- Do something about the profile pictures
- Add animations for when the guess details appear
- Add tooltips on hover
- Create transparent textures for behind squares
- Make search bar look nicer / remove autofill
- Find a better font
- Create stylized shading for background image 
- Style scrollbars to be more immersive

### Low Hanging Fruit:
- Maybe add background to arrows
- Add arrow keys to switch between search bar results
- Fix the category titles shifting a little once a guess is made (Maybe hide it until history.length > 0)
