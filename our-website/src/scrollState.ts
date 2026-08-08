/**
 * Mutable state shared between the DOM scroll engine and the 3D canvas.
 * Updated every scroll frame; read directly inside useFrame (no re-renders).
 */
export interface ScrollState {
  /** Global scroll progress 0..1 across the whole page */
  progress: number;
  /** 0..1 progress within the currently active section */
  local: number;
  /** DOM section index (0 = hero, 1..12 = regions, 13 = finale) */
  active: number;
  /** Damped model rotation Y, published by the camera rig for the model to follow */
  rotY: number;
}

export const scrollState: ScrollState = {
  progress: 0,
  local: 0,
  active: 0,
  rotY: 0,
};
