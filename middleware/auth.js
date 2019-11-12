const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
   try {
      const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)
      req.userId = userId
      next()
   } catch (err) {
      console.log(err)
      res.status(401).json({
         err
      })
   }
}

module.exports = auth