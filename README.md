# Ozobot Maze Generator

## To-do List

### p3

- UI: completed the FAQ and added translations
- UX: added translations for Tips in ko and zhs
- UX: work on adding instructions for each activity type as a teaching resource

### p2

- UI: Generate larger activities? (tape multiple pages together)
- UI: Generate two? (Front and back of page)
- UI: Difficulty
  - Determines the command codes that can be used
  - Determines the overall length of the line
- FEATURE: Maze --
  - Generation
    - Eller's algo
    - Recursive Backtracking
    - Prim's algo
    - Kruskal's algo

### p1

- FEATURE: Road Challenge Answer Keys
  - algo: requires a solver algorithm that spits out many possible solutions
  - UI: User can print several different answer keys
- FEATURE: Maze -- A maze can be generated that uses the any combination of the below Color Codes
  1. [ ] Straight at Intersection
  2. [ ] Left at Intersection
  3. [ ] Right at Intersection
  - To do this we will need to...
    1. randomly determine the start coordinates
    2. randomly walk arouhnd the grid wqhile ranodmly determining if a color code is placed
    3. continue doing the above
    4. backtrack to add false paths
    5. add false color codes to false paths
    6. abide by all restrictions for these color codes
    - [ ] at least 25mm between any parallel tracks
    - [ ] At least 51mm between color codes
    - [ ] there must be at least 25mm from a corner/intersection before another corner/intersection/color code
    - [ ] line that end in a color must have a safe area with a diameter of 20mm starting from the end of the line
    - [ ] each side of a line must have at least 12mm of white space
    - [ ] corner minimum angle is 90deg
    - [ ] add a calibration circle to each maze: 39mm diameter

### p0

- Move this project to [NextJS15](https://github.com/mjf1406/ozobot-activities)
- UI: add custom difficulty
  - [ ] add quantity next to each Color Code that is selected
  - [ ] remove the total as they set the quantity for each Color Code

## Change Log

2024/12/29

- algo: fine-tuned constraints to ensure the minimum distance between parallel codes is 5 empty cells
- algo: made it so that it retries placing color codes over and over to try to get a grid that has no failed placements
- UI: added popover explaining which Color Codes are included in which difficulties

2024/11/13

- UX: changed which hint option is default selected when changing the maze type

2024/10/30

- UX: updated the difficulty names to be more fun
- UX: the user is now alerted if any Color Codes were failed to be placed
- PDF: Usable Hints now only shows the color codes that actually get placed on the grid along with the correct quantity
- removed the locale switcher for now

2024/10/29

- algo: color code padding is now integrated into placeColorCodes. This makes it better for staying within Ozobot constraints.
- fixed: printed output now does not cut off row labels in A3 page size
- fixed: adjusted alignment of row and column labels, cell coordinates, and padding on A3 to fix formatting issues when printing

2024/10/28

- algo: adjusted difficulty to be better organized and pulled from data, removing the switch from the getRandomQuantity function
- UI: added a link to instruction printables for each activity
- UI: increased the size of the grid cell to 6mm and then 7mm to print test sheets
- tips: fixed the phrasing now that we have 3 types of activities
- UI: coordinates only render every 5 cells now and are labeled on all axes
- UI: added 2 additional padding cells to make it easier for students
- UI: reduced the font size of the Color Codes
- UI: reduced the padding of the grid
- UX: changed the way the PDF gets named

2024/10/27

- algo: padding is now added to all color codes in Maze and Road Challenge
- UX: added a loading state on the pdf generation
- UX: generating scrolls to the generate button to allow the user to quickly regenerate without having to scroll up
- algo: color codes are now randomly placed and stored in the object
- UI: added Ozobot Road Challenge and changed Ozobot Challenge to Ozobot City Challenge
- UX: added loading.tsx with proper translations
- UX: improved interaction times to be sub ~150ms after a maze is in the dom
- UI: loading state is now properly set when generating

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

## Constraints

- algo: Ozobot constraints implemented just to connect every command
  - [ ] at least 25mm between any parallel tracks
  - [ ] At least 51mm between color codes
  - [ ] there must be at least 25mm from a corner/intersection before another corner/intersection/color code
  - [ ] line that end in a color must have a safe area with a diameter of 20mm starting from the end of the line
  - [ ] each side of a line must have at least 12mm of white space
  - [ ] corner minimum angel is 90deg
- algo: Ozobot constraints implemented for the maze to be solvable
  - [ ] Zigzag and Backwalk require at least 64mm after to pick up another color code
  - [ ] Line Switch Left/Right require a parallel line next to tit
  - [ ] Line Switch Straight requires a perpendicular line
  - [ ] color codes are 5mm x 5mm
  - [ ] curves must have a minimum diameter of 25mm
  - [ ] add a calibration circle to each maze: 39mm diameter

## Dependencies

- Hosted on [Vercel](https://vercel.com/)
- CSS made easy thanks to [TailwindCSS](https://tailwindcss.com/)
- Database by [Turso](https://turso.tech/)
- Auth by [Clerk](https://clerk.com/)
- ORM by [Drizzle](https://orm.drizzle.team/)
- Colors from [RealtimeColors](https://www.realtimecolors.com/?colors=def2e7-050e09-89ddb0-1f824d-2bd579&fonts=Poppins-Poppins)
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
