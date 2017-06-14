class FighterPower {
  static type = 'fighter-power'

  static defValue = {
    type: FighterPower.type,
    method: {type: 'ge', value: 350},
  }

  static title = "Fighter Power"
}

export {
  FighterPower,
}
