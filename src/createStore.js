import makeStoreProvider,
{
    createStore,
    createStoreContext,
    createStoreEntity
} from './lib'
import React from 'react'

const userEntity = createStoreEntity(
    {
        name: 'toto',
        age: 10,
        level: 1
    },
    {
        setUserAge: (state) => (age) => ({
            age
        }),
        setUserName: (state) => (name) => ({
            name
        })
    }
)



export const store = createStore({
    user: userEntity
})


const { Consumer, Provider } = createStoreContext(store)

export const StoreProvider = makeStoreProvider(store, Provider)
export const StoreConsumer = Consumer