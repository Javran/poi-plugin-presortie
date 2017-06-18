import { CheckMethod } from './common'

class LoS {
  static type = 'los'

  static defValue = {
    type: LoS.type,
    nodeFactor: 1,
    method: {type: 'ge', value: 33},
  }

  static title = "Line of Sight"

  static isValid = obj =>
    obj.type === LoS.type &&
    CheckMethod.isValidInRange(0,Infinity)(obj.method) &&
    (obj.nodeFactor >= 1 && obj.nodeFactor <= 4)

  static describe = obj => {
    const {method, nodeFactor} = obj
    return `Line of Sight (node factor: ${nodeFactor})` +
      ` ${CheckMethod.describe(method)}`
  }
}

export {
  LoS,
}
