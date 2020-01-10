export const isThunkAction = action =>
  !!(action && action.meta && action.meta.thunk)

export const isThunkRequestAction = action =>
  !!(
    isThunkAction(action) &&
    typeof action.meta.thunk === 'object' &&
    action.meta.thunk.type === 'REQUEST'
  )

export const getThunkMeta = action => isThunkAction(action) ? action.meta.thunk : null

export const createThunkAction = (action, thunk) => ({
  ...action,
  meta: {
    ...action.meta,
    thunk,
  },
})

export const getThunkName = (action) => {
  const meta = getThunkMeta(action)
  if (meta && typeof meta === 'string') {
    return meta
  }
  if (meta && typeof meta === 'object' && 'name' in meta) {
    return meta.name
  }
  return action.type
}

export const hasId = (action) => {
  const meta = getThunkMeta(action)
  return !!meta && typeof meta === 'object' && 'id' in meta
}

export const getThunkId = (action) => {
  if (hasId(action)) return getThunkMeta(action).id
  return undefined
}

export const hasKey = (action) => {
  const meta = getThunkMeta(action)
  return !!meta && typeof meta === 'object' && 'key' in meta
}

export const generateThunk = (action) => {
  const thunk = getThunkMeta(action)

  return hasKey(action) ? { ...thunk, type: 'RESPONSE' } : { ...(typeof thunk === 'object' ? thunk : {}), name: getThunkName(action), key: Math.random().toFixed(16).substring(2), type: 'REQUEST' }
}
