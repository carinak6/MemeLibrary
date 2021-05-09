const mysql = require('mysql');

const config =
{
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PWD, 
    database: process.env.DB_NAME, 
    port: 3306,
    ssl: true
};

module.exports = function (context, myBlob) {

    const URL_BLOB = context.bindingData.uri;
    const NAME_BLOB = context.bindingData.name;
    const OWNER_BLOB = context.bindingData.metadata.user_id || null;

    const conn = new mysql.createConnection(config);

    conn.connect(
        function (err) { 
            if (err) { 
                context.log("!!! Cannot connect !!! Error:");
                throw err;
            }
            else {
                context.log("Connection established.");
                insertData();
            }
        });

    function insertData(){
        conn.query('INSERT INTO memes (name, url_image, user_id) VALUES (?, ?, ?);', [ NAME_BLOB, URL_BLOB, OWNER_BLOB], 
        function (err, results, fields) {
                    if (err) throw err;
            console.log('Inserted ' + results.affectedRows + ' row(s).');
            })
            conn.end(
                function (err) { 
                    if (err) throw err;
                    else  context.log('Closing connection.') 
            });
        };

};