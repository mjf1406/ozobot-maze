"use client";

import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";

interface MazeLoadingProps {
  className?: string;
}

const mazeMessages = [
  "Drawing your path...✨",
  "Twisting and turning...🌀",
  "Almost there—no dead ends, we promise! 🚧",
  "Loading fun in 3... 2... 1... 🎉",
  "The maze is waking up...💤",
  "Get ready to solve me! 🔍",
  "Building Ozobot’s playground... 🤖",
  "Hope you're feeling adventurous! 🗺️",
  "Will you find the way out? 🔄",
  "Left, right... or both? 🤔",
  "Sneaky paths loading... 😏",
  "This way or that way? 🤷",
  "Somewhere in here is the exit! 🚪",
  "Mind-bending turns coming right up... 🧩",
  "Warning: May contain twisty challenges! ⚠️",
  "How fast can you finish? 🏁",
  "Lost already? We haven't even started! 😂",
  "The maze knows no mercy... 🌀",
  "Hope you brought a map! 🗺️",
  "Maze in progress... buckle up! 🎢",
  "Building shortcuts and secrets... 🕵️",
  "This way to funville! 🎠",
  "Prepare for a-maze-ing adventures! 🌟",
  "Don't worry, Ozobot won't get lost! 🤖",
  "Plotting tricky paths... 🧭",
  "Just a few more twists... 🔄",
  "Surprise corners ahead! 🎁",
  "No peeking—greatness in progress! 👀",
  "Unravel the mystery... soon! 🧶",
  "Keep calm and follow the path... 📍",
  "Who needs GPS anyway? 🚗",
  "Left, right, and loop-de-loop! 🔃",
  "Maze-masters at work... 🛠️",
  "Will you escape in record time? ⏱️",
  "Maze ahead: Watch your step! 🚶",
  "This is just the beginning... 🌌",
  "You're one step closer to fun! 👣",
  "Patience, hero—adventure awaits! ⚔️",
  "The path will reveal itself... soon. 🌠",
  "Careful—this maze bites! 🐍",
  "Generating epic turns... 💫",
  "Your next puzzle piece is almost ready! 🧩",
  "Building Ozobot's mini labyrinth... 🎇",
  "Path planning in progress... 🛤️",
  "A-maze yourself today! 😄",
  "Almost ready—prepare for awesomeness! 🌈",
  "Magic in the making... ✨",
  "Patience, traveler, your maze is near... 🚶‍♂️",
  "Gearing up for twists and thrills! ⚙️",
  "This maze is no ordinary challenge! 🎯",
];

const MazeLoading = ({ className }: MazeLoadingProps) => {
  const [message, setMessage] = useState(mazeMessages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomMessage =
        mazeMessages[Math.floor(Math.random() * mazeMessages.length)];
      setMessage(randomMessage);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-8 flex w-full max-w-xl flex-col items-center justify-center gap-10 rounded-lg bg-white p-5">
      <div className={cn("h-32 w-32", className)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#eee"
                stroke-width="1"
              />
            </pattern>
          </defs>
          <rect width="200" height="200" fill="url(#grid)" />

          <path
            d="M 0 80 L 80 80 L 80 120 L 160 120"
            fill="none"
            stroke="#3b82f6"
            stroke-width="8"
            stroke-linecap="round"
          >
            <animate
              attributeName="stroke-dasharray"
              from="320 320"
              to="0 320"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>

          <path
            d="M 40 0 L 40 40 L 120 40 L 120 160"
            fill="none"
            stroke="#3b82f6"
            stroke-width="8"
            stroke-linecap="round"
          >
            <animate
              attributeName="stroke-dasharray"
              from="360 360"
              to="0 360"
              dur="2s"
              begin="0.5s"
              repeatCount="indefinite"
            />
          </path>

          <path
            d="M 160 0 L 160 80 L 200 80"
            fill="none"
            stroke="#3b82f6"
            stroke-width="8"
            stroke-linecap="round"
          >
            <animate
              attributeName="stroke-dasharray"
              from="160 160"
              to="0 160"
              dur="2s"
              begin="1s"
              repeatCount="indefinite"
            />
          </path>

          <circle cx="0" cy="0" r="6" fill="#ef4444">
            <animateMotion
              path="M 0 80 L 80 80 L 80 120 L 160 120 M 40 0 L 40 40 L 120 40 L 120 160 M 160 0 L 160 80 L 200 80"
              dur="4s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>
      <p className="-mt-10 text-center text-lg font-semibold">{message}</p>
    </div>
  );
};

export default MazeLoading;
