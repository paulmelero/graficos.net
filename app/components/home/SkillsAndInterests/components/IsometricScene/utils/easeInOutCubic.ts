/**
 * @see https://github.com/AndrewRayCode/easing-utils/blob/master/src/easing.js
 */
export function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
}
