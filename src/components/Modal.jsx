import React, { Component } from 'react'

import '../styles/components/modal.styl'

class Modal extends Component {
    render() {
        const { className, children, footer, withClose, onClose } = this.props

        return (
            <div className={'modal' + (className ? ' ' + className : '')}>
                <div className="modal-main">
                    { withClose &&
                        <div className="modal-header">
                            <span className="close tappable" onClick={ onClose }></span>
                        </div>
                    }

                    <div className="modal-content">
                        { children }
                    </div>

                    { footer }
                </div>
            </div>
        )
    }
}

export default Modal
