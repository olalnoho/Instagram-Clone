import React, { useState, useEffect } from 'react'

const ImageView = ({ photo }) => {
   const [loading, setLoading] = useState(true)
   const [mWidth, setMWidth] = useState(935)

   const imgLoad = ({ target }) => {
      console.dir(target)
      if ((target.width + 300) < 935) {
         setMWidth(target.width + 300)
      }
      setLoading(false)
   }

   useEffect(() => {
      document.querySelector('.photo-modal')
         .style.maxWidth = `${mWidth}px`
   }, [mWidth])

   return (
      <div className="imageview" style={{ display: loading ? 'none' : 'flex' }}>
         <div className="imageview__left">
            <img
               onLoad={imgLoad}
               src={photo}
               alt="active" />
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
