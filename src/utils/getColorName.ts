// ----------------------------------------------------------------------

export default function getColorName(hex: string) {
  let color;

  switch (hex) {
    case '#00AB55':
      color = 'Green';
      break;
    case '#000000':
      color = 'Black';
      break;
    case '#FFFFFF':
      color = 'White';
      break;
    case '#FFC0CB':
      color = 'Pink';
      break;
    case '#FF4842':
      color = 'Red';
      break;
    case '#1890FF':
      color = 'Blue';
      break;
    case '#94D82D':
      color = 'Greenyellow';
      break;
    case '#FFC107':
      color = 'Orange';
      break;
    default:
      color = hex;
  }

  return color;
}


export function getRandomExtremelyLightColor() {
  const r = Math.floor(Math.random() * 26 + 230); // Red: 230-255
  const g = Math.floor(Math.random() * 26 + 230); // Green: 230-255
  const b = Math.floor(Math.random() * 26 + 230); // Blue: 230-255

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}