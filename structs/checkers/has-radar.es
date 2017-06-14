class HasRadar {
  static type = 'has-radar'

  static defValue = {
    type: HasRadar.type,
    method: {type: 'ge', value: 3},
  }

  static title = "Require Radars"
}

export {
  HasRadar,
}
