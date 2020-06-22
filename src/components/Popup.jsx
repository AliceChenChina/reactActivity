import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import '../styles/components/popup.styl'

import Transition from './Transition'
import Modal from './Modal'
import { popup as popupController } from '../modules/controller'

@inject('popup')
@observer
class Popup extends Component {
  render() {
    /** @type import('../stores').PopupState */
    const popup = this.props.popup
    const text = this.props.text

    const ShowingMap = {
      message: () => (
        <Modal className="modal-msg"
               withClose={ true }
               onClose={ popupController.hide }>
          <div className="md-msg">{ popup.message }</div>
        </Modal>
      ),
      alert: () => (
        <Modal className="modal-alert">
          <div className="ma-content">{ popup.alertMsg }</div>
          <button className="ma-btn" onClick={ popupController.hide }>{ popup.btnText }</button>
        </Modal>
      ),
    }

    return (
      <Transition in={ popup.isShow } classNames="bg-fade">
        <div className="popup">
          <Transition in={ popup.isShow } classNames="fade-modal">
            { popup.target && ShowingMap[popup.target]() }
          </Transition>
        </div>
      </Transition>
    )
  }
}

export default Popup
