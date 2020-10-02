import { ICoordinates, IDirections } from "./utils"
import { NodeType, Node, INode } from "./node"
import {
  IUplinkConfig,
  QuadfallUplinkConfig,
  PuyoTsuConfig,
  PuyoTsuClassicConfig,
  PuyoFeverNormalConfig,
} from "./uplinkcfg"

export const UplinkConfigs = {
  Quadfall: QuadfallUplinkConfig,
  Puyo2: PuyoTsuConfig,
  Puyo2C: PuyoTsuClassicConfig,
  PuyoFeverN: PuyoFeverNormalConfig,
}

export { ICoordinates, IDirections, NodeType, Node, INode, IUplinkConfig }
