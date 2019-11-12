const router = require('express').Router()
const db = require('../db')
const auth = require('../middleware/auth')
router.post('/', auth, (req, res) => {

})

router.get('/', auth, async (req, res) => {
   const { rows } = await db.raw(`
      SELECT
         username,
         COALESCE(followers, 0) as followers,
         COALESCE(followees, 0) as followees,
         COALESCE(post_count, 0) as post_count,
         p.profile_text
      FROM users
      LEFT JOIN (
         SELECT
            follower,
            COUNT(follower) as followers
         FROM follow GROUP BY follower
      ) f ON f.follower = users.id
      LEFT JOIN (
            SELECT
            followee,
            COUNT(followee) as followees 
         FROM follow GROUP BY followee
      ) f2 ON f2.followee = users.id
      LEFT JOIN (
         SELECT
            uploaded_by as ub,
            COUNT(*) as post_count
         FROM photos GROUP BY uploaded_by
      ) ph ON ph.ub = users.id
      LEFT JOIN profiles p ON p.user = users.id 
      WHERE users.id = ?;
   `, req.userId)

   res.json(rows[0])
})

module.exports = router