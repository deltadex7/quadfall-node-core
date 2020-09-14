/**
 * @packageDocumentation
 * Node, a single data unit in the Uplink ecosystem. When node is colored,
 * it will connect with similarly colored node. Once the connection limit
 * is reached (default is 4), the nodes are marked for erase and uplink (chain)
 * is made.
 *
 * "Node" is Quadfall term for Puyo.
 */

import { Coordinates, Directions } from "./utils"

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
  /** Power node which boosts output when erased. May contain items. */
  POWER,
  /** Heavily damaged node that cannot be fixed or erased. */
  CORRUPT,
  /** Solid barrier that is not affected by gravity. */
  BLOCK,
}

/**
 * A single unit element representation of Node.
 */
export class Node {
  /** Node type. */
  type: NodeType = NodeType.NONE

  /** Node color.
   *
   * Applies only when [[type]] is [[NodeType.COLOR]]
   *
   * Common convention follows Puyo Puyo color cycle:
   * * Red = 0
   * * Green = 1
   * * Blue = 2
   * * Yellow = 3
   * * Purple = 4
   *
   * More colors may be specified independently from here.
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

  /** A mark of node to be removed/erased */
  erase: boolean = false

  /** An item associated with the node.
   *
   * Effective only when [[type]] is [[NodeType.POWER]]
   */
  item: string = ""

  /** Current position of the node. */
  coords: Coordinates = { x: 0, y: 0 }

  /** Next position of the node, used to handle animations. */
  nextCoords: Coordinates = { x: this.coords.x, y: this.coords.y }

  /** Bitfield that takes [[Directions]] to connected nodes.
   * Not exposed by default.
   */
  private connected: number = 0

  /**
   * Check if the node is empty.
   *
   * @returns Is the node type empty?
   */
  isEmpty(): boolean {
    return this.type === NodeType.NONE
  }

  /**
   * Check if the node is colored.
   *
   * @returns Is the node type a color node?
   */
  isColored(): boolean {
    return this.type === NodeType.COLOR
  }

  /**
   * Check if the node is a dump/garbage.
   *
   * @returns Is the node type a dump?
   */
  isDumped(): boolean {
    return this.type === NodeType.DUMP
  }

  /**
   * Check if the node is a hard dump/garbage.
   *
   * @returns Is it a dump node and has hardness value above zero?
   */
  isHardDump(): boolean {
    return this.isDumped() && this.hardness > 0
  }

  /**
   * Check if the node is frozen.
   *
   * @returns Is node's freeze value above zero?
   */
  isFrozen(): boolean {
    return this.freeze > 0
  }

  /**
   * Check if the node is corrupted.
   *
   * @returns Is the node type corrupt?
   */
  isCorrupted(): boolean {
    return this.type === NodeType.CORRUPT
  }

  /**
   * Check if the node is actually a block.
   *
   * @returns Is the node type a block?
   */
  isBlock(): boolean {
    return this.type === NodeType.BLOCK
  }

  /**
   * Check if the node is a power node.
   *
   * @returns Is the node type power and has no associated item?
   */
  isPower(): boolean {
    return this.type === NodeType.POWER && this.item === ""
  }

  /**
   * Check if the node is an item node.
   *
   * @returns Is the node type power and has any associated item?
   */
  isItem(): boolean {
    return this.type === NodeType.POWER && this.item !== ""
  }

  /** Get a fully mapped direction of where the node connects to. */
  get connections(): Directions[] {
    const dirs: Directions[] = []

    // Only connect if it's a color node
    if (this.isColored()) {
      if (this.connected & Directions.UP) dirs.push(Directions.UP)
      if (this.connected & Directions.DOWN) dirs.push(Directions.DOWN)
      if (this.connected & Directions.LEFT) dirs.push(Directions.LEFT)
      if (this.connected & Directions.RIGHT) dirs.push(Directions.RIGHT)
    }

    return dirs
  }

  /** Set a direction map of where the node connects to.
   *
   * @param val Map of directions
   */
  set connections(val: Directions[]) {
    val.map((dir) => (this.connected |= dir))
  }

  /**
   * Single-character node value under Puyo Puyo convention.
   *
   * There are limitations when using this:
   * * Only 5 colors are supported.
   * * Item nodes will be treated as Power (Sun) nodes
   *
   * Refer to
   * [@S2LSOFTENER's documentation](https://github.com/s2lsoftener/s2-puyosim-core/blob/master/src/Puyo.ts#L1)
   * for details.
   *
   * @returns Single character string representing a node.
   */
  get puyoShortCode(): string {
    switch (this.type) {
      case NodeType.COLOR:
        switch (this.color) {
          case 0:
            return "R"
          case 1:
            return "G"
          case 2:
            return "B"
          case 3:
            return "Y"
          case 4:
            return "P"
          default:
            return "0"
        }
      case NodeType.DUMP:
        if (this.hardness > 0) return "H"
        else if (this.point > 0) return "N"
        else return "J"
      case NodeType.POWER:
        return "S"
      case NodeType.BLOCK:
        return "L"
      case NodeType.CORRUPT:
        return "T"
      case NodeType.NONE:
      default:
        return "0"
    }
  }
}
