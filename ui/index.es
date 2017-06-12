import React, { Component } from 'react'
import {
  DropdownButton,
  MenuItem,
} from 'react-bootstrap'

import { PTyp } from '../ptyp'
import { MapInfo } from '../structs'

class PresortieMain extends Component {
  static propTypes = {
    mapInfoArray: PTyp.arrayOf(PTyp.MapInfo).isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      curMapId: 11,
    }
  }

  componentDidMount() {

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
