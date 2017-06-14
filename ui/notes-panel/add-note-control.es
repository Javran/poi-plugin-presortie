import React, { Component } from 'react'
import {
  Button,
} from 'react-bootstrap'
import Textarea from 'react-textarea-autosize'
import { PTyp } from '../../ptyp'

const { FontAwesome } = window

class AddNoteControl extends Component {
  static propTypes = {
    onAddNote: PTyp.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      content: '',
    }
  }

  handleContentChange = e =>
    this.setState({content: e.target.value})

  handleReset = () =>
    this.setState({content: ''})

  handleAddContent = () => {
    const { content } = this.state
    const { onAddNote } = this.props
    onAddNote(content.trimRight())
    this.setState({content: ''})
  }

  render() {
    const btnStyle = {
      marginLeft: 5,
      height: 'auto',
    }
    const { content } = this.state
    const canSave = content.trimRight().length > 0
    return (
      <div style={{display: 'flex', alignItems: 'flex-end'}}>
        <Textarea
          style={{marginBottom: 6, flex: 1, width: 'auto'}}
          placeholder="Contents (Markdown supported)"
          className="form-control"
          value={content}
          onChange={this.handleContentChange}
        />
        <Button
          style={btnStyle}
          bsSize="small"
          onClick={this.handleReset}
        >
          <FontAwesome name="undo" />
        </Button>
        <Button
          disabled={!canSave}
          style={btnStyle}
          bsStyle={canSave ? 'default' : 'danger'}
          onClick={this.handleAddContent}
          bsSize="small">
          <FontAwesome name="plus" />
        </Button>
      </div>
    )
  }
}

export {
  AddNoteControl,
}
