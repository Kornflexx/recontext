import chainMiddlewares from './chainMiddlewares'

export const makeActionWithMeta = (actionKey, entityKey) => (action) =>
    (state) => (...params) => ({
        actionKey,
        entityKey,
        partialState: action(state[entityKey])(...params)
    })

export const makeActionDispatcher = (getState, setState, middlewares) => (actionWithMeta, actions) => (...params) => {
    const state = getState()
    chainMiddlewares(state, setState, actions, middlewares)(actionWithMeta(state)(...params))
}
