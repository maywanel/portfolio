// Dense, overlapping ink samples deform as a continuous surface, never scattered particles.
type Ink = { x: number; y: number; r: number; g: number; b: number };

export async function prepareIntroMorph(canvas: HTMLCanvasElement, name: HTMLElement, logo: HTMLImageElement) {
  await Promise.all([document.fonts.ready, logo.decode()]);
  const width = 800;
  const height = 440;
  const buffer = document.createElement('canvas');
  buffer.width = width;
  buffer.height = height;
  const ctx = buffer.getContext('2d', { willReadFrequently: true });
  const output = canvas.getContext('2d');
  if (!ctx || !output) return null;
  // Keep logical coordinates stable while rendering at the display's pixel density.
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 3);
  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  output.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  const sample = (): Ink[] => {
    const pixels = ctx.getImageData(0, 0, width, height).data;
    const ink: Ink[] = [];
    for (let x = 0; x < width; x += 1) {
      for (let y = 0; y < height; y += 1) {
        const i = (y * width + x) * 4;
        if (pixels[i + 3] > 100 && Math.max(pixels[i], pixels[i + 1], pixels[i + 2]) > 155) {
          ink.push({ x, y, r: pixels[i], g: pixels[i + 1], b: pixels[i + 2] });
        }
      }
    }
    return ink;
  };
  const family = getComputedStyle(name).fontFamily;
  ctx.font = `600 64px ${family}`;
  ctx.textBaseline = 'middle';
  const first = 'Mohamed ';
  const second = 'El Messaadi';
  const textWidth = ctx.measureText(first + second).width;
  const x = (width - textWidth) / 2;
  ctx.fillStyle = '#fffaf0';
  ctx.fillText(first, x, height / 2);
  ctx.fillStyle = '#e7ba64';
  ctx.fillText(second, x + ctx.measureText(first).width, height / 2);
  const source = sample();
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(logo, 90, 13, 620, 414);
  const target = sample();
  if (!source.length || !target.length) return null;
  const count = Math.min(36000, Math.max(source.length, target.length));
  return (progress: number) => {
    output.clearRect(0, 0, width, height);
    const t = progress * progress * (3 - 2 * progress);
    const flow = Math.sin(t * Math.PI);
    // Begin with actual antialiased glyphs; blend into the deforming ink surface.
    const inkOpacity = Math.min(1, progress / .16);
    output.globalAlpha = 1 - inkOpacity;
    output.font = `600 64px ${family}`;
    output.textBaseline = 'middle';
    output.fillStyle = '#fffaf0';
    output.fillText(first, x, height / 2);
    output.fillStyle = '#e7ba64';
    output.fillText(second, x + ctx.measureText(first).width, height / 2);
    output.globalAlpha = inkOpacity;
    for (let i = 0; i < count; i++) {
      const a = source[Math.floor(i * source.length / count)];
      const b = target[Math.floor(i * target.length / count)];
      const px = a.x + (b.x - a.x) * t;
      const py = a.y + (b.y - a.y) * t + Math.sin(a.x / width * Math.PI * 2) * flow * 36;
      output.fillStyle = `rgb(${Math.round(a.r + (b.r - a.r) * t)} ${Math.round(a.g + (b.g - a.g) * t)} ${Math.round(a.b + (b.b - a.b) * t)})`;
      output.fillRect(px - .9, py - .9, 1.8, 1.8);
    }
    output.globalAlpha = 1;
  };
}
