import React, { useContext, useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import Header from '../UI/Header/Header'
import useHttpGet from '../../hooks/useHttpGet'
import axios from '../../axios/axios'
const testAvatar = "https://scontent-arn2-2.cdninstagram.com/vp/fc9f9cdae239fe0319afc0cca853cd2d/5E5792C1/t51.2885-19/s150x150/66230601_898875400450053_5296268938865278976_n.jpg?_nc_ht=scontent-arn2-2.cdninstagram.com"
const OtherProfile = (props) => {
   const [doesFollow, setDoesFollow] = useState(null)
   const uname = props.match.params.username
   const { user } = useContext(AuthContext)

   const { data, error, loading, setData } = useHttpGet(`/profiles/${uname}`)

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

   const {
      username,
      followers,
      followees,
      post_count,
      profile_text
   } = data || {}

   return (
      <>
         <Header />
         <div className="profile">
            {error ? <p className="error">Could not find user {uname}</p> :
               <header className="profile__header">
                  <div className="profile__header__avatar">
                     <img src={testAvatar} alt="avatar" />
                  </div>
                  <div className="profile__header__info">
                     <div className="profile__header__info--first">
                        <p className="lead"> {username} </p>
                        <button onClick={followUser} className="btn btn--primary"> {doesFollow ? 'Unfollow' : 'Follow'} </button>
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
         </div>
      </>
   )
}

export default OtherProfile