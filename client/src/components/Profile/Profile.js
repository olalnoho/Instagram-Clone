import React, { useState } from 'react'
import Header from '../UI/Header/Header'
import useHttpGet from '../../hooks/useHttpGet'
import Modal from '../UI/Modal/Modal'
import Upload from '../Upload/Upload'
import UploadAvatar from '../UploadAvatar/UploadAvatar'
import EditText from './EditText'
import ImageView from './ImageView'
import axios from '../../axios/axios'

const Profile = () => {
   const { data, error, loading, setData } = useHttpGet('/api/profiles')
   const { data: photos, setData: setPhotos } = useHttpGet('/api/profiles/photos')
   const [showUploadModal, setShowUploadModal] = useState(false)
   const [showAvatarModal, setShowAvatarModal] = useState(false)
   const [showProfileTextModal, setShowProfileTextModal] = useState(false)
   const [activePhoto, setActivePhoto] = useState(null)

   const deletePhotos = id => {
      axios.delete('/api/photos/' + id)
         .then(({ data }) => {
            const newPhotos = photos.filter(p => p.id !== data.photo.id)
            setPhotos(newPhotos)
            setActivePhoto(null)
         })
   }

   if (loading) {
      return <div className="profile"></div>
   }

   const { username, followers, followees, post_count, profile_text, avatar } = data || {}
   return (
      <>
         {activePhoto && <Modal extraClass="photo-modal">
            <ImageView
               avatar={avatar}
               username={username}
               photo={activePhoto.path}
               id={activePhoto.id}
               deletePhoto={deletePhotos} />
         </Modal>}

         <div className="container flex" onClick={e => {
            activePhoto && setActivePhoto(null)
            showUploadModal && setShowUploadModal(false)
            showAvatarModal && setShowAvatarModal(false)
            showProfileTextModal && setShowProfileTextModal(false)
         }}>

            {(showUploadModal || showAvatarModal || showProfileTextModal) && <Modal extraClass="action-modal">
               {showUploadModal && <Upload modalState={setShowUploadModal} addPhoto={setPhotos} username={username} />}
               {showAvatarModal && <UploadAvatar modalState={setShowAvatarModal} setAvatar={setData} username={username} />}
               {showProfileTextModal && <EditText initText={data.profile_text} modalState={setShowProfileTextModal} setProfileText={setData} />}
            </Modal>}

            <Header />
            <div className="profile">
               {error ? <p className="error">Something went wrong</p> :
                  <header className="profile__header">
                     <div className="profile__header__avatar">
                        {/* The filename for avatar will always be the same
                     so the date on img src acts as cachebreaker */}
                        <img src={avatar + '?' + new Date().getTime()} alt="avatar" />
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
                        <img
                           onClick={e => {
                              e.stopPropagation()
                              setActivePhoto({ path: p.file_path, id: p.id })
                           }} src={p.small_file_path} alt="uploaded by user" />
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

export default Profile
