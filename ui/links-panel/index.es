import React, { Component } from 'react'
import {
  Panel,
  ListGroup, ListGroupItem,
} from 'react-bootstrap'

import { PTyp } from '../../ptyp'
import { AddLinkControl } from './add-link-control'

class LinksPanel extends Component {
  static propTypes = {
    style: PTyp.object,
    links: PTyp.arrayOf(PTyp.LinkInfo).isRequired,

    onAddLink: PTyp.func.isRequired,
  }

  static defaultProps = {
    style: {},
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
    const { style, links, onAddLink } = this.props
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
                <a href={linkInfo.link}>{linkInfo.name}</a>
              </ListGroupItem>
            ))
          }
          <ListGroupItem style={{padding: '8px 15px'}}>
            <AddLinkControl
              onAddLink={onAddLink}
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
