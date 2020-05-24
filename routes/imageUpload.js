const fs = require('fs').promises
const path = require('path')
const jimp = require('jimp')
const router = require('express').Router()

const db = require('../db')
const auth = require('../middleware/auth')

router.post('/', auth(true), async (req, res) => {
   const { file } = req.files || {}
   const { username, description, tags: unformattedTags } = req.body

   const tags = unformattedTags.split(',')

   if (!file) {
      return res.status(400).json({
         err: 'No file'
      })
   }

   let folder = path.join(__dirname, '../public', username)
   let fullPath = path.resolve(folder, file.name)
   let smallFullPath = path.resolve(folder, `small-${file.name}`)
   try {
      await fs.access(folder)
      // first null in resize means width will auto-scale to height.
      const img = await jimp.read(file.data)
      const img2 = await jimp.read(file.data)
      await img.resize(jimp.AUTO, 600)
      await img.write(fullPath)
      await img2.resize(jimp.AUTO, 300)
      await img2.write(smallFullPath)
   } catch (err) {
      if (err.code === 'ENOENT') {
         try {
            await fs.mkdir(folder, { recursive: true })
            const img = await jimp.read(file.data)
            img.resize(jimp.AUTO, 600)
            await img.write(fullPath)
            const img2 = await jimp.read(file.data)
            await img2.resize(jimp.AUTO, 600)
            await img.write(smallFullPath)
         } catch(err) {
            return res.status(500).json({
               err: 'Unable to save image to filesystem'
            })
         }

      } else {
         return res.status(500).json({
            err: 'Unable to save image to filesystem'
         })
      }
   }

   try {
      const [fileData] = await db('photos').insert({
         uploaded_by: req.userId,
         file_path: `${username}/${file.name}`,
         small_file_path: `${username}/small-${file.name}`,
         description,
         tags
      }, ['file_path', 'small_file_path', 'id', 'description'])

      return res.json({
         file: fileData,
      })

   } catch (err) {
      return res.status(500).json({
         err: 'Unable to save image to database'
      })
   }
})

router.post('/avatar', auth(true), async (req, res) => {
   const { file } = req.files || {}
   const username = req.body.username
   const { userId } = req

   if (!file) {
      return res.status(400).json({
         err: 'No file'
      })
   }

   let folder = path.join(__dirname, '../public/avatars')
   let fullPath = path.resolve(folder)
   try {
      // first null in resize means width will auto-scale to height.
      const img = await jimp.read(file.data)
      await img.resize(jimp.AUTO, 150)
      await img.write(fullPath + '/' + `${username}.png`)
   } catch (err) {
      return res.status(500).json({
         err: 'Unable to save image to filesystem'
      })
   }

   try {
      const [fileData] = await db('profiles').update({
         avatar: `avatars/${username}.png`
      }).where({
         user: userId
      }).returning('avatar')

      return res.json({
         file: fileData
      })

   } catch (err) {
      console.log(err)
      return res.status(500).json({
         err: 'Unable to save image to database'
      })
   }
})

module.exports = router