import {
  fleetShipsDataSelectorFactory,
} from 'views/utils/selectors'

import {
  shipTextSelectorFactory,
} from './selectors'

class ExtraSlots {
  static type = 'extra-slots'

  static defValue = {
  }

  static title = "Extra Slots"

  static isValid = () => true

  static describe = () =>
    'All openned extra slots should be equipped'

  static prepare = () => checkerContext => {
    const { fleetId } = checkerContext
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
