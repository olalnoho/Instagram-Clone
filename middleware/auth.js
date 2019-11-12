const jwt = require('jsonwebtoken')
const db = require('../db')

const auth = async (req, res, next) => {
   try {
      const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)
      const [user] = await db('users').select('*').where({ id: userId })
      req.user = user
      next()
   } catch (err) {
      res.status(401).json({
         err
      })
   }
}

module.exports = auth