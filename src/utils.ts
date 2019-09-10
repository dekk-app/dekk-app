export const range = (n: number, start: number = 0): number[] => new Array(n).fill(Boolean).map((x, i) => i + start);
