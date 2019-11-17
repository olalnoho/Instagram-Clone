import React, { useContext, useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import Header from '../UI/Header/Header'
import useHttpGet from '../../hooks/useHttpGet'
import axios from '../../axios/axios'
import ImageView from '../Profile/ImageView'
import Modal from '../UI/Modal/Modal'

const OtherProfile = (props) => {
   const [doesFollow, setDoesFollow] = useState(null)
   const [photos, setPhotos] = useState(null)
   const [activePhoto, setActivePhoto] = useState(null)
   const uname = props.match.params.username
   const { user } = useContext(AuthContext)

   const { data, error, loading, setData } = useHttpGet(`/profiles/${uname}`)

   useEffect(() => {
      if (data && data.id) {
         axios.get(`/profiles/photos/${data.id}`)
            .then(res =>
               setPhotos(res.data)
            )
      }
   }, [data])

   const followUser = async e => {
      // @note
      // The request will **probably** never fail, and always has the same outcome
      // so taking an optimistic-UI approach here makes sense
      // for a more responive behaviour
      const url = doesFollow ? `/profiles/unfollow/${data.id}` : `/profiles/follow/${data.id}`
      const copyOfPrev = Object.assign({}, data)
      try {
         setData(prevState => ({
            ...prevState,
            followers: +followers + (doesFollow ? -1 : 1),
            isfollowing: doesFollow ? 0 : 1
         }))
         await axios.post(url)
      } catch {
         setData(copyOfPrev)
      }
   }

   useEffect(() => {
      if (data && data.isfollowing) {
         setDoesFollow(true)
      } else if (data && data.isfollowing === 0) {
         setDoesFollow(false)
      }
   }, [data])

   if (loading) {
      return <div className="profile"></div>
   }

   if (user && user.username === uname) {
      return <Redirect to="/profile" />
   }

   console.log(activePhoto)

   const {
      username,
      followers,
      followees,
      post_count,
      profile_text,
      avatar
   } = data || {}

   return (
      <>
         {activePhoto && <Modal extraClass="photo-modal">
            <ImageView photo={`http://localhost:5000/${activePhoto}`} />
         </Modal>}
         <div className="container flex" onClick={e => {
            activePhoto && setActivePhoto(null)
         }}>
            <Header />
            <div className="profile">
               {error ? <p className="error">Could not find user {uname}</p> :
                  <header className="profile__header">
                     <div className="profile__header__avatar">
                        <img src={`http://localhost:5000/${avatar}`} alt="avatar" />
                     </div>
                     <div className="profile__header__info">
                        <div className="profile__header__info--first">
                           <p className="lead"> {username} </p>
                           {user && <button onClick={followUser} className="btn btn--primary"> {doesFollow ? 'Unfollow' : 'Follow'} </button>}
                        </div>
                        <div className="profile__header__info--second">
                           <p className="lead"><strong> {post_count} </strong> posts</p>
                           <p className="lead"><strong> {followers} </strong> followers </p>
                           <p className="lead"><strong> {followees} </strong> following</p>
                        </div>
                        <div className="profile__header__info--third">
                           <p className="lead">
                              {profile_text}
                           </p>
                        </div>
                     </div>
                  </header>}
               <div className="profile__gallery">
                  {photos && photos.map(p => {
                     // @note
                     // Change src when deploying
                     return <div key={p.id} className="profile__gallery__image">
                        <img
                           onClick={e => {
                              e.stopPropagation()
                              setActivePhoto(p.file_path)
                           }} src={`http://localhost:5000/${p.small_file_path}`} alt="uploaded by user" />
                        <label>
                           {p.description}
                        </label>
                     </div>
                  })}
               </div>
            </div>
         </div>
      </>
   )
}

export default OtherProfile
