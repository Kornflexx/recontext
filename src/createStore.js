import makeStoreProvider,
{
    createStore,
    createStoreContext,
    createStoreEntity
} from './lib'
import React from 'react'

const initialUserState = {
    name: 'toto',
    age: 10,
    level: 1
}

const setUserAge = state => (age) => ({
    age
})

const setUserName = state => (name) => ({
    name
})

const userEntity = createStoreEntity(initialUserState, {
    setUserAge,
    setUserName,
})

const myMiddleware = state => next => (actionResult, actions) => {

    if (actionResult.actionKey === 'setUserAge') {

        const otherps = actions.user.setUserName(state)('cannard' + actionResult.partialState.age)
        next(otherps)

    }
    next(actionResult)

}

const agePlusOne = state => next => (actionResult, actions) => {

    //
    if (actionResult.actionKey === 'setUserAge') {
        next(actions.user.setUserAge(state)(actionResult.partialState.age + 1))
        
        return
    }
    next(actionResult)

}

export const store = createStore({
    user: userEntity
}, [myMiddleware, agePlusOne])


const { Consumer, Provider } = createStoreContext(store)

export const StoreProvider = makeStoreProvider(store, Provider)
export const StoreConsumer = Consumer