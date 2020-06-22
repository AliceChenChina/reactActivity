import { hot } from 'react-hot-loader/root'
import React, { Fragment } from 'react'
// Provider 能把组件变为可响应数据变化的组件
import { Provider } from 'mobx-react'
import stores from './stores'

// 路由
import Route from '@/router/router';
// 引入组件
import Loading from '@/components/Loading';
import Toast from '@/components/Toast';
import Popup from '@/components/Popup';

function App() {
    return (
        <Provider {...stores}>
            <Fragment>
                <Loading />
                <Toast />
                <Popup />
                <Route />
            </Fragment>
        </Provider>
    )
}

export default hot(App)
