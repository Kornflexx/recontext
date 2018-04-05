import { getNextObservedBits } from './utils/observedBits'
import { makeActionDispatcher, makeActionWithMeta  } from './utils/actions'

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