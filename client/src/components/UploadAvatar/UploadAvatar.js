import React, { useState } from 'react'
import useHttp from '../../hooks/useHttp'

const UploadAvatar = ({ username, setAvatar, modalState }) => {
   const [file, setFile] = useState()
   const [fileName, setFileName] = useState('Choose a file')
   const { error, fetchData } = useHttp('/api/upload/avatar')
   const uploadFile = async e => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('username', username)
      const { file: avatar } = await fetchData(formData)
      setAvatar(prev => ({
         ...prev,
         avatar
      }))
      modalState(false)
   }

   const fileHandler = e => {
      const file = e.target.files[0]
      if (file) {
         setFile(file)
         setFileName(file.name)
      }
   }

   return (
      <div className="upload">
         {error && <p className="error">Something went wrong</p>}
         <h2 className="heading-2">
            Change avatar
         </h2>
         <div className="form">
            <input
               type="file"
               name="file"
               id="file"
               className="inputfile"
               onChange={fileHandler} />
            <label htmlFor="file"> {fileName} </label>
            <input type="submit" value="Upload" onClick={e => {
               uploadFile()
            }} />
         </div>
      </div>
   )
}

export default UploadAvatar
