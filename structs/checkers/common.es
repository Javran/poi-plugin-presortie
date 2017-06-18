class CheckMethod {
  static isValidInRange = (min=-Infinity,max=+Infinity) => obj =>
    ['lt','le','eq','ge','gt'].indexOf(obj.type) !== -1 &&
    typeof obj.value === 'number' &&
    min <= obj.value && obj.value <= max

  static describe = (() => {
    const table = {
      lt: '<',
      le: '≤',
      eq: '=',
      ge: '≥',
      gt: '>',
    }
    return cm => {
      const {type, value} = cm
      return `${table[type]} ${value}`
    }
  })()

  static toFunction = (() => {
    // this table is only meant for this function to use,
    // the flip of arguments is intentional, as it allows
    // the lhs value to be passed later.
    const funcTable = {
      lt: x => y => y < x,
      le: x => y => y <= x,
      eq: x => y => y === x,
      ge: x => y => y >= x,
      gt: x => y => y > x,
    }

    return cm => {
      const {type, value} = cm
      return funcTable[type](value)
    }
  })()
}

export {
  CheckMethod,
}
