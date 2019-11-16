import React, { useState } from 'react'
import useHttp from '../../hooks/useHttp'
const EditText = ({ setProfileText, modalState }) => {
   const [text, setText] = useState('')
   const { fetchData, error } = useHttp('/profiles/edit_profile')

   const sendData = async e => {
      e.preventDefault()
      const newText = await fetchData({ text })
      setProfileText(prev => ({
         ...prev,
         profile_text: newText
      }))
      modalState(false)
   }
   return (
      <div className="profiletext" onSubmit={sendData}>
         {error && <p className="error">Something went wrong</p>}
         <h2 className="heading-2">
            Change profile description
      </h2>
         <form className="form">
            <textarea value={text} onChange={e => setText(e.target.value)} />
            <input type="submit" />
         </form>
      </div>
   )
}

export default EditText
