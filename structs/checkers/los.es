import { CheckMethod } from './common'
import {
  sakuSelectorFactoryWithNodeFactor,
} from './selectors'

import { Target } from '../target'

class LoS {
  static type = 'los'

  static defValue = {
    nodeFactor: 1,
    method: {type: 'ge', value: 33},
  }

  static title = "Line of Sight"

  static isValidObj = obj =>
    CheckMethod.isValidInRange(0,Infinity)(obj.method) &&
    (obj.nodeFactor >= 1 && obj.nodeFactor <= 4)

  static describe = obj => {
    const {method, nodeFactor} = obj
    return `Line of Sight (node factor: ${nodeFactor})` +
      ` ${CheckMethod.describe(method)}`
  }

  static prepare = checker => {
    const {method, nodeFactor, target} = checker
    const fleetId = Target.destruct({fleet: x => x})(target)
    const fleetInd = fleetId-1
    const satisfy = CheckMethod.toFunction(method)
    const sakuSelectorFactory = sakuSelectorFactoryWithNodeFactor(nodeFactor)
    return checkerContext => {
      const saku = sakuSelectorFactory(fleetInd)(checkerContext)
      return satisfy(saku.total) ? [] : [`Current LoS is ${saku.total}`]
    }
  }
}

export {
  LoS,
}
