import { createStructuredSelector } from 'reselect'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Panel,
  ListGroup, ListGroupItem,
} from 'react-bootstrap'
import { modifyObject } from 'subtender'

import { mapDispatchToProps } from '../../store'
import {
  linksSelector,
  mapIdSelector,
} from '../../selectors'
import { PTyp } from '../../ptyp'
import { AddLinkControl } from './add-link-control'
import { LinkControl } from './link-control'

class LinksPanelImpl extends Component {
  static propTypes = {
    style: PTyp.object.isRequired,
    links: PTyp.arrayOf(PTyp.LinkInfo).isRequired,

    // onAddLink: PTyp.func.isRequired,
    mapId: PTyp.number.isRequired,
    mapMemoModify: PTyp.func.isRequired,
  }

  modifyLinks = modifier =>
    this.props.mapMemoModify(
      this.props.mapId,
      modifyObject('links', modifier)
    )

  handleAddLink = linkInfo =>
    this.modifyLinks(links => [...links, linkInfo])

  // TODO: remove
  checkLinkName = linkNameRaw => {
    const linkName = linkNameRaw.trim()
    if (linkName.length === 0)
      return false
    const { links } = this.props
    return links
      .every(linkInfo => linkInfo.name !== linkName)
  }

  render() {
    const {style, links} = this.props
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
              onAddLink={this.handleAddLink}
              checkLinkName={this.checkLinkName}
            />
          </ListGroupItem>
        </ListGroup>
      </Panel>
    )
  }
}

const LinksPanel = connect(
  createStructuredSelector({
    links: linksSelector,
    mapId: mapIdSelector,
  }),
  mapDispatchToProps,
)(LinksPanelImpl)

export {
  LinksPanel,
}
