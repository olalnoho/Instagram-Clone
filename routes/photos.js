const router = require('express').Router()
const db = require('../db')
const auth = require('../middleware/auth')

router.get('/:id', async (req, res) => {
   try {
      const data = await db.raw(`
      SELECT
         pc.comment,
         u.username,
         p.avatar
      FROM photo_comments pc
      INNER JOIN users u ON pc.user = u.id
      INNER JOIN profiles p ON p.user = u.id
      WHERE pc.photo = ?;
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
   console.log('got here')
   const { userId } = req

   try {
      const [data] = await db('photo_comments').insert({
         photo: req.params.id,
         user: userId,
         comment: req.body.comment
      }, '*')

      return res.json(data)

   } catch (err) {
      if(err.code == '23503') {
         return res.status(400).json({
            err: 'Photo does not exist'
         })
      }
      return res.status(500).json({err})
   }

   console.log('Got here')
})

module.exports = router