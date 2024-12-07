const colors: string[] = [
  "#512b48",
  "#3f3169",
  "#c1add3",
  "#be92d3",
  "#7d5697",
  "#613875",
  "#4a3151",
  "#763e71",
  "#6d539d",
  "#7d4d9d",
  "#8c5aa1",
  "#9057be"
];

function hexToHSL(hex: string): [number, number, number] {
  let r = 0, g = 0, b = 0;
  if (hex.length == 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length == 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  r /= 255;
  g /= 255;
  b /= 255;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h: number = 0
  let s: number;
  let l: number = (max + min) / 2;
  if (max == min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h, s, l];
}

colors.sort((a: string, b: string) => {
  const hslA = hexToHSL(a);
  const hslB = hexToHSL(b);
  return hslA[0] - hslB[0];
});

console.log(colors);

// const purples = [ "#512b48", "#3f3169","#c1add3", "#be92d3","#7d5697","#613875", "#4a3151", "#763e71", "#6d539d", "#7d4d9d","#8c5aa1", "#9057be"];
// sorted purples: ['#3f3169', '#6d539d', '#c1add3', '#9057be', '#7d5697', '#7d4d9d', '#613875', '#be92d3', '#8c5aa1', '#4a3151', '#763e71', '#512b48']