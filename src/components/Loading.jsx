import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import Transition from './Transition'
import '../styles/components/loading.styl'

@inject('loading')
@observer
class Loading extends Component {
    render() {
        /** @type import('../stores').LoadingState */
        const loading = this.props.loading
        return (
            <Transition in={ loading.isShow } classNames="fade">
                <div className="loading">
                    <div className="loading-wrapper">
                        <img src="https://m.jr.jd.com/statics/pageLoading/loading.svg" alt="" className="img-loading"/>
                    </div>
                </div>
            </Transition>
        )
    }
}

export default Loading
