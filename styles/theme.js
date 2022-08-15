const backgroundHue = 1 + Math.random() * (360 - 1);

export const theme = {
  source: '#f5f5f5',

  textColor: `hsl(${backgroundHue}, 100%, 20%)`,
  subTextColor: 'blue',
  hoverColor: 'red',
  backgroundColor: `hsl(${backgroundHue}, 30%, 80%)`,
  backgroundDarkerColor: 'orange',
  selectionColor: 'yellow',
};
