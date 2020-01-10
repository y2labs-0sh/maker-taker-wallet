import React from 'react'
import classNames from 'classnames'
import style from './style.css'

export const FormContainer = ({ children, center }) => (
  <div
    className={classNames({
      [style.formContainer]: true,
      [style.center]: !!center
    })}
  >
    {children}
  </div>
)
