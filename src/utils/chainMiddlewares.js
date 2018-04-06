
const chainMiddlewares = (store, actionDispatcher, callbacks, [currentMiddleware, ...middlewares]) => (action, params, callback) => {
    const newCallbacks = callback ?
        [...callbacks, { action, callback }]
        : callbacks;

    if (!currentMiddleware) {
        actionDispatcher(action, params, newCallbacks)
        return;
    }
    currentMiddleware(store)(chainMiddlewares(store, actionDispatcher, newCallbacks, middlewares))(action, params)
}

export default chainMiddlewares
