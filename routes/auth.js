const router = require('express').Router()
const bcrypt = require('bcryptjs')
const generateToken = require('../utils/generateToken')
const db = require('../db')
const auth = require('../middleware/auth')

router.post('/login', async (req, res) => {
   const { identifier, password } = req.body

   if (!identifier || !password) {
      return res
         .status(400)
         .json({ err: 'Missing required fields' })
   }

   const [user] = await db('users')
      .select('*')
      .where({ email: identifier })
      .orWhere({ username: identifier })
      .innerJoin('profiles', 'profiles.user', 'users.id')

   if (!user) {
      return res
         .status(401)
         .json({ err: 'Invalid credentials' })
   }

   const isValid = await bcrypt.compare(password, user.password)

   if (!isValid) {
      return res
         .status(401)
         .json({ err: 'Invalid credentials' })
   }

   return res.json({
      token: generateToken(user.id),
      user
   })
})

router.get('/me', auth(true), async (req, res) => {
   try {
      // @note
      // join with profile for avatar
      const [user] = await db('users')
         .select('*')
         .where({ "users.id": req.userId })
         .innerJoin('profiles', 'profiles.user', 'users.id')

      if (!user) {
         res.status(404).json({
            err: 'User not found'
         })
      }
      res.json(user)
   } catch (err) {
      console.log(err);
      
      res.status(500).json({
         err: 'Error when retrieving user data'
      })
   }
})

module.exports = router