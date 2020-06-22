import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import Transition from './Transition'
import '../styles/components/toast.styl'

@inject('toast')
@observer
class Toast extends Component {
    render() {
        /** @type import('../stores').ToastState */
        const toast = this.props.toast

        return (
            <Transition in={ toast.isShow } classNames="fade">
                <div className="toast-wrapper">
                    <div className="toast">{ this.props.toast.msg }</div>
                </div>
            </Transition>
        )
    }
}

export default Toast
