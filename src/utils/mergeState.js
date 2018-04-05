
export default (state, partialState) =>
    Object.keys(partialState).reduce((stateAcc, partialStateKey) => ({
        ...stateAcc,
        [partialStateKey]: {
            ...stateAcc[partialStateKey],
            ...partialState[partialStateKey]
        }
    }), state)
