export const positionToString = (x, y) => {
  let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  x = letters.charAt(x);

  return `[${x}:${y}]`;
}
