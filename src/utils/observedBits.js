
export const getNextObservedBits = observedBits => {
    const observedBitsKeys = Object.keys(observedBits)
    return Math.pow(2, observedBitsKeys.length)
}

export const makeBitsObserver = (observedBits) => (prev, next) =>
    Object.keys(observedBits).reduce((result, observedBitKey) =>
        prev[observedBitKey] !== next[observedBitKey]
            ? result |= observedBits[observedBitKey]
            : result
    , 0)
