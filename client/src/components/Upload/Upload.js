import React, { useState } from 'react'

const Upload = () => {
   const [file, setFile] = useState()
   const [fileName, setFileName] = useState('Choose a file')
   const [allTags, setAllTags] = useState([])
   const [tag, setTag] = useState('')

   const uploadFile = e => {
      const formData = new FormData()
      formData.append('file', file)
   }

   const addTag = e => {
      if (e.key === 'Enter' && e.target.value) {
         setAllTags([...allTags, e.target.value])
         setTag('')
      }
   }

   const deleteTag = (i) => {
      const tagCopy = allTags.slice()
      tagCopy.splice(i, 1)
      setAllTags(tagCopy)
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
         <h2 className="heading-2">
            Upload a photo
         </h2>
         <div className="form">
            <input type="text" placeholder="Image description" />
            <input
               type="file"
               name="file"
               id="file"
               className="inputfile"
               onChange={fileHandler} />
            <label htmlFor="file"> {fileName} </label>
            <div className="tag-holder">
               <span className="labelfortags"> Your tags: </span>
               {allTags.map((t, i) => {
                  return <span key={i} onClick={() => deleteTag(i)} className="tag">
                     {t}
                  </span>
               })}
            </div>
            <input
               type="text"
               placeholder="Tags. Press enter to add them."
               value={tag}
               onKeyDown={addTag}
               onChange={e => setTag(e.target.value)}
            />

            <input type="submit" value="Upload" />
         </div>
      </div>
   )
}

export default Upload
