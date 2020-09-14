import { strict as assert } from "assert"
import { Node, NodeType } from "../node"
import { Directions } from "../utils"

const testNode1 = new Node()

testNode1.type = NodeType.COLOR
testNode1.color = 0
const dirsArgs = [Directions.UP, Directions.RIGHT]
testNode1.connections = dirsArgs

assert.ok(testNode1.isColored())
assert.ok(!testNode1.isEmpty())
assert.deepStrictEqual(testNode1.connections, dirsArgs)
assert.strictEqual(testNode1.puyoShortCode, "R")

testNode1.type = NodeType.DUMP
testNode1.hardness = 1

assert.ok(!testNode1.isColored())
assert.ok(testNode1.isDumped())
assert.ok(testNode1.isHardDump())
assert.deepStrictEqual(testNode1.connections, [])
