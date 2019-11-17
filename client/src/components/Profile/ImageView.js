import React, { useState } from 'react'

const ImageView = ({ photo }) => {
   const [loading, setLoading] = useState(true)
   return (
      <div className="imageview" style={{ display: loading ? 'none' : 'flex' }}>
         <div className="imageview__left">
            <img
               onLoad={() => setLoading(false)} src={photo} alt="active" />
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
