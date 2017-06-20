class ExtraSlots {
  static type = 'extra-slots'

  static defValue = {
    type: ExtraSlots.type,
  }

  static title = "Extra Slots"

  static isValid = obj =>
    obj.type === ExtraSlots.type

  static describe = () =>
    "All openned extra slots should be equipped"

}

export {
  ExtraSlots,
}
