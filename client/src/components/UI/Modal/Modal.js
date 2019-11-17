import React from 'react'

const Modal = props => {
   let classes = 'modal'
   if (props.extraClass) {
      classes += ' ' + props.extraClass
   }
   return (
      <div className={classes} onClick={e => {
         e.stopPropagation()
      }}>
         {props.children}
      </div>
   )
}

export default Modal
