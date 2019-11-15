const jwt = require('jsonwebtoken')

const auth = requireAuth => async (req, res, next) => {
   try {
      const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)
      req.userId = userId
      next()
   } catch (err) {
      if(!requireAuth) {
         req.userId = null
         return next()
      }

      res.status(401).json({
         err
      })
   }
}

module.exports = auth