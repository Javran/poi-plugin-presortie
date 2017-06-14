import React, { Component } from 'react'
import {
  FormControl, Button,
} from 'react-bootstrap'

import { PTyp } from '../../ptyp'

const { FontAwesome } = window

class AddLinkControl extends Component {
  static propTypes = {
    checkLinkName: PTyp.func.isRequired,
    onAddLink: PTyp.func.isRequired,
  }

  static initState = {
    name: '',
    link: 'http://',
  }

  constructor(props) {
    super(props)
    this.state = {
      ...AddLinkControl.initState,
    }
  }

  handleReset = () =>
    this.setState(AddLinkControl.initState)

  handleChangeName = e =>
    this.setState({name: e.target.value})

  handleChangeLink = e =>
    this.setState({link: e.target.value})

  handleAddLink = () => {
    const { name, link } = this.state
    const { onAddLink } = this.props
    onAddLink({name: name.trim(), link: link.trim()})
    this.setState(AddLinkControl.initState)
  }

  render() {
    const btnStyle = {
      marginLeft: 5,
      height: 'auto',
    }
    const { name, link } = this.state
    const { checkLinkName } = this.props
    const canAdd = checkLinkName(name) && link.trim().length > 0
    return (
      <div style={{display: 'flex', alignItems: 'flex-end'}}>
        <div style={{flex: 1, width: 'auto'}}>
          <FormControl
            placeholder="Name"
            onChange={this.handleChangeName}
            value={name}
          />
          <FormControl
            placeholder="Link"
            onChange={this.handleChangeLink}
            value={link}
          />
        </div>
        <Button
          style={btnStyle}
          bsSize="small"
          onClick={this.handleReset}
        >
          <FontAwesome name="undo" />
        </Button>
        <Button
          disabled={!canAdd}
          style={btnStyle}
          bsStyle={canAdd ? 'default' : 'danger'}
          onClick={this.handleAddLink}
          bsSize="small">
          <FontAwesome name="plus" />
        </Button>
      </div>
    )
  }
}

export {
  AddLinkControl,
}
