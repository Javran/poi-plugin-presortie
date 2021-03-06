import React, { Component } from 'react'
import {
  Button,
} from 'react-bootstrap'
import Markdown from 'react-remarkable'
import Textarea from 'react-textarea-autosize'
import FontAwesome from 'react-fontawesome'

import { PTyp } from '../../ptyp'

class NoteControl extends Component {
  static propTypes = {
    note: PTyp.Note.isRequired,
    onReplaceNote: PTyp.func.isRequired,
  }

  static btnStyle = {
    marginLeft: 5,
    width: '2.7em',
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

  handleCancelEditing = () =>
    this.setState({editing: false})

  handleNoteChange = e =>
    this.setState({content: e.target.value})

  handleModifyNote = () => {
    const { content } = this.state
    const { onReplaceNote } = this.props
    onReplaceNote(content)
    this.setState({editing: false, content})
  }

  handleRemoveNote = () => {
    const {onReplaceNote} = this.props
    onReplaceNote(null)
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignSelf: 'stretch',
          }}>
          <Button
            style={{
              ...NoteControl.btnStyle,
              marginBottom: 5,
            }}
            onClick={this.handleCancelEditing}
            bsSize="small">
            <FontAwesome name="undo" />
          </Button>
          <Button
            disabled={!canSave}
            bsStyle={canSave ? 'success' : 'danger'}
            onClick={this.handleModifyNote}
            style={NoteControl.btnStyle}
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
  NoteControl,
}
