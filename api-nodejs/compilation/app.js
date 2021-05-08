"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mysql_1 = __importDefault(require("mysql"));
const cors_1 = __importDefault(require("cors"));
//import bodyParser from 'body-parser';
var bodyParser = require("body-parser");
const bcrypt_1 = __importDefault(require("bcrypt"));
// import * as multer from 'multer'
const multer_1 = __importDefault(require("multer"));
const storage_blob_1 = require("@azure/storage-blob");
// import multer, { Multer } from 'multer'
require('dotenv').config();
const app = express_1.default();
app.use(cors_1.default());
const port = 3500;
const storage = multer_1.default.memoryStorage();
const upload = multer_1.default({ storage: storage });
function upload_file(filename, content_file, filetype, n_user) {
    return __awaiter(this, void 0, void 0, function* () {
        const account = "mmmstorageaccount";
        const accountKey = "n/1EsO8u7lMZnjw6TqPm607DuPXTMxXD5qY9CRpFA8DVyCAfZhb/VlES4/1XyJ7zzuGOxcg70Pn2GBXtmsZ/kQ==";
        const sharedKeyCredential = new storage_blob_1.StorageSharedKeyCredential(account, accountKey);
        const blobServiceClient = new storage_blob_1.BlobServiceClient(`https://${account}.blob.core.windows.net`, sharedKeyCredential);
        const containerClient = blobServiceClient.getContainerClient('memes');
        const content = content_file;
        const blobName = filename;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        const uploadBlobResponse = yield blockBlobClient.upload(content, Buffer.byteLength(content), { blobHTTPHeaders: { blobContentType: filetype } });
        const metadataProperties = {};
        metadataProperties.user_id = n_user;
        containerClient.getBlobClient(filename).setMetadata(metadataProperties);
        console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
    });
}
// const azureStorage: MulterAzureStorage = new MulterAzureStorage({
//   connectionString: "DefaultEndpointsProtocol=https;AccountName=mmmstorageaccount;AccountKey=n/1EsO8u7lMZnjw6TqPm607DuPXTMxXD5qY9CRpFA8DVyCAfZhb/VlES4/1XyJ7zzuGOxcg70Pn2GBXtmsZ/kQ==;EndpointSuffix=core.windows.net",
//   accessKey: "n/1EsO8u7lMZnjw6TqPm607DuPXTMxXD5qY9CRpFA8DVyCAfZhb/VlES4/1XyJ7zzuGOxcg70Pn2GBXtmsZ/kQ==",
//   accountName: "mmmstorageaccount",
//   containerName: "memes",
// blobName: resolveBlobName,
// metadata: resolveMetadata,
//   containerAccessLevel: 'blob',
//   urlExpirationTime: 60
// });
/* connexion à la BDD */
const connection = mysql_1.default.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PWD,
    port: process.env.DB_PORT,
    ssl: true
});
/* verification de la connexion à la BDD*/
connection.connect(function (err) {
    if (err) { // or restarting (takes a while sometimes).
        console.log('CARINA ==> error when connecting to db:', err);
        connection.end();
        //mysql_handleDisconnect(); // We introduce a delay before attempting to reconnect,
    }
    else { // to avoid a hot loop, and to allow our node script to
        console.log('Connection established BRAVO!!!'); // process asynchronous requests in the meantime.
        // If you're also serving http, display a 503 error.
    }
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res, next) => {
    res.send('On est connecté, VAMOS!!!');
});
/* formulaire Ajouter un meme */
app.get('/addMeme', (req, res, next) => {
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
          <form action="/api/add/meme" method="post" enctype="multipart/form-data">
              Your File : <input type="file" name="file" value="file" />
              <input type="hidden" name="user_id" value="1" />
              <button type="submit">Envoyer</button>
      </form>
  </body>
  </html>`);
});
app.get('/addMemeTest', (req, res, next) => {
    res.send(`<!DOCTYPE html>
  <html lang="fr">
  <head>
  
      <title>Formulaire</title>
  </head>
  <body>
         <h1> Ajouter un meme  </h1>
          <form action="/upload" method="post" enctype="multipart/form-data">
              Your File : <input type="file" name="keyform" value="file" />
              <input type="hidden" name="user_id" value="1" />
              <button type="submit">Envoyer</button>
      </form>
  </body>
  </html>`);
});
app.post('/upload', upload.single('keyform'), (req, res) => {
    console.log(req.file);
    upload_file(req.file['originalname'], req.file['buffer'], req.file['mimetype'], req.body['user_id']);
    res.send('ok');
});
//gestionnaires de routage pour ajouter un meme
app.route('/api/add/meme')
    .get(function (req, res) {
    res.send('partie Get de la route ajoute');
    console.log('GET request de la route add');
    //next();
})
    .post(function (req, res) {
    console.log(JSON.stringify(req.body)); //recupere tous les parametres        
    const name = req.body.meme;
    const url_meme = req.body.url;
    const user_meme = req.body.user;
    connection.query('INSERT INTO memes (name, url_image,user_id) VALUES (?, ?, ?);', [name, url_meme, user_meme], function (err, results, fields) {
        if (err)
            throw err;
        console.log('Inserted ' + results.affectedRows + ' row(s).');
        res.json({ results });
    });
    //res.send('POST request ADD sur la BDD');
    console.log('POST request de la route add');
});
/** Affiche tous les memes*/
app.get('/api/allMemes', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = "SELECT * FROM memes";
    connection.query(query, function (err, results, fields) {
        if (err) {
            throw err;
        }
        else {
            console.log('Selected ' + results.length + ' row(s).');
            res.json({ results });
            console.log('Done !!!.');
        }
    });
}));
//quand on demande sur un meme en particuliere par ID, au cas où
app.get('/api/meme/:id', function (req, res) {
    //console.log(JSON.stringify(req.body)); //recupere tous les parametres
    //console.log(req.url);
    console.log(req.params.id);
    const id_meme = req.params.id;
    connection.query('SELECT * from memes where id = ? ', [id_meme], function (err, results, fields) {
        if (err)
            throw err;
        if (results[0] != undefined) {
            console.log('Recupere : ' + JSON.stringify(results[0]));
            res.json({ results });
        }
        else {
            res.send("Meme inexistante !!");
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
          <form action="/api/add/user" method="post">
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
    const name = req.body.name; //userName sur React
    const mail = req.body.email; //userMail
    const pwd = req.body.pwd; //userPassword
    /**mode synchrone, encrypte le password */
    let psw_encr = bcrypt_1.default.hashSync(pwd, 10);
    connection.query('INSERT INTO users (name, mail,pwd) VALUES (?, ?, ?);', [name, mail, psw_encr], function (err, results, fields) {
        if (err)
            throw err;
        console.log('Inserted ' + results.affectedRows + ' row(s).');
        res.json({ results });
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
    const mail = req.body.identifiant;
    const pwd = req.body.pwd;
    console.log(mail);
    connection.query('SELECT * FROM users WHERE mail = ? ', [mail], function (err, results, fields) {
        if (err)
            throw err;
        console.log('Trouvé : ' + JSON.stringify(results) + ' .');
        if (results[0] != undefined) {
            //version synchrone
            if (bcrypt_1.default.compareSync(pwd, results[0]['pwd'])) {
                //res.send("Bienvenue "+results[0]['name'])
                res.json({ 'id': results[0]['id'], 'mail': results[0]['mail'], 'name': results[0]['name'] });
            }
            else {
                //res.send("Mots incorrecte !! pour l'email "+results[0]['mail'])
                res.json({ 'results': 'Mots de passe incorrect' });
            }
        }
        else {
            //res.send('Inexistante');
            res.json({ 'results': 'Inexistante' });
        }
    });
    //res.send('POST request ADD sur la BDD');
    console.log('POST request de la route add');
});
//on affiche tous les utilisateurs  
app.get('/api/allUsers', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Entra au endpoint all user');
    const query = "SELECT * FROM users ";
    connection.query(query, (error, results) => {
        if (!results[0]) {
            res.json({ status: "not found" });
        }
        console.log({ results });
        res.json({ results });
    });
}));
/* on demarre le serveur il ecoute dans le port defini avant  */
app.listen(port, () => {
    //   if (err) {
    //     console.error(err); //return 
    //   }
    console.log(`Le serveur est activé dans le port : ${port}`); //return 
});
//# sourceMappingURL=app.js.map