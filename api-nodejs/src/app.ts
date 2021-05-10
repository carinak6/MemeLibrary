import express from 'express';
import mysql from 'mysql';
//const mysql = require('mysql');
//import bodyParser from 'body-parser';
var bodyParser = require("body-parser");
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
//const bcrypt = require('bcrypt');

require('dotenv').config()


const app = express();
const port = 3500;

/* connexion à la BDD */
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PWD,
    port: process.env.DB_PORT,         
    ssl: true 
  });

  /* verification de la connexion à la BDD*/
  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      connection.end();
      //mysql_handleDisconnect(); // We introduce a delay before attempting to reconnect,
    }else{                                    // to avoid a hot loop, and to allow our node script to
        console.log('Connection established BRAVO!!!');// process asynchronous requests in the meantime.
                                                // If you're also serving http, display a 503 error.
    } 
  }); 

  
app.use(bodyParser.urlencoded({ extended: true }) );

/* function middleware pour l utiliser dans toutes les routes*/
const authentification=(req, res, next) =>{

  console.log('Entra à authentification');

  try{
      /* pour chaque route cote front il faudra envoyer le token */
      //localhost:3500/addMeme?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNjIwNDgxNTczfQ.sbfs4zqJ-b2LeZ0XsDrkgwbJpFPk-JdxF8A5moq_77c
      const {token} = req.query; //on recupere le token qui est en parametre dans req, on utilise{}
      //pour donner au nom de la variable le meme que du parametre en req 

      console.log('-------- token authentification : ',token);

      //verifier le token avec jwt
      const decoded = jwt.verify(token, process.env.KEY_JWT);
      console.log(decoded.id); //doit retourner l id de l'utilisateur
      console.log('OK authentification');
      next();

  }catch(err){
     console.log(err);
     res.send(err);
  }
    

}

/* function middleware pour l utiliser dans toutes les routes*/
const authentification=(req, res, next) =>{

  console.log('Entra à authentification');

  try{
      /* pour chaque route cote front il faudra envoyer le token */
      //localhost:3500/addMeme?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNjIwNDgxNTczfQ.sbfs4zqJ-b2LeZ0XsDrkgwbJpFPk-JdxF8A5moq_77c
      const {token} = req.query; //on recupere le token qui est en parametre dans req, on utilise{}
      //pour donner au nom de la variable le meme que du parametre en req 

      console.log('-------- token authentification : ',token);

      //verifier le token avec jwt
      const decoded = jwt.verify(token, process.env.KEY_JWT);
      console.log(decoded.id); //doit retourner l id de l'utilisateur
      console.log('OK authentification');
      next();

  }catch(err){
     console.log(err);
     res.send(err);
  }
    

}

app.get('/', (req, res, next) => {
   res.send('On est connecté, VAMOS!!!');
});

/* formulaire Ajouter un meme */
app.get('/addMeme',(req, res, next) => {

  console.log('route Addmeme');

  res.send(`<!DOCTYPE html>
  <html lang="fr">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Formulaire</title>
  </head>
  <body>
         <h1> Ajouter un meme  </h1>
        <!-- il faut envoyer le token dans action aussi--> 
          <form action="/api/add/meme?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNjIwNDgxNTczfQ.sbfs4zqJ-b2LeZ0XsDrkgwbJpFPk-JdxF8A5moq_77c" method="post">
              Nom : <input type="text" name="meme" id="">
              URL : <input type="text" name="url" id="">
              user (il sera cache) : <input type="text" name="user" id="">
              <button type="submit">Envoyer</button>
      </form>
  </body>
  </html>`);  
});


//gestionnaires de routage pour ajouter un meme
app.route('/api/add/meme')
    .get(function(req, res) {
        res.send('partie Get de la route ajoute');
        console.log('GET request de la route add');
        //next();
    })
    .post(authentification,function (req, res) {
        console.log(JSON.stringify(req.body)); //recupere tous les parametres        

        const name= req.body.meme;
        const url_meme = req.body.url;
        const user_meme = req.body.user;

        connection.query('INSERT INTO memes (name, url_image,user_id) VALUES (?, ?, ?);', [name, url_meme,user_meme], 
          function (err, results, fields) {
              if (err) throw err;
              console.log('Inserted ' + results.affectedRows + ' row(s).');
              res.json({results});
        });
        
        //res.send('POST request ADD sur la BDD');
        console.log('POST request de la route add');
        
    });

/** Affiche tous les memes --> authentification?? je croit pas */
app.get('/api/allMemes',async (req, res, next) => {      
        
      const query = "SELECT * FROM memes";
      connection.query( query, function (err, results, fields) {
          if (err) {throw err;}
          else{
              console.log('Selected ' + results.length + ' row(s).'); 
              res.json({results});
             
              console.log('Done !!!.');
          }
      });
})

//quand on demande sur un meme en particuliere par ID, au cas où
app.get('/api/meme/:id', authentification, function (req, res) { 
  //console.log(JSON.stringify(req.body)); //recupere tous les parametres
  //console.log(req.url);
  console.log(req.params.id);
  const id_meme =req.params.id;

  connection.query('SELECT * from memes where id = ? ',[id_meme], 
    function (err, results, fields) {
        if (err) throw err;
        if(results[0] != undefined){
          console.log('Recupere : ' + JSON.stringify(results[0]));
          res.json({results});
        }else{
          res.send("Meme inexistante !!") ;
        }
        
  });
      
});


/* Formulaire pour Ajouter un utilisateur */
app.get('/addUser', (req, res, next) => {
  //res.send('Nos conectamos VAMOS!!!');
  //res.redirect('./src/index.html');
  res.send(`<!DOCTYPE html>
  <html lang="fr">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Formulaire</title>
  </head>
  <body>  
          <h1>Nouveau utilisateur</h1>
          <form action="/api/add/user?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNjIwNDgxNTczfQ.sbfs4zqJ-b2LeZ0XsDrkgwbJpFPk-JdxF8A5moq_77c" method="post">
              Nom : <input type="text" name="name" id="">
              Identfiant : <input type="text" name="email" id="">
              Password : <input type="text" name="pwd" id="">              
              <button type="submit">Envoyer</button>
          </form>
  </body>
  </html>`);
  //next();
});

//gestionnaires de routage pour ajouter un utilisateur
//une autre maniere de creer une route qui donne l'option d'utiliser un methode get et post pour la meme route
app.route('/api/add/user')    
    .post(function (req, res) {
        console.log(JSON.stringify(req.body)); //recupere tous les parametres
        console.log(req.body.name);
        const name= req.body.name; //userName sur React
        const mail = req.body.email; //userMail
        const pwd = req.body.pwd; //userPassword
        
        /**mode synchrone, encrypte le password */
        let psw_encr = bcrypt.hashSync(pwd, 10);
       

      connection.query('INSERT INTO users (name, mail,pwd) VALUES (?, ?, ?);', [name, mail,psw_encr], 
        function (err, results, fields) {
            if (err) throw err;
            console.log('Inserted ' + results.affectedRows + ' row(s).');
            res.json({results});
      });
        
               
        console.log('POST request de la route add');       
    });


/** Formulaire login */
app.get('/login', (req, res, next) => {
  
  res.send(`<!DOCTYPE html>
  <html lang="fr">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Formulaire</title>
  </head>
  <body>
          <form action="/api/login/" method="post">
              Identfiant : <input type="text" name="identifiant" id="">
              Password : <input type="text" name="pwd" id="">              
              <button type="submit">Envoyer</button>
      </form>
  </body>
  </html>`);  
});



/* Verification si l'user est bien enregistre dans la BDD*/
app.route('/api/login/')  
  .post(function (req, res) {
      const mail= req.body.identifiant;
      const pwd= req.body.pwd;
      console.log(mail);       
      

      connection.query('SELECT * FROM users WHERE mail = ? ', [mail], 
        function (err, results, fields) {
            if (err) throw err;
            console.log('Trouvé : ' + JSON.stringify(results) + ' .');

            if(results[0] != undefined){
                //version synchrone

                if (bcrypt.compareSync(pwd, results[0]['pwd'])) {
                      //res.send("Bienvenue "+results[0]['name'])
                      
                      //res.json({'id':results[0]['id'], 'mail': results[0]['mail'], 'name' :results[0]['name']});
                      
                      /*on crée un token, foo: 'bar' ==>la data dans le tocken, faire attention avec, et 'shhhhh' la cle, il faut
                      le garder dans les secrets, dans les variable d'environements, pas le laiser dans le front */
                      const token = jwt.sign({id : results[0]['id']}, process.env.KEY_JWT);
                      /*token reste dans le serveur pour verifier les connexions*/
                      console.log('token : ',token);
                      res.send(token); //il faudra le recuperer dans le front et le stocker dans le localstorage

                } else {
                      res.send("Mots incorrecte !! pour l'email "+results[0]['mail'])
                }  
              
            }else{
              res.send('Inexistante');
            }
            
      });
      
      //res.send('POST request ADD sur la BDD');
      console.log('POST request de la route add');
  });

//on affiche tous les utilisateurs  
app.get('/api/allUsers', async (req, res, next) => {
  
      console.log('Entra au endpoint all user');
      
      const query = "SELECT * FROM users "
      connection.query(query, (error, results) => {
          if(!results[0]){
            res.json({status : "not found"})
          }
          console.log({results})
          res.json({ results });
        });

})

//on affiche tous les memes par un utilisateur  
app.get('/api/memesUser/:id', async (req, res, next) => {
  
  console.log('Entra au endpoint memes par user');
  console.log(req.params.id);
  const id_user =req.params.id;

  connection.query('SELECT m.* FROM memes m , users u WHERE u.id = m.user_id AND u.id = ? ',[id_user], 
    function (err, results, fields) {
        if (err) throw err;
       // if(results != undefined){
          console.log('Recupere : ' + JSON.stringify(results));
          res.json({results});
        // }else{
        //   res.send("Memes inexistante !!") ;
        // }
        
  });
  
  const query = "SELECT * FROM users "
  connection.query(query, (error, results) => {
      if(!results[0]){
        res.json({status : "not found"})
      }
      console.log({results})
      res.json({ results });
    });

})

app.listen(port, () => {
  //   if (err) {
  //     console.error(err); //return 
  //   }
    console.log(`Le serveur est activé dans le port : ${port}`); //return 
});