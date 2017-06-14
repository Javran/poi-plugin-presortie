class CheckMethod {
  static isValidInRange = (min=-Infinity,max=+Infinity) => obj =>
    ['le','eq','ge'].indexOf(obj.type) !== -1 &&
    typeof obj.value === 'number' &&
    min <= obj.value && obj.value <= max
}

export {
  CheckMethod,
}
