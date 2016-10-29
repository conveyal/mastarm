function isPromise (val) {
  return val && typeof val.then === 'function'
}

export default function promiseMiddleware (store) {
  return (next) => (action) =>
    isPromise(action)
        ? action.then(store.dispatch)
        : next(action)
}
