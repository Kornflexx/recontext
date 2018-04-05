import { createContext } from 'react'
import { makeBitsObserver } from './utils/observedBits'

export default store =>
    createContext(null, makeBitsObserver(store.observedBits))
