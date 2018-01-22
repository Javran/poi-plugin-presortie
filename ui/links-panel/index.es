import { createStructuredSelector } from 'reselect'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Panel,
  ListGroup, ListGroupItem,
} from 'react-bootstrap'
import { modifyObject, modifyArray } from 'subtender'

import { mapDispatchToProps } from '../../store'
import {
  memoFocusSelector,
} from '../../selectors'
import { allLinksSelector } from './selectors'
import { PTyp } from '../../ptyp'
import { AddLinkControl } from './add-link-control'
import { LinkControl } from './link-control'

class LinksPanelImpl extends Component {
  static propTypes = {
    style: PTyp.object.isRequired,
    allLinks: PTyp.array.isRequired,

    memoFocus: PTyp.string.isRequired,
    memoModify: PTyp.func.isRequired,
  }

  modifyLinks = modifier =>
    this.props.memoModify(
      this.props.memoFocus,
      modifyObject('links', modifier)
    )

  handleAddLink = linkInfo =>
    this.modifyLinks(links => [...links, linkInfo])


  handleReplaceLink = linkName => contentOrNull =>
    this.modifyLinks(links => {
      if (contentOrNull === null) {
        return links.filter(l => l.name !== linkName)
      } else {
        const ind = links.findIndex(l => l.name === linkName)
        if (ind === -1) {
          // should not happen, just in case.
          return links
        } else {
          const content = contentOrNull
          return modifyArray(ind, () => ({
            name: linkName,
            link: content,
          }))(links)
        }
      }
    })

  /*
     check whether a link name is valid:

     - should be a non-empty string
     - should not have the same name as an existing one.
       (this includes preset-links as I don't think it makes sense anyways)
   */
  checkLinkName = linkNameRaw => {
    const linkName = linkNameRaw.trim()
    if (linkName.length === 0)
      return false
    const {allLinks} = this.props
    return allLinks
      .every(linkInfo => linkInfo.name !== linkName)
  }

  render() {
    const {style, allLinks} = this.props
    return (
      <Panel
        style={style}
        className="main-panel"
      >
        <Panel.Heading>
          Links
        </Panel.Heading>
        <Panel.Body>
          <ListGroup fill>
            {
              allLinks.map(({name, link, type}) => (
                <ListGroupItem
                  style={{padding: '8px 15px'}}
                  key={name}>
                  <LinkControl
                    link={link}
                    name={name}
                    onReplaceLink={
                      type === 'custom' ?
                        this.handleReplaceLink(name) :
                        null
                    }
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
        </Panel.Body>
      </Panel>
    )
  }
}

const LinksPanel = connect(
  createStructuredSelector({
    allLinks: allLinksSelector,
    memoFocus: memoFocusSelector,
  }),
  mapDispatchToProps,
)(LinksPanelImpl)

export {
  LinksPanel,
}
