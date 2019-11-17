const router = require('express').Router()
const bcrypt = require('bcryptjs')
const generateToken = require('../utils/generateToken')
const db = require('../db')

router.post('/register', async (req, res) => {
   const { username, email, password } = req.body

   if (!username || !email || !password) {
      return res
         .status(400)
         .json({ error: 'Missing required fields' })
   }

   try {
      const hashedPw = await bcrypt.hash(password, 10)
      const [user] = await db('users')
         .insert({
            username,
            email,
            password: hashedPw
         }, '*')

      await db('profiles').insert({
         user: user.id
      })

      return res.json({
         user,
         token: generateToken(user.id)
      })
   } catch (err) {
      // 23505 is a unique-constraint violation in DB
      if (err.code == 23505) {
         const fieldRegex = /\((.+)\)\=/
         // (field)=(value) is the thing we're matching
         const field = err.detail.match(fieldRegex)[1]
         return res
            .status(409)
            .json({ err: `${field} already taken` })
      }

      return res
         .status(500)
         .json({ err: 'Server error' })
   }
})

module.exports = router