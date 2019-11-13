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

router.get('/:username', auth, async (req, res) => {
   const { rows } = await db.raw(`
      SELECT
      username,
      users.id,
      COALESCE(followers, 0) as followees,
      COALESCE(followees, 0) as followers,
      COALESCE(post_count, 0) as post_count,
      COALESCE(isFollowing.followee, 0) as isFollowing,
      COALESCE(p.profile_text, 'No text') as profile_text
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
      LEFT JOIN (
         SELECT
            followee,
            follower
         FROM follow
         WHERE follower = ?
      ) isFollowing ON isFollowing.followee = users.id
      LEFT JOIN profiles p ON p.user = users.id 
      WHERE users.username = ?;
   `, [req.userId, req.params.username])

   if (!rows.length) {
      return res
         .status(404)
         .json({
            err: 'Could not find profile for this user'
         })
   }

   res.json(rows[0])
})

router.post('/follow/:id', auth, async (req, res) => {
   if (req.params.id == req.userId) {
      return res.status(400).json({
         err: 'You cannot follow yourself'
      })
   }
   try {
      await db('follow').insert({
         follower: req.userId,
         followee: req.params.id
      })
      return res.send('Ok')
   } catch (err) {
      console.log(err)
      res.status(400).json({
         err: 'You already follow this user'
      })
   }
})

router.post('/unfollow/:id', auth, async (req, res) => {
   try {
      await db('follow').delete().where({
         follower: req.userId,
         followee: req.params.id
      })
      return res.send('Ok')
   } catch (err) {
      console.log(err)
      res.status(400).json({
         err: 'You already follow this user'
      })
   }
})

module.exports = router

// router.get('/:username', auth, async (req, res) => {
//    const { rows } = await db.raw(`
//       SELECT
//          username,
//          users.id,
//          COALESCE(followers, 0) as followers,
//          COALESCE(followees, 0) as followees,
//          COALESCE(post_count, 0) as post_count,
//          p.profile_text
//       FROM users
//       LEFT JOIN (
//          SELECT
//             follower,
//             COUNT(follower) as followers
//          FROM follow GROUP BY follower
//       ) f ON f.follower = users.id
//       LEFT JOIN (
//          SELECT
//             followee,
//          COUNT(followee) as followees
//          FROM follow GROUP BY followee
//       ) f2 ON f2.followee = users.id
//       LEFT JOIN (
//          SELECT
//             uploaded_by as ub,
//             COUNT(*) as post_count
//          FROM photos GROUP BY uploaded_by
//       ) ph ON ph.ub = users.id
//       LEFT JOIN (
//          SELECT
//             followee
//          FROM follows WHERE follower = users.id
//       ) isfollow
//       LEFT JOIN profiles p ON p.user = users.id 
//       WHERE users.username = ?;
//    `, req.params.username)

//    if (!rows.length) {
//       return res
//          .status(404)
//          .json({
//             err: 'Could not find profile for this user'
//          })
//    }

//    res.json(rows[0])
// })