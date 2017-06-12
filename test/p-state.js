import {
  updateSortieHistory,
} from '../p-state'

const assert = require('assert')

const spec = it

describe('p-state', () => {
  spec('updateSortieHistory', () => {
    assert.deepEqual(updateSortieHistory([],1), [1])
    {
      // expect it to return the same object.
      const xs = [11,21,31]
      assert.equal(updateSortieHistory(xs,11),xs)
    }

    // keep up to 5 objects
    assert.deepEqual(
      updateSortieHistory([1,2,3,4,5],6),
      [6,1,2,3,4])

    // update with an existing one simply brings it
    // to the front
    assert.deepEqual(
      updateSortieHistory([1,2,3,4,5],3),
      [3,1,2,4,5])
  })
})
