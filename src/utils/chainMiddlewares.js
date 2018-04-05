
const chainMiddlewares = (store, setState, actions, [currentMiddleware, ...middlewares]) => (actionWithMeta) => {
    if (!currentMiddleware) {
        setState({
            [actionWithMeta.entityKey]: actionWithMeta.partialState
        })
        return;
    }
    currentMiddleware(store)(chainMiddlewares(store, setState, actions, middlewares))(actionWithMeta, actions)
}

export default chainMiddlewares
