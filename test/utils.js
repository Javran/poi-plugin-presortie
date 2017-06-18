import {
  shallowObjectEqual,
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
    test({a: {a: 1}},{a: {a: 1}}, false)
  })
})
