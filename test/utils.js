import {
  shallowObjectEqual,
  precompose,
  mergeResults,
} from '../utils'

const assert = require('assert')

const spec = it

describe('utils', () => {
  spec('shallowObjectEqual', () => {
    const test = (obj1,obj2,expected) =>
      assert.equal(shallowObjectEqual(obj1,obj2),expected)

    test(null,null,true)
    test(null,{},false)
    test(40,null,false)

    test({a: "aa"},{a: "aa"}, true)
    test({a: "aa", b: "cc"},{b: "cc", a: "aa"}, true)
    test({a: "aa", b: "cc"},{b: "cc", a: "aa1"}, false)
    test({a: "aa"},{a: "aa", b: 'cc'}, false)
    test({a: {a: 1}},{a: {a: 1}}, false)

    {
      const x = {a: 1}
      test({a: x, b: x}, {b: x, a: x}, true)
      test({a: {a: 1}, b: x}, {b: x, a: x}, false)
    }
  })

  spec('precompose', () => {
    const f = (a,b,c,d) => `${a}-${b}-${c}-${d}`
    const mul2 = x => x*2
    const plus10 = x => x+10
    assert.equal(precompose(mul2)(f)(1,2,3,4), '2-4-6-8')
    assert.equal(precompose(plus10)(f)(1,2,3,4), '11-12-13-14')
  })

  spec('mergeResults', () => {
    assert.deepEqual(
      mergeResults(
        x => ({x}),
        x => ({y: x+1}),
        (a,b) => ({a,b}))(10,20),
      {
        x: 10,
        y: 11,
        a: 10,
        b: 20,
      })
  })
})
