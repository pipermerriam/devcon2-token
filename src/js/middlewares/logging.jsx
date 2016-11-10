export default store => next => action => {
  console.info('dispatching', action.type)
  return next(action)
}
