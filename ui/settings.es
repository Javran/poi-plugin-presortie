import { createStructuredSelector } from 'reselect'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Checkbox } from 'react-bootstrap'
import { modifyObject, not } from 'subtender'

import { persistSelector, smartMemoFocusSelector } from '../selectors'
import { mapDispatchToProps } from '../store'
import { PTyp } from '../ptyp'

class SettingsImpl extends PureComponent {
  static propTypes = {
    ready: PTyp.bool.isRequired,
    smartMemoFocus: PTyp.bool.isRequired,
    persistModify: PTyp.func.isRequired,
  }

  handleToggleSmartMemoFocus = _e =>
    this.props.persistModify(
      modifyObject('smartMemoFocus', not)
    )

  render() {
    const {ready, smartMemoFocus} = this.props
    return (
      <div style={{marginBottom: '1.8em'}}>
        <div style={{display: 'flex', alignItems: 'baseline'}}>
          <div
            style={{
              width: '50%',
              maxWidth: '25em',
            }}
          >
            Smart Memo Focus
          </div>
          <Checkbox
            style={{flex: 1}}
            onChange={this.handleToggleSmartMemoFocus}
            disabled={!ready}
            checked={smartMemoFocus}
          />
        </div>
      </div>
    )
  }
}

const Settings = connect(
  createStructuredSelector({
    ready: s => persistSelector(s).ready,
    smartMemoFocus: smartMemoFocusSelector,
  }),
  mapDispatchToProps,
)(SettingsImpl)

export { Settings }
