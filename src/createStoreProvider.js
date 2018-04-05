import React, { Component } from 'react'
import mergeState from './utils/mergeState'

export default (store, Provider) =>
    class StoreProvider extends Component {

        constructor(props, context) {
            super(props, context)
            this.state = store.state
            this.refreshEnd = true
            this.actions = store.makeActions(this.getProviderState, this.setProviderState)
        }

        getProviderState = () => this.state

        handleNextState = () => {
            this.refreshEnd = true;
            if (!this.shouldRefresh) return;
            this.setState(this.nextState, () => this.refreshEnd = true)
            this.nextState = null
            this.shouldRefresh = false
        }

        setProviderState = (partialState) => {
            if (!this.refreshEnd) {
                
                this.shouldRefresh = true;
                this.nextState = mergeState(this.nextState, partialState)
                return null;
            }
            
            this.refreshEnd = false;
            this.nextState = mergeState(this.state, partialState)
            
            this.setState(this.nextState, this.handleNextState)
        }

        shouldComponentUpdate(nextProps, nextState) {

            if (nextProps !== this.props || nextState !== this.state) {
                return true;
            }
            return false;

        }

        render() {
            return (
                <Provider
                    value={
                        Object.keys(this.state).reduce((storeWithActions, entityKey) => ({
                            ...storeWithActions,
                            [entityKey]: {
                                ...storeWithActions[entityKey],
                                ...this.actions[entityKey]
                            }
                        }), this.state)
                    }
                >
                    {React.cloneElement(this.props.children, this.props)}
                </Provider>
            )
        }
    }
