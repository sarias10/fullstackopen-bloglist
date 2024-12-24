import PropTypes from 'prop-types'
import React, { useImperativeHandle, useState, forwardRef } from 'react'

const Togglable = forwardRef((props, refs) => {//el componente esta envuelto en forwardRef, asi el componente puede acceder a la referencia que se le asigna
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '': 'none' }

  //cada que se haga click cambia visible de true a false o de false a true
  const toggleVisibility = () => {
    setVisible(!visible)
  }
  //el componente usa este gancho para hacer que la funcion toggleVisibility este disponible fuera del componente
  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>{/*si visible es true entonces este boton se oculta*/}
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>{/*se muestra la propiedad buttonLabel que se le pasa desde otro componente*/}
      </div>
      <div style={showWhenVisible}>{/*si visible es true entonces este boton se muestra*/}
        {props.children}{/*Permite a un componente renderizar contenido anidado que se le pasa desde su componente padre.*/}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}
//se usa para que en las herramientas de depuracion aparezca Togglable y no ForwardRef
Togglable.displayName = 'Togglable'

export default Togglable