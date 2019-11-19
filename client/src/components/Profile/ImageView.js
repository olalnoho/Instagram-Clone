import React, { useState, useEffect, useContext, useRef } from 'react'
import useHttpGet from '../../hooks/useHttpGet'
import useHttpPost from '../../hooks/useHttp'
import { AuthContext } from '../../context/AuthContext'
const ImageView = ({ photo, avatar, username, id }) => {
   const {
      data: comments,
      loading: commentLoad,
      setData: setComments
   } = useHttpGet(`/photos/${id}`)

   const { fetchData } = useHttpPost(`/photos/${id}`)

   const scrollDiv = useRef()
   const { user } = useContext(AuthContext)

   const [loading, setLoading] = useState(true)
   const [commentText, setCommentText] = useState('')
   const [mWidth, setMWidth] = useState(935)
   const [hasScrolled, setHasScrolled] = useState(false)

   const imgLoad = ({ target }) => {
      // For resizing min width on Image modal
      if ((target.width + 300) < 935) {
         setMWidth(target.width + 300)
      }
      setLoading(false)
   }

   useEffect(() => {
      document.querySelector('.photo-modal')
         .style.maxWidth = `${mWidth}px`
   }, [mWidth])


   useEffect(() => {
      scrollDiv.current &&
         scrollDiv.current.addEventListener('scroll', () => {
            setHasScrolled(true)
         }, { once: true })
   }, [scrollDiv])

   useEffect(() => {
      if (!hasScrolled || shouldAutoScroll(scrollDiv.current)) {
         scrollDiv.current.scrollTop = scrollDiv.current.scrollHeight
      }
   }, [hasScrolled, commentLoad, loading, comments])

   const shouldAutoScroll = box => {
      // 400 is arbitrary
      if (box.scrollHeight - (box.scrollTop + box.offsetHeight) < 400) {
         return true
      }
      return false
   }


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
      <div className="imageview" style={{ display: loading ? 'none' : 'flex' }}>
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
            </header>
            <div className="imageview__right-comments" ref={scrollDiv}>
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
