import React, { Component } from 'react'
import { CSSTransition } from 'react-transition-group'

export default function Transition(props) {
    return (
        <CSSTransition
            { ...props }
            appear
            unmountOnExit
            timeout={1e3}>
            { props.children }
        </CSSTransition>
    )
}
