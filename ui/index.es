import React, { Component } from 'react'
import {
  DropdownButton,
  MenuItem,
} from 'react-bootstrap'
import { observer, observe } from 'redux-observers'

import { store } from 'views/create-store'

import { PTyp } from '../ptyp'
import { MapInfo } from '../structs'
import { mapDispatchToProps } from '../reducer'
import { loadPState } from '../p-state'

const mapIdObserver = observer(
  state => state.sortie.sortieMapId,
  (dispatch, curMapIdRaw, prevMapIdRaw) => {
    const normalize = x => {
      const parsed = parseInt(x,10)
      // all falsy values are turned into null
      if (!parsed)
        return null
      return parsed
    }

    const curMapId = normalize(curMapIdRaw)
    const prevMapId = normalize(prevMapIdRaw)
    // only observe sortie-changing events
    // where we are not returning to port (i.e. not null)
    if (curMapId !== prevMapId &&
        curMapId !== null) {
      mapDispatchToProps(dispatch).onMapIdChange(curMapId)
    }
  })

class PresortieMain extends Component {
  static propTypes = {
    mapInfoArray: PTyp.arrayOf(PTyp.MapInfo).isRequired,

    onInit: PTyp.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.unsubscribe = null
    this.state = {
      curMapId: 11,
    }
  }

  componentDidMount() {
    const { onInit } = this.props
    this.unsubscribe = observe(store,[mapIdObserver])
    setTimeout(() => {
      onInit(loadPState())
    })
  }

  componentWillUnmount() {
    if (this.unsubscribe !== null) {
      this.unsubscribe()
      this.unsubscribe = null
    }
  }

  handleChangeMapId = mapId =>
    this.setState({curMapId: mapId})

  render() {
    const { mapInfoArray } = this.props
    const { curMapId } = this.state

    const curMapInfo = mapInfoArray.find(x => x.id === curMapId)
    return (
      <div
        style={{margin: 5}}
      >
        <DropdownButton
          title={`Sortie Area: ${MapInfo.toString(curMapInfo)}`}
          onSelect={this.handleChangeMapId}
          key={curMapId}
          id={`presortie-dropdown-sortie-area`}>
          {
            /*
               TODO:

               - MenuItem: last sortie area
               - maintain a list of unique sortie areas from history,
                 if possible.
               - <MenuItem divider />
             */
          }
          {
            mapInfoArray.map( x => (
              <MenuItem
                key={x.id} eventKey={x.id}>
                {MapInfo.toString(x)}
              </MenuItem>
            ))
          }
        </DropdownButton>
      </div>
    )
  }
}

export {
  PresortieMain,
}
