import { strict as assert } from "assert"
import { Node, NodeType } from "../node"
import { Directions } from "../utils"

const testNode1 = new Node()

testNode1.type = NodeType.COLOR
testNode1.color = 0

assert.strictEqual(testNode1.isColored(), true)

testNode1.connections = [Directions.UP, Directions.RIGHT]
assert.strictEqual(testNode1.connected, Directions.UP | Directions.RIGHT)
