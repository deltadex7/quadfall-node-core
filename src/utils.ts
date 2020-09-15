/**
 * @packageDocumentation
 *
 * Utilities, holds necessary helper functions that may me used throughout
 * the package. May not necessarily be exported to the main entry point.
 */

export interface ICoordinates {
  x: number
  y: number
}

export enum IDirections {
  UP = 1 << 0,
  RIGHT = 1 << 1,
  DOWN = 1 << 2,
  LEFT = 1 << 3,
}
