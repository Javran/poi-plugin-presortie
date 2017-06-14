class AllSlotsEmpty {
  static type = 'all-slots-empty'

  static defValue = {
    type: AllSlotsEmpty.type,
    method: {type: 'eq', value: 0},
    ignoreExtra: false,
    ignoreUnlocked: true,
  }
}

export {
  AllSlotsEmpty,
}
