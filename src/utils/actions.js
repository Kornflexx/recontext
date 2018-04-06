import chainMiddlewares from './chainMiddlewares'

const createActionDispatcher = (store, setState, actionMap) => (action, params, callbacks) => {
    const { effect, entityKey } = actionMap[action.name]
    const callback = callbacks.find(callbackMeta => callbackMeta.action === action)
    setState({
        [entityKey]: effect(store[entityKey], params)
    }, callback)
}

export const createMiddlewareChains = (getState, setState, middlewares, actionMap) => (action) => (params) => {
    const store = getState()
    const actionDispatcher = createActionDispatcher(store, setState, actionMap)
    chainMiddlewares(store, actionDispatcher, [], middlewares)(action, params)
}
