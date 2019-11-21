const router = require('express').Router()
const db = require('../db')
const fs = require('fs').promises
const path = require('path')
const auth = require('../middleware/auth')

router.get('/:id', async (req, res) => {
   try {
      const data = await db.raw(`
      SELECT
         pc.comment,
         u.username,
         p.avatar,
         pc.created_at
      FROM photo_comments pc
      INNER JOIN users u ON pc.user = u.id
      INNER JOIN profiles p ON p.user = u.id
      WHERE pc.photo = ?
      ORDER BY created_at;
      `, req.params.id)

      return res.json(data.rows)
   }
   catch {
      return res.status(500).json({
         err: 'Comments could not be loaded'
      })
   }
})

router.post('/:id', auth(true), async (req, res) => {
   const { userId } = req

   try {
      const [data] = await db('photo_comments').insert({
         photo: req.params.id,
         user: userId,
         comment: req.body.comment
      }, '*')

      return res.json(data)

   } catch (err) {
      if (err.code == '23503') {
         return res.status(400).json({
            err: 'Photo does not exist'
         })
      }
      return res.status(500).json({ err })
   }
})

router.delete('/:id', auth(true), async (req, res) => {
   try {

      const photo = await db('photos')
         .delete()
         .where({
            uploaded_by: req.userId,
            id: req.params.id
         }).returning('*')

      const file_path = path.join(__dirname, '../public', photo[0].file_path)
      const small_file_path = path.join(__dirname, '../public', photo[0].small_file_path)

      await fs.unlink(file_path)
      await fs.unlink(small_file_path)

      res.json({
         photo: photo[0]
      })
      
   } catch (err) {
      console.log(err)
      res.status(400).json({
         err: err.message
      })
   }
})

module.exports = router