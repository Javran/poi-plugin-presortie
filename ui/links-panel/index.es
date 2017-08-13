import React, { Component } from 'react'
import {
  Panel,
  ListGroup, ListGroupItem,
} from 'react-bootstrap'

import { PTyp } from '../../ptyp'
import { AddLinkControl } from './add-link-control'
import { LinkControl } from './link-control'

class LinksPanel extends Component {
  static propTypes = {
    style: PTyp.object.isRequired,
    // links: PTyp.arrayOf(PTyp.LinkInfo).isRequired,

    // onAddLink: PTyp.func.isRequired,
  }

  checkLinkName = linkNameRaw => {
    const linkName = linkNameRaw.trim()
    if (linkName.length === 0)
      return false
    const { links } = this.props
    return links
      .every(linkInfo => linkInfo.name !== linkName)
  }

  render() {
    const {style} = this.props
    const links = []
    return (
      <Panel
        style={style}
        className="main-panel"
        header="Links">
        <ListGroup fill>
          {
            links.map( linkInfo => (
              <ListGroupItem
                style={{padding: '8px 15px'}}
                key={linkInfo.name}>
                <LinkControl
                  linkInfo={linkInfo}
                />
              </ListGroupItem>
            ))
          }
          <ListGroupItem style={{padding: '8px 15px'}}>
            <AddLinkControl
              onAddLink={() => undefined}
              checkLinkName={this.checkLinkName}
            />
          </ListGroupItem>
        </ListGroup>
      </Panel>
    )
  }
}

export {
  LinksPanel,
}
