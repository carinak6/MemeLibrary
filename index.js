const express = require('express')
const mysql = require('mysql')

const app = express()

const db = mysql.createConnection({
    host: 'db-librariememe.mysql.database.azure.com',
    user: 'mmm@db-librariememe',
    database: 'db_meme_library',
    password: 'Pwd_admin_123',
    port: 3306,
    ssl: true
})

// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     database: 'db_meme_library',
//     password: 'root'
// })

db.connect(function(err){
    if(err){
        console.log('Error connecting to Db');
        db.end();
    }else{
        console.log('Connection established');
    }
});

function getAllMemes(req, res) {
    db.connect(function(err) {
        console.log('Connecté à la base de données MYSQL!')
        db.query("SELECT * FROM memes LIMIT 10", (err, result) => {
            if (err) throw err;
            // res.json(result.rows)
            res.end(JSON.stringify(result.rows))
            // console.log(result)
        })
    })
}

app.use((req, res, next) => {
    res.set("Access-Control-Allow-Origin", "*");
    next();
})

app.get("/", getAllMemes)

app.listen(3000, () => {
    console.log("Listening on port 3000")
})