import React, { useState } from 'react'
import Header from '../UI/Header/Header'
import useHttpGet from '../../hooks/useHttpGet'
import Modal from '../UI/Modal/Modal'
import Upload from '../Upload/Upload'
import UploadAvatar from '../UploadAvatar/UploadAvatar'
const testAvatar = "https://scontent-arn2-2.cdninstagram.com/vp/fc9f9cdae239fe0319afc0cca853cd2d/5E5792C1/t51.2885-19/s150x150/66230601_898875400450053_5296268938865278976_n.jpg?_nc_ht=scontent-arn2-2.cdninstagram.com"
const Profile = () => {
   const { data, error, loading } = useHttpGet('/profiles')
   const { data: photos, setData: addPhoto } = useHttpGet('/profiles/photos')
   const [showUploadModal, setShowUploadModal] = useState(false)
   const [showAvatarModal, setShowAvatarModal] = useState(false)

   if (loading) {
      return <div className="profile"></div>
   }

   const { username, followers, followees, post_count, profile_text } = data || {}
   return (
      <div className="container flex" onClick={e => {
         showUploadModal && setShowUploadModal(false)
         showAvatarModal &&  setShowAvatarModal(false)
      }}>

         {showUploadModal && <Modal>
            <Upload addPhoto={addPhoto} username={username} />
         </Modal>}

         {showAvatarModal && <Modal>
            <UploadAvatar username={username}/>
         </Modal>}

         <Header />
         <div className="profile">
            {error ? <p className="error">Something went wrong</p> :
               <header className="profile__header">
                  <div className="profile__header__avatar">
                     <img src={data.avatar} alt="avatar" />
                     <button onClick={e => {
                        e.stopPropagation()
                        setShowAvatarModal(true)
                     }} className="btn btn--primary">Change avatar</button>
                  </div>
                  <div className="profile__header__info">
                     <div className="profile__header__info--first">
                        <p className="lead"> {username} </p>
                        <button onClick={e => {
                           e.stopPropagation()
                           setShowUploadModal(true)
                        }} className="btn btn--primary">Upload photo</button>
                        <button onClick={e => {
                        }} className="btn btn--primary">Edit Profile Text</button>
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
            <div className="profile__gallery">
               {photos && photos.map(p => {
                  return <div key={p.id} className="profile__gallery__image">
                     <img src={p.file_path} alt="uploaded by user" />
                  </div>
               })}
            </div>
         </div>
      </div>
   )
}

export default Profile
