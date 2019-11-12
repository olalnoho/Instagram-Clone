import React from 'react'
import Header from '../UI/Header/Header'
const testAvatar = "https://scontent-arn2-2.cdninstagram.com/vp/fc9f9cdae239fe0319afc0cca853cd2d/5E5792C1/t51.2885-19/s150x150/66230601_898875400450053_5296268938865278976_n.jpg?_nc_ht=scontent-arn2-2.cdninstagram.com"
const Profile = () => {
   return (
      <>
         <Header />
         <div className="profile">
            <header className="profile__header">
               <div className="profile__header__avatar">
                  <img src={testAvatar} alt="avatar"/>
               </div>
               <div className="profile__header__info">
                  <div className="profile__header__info--first">
                     <p className="lead">Test</p>
                     <button className="btn btn--primary">Follow</button>
                  </div>
                  <div className="profile__header__info--second">
                     <p className="lead"><strong>0</strong> posts</p>
                     <p className="lead"><strong>22k</strong> followers</p>
                     <p className="lead"><strong>105</strong> following</p>
                  </div>
                  <div className="profile__header__info--third">
                     <p className="lead">
                        This is a very descriptive text about me!
                     </p>
                  </div>
               </div>
            </header>
         </div>
      </>
   )
}

export default Profile
