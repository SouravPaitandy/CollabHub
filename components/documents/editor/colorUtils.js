// Pastel colors for user cursors
const colors = [
  "#ffb3ba",
  "#ffdfba",
  "#ffffba",
  "#baffc9",
  "#bae1ff",
  "#c9baff",
  "#ffbaed",
];

// Darker colors for dark mode
const darkModeColors = [
  "#8a0f1b", // Dark pink
  "#8a510f", // Dark orange/peach
  "#8a8a0f", // Dark yellow
  "#0f8a2a", // Dark green
  "#0f548a", // Dark blue
  "#2a0f8a", // Dark purple
  "#8a0f6a", // Dark magenta
];

export const getRandomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

export const getRandomDarkColor = () => {
  return darkModeColors[Math.floor(Math.random() * darkModeColors.length)];
};

export const createUserData = (session) => {
  if (!session?.user) return null;
  return {
    name: session.user.name || "Anonymous",
    color: getRandomColor(),
    avatar: session.user.image,
  };
};