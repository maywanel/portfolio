declare module 'jquery' {
  interface RippleSurface {
    ripples(options: { resolution: number; dropRadius: number; perturbance: number; interactive: boolean; imageUrl: string }): RippleSurface;
    ripples(method: 'destroy' | 'pause' | 'play' | 'updateSize'): RippleSurface;
    ripples(method: 'set', name: 'imageUrl', value: string): RippleSurface;
    ripples(method: 'drop', x: number, y: number, radius: number, strength: number): RippleSurface;
  }
  const jquery: (element: HTMLElement) => RippleSurface;
  export default jquery;
}
declare module 'jquery.ripples';
