import { createAsyncAction } from 'redux-helper'
import { createAction } from 'redux-actions'

export const addEndPoint = createAction('endpoint/ADD_ENDPOINT')
export const setActiveEndPoint = createAction('endpoint/SET_ACTIVE_ENDPOINT')
export const deleteEndPoint = createAction('endpoint/DELETE_ENDPOINT')
export const updateEndPointStatus = createAction('endpoint/UPDATE_STATUS')

export const getEndPointStatus = createAsyncAction('endpoint/GET_STATUS')
