import React, { useState } from 'react'
import Header from '../UI/Header/Header'
import useHttpGet from '../../hooks/useHttpGet'
import Modal from '../UI/Modal/Modal'
import Upload from '../Upload/Upload'
import UploadAvatar from '../UploadAvatar/UploadAvatar'
import EditText from './EditText'
const Profile = () => {
   const { data, error, loading, setData } = useHttpGet('/profiles')
   const { data: photos, setData: addPhoto } = useHttpGet('/profiles/photos')
   const [showUploadModal, setShowUploadModal] = useState(false)
   const [showAvatarModal, setShowAvatarModal] = useState(false)
   const [showProfileTextModal, setShowProfileTextModal] = useState(false)

   if (loading) {
      return <div className="profile"></div>
   }

   const { username, followers, followees, post_count, profile_text } = data || {}
   return (
      <div className="container flex" onClick={e => {
         showUploadModal && setShowUploadModal(false)
         showAvatarModal && setShowAvatarModal(false)
         showProfileTextModal && setShowProfileTextModal(false)
      }}>

         {(showUploadModal || showAvatarModal || showProfileTextModal) && <Modal>
            {showUploadModal && <Upload modalState={setShowUploadModal} addPhoto={addPhoto} username={username} />}
            {showAvatarModal && <UploadAvatar modalState={setShowAvatarModal} setAvatar={setData} username={username} />}
            {showProfileTextModal && <EditText initText={data.profile_text} modalState={setShowProfileTextModal} setProfileText={setData} />}
         </Modal>}

         <Header />
         <div className="profile">
            {error ? <p className="error">Something went wrong</p> :
               <header className="profile__header">
                  <div className="profile__header__avatar">
                     {/* The date on img src acts as cachebreaker */}
                     <img src={data.avatar + '?' + new Date().getTime()} alt="avatar" />
                     <button onClick={e => {
                        e.stopPropagation()
                        setShowAvatarModal(true)
                        if (showUploadModal) setShowUploadModal(false)
                        if (showProfileTextModal) setShowProfileTextModal(false)
                     }} className="btn btn--primary">Change avatar</button>
                  </div>
                  <div className="profile__header__info">
                     <div className="profile__header__info--first">
                        <p className="lead"> {username} </p>
                        <button onClick={e => {
                           e.stopPropagation()
                           setShowUploadModal(true)
                           if (showAvatarModal) setShowAvatarModal(false)
                           if (showProfileTextModal) setShowProfileTextModal(false)
                        }} className="btn btn--primary">Upload photo</button>
                        <button onClick={e => {
                           e.stopPropagation()
                           setShowProfileTextModal(true)
                           if (showAvatarModal) setShowAvatarModal(false)
                           if (showUploadModal) setShowUploadModal(false)
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
                     <img src={p.small_file_path} alt="uploaded by user" />
                  </div>
               })}
            </div>
         </div>
      </div>
   )
}

export default Profile
