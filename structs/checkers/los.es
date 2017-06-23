import { CheckMethod } from './common'
import {
  sakuSelectorFactoryWithNodeFactor,
} from './selectors'

class LoS {
  static type = 'los'

  static defValue = {
    nodeFactor: 1,
    method: {type: 'ge', value: 33},
  }

  static title = "Line of Sight"

  static isValid = obj =>
    CheckMethod.isValidInRange(0,Infinity)(obj.method) &&
    (obj.nodeFactor >= 1 && obj.nodeFactor <= 4)

  static describe = obj => {
    const {method, nodeFactor} = obj
    return `Line of Sight (node factor: ${nodeFactor})` +
      ` ${CheckMethod.describe(method)}`
  }

  static prepare = checker => {
    const {method, nodeFactor} = checker
    const satisfy = CheckMethod.toFunction(method)
    const sakuSelectorFactory = sakuSelectorFactoryWithNodeFactor(nodeFactor)
    return checkerContext => {
      const { fleetId } = checkerContext
      const fleetInd = fleetId-1
      const saku = sakuSelectorFactory(fleetInd)(checkerContext)
      return satisfy(saku.total) ? [] : [`Current LoS is ${saku.total}`]
    }
  }
}

export {
  LoS,
}
