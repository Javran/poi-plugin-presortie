import { CheckMethod } from '../../../structs/checkers/common'

const assert = require('assert')

const spec = it

describe('CheckMethod', () => {
  spec('tests', () => {
    // example: test(1, 'gt', 2, 1 >= 2)
    const test = (x, typ, y, expected) =>
      assert.equal(
        CheckMethod.toFunction({type: typ, value: y})(x),
        expected)

    // just need a small matrix to expose the problem, if any.
    const batchTest = (typ, func) => {
      for (let x=0; x<5; ++x)
        for (let y=0; y<5; ++y)
          test(x,typ,y, func(x,y))
    }

    batchTest('lt', (x,y) => x < y)
    batchTest('le', (x,y) => x <= y)
    batchTest('eq', (x,y) => x === y)
    batchTest('ge', (x,y) => x >= y)
    batchTest('gt', (x,y) => x > y)
  })
})
