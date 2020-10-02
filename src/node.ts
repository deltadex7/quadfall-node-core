/**
 * @packageDocumentation
 * Node, a single data unit in the Uplink ecosystem. When node is colored,
 * it will connect with similarly colored node. Once the connection limit
 * is reached (default is 4), the nodes are marked for erase and uplink (chain)
 * is made.
 *
 * "Node" is Quadfall term for Puyo.
 */

import { ICoordinates, IDirections } from "./utils"

/**
 * Single-character node value under Puyo Puyo convention.
 *
 * Refer to
 * [@S2LSOFTENER's documentation](https://github.com/s2lsoftener/s2-puyosim-core/blob/master/src/Puyo.ts#L1)
 * for details.
 */
declare type ShortCodePuyo = "R" | "G" | "B" | "Y" | "P" | "0" | "H" | "N" | "J" | "S" | "L" | "T"

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

export const DefaultNode: INode = {
  type: NodeType.COLOR,
  color: 0,
  freeze: 0,
  hardness: 0,
  point: 0,
  erase: false,
  item: "",
  coords: { x: 0, y: 0 },
  nextCoords: { x: 0, y: 0 },
  connections: [],
}

export interface INode {
  /** Node type. */
  type: NodeType

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
  color: number

  /** Freeze timer for this node. */
  freeze: number

  /** Hardness of dumps.
   *
   * Effective only when [[type]] is [[NodeType.DUMP]].
   */
  hardness: number

  /** Value of node if it's deleted.
   *
   * Works like Point Puyo when [[type]] is [[NodeType.DUMP]].
   */
  point: number

  /** A mark of node to be removed/erased */
  erase: boolean

  /** An item associated with the node.
   *
   * Effective only when [[type]] is [[NodeType.POWER]]
   */
  item: string

  /** Current position of the node. */
  coords: ICoordinates

  /** Next position of the node, used to handle animations. */
  nextCoords: ICoordinates

  /** A map of [[Directions]] to connected nodes.
   */
  connections: IDirections[]
}

/**
 * A helper class to help manage [[INode]].
 */
export class Node {
  /**
   * Check if the node is empty.
   *
   * @returns Is the node type empty?
   */
  static isEmpty(n: INode): boolean {
    return n.type === NodeType.NONE
  }

  /**
   * Check if the node is colored.
   *
   * @returns Is the node type a color node?
   */
  static isColored(n: INode): boolean {
    return n.type === NodeType.COLOR
  }

  /**
   * Check if the node is a dump/garbage.
   *
   * @returns Is the node type a dump?
   */
  static isDumped(n: INode): boolean {
    return n.type === NodeType.DUMP
  }

  /**
   * Check if the node is a hard dump/garbage.
   *
   * @returns Is it a dump node and has hardness value above zero?
   */
  static isHardDump(n: INode): boolean {
    return Node.isDumped(n) && n.hardness > 0
  }

  /**
   * Check if the node is frozen.
   *
   * @returns Is node's freeze value above zero?
   */
  static isFrozen(n: INode): boolean {
    return n.freeze > 0
  }

  /**
   * Check if the node is corrupted.
   *
   * @returns Is the node type corrupt?
   */
  static isCorrupted(n: INode): boolean {
    return n.type === NodeType.CORRUPT
  }

  /**
   * Check if the node is actually a block.
   *
   * @returns Is the node type a block?
   */
  static isBlock(n: INode): boolean {
    return n.type === NodeType.BLOCK
  }

  /**
   * Check if the node is a power node.
   *
   * @returns Is the node type power and has no associated item?
   */
  static isPower(n: INode): boolean {
    return n.type === NodeType.POWER && n.item === ""
  }

  /**
   * Check if the node is an item node.
   *
   * @returns Is the node type power and has any associated item?
   */
  static isItem(n: INode): boolean {
    return n.type === NodeType.POWER && n.item !== ""
  }

  /** Get a fully mapped direction of where the node connects to. */
  static getConnections(n: INode): IDirections[] {
    // Only connect if it's a color node
    if (Node.isColored(n)) {
      return n.connections
    }

    return []
  }

  /**
   * Gets the shortcode compatible with Puyo Puyo
   *
   * There are limitations when using this:
   * * Only 5 colors are supported.
   * * Item node will be treated as Power node (Sun Puyo)
   *
   * @returns Single character string representing a node in Puyo standard.
   */
  static getShortCodePuyo(n: INode): ShortCodePuyo {
    switch (n.type) {
      case NodeType.COLOR:
        switch (n.color) {
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
        if (n.hardness > 0) return "H"
        else if (n.point > 0) return "N"
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

  static setShortCodePuyo(n: INode, val: string): void {
    // Ensures that the first character is read rather than the whole string
    switch (val.charAt(0)) {
      case "R":
        n.type = NodeType.COLOR
        n.color = 0
        break
      case "G":
        n.type = NodeType.COLOR
        n.color = 1
        break
      case "B":
        n.type = NodeType.COLOR
        n.color = 2
        break
      case "Y":
        n.type = NodeType.COLOR
        n.color = 3
        break
      case "P":
        n.type = NodeType.COLOR
        n.color = 4
        break
      case "J":
        n.type = NodeType.DUMP
        n.hardness = 0
        break
      case "H":
        n.type = NodeType.DUMP
        n.hardness = 1
        break
      case "N":
        n.type = NodeType.DUMP
        n.hardness = 0
        n.point = 50 // default value of Point Puyo
        break
      case "T":
        n.type = NodeType.CORRUPT
        break
      case "S":
        n.type = NodeType.POWER
        break
      case "L":
        n.type = NodeType.BLOCK
        break
      case "0":
      default:
        n.type = NodeType.NONE
    }
  }
}
