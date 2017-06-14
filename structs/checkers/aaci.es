class AACI {
  static type = 'aaci'

  static defValue = {
    type: AACI.type,
    method: {type: 'ge', value: 1},
  }

  static title = "Anti-Air Cut-In"
}

export {
  AACI,
}
