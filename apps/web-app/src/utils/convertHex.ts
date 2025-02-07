function componentToHex(c?: number) {
  const hex = c?.toString(16);

  return hex?.length === 1 ? `0${hex}` : hex;
}

export function rgbToHex(rgb: string) {
  const [r, g, b] = rgb
    .replace("rgb(", "")
    .replace(")", "")
    .split(",")
    .map(Number);

  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
