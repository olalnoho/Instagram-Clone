import React from 'react'
import Header from '../UI/Header/Header'
import useHttpGet from '../../hooks/useHttpGet'
const testAvatar = "https://scontent-arn2-2.cdninstagram.com/vp/fc9f9cdae239fe0319afc0cca853cd2d/5E5792C1/t51.2885-19/s150x150/66230601_898875400450053_5296268938865278976_n.jpg?_nc_ht=scontent-arn2-2.cdninstagram.com"
const Profile = () => {
   const { data, error, loading } = useHttpGet('/profiles')

   if (loading) {
      return <div className="profile"></div>
   }

   const { username, followers, followees, post_count, profile_text } = data || {}
   return (
      <>
         <Header />
         <div className="profile">
            {error ? <p className="error">Something went wrong</p> :
            <header className="profile__header">
               <div className="profile__header__avatar">
                  <img src={testAvatar} alt="avatar" />
               </div>
               <div className="profile__header__info">
                  <div className="profile__header__info--first">
                     <p className="lead"> {username} </p>
                  </div>
                  <div className="profile__header__info--second">
                     <p className="lead"><strong>{post_count}</strong> posts</p>
                     <p className="lead"><strong> {followers} </strong> followers</p>
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

export default Profile
