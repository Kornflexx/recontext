import { getNextObservedBits } from './utils/observedBits'
import { createMiddlewareChains  } from './utils/actions'

export default (entities, middlewares = []) => {

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

        const actionMap = Object.keys(entities).reduce((storeActions, entityKey) => ({
            ...storeActions,
            ...Object.keys(entities[entityKey].actions).reduce((entityActions, actionKey) => ({
                ...entityActions,
                [actionKey]: {
                    entityKey,
                    effect: entities[entityKey].actions[actionKey]
                }
            }), {})
        }), {});

        const middlewareChains = createMiddlewareChains(getState, setState, middlewares, actionMap)

        return Object.keys(entities).reduce((actionsDispatcher, entityKey) => ({
            ...actionsDispatcher,
            [entityKey]: Object.keys(entities[entityKey].actions).reduce((entityActions, actionKey) => ({
                ...entityActions,
                [actionKey]: middlewareChains(entities[entityKey].actions[actionKey])
            }), {})
        }), {});
    }

    return {
        ...store,
        makeActions
    }

}