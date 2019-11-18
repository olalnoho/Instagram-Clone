import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
const ImageView = ({ photo, avatar, username, id }) => {
   console.log(id)
   const { user } = useContext(AuthContext)
   const [loading, setLoading] = useState(true)
   const [mWidth, setMWidth] = useState(935)

   const imgLoad = ({ target }) => {
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
            <header className="imageview__right-header">
               <img src={avatar} alt="avatar"/>
               <span> {username}  </span>
            </header>
            <p className="lead">
            </p>
            <div className="imageview__right-bottom">
               {user ? <form className="form">
                  <input type="text" />
               </form> : <p className="lead"> Log in to comment </p>}
            </div>
         </div>
      </div>
   )
}

export default ImageView
