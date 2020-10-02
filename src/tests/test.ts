import { strict as assert } from "assert"
import { Node, NodeType, DefaultNode } from "../node"
import { IDirections } from "../utils"
import { IUplinkConfig, PuyoFeverNormalConfig, PuyoTsuConfig } from "../uplinkcfg"

let testCount = 0
function testInfo(testName: string) {
  testCount++
  console.log(`Test #${testCount}: ${testName}`)
}

testInfo("Puyo Test")

const testNode1 = DefaultNode

testNode1.type = NodeType.COLOR
testNode1.color = 0
const dirsArgs = [IDirections.UP, IDirections.RIGHT]
testNode1.connections = dirsArgs

assert.ok(Node.isColored(testNode1))
assert.ok(!Node.isEmpty(testNode1))
assert.deepStrictEqual(testNode1.connections, dirsArgs)
assert.strictEqual(Node.getShortCodePuyo(testNode1), "R")

Node.setShortCodePuyo(testNode1, "P")
const dirsArgs2 = [IDirections.DOWN, IDirections.LEFT]
testNode1.connections = dirsArgs2

assert.ok(Node.isColored(testNode1))
assert.ok(!Node.isEmpty(testNode1))
assert.deepStrictEqual(testNode1.connections, dirsArgs2)
assert.strictEqual(Node.getShortCodePuyo(testNode1), "P")

testNode1.type = NodeType.DUMP
testNode1.hardness = 1

assert.ok(!Node.isColored(testNode1))
assert.ok(Node.isDumped(testNode1))
assert.ok(Node.isHardDump(testNode1))
assert.deepStrictEqual(Node.getConnections(testNode1), [])

console.log("Pass!")

testInfo("Scoring Test")

const testConfigTsu: IUplinkConfig = PuyoTsuConfig

assert.strictEqual(testConfigTsu.uplinkPower(1), 0)
assert.strictEqual(testConfigTsu.uplinkPower(3), 16)
assert.strictEqual(testConfigTsu.uplinkPower(6), 96)

assert.strictEqual(testConfigTsu.score(4, 0, 0, 0, 0), 40)
assert.strictEqual(testConfigTsu.score(4, 500, 300, 200, 0), 39960)

const testConfigFever: IUplinkConfig = PuyoFeverNormalConfig

/** Fever chain power table. Amitie's data from 20th Anniversary will be used.
 * Since chains are one-indexed, table is offset.
 */
const feverPowerArgs: number[] = [
  0,
  0,
  8,
  17,
  22,
  34,
  67,
  112,
  168,
  224,
  280,
  350,
  420,
  490,
  560,
  630,
  699,
  699,
  699,
  699,
]

assert.strictEqual(testConfigFever.uplinkPower(1, feverPowerArgs), feverPowerArgs[1])
assert.strictEqual(testConfigFever.uplinkPower(3, feverPowerArgs), feverPowerArgs[3])
assert.strictEqual(testConfigFever.uplinkPower(6, feverPowerArgs), feverPowerArgs[6])
assert.strictEqual(testConfigFever.uplinkPower(24, feverPowerArgs), feverPowerArgs[19])

console.log("Pass!")
