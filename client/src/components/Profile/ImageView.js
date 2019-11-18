import React, { useState, useEffect, useContext } from 'react'
import useHttpGet from '../../hooks/useHttpGet'
import useHttpPost from '../../hooks/useHttp'
import { AuthContext } from '../../context/AuthContext'
const ImageView = ({ photo, avatar, username, id }) => {
   const { data: comments,
      loading: commentLoad,
      setData: setComments
   } = useHttpGet(`/photos/${id}`)

   const { fetchData } = useHttpPost(`/photos/${id}`)

   const { user } = useContext(AuthContext)
   const [loading, setLoading] = useState(true)
   const [commentText, setCommentText] = useState('')
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

   const submitComment = e => {
      e.preventDefault()
      fetchData({
         comment: commentText
      }).then(res => {
         const obj = { comment: res.comment, username, avatar, created_at: res.created_at }
         setComments(prev => {
            return [...prev, obj]
         })
         setCommentText('')
      })
   }

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
               <img src={avatar} alt="avatar" />
               <span> {username}  </span>
            </header>
            <div className="imageview__right-comments" >
               {commentLoad ? <p>Loading...</p> :
                  comments.map(comment => {
                     return <div key={comment.created_at} className="comment">
                        <img src={comment.avatar} alt="avatar" />
                        <p className="lead"> {comment.comment} </p>
                     </div>
                  })
               }
            </div>
            <div className="imageview__right-bottom">
               {user ? <form className="form" onSubmit={submitComment}>
                  <input required value={commentText} onChange={e => setCommentText(e.target.value)} type="text" />
               </form> : <p className="lead"> Log in to comment </p>}
            </div>
         </div>
      </div>
   )
}

export default ImageView
