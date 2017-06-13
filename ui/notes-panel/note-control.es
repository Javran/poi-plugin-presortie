import React, { Component } from 'react'
import {
  Button,
} from 'react-bootstrap'
import Markdown from 'react-remarkable'
import Textarea from 'react-textarea-autosize'

import { PTyp } from '../../ptyp'

const { FontAwesome } = window

class NoteControl extends Component {
  static propTypes = {
    note: PTyp.Note.isRequired,
    onModifyNote: PTyp.func.isRequired,
  }

  static btnStyle = {
    marginLeft: 5,
    height: 'auto',
  }

  constructor(props) {
    super(props)
    const { note } = props
    this.state = {
      editing: false,
      content: note.content,
    }
  }

  handleStartEditing = () => {
    const { note } = this.props
    this.setState({
      editing: true,
      content: note.content,
    })
  }

  handleNoteChange = e =>
    this.setState({content: e.target.value})

  handleModifyNote = () => {
    const { content } = this.state
    const { onModifyNote } = this.props
    onModifyNote(content)
    this.setState({editing: false, content})
  }

  handleRemoveNote = () => {
    const { onModifyNote } = this.props
    onModifyNote(null)
  }

  renderViewMode = () => {
    const { note } = this.props
    return (
      <div style={{display: 'flex', alignItems: 'flex-end'}}>
        <div style={{flex: 1, width: 'auto'}}>
          <Markdown source={note.content} />
        </div>
        <Button
          style={NoteControl.btnStyle}
          bsSize="small"
          onClick={this.handleStartEditing}
        >
          <FontAwesome name="pencil" />
        </Button>
      </div>
    )
  }

  renderEditMode = () => {
    const { content } = this.state
    const canSave = content.trimRight().length > 0
    return (
      <div style={{display: 'flex', alignItems: 'flex-end'}}>
        <Textarea
          style={{marginBottom: 6, flex: 1, width: 'auto'}}
          placeholder="Notes (Markdown supported)"
          className="form-control"
          value={content}
          onChange={this.handleNoteChange}
        />
        <Button
          style={NoteControl.btnStyle}
          bsStyle="danger"
          bsSize="small"
          onClick={this.handleRemoveNote}
        >
          <FontAwesome name="trash" />
        </Button>
        <Button
          disabled={!canSave}
          style={NoteControl.btnStyle}
          bsStyle={canSave ? 'success' : 'danger'}
          onClick={this.handleModifyNote}
          bsSize="small">
          <FontAwesome name="save" />
        </Button>
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
  NoteControl,
}
