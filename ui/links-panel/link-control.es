import React, { Component } from 'react'
import {
  Button,
  FormControl,
} from 'react-bootstrap'

import { PTyp } from '../../ptyp'

const { FontAwesome } = window

class LinkControl extends Component {
  static propTypes = {
    linkInfo: PTyp.LinkInfo.isRequired,
  }

  constructor(props) {
    super(props)
    const { linkInfo } = props
    this.state = {
      editing: false,
      link: linkInfo.link,
    }
  }

  handleStartEditing = () => {
    const { linkInfo } = this.props
    this.setState({
      editing: true,
      link: linkInfo.link,
    })
  }

  handleRemoveLink = () => {
    const { linkInfo } = this.props
    const { onModifyLink } = linkInfo
    onModifyLink(() => null)
  }

  handleSaveLink = () => {
    const { linkInfo } = this.props
    const { link } = this.state
    const { name, onModifyLink } = linkInfo
    onModifyLink(() => ({
      name,
      link: link.trim(),
    }))
    this.setState({ editing: false })
  }

  handleChangeLink = e =>
    this.setState({link: e.target.value})

  renderViewMode = () => {
    const { linkInfo } = this.props
    const { name, link, onModifyLink } = linkInfo
    const editable = typeof onModifyLink === 'function'
    return (
      <div style={{display: 'flex', alignItems: 'center'}}>
        <a href={link} style={{flex: 1}}>
          {name}
        </a>
        {
          editable &&
          (<Button
             bsSize="small"
             onClick={this.handleStartEditing}
            >
            <FontAwesome name="pencil" />
          </Button>)
        }
      </div>
    )
  }

  renderEditMode = () => {
    const btnStyle = {
      marginLeft: 5,
      height: 'auto',
    }
    const { linkInfo } = this.props
    const { name } = linkInfo
    const { link } = this.state
    const canSave = link.trim().length > 0
    return (
      <div style={{display: 'flex', alignItems: 'flex-end'}}>
        <div style={{flex: 1, width: 'auto'}}>
          <FormControl readOnly value={name} />
          <FormControl
            placeholder="Link"
            onChange={this.handleChangeLink}
            value={this.state.link}
          />
        </div>
        <Button
          style={btnStyle}
          bsSize="small"
          bsStyle="danger"
          onClick={this.handleRemoveLink}
        >
          <FontAwesome name="trash" />
        </Button>
        <div
          style={{
            ...btnStyle,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignSelf: 'stretch',
          }}>
          <Button
            style={{marginBottom: 5}}
            bsSize="small">
            <FontAwesome name="undo" />
          </Button>
          <Button
            disabled={!canSave}
            onClick={this.handleSaveLink}
            bsStyle={canSave ? 'success' : 'danger'}
            bsSize="small">
            <FontAwesome name="save" />
          </Button>
        </div>
      </div>
    )
  }

  render() {
    const { editing } = this.state
    return editing ?
      this.renderEditMode() :
      this.renderViewMode()
  }
}

export {
  LinkControl,
}
