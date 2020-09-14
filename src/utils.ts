export interface Coordinates {
  x: number
  y: number
}

export enum Directions {
  UP = 1 << 0,
  RIGHT = 1 << 1,
  DOWN = 1 << 2,
  LEFT = 1 << 3,
}
