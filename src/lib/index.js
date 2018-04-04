import React, { Component, createContext } from 'react'

const chainMiddlewares = (store, setState, actions, [currentMiddleware, ...middlewares]) => (actionWithMeta) => {
    if (!currentMiddleware) {
        setState({
            [actionWithMeta.entityKey]: actionWithMeta.partialState
        })
        return;
    }
    currentMiddleware(store)(chainMiddlewares(store, setState, actions, middlewares))(actionWithMeta, actions)
}

const makeActionWithMeta = (actionKey, entityKey) => (action) =>
    (state) => (...params) => ({
        actionKey,
        entityKey,
        partialState: action(state[entityKey])(...params)
    })

const makeActionDispatcher = (getState, setState, middlewares) => (actionWithMeta, actions) => (...params) => {
    
    const state = getState()
    chainMiddlewares(state, setState, actions, middlewares)(actionWithMeta(state)(...params))

}


const getNextObservedBits = observedBits => {
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

export const createStore = (entities, middlewares = []) => {
    const store = Object.keys(entities).reduce((store, entityKey, entityIndex) => ({
        observedBits: Object.keys(entities[entityKey].state).reduce((observedBits, stateKey) => ({
            ...observedBits,
            [stateKey]: getNextObservedBits(observedBits)
        }), store.observedBits),
        state: {
            ...store.state,
            [entityKey]: entities[entityKey].state
        }
    }), {
        state: {},
        observedBits: {}
    });

    const makeActions = (getState, setState) => {
        const actionDispatcher = makeActionDispatcher(getState, setState, middlewares)
        const actionsWithMeta = Object.keys(entities).reduce((storeActions, entityKey) => ({
            ...storeActions,
            [entityKey]: Object.keys(entities[entityKey].actions).reduce((entityActions, actionKey) => ({
                ...entityActions,
                [actionKey]: makeActionWithMeta(actionKey, entityKey)(entities[entityKey].actions[actionKey])
            }), {})
        }), {});

        const actionsDispatcher = Object.keys(entities).reduce((actionsDispatcher, entityKey) => ({
            ...actionsDispatcher,
            [entityKey]: Object.keys(entities[entityKey].actions).reduce((entityActions, actionKey) => ({
                ...entityActions,
                [actionKey]: actionDispatcher(actionsWithMeta[entityKey][actionKey], actionsWithMeta)
            }), {})
        }), {});
        
        return actionsDispatcher
    }

    return {
        ...store,
        makeActions
    }
}

export const connect = (...Consumers) => ComponentToWrap => () =>
    Consumers.reduce((ConnectedComponent, Consumer) =>
        <Consumer>
            {props => <ConnectedComponent {...props} />}
        </Consumer>
    , ComponentToWrap)


const mergeState = (state, partialState) =>
    Object.keys(partialState).reduce((stateAcc, partialStateKey) => ({
        ...stateAcc,
        [partialStateKey]: {
            ...stateAcc[partialStateKey],
            ...partialState[partialStateKey]
        }
    }), state)

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
