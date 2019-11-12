module.exports = require('knex')({
   client: 'pg',
   version: '11.5',
   connection: {
     host : process.env.DB_HOST,
     user : 'duh',
     password : process.env.DB_PASSWORD,
     database : 'gramclone'
   }
 });
 