import { createAction } from 'redux-actions'

export const addContact = createAction('contact/ADD')
export const updateContact = createAction('contact/EDIT')
export const deleteContact = createAction('contact/DELETE')
export const setActiveContact = createAction('contact/SET_ACTIVE')
