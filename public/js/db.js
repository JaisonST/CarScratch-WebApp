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


const dbModule = {
    getRecords: async function(id){
        const rows = await query("SELECT * FROM records WHERE user_id = ? ORDER BY time desc",[id]); 
        return rows;    
    }, 
    deleteRecord:async function (id){
        const rows = await query("DELETE FROM records WHERE id = ? ",[id]); 
    }
}


async function delRecord(id){
    const rows = await query("SELECT * FROM records WHERE user_id = ? ",[id]); 
    return rows;    
}

async function getUserRecords(id){
    const rows = await query("DELETE FROM records WHERE id = ? ",[id]); 
    return rows;    
}

module.exports = dbModule;