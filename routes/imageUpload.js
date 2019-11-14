const router = require('express').Router()
const fs = require('fs').promises
const path = require('path')

router.post('/', async (req, res) => {
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
      await file.mv(fullPath)
   } catch (err) {
      if (err.code === 'ENOENT') {
         await fs.mkdir(folder, { recursive: true })
         await file.mv(fullPath)
      } else {
         return res.status(500).json({
            err: 'Server error'
         })
      }
   }
   return res.send('Ok')
})

module.exports = router