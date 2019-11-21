import React, { useState, useEffect, useContext } from 'react'
import useHttpGet from '../../hooks/useHttpGet'
import useHttpPost from '../../hooks/useHttp'
import useAutoScroll from '../../hooks/useAutoScroll'
import { AuthContext } from '../../context/AuthContext'

const ImageView = ({ photo, avatar, username, id, deletePhoto }) => {
   const { user } = useContext(AuthContext)
   const [imageLoading, setImageLoading] = useState(true)
   const [commentText, setCommentText] = useState('')
   const [mWidth, setMWidth] = useState(935)

   const { data: comments, loading: commentLoad, setData: setComments } = useHttpGet(`/api/photos/${id}`)
   const { fetchData } = useHttpPost(`/api/photos/${id}`)

   // imageLoading is a dependency because the modal
   // has 'display: none' if image is not loaded
   const ref = useAutoScroll(400, [commentLoad, imageLoading, comments])

   const imgLoad = ({ target }) => {
      // For resizing min width on Image modal
      if ((target.width + 300) < 935) {
         setMWidth(target.width + 300)
      }
      setImageLoading(false)
   }

   useEffect(() => {
      document.querySelector('.photo-modal')
         .style.maxWidth = `${mWidth}px`
   }, [mWidth])

   const submitComment = e => {
      e.preventDefault()
      fetchData({ comment: commentText })
         .then(res => {
            const obj = { comment: res.comment, username, avatar: user.avatar, created_at: res.created_at }
            setComments(prev => {
               return [...prev, obj]
            })
            setCommentText('')
         })
   }

   return (
      <div className="imageview" style={{ display: imageLoading ? 'none' : 'flex' }}>
         <div className="imageview__left">
            <img
               onLoad={imgLoad}
               src={photo}
               alt="active" />
         </div>
         <div className="imageview__right">
            <header className="imageview__right-header">
               <img src={avatar + '?' + new Date().getTime()} alt="avatar" />
               <span> {username}  </span>
               {(user.username === username) &&
                  <button onClick={() => deletePhoto(id)} className="btn btn--thirdary">Delete</button>
               }
            </header>
            <div className="imageview__right-comments" ref={ref}>
               {commentLoad ? <p>Loading...</p> :
                  comments.map(comment => {
                     return <div key={comment.created_at} className="comment">
                        <div className="comment__user">
                           <img src={`http://localhost:5000/${comment.avatar}?${new Date().getTime()}`} alt="avatar" />
                           <strong className="name">
                              {comment.username}
                           </strong>
                        </div>
                        <p className="lead"> {comment.comment} </p>
                     </div>
                  })
               }
            </div>
            <div className="imageview__right-bottom">
               {user ? <form className="form" onSubmit={submitComment}>
                  <input
                     placeholder="Comment"
                     required
                     value={commentText}
                     onChange={e => setCommentText(e.target.value)} type="text" />
               </form> : <p className="lead"> Log in to comment </p>}
            </div>
         </div>
      </div>
   )
}

export default ImageView
