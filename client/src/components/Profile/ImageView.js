import React from 'react'

const ImageView = ({ photo }) => {
   return (
      <div className="imageview">
         <div className="imageview__left">
            <img src={photo} alt="active" />
         </div>
         <div className="imageview__right">
            <p className="lead">
               Hello
            </p>
         </div>
      </div>
   )
}

export default ImageView
