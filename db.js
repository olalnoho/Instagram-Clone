const knex = require('knex')      

const db = knex({
   client: 'pg',
   version: '11.5',
   connection: {
      host: '127.0.0.1',
      password: 'password',       
      database: 'gramclone',      
      user: 'duh'
   }
})

module.exports = db