/**
 * @packageDocumentation
 *
 * Configurations for Uplink system, set of rules and behaviors that can be
 * applied to the mix.
 *
 * Essentially, this is a set of gamerule templates that you can use.
 *
 * For more information on Puyo Puyo scoring, see the
 * [Puyo Nexus Wiki](https://puyonexus.com/wiki/Scoring).
 */

/**
 * Function that determines the uplink (chain) behavior.
 *
 * @param n Value passed for the function
 * @param args Arguments that will determine the behavior of the function
 */
declare type UplinkFunction = (n: number, args?: number[]) => number

/**
 * @internal
 * Returns the value within bounds of the array.
 *
 * @param i Index to be retrieved
 * @param arr Array of a specific type
 */
function limitToArray<T>(i: number, arr: T[]): T {
  // if (i < 0) return arr[0]
  // else if (i >= arr.length) return arr[length - 1]
  // else return arr[i]
  //
  // Above expression is shortened to this.
  return arr[minMax(0, arr.length - 1, i)]
}

/**
 * @internal
 * Bound a value between minimum and maximum value
 *
 * @param min Minimum value
 * @param max Maximum value
 * @param value Numeric expression to be evaluated
 */
function minMax(min: number, max: number, value: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Structure for Uplink system configuration or "gamerule".
 */
export interface IUplinkConfig {
  /** Width of the game board. */
  rows: number
  /** Visible height of the game board. */
  columns: number
  /** Additional height, may or may not interact with visible board. */
  extraRows: number
  /** Conversion ratio of points to dump. */
  targetPoint: number
  /** Amount of nodes to link to create an uplink (chain). */
  linkSize: number
  /** Default score for dump nodes that has point value. */
  dumpPoints: number
  /** Behavior when dump is erased in hidden rows.
   *
   * * "Modern" means yes, erase it.
   * * "Classic" means no, don't erase it when it is located in hidden rows.
   */
  dumpBehaviorOnHidden: "modern" | "classic"
  /** Uplink (chain) power table or function. */
  uplinkPower: UplinkFunction
  /** Uplink (chain) size bonus function.
   * In Puyo Puyo, this is called "Group Bonus".
   */
  uplinkSizeBonus: UplinkFunction
  /** Uplink (chain) group bonus function.
   * In Puyo Puyo, this is called "Color Bonus".
   */
  uplinkGroupBonus: UplinkFunction
  /** Function to calculate score.
   */
  score: (
    size: number,
    power: number,
    sizeBonus: number,
    groupBonus: number,
    pointBonus: number
  ) => number
}

export const PuyoTsuConfig: IUplinkConfig = {
  rows: 12,
  columns: 6,
  extraRows: 1,
  targetPoint: 70,
  linkSize: 4,
  dumpPoints: 50,
  dumpBehaviorOnHidden: "modern",
  /** Puyo Tsu Chain Power in algorithmic manner,
   * supports chains over 24.
   */
  uplinkPower: (n) => {
    if (n < 2) return 0
    else if (n < 5) return 2 ** (n + 1)
    else return 32 * (n - 3)
  },
  /** Puyo Tsu Group Bonus in algorithmic manner,
   * supports bonuses over 10.
   */
  uplinkSizeBonus: (n) => {
    const mod = () => {
      if (n < 1) return 0
      else if (n < 7) return 1
      else return 3
    }
    return n + mod()
  },
  /** Puyo Tsu Color bonus in algorithmic manner,
   * supports bonuses over 5.
   */
  uplinkGroupBonus: (n) => {
    if (n < 1) return 0
    else return 3 ** (n - 1)
  },
  score: (n, a, b, c, p) => {
    // Bounds the output from 1 to 999
    return (10 * n + p) * minMax(1, 999, a + b + c)
  },
}

export const PuyoTsuClassicConfig: IUplinkConfig = {
  ...PuyoTsuConfig,
  dumpBehaviorOnHidden: "classic",
}

export const QuadfallUplinkConfig: IUplinkConfig = {
  ...PuyoTsuConfig,
  uplinkSizeBonus: (n, arg) => {
    if (!arg) {
      throw new Error("Size bonus argument is not specified.")
    }
    const baseMult = arg[0] - 1
    return 1 + n * baseMult
  },
  uplinkGroupBonus: (n, arg) => {
    if (!arg) {
      throw new Error("Group bonus argument is not specified.")
    }
    const baseMult = arg[0] - 1
    return 1 + n * baseMult
  },
  score: (n, a, b, c, p) => {
    return (10 * n + p) * Math.floor(a * b * c)
  },
}

export const PuyoFeverNormalConfig: IUplinkConfig = {
  ...PuyoTsuConfig,
  targetPoint: 120,
  uplinkPower: (n, powerTable) => {
    if (!powerTable) {
      throw new Error("Power table is not given.\nWho are you, player?")
    }
    return limitToArray(n, powerTable)
  },
  /** Puyo Fever Group Bonus */
  uplinkSizeBonus: (n) => {
    const mod = () => {
      if (n < 1) return 0
      else if (n < 7) return 0
      else return 2
    }
    return n + mod()
  },
  /** Puyo Fever Color bonus */
  uplinkGroupBonus: (n) => {
    if (n < 1) return 0
    else return 2 ** (n - 1)
  },
}
