import React from 'react'

const Modal = props => {
   return (
      <div className="modal" onClick={e => {
         e.stopPropagation()
      }}>
         {props.children}
      </div>
   )
}

export default Modal
