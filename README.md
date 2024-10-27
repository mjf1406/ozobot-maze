# Ozobot Maze Generator

## To-do List

### p3

- UI: completed the FAQ and added translations

### p2

- Generation
  - Eller's algo
  - Recursive Backtracking
  - Prim's algo
  - Kruskal's algo
- Inputs
  - Number of commands required to finish the maze
    - Minimum: ???
    - Maximum: ???
  - Difficulty
    - proxy for how long the black line is that bit follows
    - determines which command codes are required to finish the maze
  - Generate two? (Front and back of page)
  - Generate larger mazes? (tape multiple pages together)
  - Grid type
    - square
    - circle
    - hex
- Output
  - How wide is the Bit black line?
  - Option to reveal the required commands with or without the quantities

### p1

- algo: Ozobot constraints implemented
  - [ ] at least 25mm between any parallel tracks
  - [ ] Zigzag and Backwalk require at least 64mm after to pick up another color code
  - [ ] Line Switch Left/Right require a parallel line next to tit
  - [ ] Line Switch Straight requires a perpendicular line
  - [ ] At least 51mm between color codes
  - [ ] there must be at least 25mm from a corner/intersection before another corner/intersection/color code
  - [ ] line that end in a color must have a safe area with a diameter of 20mm starting from the end of the line
  - [ ] color codes are 5mm x 5mm
  - [ ] line thickness
  - [ ] each side of a line must have at least 12mm of white space
  - [ ] curves must have a minimum diameter of 25mm
  - [ ] corner minimum angel is 90deg
  - [ ] add a calibration circle to each maze: 39mm diameter

### p0

- UX: added translations for Tips in ko and zhs

## Change Log

2024/10/27

- UX: added loading.tsx with proper translations
- UX: improved interaction times to be sub ~150ms after a maze is in the dom
- UI: loading state is not properly set when generating

2024/10/26

- UX: added a tips section just below the output
- UX: added two types of generations: Ozobot Maze and Ozobot Challenge
- algo: number of each Color Code is now randomly determined
- fixed: flags now appear correctly in LocaleSwitcher
- fixed: there is no longer a delay in setting the locale dropdown to the current locale
  2024/10/26

- UX: added Korean and Chinese simplified using next-international: https://docs.google.com/spreadsheets/d/1R3-hWtn4Krmn088SiIITLgav9V1oalo7tXeQHrucyY0/edit?gid=0#gid=0

2024/10/24

- UX: the loading state now is ended upon maze generation instead of using a setTimeout
- algo: can now render a grid based on paper size
- UI: the printed CSS is no longer different from the on-page rendered CSS
- UI: the reveal hints items now display in the output when checked
- UX: updating the page size or difficulty no longer rerenders the output and user is alerted that they will have to generate a new maze if they want to see the changes take effect
- UI: added an X button to the title input to clear it
- output: added the website URL to the output maze in the footer: https://ozobot-maze.vercel.app/

2024/10/23

- did a whole bunch of stuff because it's the initial commit

## Dependencies

- Hosted on [Vercel](https://vercel.com/)
- CSS made easy thanks to [TailwindCSS](https://tailwindcss.com/)
- Database by [Turso](https://turso.tech/)
- Auth by [Clerk](https://clerk.com/)
- ORM by [Drizzle](https://orm.drizzle.team/)
- Colors from [RealtimeColors](https://www.realtimecolors.com/?colors=def2e7-050e09-89ddb0-1f824d-2bd579&fonts=Poppins-Poppins)
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
