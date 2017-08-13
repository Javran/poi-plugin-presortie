import React, { Component } from 'react'
import {
  Button,
  FormControl,
} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

import { PTyp } from '../../ptyp'

class LinkControl extends Component {
  static propTypes = {
    link: PTyp.string.isRequired,
    name: PTyp.string.isRequired,
    onReplaceLink: PTyp.func,
  }

  static defaultProps = {
    onReplaceLink: null,
  }

  constructor(props) {
    super(props)
    const {link} = props
    this.state = {
      editing: false,
      // only link is editable,
      // as we are using name as id of link structure.
      link,
    }
  }

  handleStartEditing = () => {
    const {link} = this.props
    this.setState({
      editing: true,
      link,
    })
  }

  handleCancelEditing = () =>
    this.setState({editing: false})

  handleRemoveLink = () =>
    this.props.onReplaceLink(null)

  handleSaveLink = () => {
    const {link} = this.state
    this.props.onReplaceLink(link.trim())
    this.setState({ editing: false })
  }

  handleChangeLink = e =>
    this.setState({link: e.target.value})

  renderViewMode = () => {
    const {name, link, onReplaceLink} = this.props
    const editable = typeof onReplaceLink === 'function'
    return (
      <div style={{display: 'flex', alignItems: 'center'}}>
        <a href={link} style={{flex: 1}}>
          {name}
        </a>
        {
          editable &&
          (
            <Button
              bsSize="small"
              onClick={this.handleStartEditing}
            >
              <FontAwesome name="pencil" />
            </Button>
          )
        }
      </div>
    )
  }

  renderEditMode = () => {
    const btnStyle = {
      marginLeft: 5,
      height: 'auto',
    }
    const {name} = this.props
    const {link} = this.state
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
            onClick={this.handleCancelEditing}
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
    const {editing} = this.state
    return editing ?
      this.renderEditMode() :
      this.renderViewMode()
  }
}

export {
  LinkControl,
}
