import React, { Component } from 'react'
import {
  Panel,
  Button,
} from 'react-bootstrap'

const { FontAwesome } = window

class ChecklistPanel extends Component {

  render() {
    const panelStyle = {
      marginBottom: 14,
    }

    return (
      <Panel
        style={{...panelStyle}}
        className="main-panel"
        header={
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={{width: 'auto', flex: 1}}>Checklist</div>
            <Button
              style={{marginTop: 0}}
                    bsSize="xsmall"
                    bsStyle="success">
              <FontAwesome name="check" />
            </Button>
          </div>
        }>
        TODO
      </Panel>
    )
  }

}

export {
  ChecklistPanel,
}
