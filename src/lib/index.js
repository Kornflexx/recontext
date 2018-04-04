import React, { Component, createContext } from 'react'

const withDispatch = (action, actionKey, entityKey, setProviderState) => (...params) => {

    setProviderState(({ store }) => {

        console.log(`-------- ${actionKey} - ${entityKey} --------`)
        console.log('prevState', store)
        const state = {
            store: {
                ...store,
                [entityKey]: {
                    ...store[entityKey],
                    ...action(store[entityKey])(...params)
                }
            }
        };
        console.log('action params', ...params)
        console.log('nextState', state.store)
        console.log('--------')

        return state;
    })

}

const createNextObservedBits = observedBits => {
    const observedBitsKeys = Object.keys(observedBits)
    return Math.pow(2, observedBitsKeys.length)
}

const makeBitsObserver = (observedBits) => (prev, next) =>
    Object.keys(observedBits).reduce((result, observedBitKey) =>
        prev[observedBitKey] !== next[observedBitKey]
            ? result |= observedBits[observedBitKey]
            : result
    , 0)

export const createStoreContext = store =>
    createContext(null, makeBitsObserver(store.observedBits))


export const createStoreEntity = (initialState, actions) => ({
    state: initialState,
    actions
})

export const createStore = entities =>
    Object.keys(entities).reduce((store, entityKey, entityIndex) => ({
        observedBits: Object.keys(entities[entityKey].state).reduce((observedBits, stateKey) => ({
            ...observedBits,
            [stateKey]: createNextObservedBits(observedBits)
        }), store.observedBits),
        makeActions: (setState) =>
                Object.keys(entities[entityKey].actions).reduce((actions, actionKey) => ({
                ...actions,
                [actionKey]: withDispatch(entities[entityKey].actions[actionKey], actionKey, entityKey, setState)
            }), {}),
        state: {
            ...store.state,
            [entityKey]: entities[entityKey].state
        }
    }), {
        state: {},
        observedBits: {}
    })

export const connect = (...Consumers) => ComponentToWrap => () =>
    Consumers.reduce((ConnectedComponent, Consumer) =>
        <Consumer>
            {props => <ConnectedComponent {...props} />}
        </Consumer>
    , ComponentToWrap)



export default (store, Provider) =>
    class StoreProvider extends Component {

        constructor(props, context) {
            super(props, context)
            this.state = { store: store.state }
            this.actions = store.makeActions(this.setProviderState)
        }

        setProviderState = (callback) => {
            callback.bind(this)
            this.setState(callback)
        }

        render() {
            return (
                <Provider
                    value={{
                        ...this.state.store,
                        ...this.actions
                    }}
                >
                    {React.cloneElement(this.props.children, this.props)}
                </Provider>
            )
        }
    }
