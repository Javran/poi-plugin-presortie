class FastFleet {
  static type = 'fast-fleet'

  static defValue = {
    type: FastFleet.type,
  }

  static title = "Require Fast Fleet"

  static isValid = obj =>
    obj.type === FastFleet.type
}

export {
  FastFleet,
}
