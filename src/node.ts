/**
 * @packageDocumentation
 * Node, a single data unit in the Uplink ecosystem.
 */

import { Coordinates } from "./utils"

/** Types of Node */
export enum NodeType {
  /** No node. */
  NONE,
  /** Active node with assignable color. */
  COLOR,
  /** Dumped/garbage node with
   * optional hardness value and points when erased.
   * */
  DUMP,
  /** Power node which boosts output when erased. */
  POWER,
  /** Heavily damaged node that cannot be fixed or erased. */
  CORRUPT,
  /** Solid barrier that is not affected by gravity. */
  BLOCK,
}

/**
 * A single unit element representation of Node
 */
export class Node {
  /** Node type. */
  type: NodeType = NodeType.NONE

  /** Node color.
   *
   * Applies only when [[type]] is [[NodeType.COLOR]]
   */
  color: number = 0

  /** Freeze timer for this node. */
  freeze: number = 0

  /** Hardness of dumps.
   *
   * Effective only when [[type]] is [[NodeType.DUMP]].
   */
  hardness: number = 0

  /** Value of node if it's deleted.
   *
   * Works like Point Puyo when [[type]] is [[NodeType.DUMP]].
   */
  point: number = 10

  coords: Coordinates = { x: 0, y: 0 }

  nextCoords: Coordinates = { x: this.coords.x, y: this.coords.y }

  isColored(): boolean {
    return this.type === NodeType.COLOR
  }

  static isColored(n: Node): boolean {
    return n.isColored()
  }

  isDumped(): boolean {
    return this.type === NodeType.DUMP
  }

  isHardDump(): boolean {
    return this.isDumped() && this.hardness > 0
  }

  isFrozen(): boolean {
    return this.freeze > 0
  }
}
