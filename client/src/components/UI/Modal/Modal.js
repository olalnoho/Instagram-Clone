import React from 'react'

const Modal = props => {
   let classes = 'modal'
   if (props.extraClass) {
      classes += ' ' + props.extraClass
      console.log('ran')
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
