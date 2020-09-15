import { strict as assert } from "assert"
import { Node, NodeType } from "../node"
import { IDirections } from "../utils"

const testNode1 = new Node()

testNode1.type = NodeType.COLOR
testNode1.color = 0
const dirsArgs = [IDirections.UP, IDirections.RIGHT]
testNode1.connections = dirsArgs

assert.ok(Node.isColored(testNode1))
assert.ok(!Node.isEmpty(testNode1))
assert.deepStrictEqual(testNode1.connections, dirsArgs)
assert.strictEqual(testNode1.shortCodePuyo, "R")

testNode1.shortCodePuyo = "P"
const dirsArgs2 = [IDirections.DOWN, IDirections.LEFT]
testNode1.connections = dirsArgs2

assert.ok(Node.isColored(testNode1))
assert.ok(!Node.isEmpty(testNode1))
assert.deepStrictEqual(testNode1.connections, dirsArgs2)
assert.strictEqual(testNode1.shortCodePuyo, "P")

testNode1.type = NodeType.DUMP
testNode1.hardness = 1

assert.ok(!Node.isColored(testNode1))
assert.ok(Node.isDumped(testNode1))
assert.ok(Node.isHardDump(testNode1))
assert.deepStrictEqual(testNode1.connections, [])

console.log("Pass!")
