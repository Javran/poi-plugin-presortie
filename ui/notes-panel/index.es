import React, { Component } from 'react'
import {
  Panel,
  ListGroup, ListGroupItem,
} from 'react-bootstrap'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { modifyObject, modifyArray } from 'subtender'

import { PTyp } from '../../ptyp'
import { AddNoteControl } from './add-note-control'
import { NoteControl } from './note-control'
import { notesSelector, memoFocusSelector } from '../../selectors'
import { mapDispatchToProps } from '../../store'

class NotesPanelImpl extends Component {
  static propTypes = {
    notes: PTyp.arrayOf(PTyp.Note).isRequired,
    style: PTyp.object.isRequired,
    memoFocus: PTyp.string.isRequired,
    memoModify: PTyp.func.isRequired,
  }

  modifyNotes = modifier =>
    this.props.memoModify(
      this.props.memoFocus,
      modifyObject('notes', modifier)
    )

  handleReplaceNote = noteId => contentOrNull =>
    this.modifyNotes(notes => {
      if (contentOrNull === null) {
        // "null" causes removal of this note
        return notes.filter(n => n.id !== noteId)
      } else {
        const ind = notes.findIndex(n => n.id === noteId)
        if (ind === -1) {
          // should not happen, but anyways
          return notes
        } else {
          const content = contentOrNull
          return modifyArray(ind, () => ({
            id: noteId,
            content}))(notes)
        }
      }
    })

  handleAddNote = content => {
    this.modifyNotes(
      notes => {
        const newId =
          notes.length === 0 ?
            0 :
            Math.max(...notes.map(n => n.id)) + 1
        return [...notes, {id: newId, content}]
      }
    )
  }

  render() {
    const {style, notes} = this.props
    return (
      <Panel
        style={style}
        className="main-panel"
      >
        <Panel.Heading>
          Notes
        </Panel.Heading>
        <Panel.Body
          style={{padding: 0}}
        >
          <ListGroup style={{marginBottom: 0}}>
            {
              notes.map(note => (
                <ListGroupItem key={note.id}>
                  <NoteControl
                    onReplaceNote={this.handleReplaceNote(note.id)}
                    note={note}
                  />
                </ListGroupItem>
              ))
            }
            <ListGroupItem style={{padding: '8px 15px'}}>
              <AddNoteControl
                onAddNote={this.handleAddNote}
              />
            </ListGroupItem>
          </ListGroup>
        </Panel.Body>
      </Panel>
    )
  }
}

const NotesPanel = connect(
  createStructuredSelector({
    notes: notesSelector,
    memoFocus: memoFocusSelector,
  }),
  mapDispatchToProps
)(NotesPanelImpl)

export {
  NotesPanel,
}
