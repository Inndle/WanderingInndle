# Innordle

![alt text](./WanderingInndle.png)

## How to Run Locally
Currently only supports running in development mode. No packages or dependencies besides React and
Node.js required, to run, use:
```
npm run dev
```

## Things Left to Implement:
### Functionality (Listed in order of importance):

- Add initial rules popup (This can be where daily goes. Or that's always the first.) (SAM SHOULD FILL THIS OUT)

- Make settings modal a consistent size across tabs

- Include optional difficulty 4 (Easy)

- Include victory screen - Done?

- Add some way to apply settings before starting game 

    Includes Difficulty, and could also include which columns to include
    Difficulty can be a strict include 
    
    CComment: They can just reset I think this one is optional

- Rework search functionality to be faster and correct -> complete

Ideally we can have little profile photos next to each search entry to make it clearer. Also, the search is for "names containing letter x" instead of "names beginning with letter x". Should also speed up search somehow (maybe cache search results before loading the inputbox?)

- Refactor code

Right now a lot of the logic for what the squares display and changing what they look like is handled inside `Guesses.tsx`. It might be cleaner and more "React-like" if we move the logic into `Game.tsx`. This is also a placeholder for other potential ways we can make the codebase cleaner.

### Appearance (Listed in order of importance):
- Do something about the profile pictures
- Add animations for when the guess details appear
- Add victory screen
- Add tooltips on hover
- Create transparent textures for behind squares
- Make search bar look nicer / remove autofill
- Add favicon
- Find a better font
- Create stylized shading for background image 
- Style scrollbars to be more immersive

### Low Hanging Fruit:
- Maybe add background to arrows
- Add favicon (We have no created favicon yet tho)
- Add arrow keys to switch between search bar results
- Add a give up button
- Fix the category titles shifting a little once a guess is made (Maybe hide it until history.length > 0)

#### Starter Plan:

Popup
- Choose the daily (SPOILERS THOUGH)
- Choose Free Play (Says what spoilers to include)
- 
