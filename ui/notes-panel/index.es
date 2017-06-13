import React, { Component } from 'react'
import {
  Panel,
  ListGroup, ListGroupItem,
} from 'react-bootstrap'

import { PTyp } from '../../ptyp'
import { AddNoteControl } from './add-note-control'
import { NoteControl } from './note-control'

class NotesPanel extends Component {
  static propTypes = {
    notes: PTyp.arrayOf(PTyp.Note).isRequired,
    style: PTyp.object,

    onAddNote: PTyp.func.isRequired,
    onModifyNote: PTyp.func.isRequired,
  }

  static defaultProps = {
    style: {},
  }

  render() {
    const { style, notes, onAddNote, onModifyNote } = this.props
    return (
      <Panel
        style={style}
        className="main-panel"
        header="Notes">
        <ListGroup fill>
          {
            notes.map(note => (
              <ListGroupItem key={note.id}>
                <NoteControl
                  onModifyNote={onModifyNote(note.id)}
                  note={note}
                />
              </ListGroupItem>
            ))
          }
          <ListGroupItem style={{padding: '8px 15px'}}>
            <AddNoteControl
              onAddNote={onAddNote}
            />
          </ListGroupItem>
        </ListGroup>
      </Panel>
    )
  }
}

export {
  NotesPanel,
}
