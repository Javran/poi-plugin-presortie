import {
  fleetShipsDataSelectorFactory,
} from 'views/utils/selectors'

import {
  shipTextSelectorFactory,
} from './selectors'

import { Target } from '../target'

class ExtraSlots {
  static type = 'extra-slots'

  static defValue = {
  }

  static title = "Extra Slots"

  static isValidObj = () => true

  static describe = () =>
    'All openned extra slots should be equipped'

  static prepare = obj => checkerContext => {
    const { target } = obj
    const fleetId = Target.destruct({fleet: x => x})(target)
    const fleetInd = fleetId-1

    let shipsData = fleetShipsDataSelectorFactory(fleetInd)(checkerContext)
    if (!shipsData)
      shipsData = []

    const shipsWithEmptyExSlot = shipsData.filter( ([ship]) =>
      ship && ship.api_slot_ex === -1)

    return shipsWithEmptyExSlot.map(([ship]) =>
      `${shipTextSelectorFactory(ship.api_id)(checkerContext)}: Empty extra slot`)
  }
}

export {
  ExtraSlots,
}
