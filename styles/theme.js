const Hue = 1 + Math.random() * (360 - 1);

export const theme = {
  textColor: `hsl(${Hue}, 100%, 20%)`,
  hoverColor: `hsl(${Hue}, 100%, 30%)`,
  backgroundColor: `hsl(${Hue}, 30%, 80%)`,
  subTextColor: 'blue',
  selectionColor: 'yellow',
};
