const fs = require('fs').promises
const path = require('path')
const sharp = require('sharp')
const router = require('express').Router()

const db = require('../db')
const auth = require('../middleware/auth')

router.post('/', auth, async (req, res) => {
   const { file } = req.files || {}
   const username = req.body.username

   if (!file) {
      return res.status(400).json({
         err: 'No file'
      })
   }

   let folder = path.join(__dirname, '../public', username)
   let fullPath = path.resolve(folder, file.name)
   try {
      await fs.access(folder)
      await sharp(file.data).resize(600).toFile(fullPath)
   } catch (err) {
      if (err.code === 'ENOENT') {
         await fs.mkdir(folder, { recursive: true })
         await sharp(file.data).resize(600).toFile(fullPath)
      } else {
         return res.status(500).json({
            err: 'Server error'
         })
      }
   }

   try {
      await db('photos').insert({
         uploaded_by: req.userId,
         file_path: `${username}/${file.name}`
      })
   } catch (err) {
      return res.status(500).json({
         err: 'Unable to save image to database'
      })
   }

   return res.json({
      file: fullPath
   })
})

module.exports = router

/*
   id SERIAL PRIMARY KEY,
   uploaded_by INT,
   file_path VARCHAR(255),
*/