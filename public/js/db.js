//database 
const mysql = require('mysql'); 
const util = require('util')
var conn = mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER, 
    password:process.env.DATABASE_PASSWORD, 
    database: process.env.DATABASE_DB, 
})

// promise wrapper to enable async await with MYSQL
const query = util.promisify(conn.query).bind(conn);

async function getUserRecords(id){
    const rows = await query("SELECT * FROM records WHERE user_id = ? ",[id]); 
    return rows;
    
}

module.exports = getUserRecords;