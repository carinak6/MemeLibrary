"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
//const mysql = require('mysql');
//import bodyParser from 'body-parser';
const bodyParser = require("body-parser");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//const bcrypt = require('bcrypt');
const multer_1 = __importDefault(require("multer"));
const storage_blob_1 = require("@azure/storage-blob");
const storage = multer_1.default.memoryStorage();
const upload = multer_1.default({ storage: storage });
require('dotenv').config();
const app = express_1.default();
const port = 3500;
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
        console.log('Connection established !!');
    }
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors_1.default());
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Pass to next layer of middleware
    next();
});
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
        // ajouter la metadata
        const metadataProperties = {};
        metadataProperties.user_id = n_user;
        // fin ajouter la metadata
        containerClient.getBlobClient(filename).setMetadata(metadataProperties);
        console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
    });
}
app.post('/upload', upload.single('keyform'), (req, res) => {
    console.log(req.file);
    upload_file(req.file['originalname'], req.file['buffer'], req.file['mimetype'], req.body['user_id']);
    res.send('ok');
});
/* function middleware pour l utiliser dans toutes les routes*/
const authentification = (req, res, next) => {
    console.log('Entra à authentification');
    try {
        const { token } = req.query;
        console.log('-------- token authentification : ', token);
        //verifier le token avec jwt
        const decoded = jsonwebtoken_1.default.verify(token, process.env.KEY_JWT);
        console.log(decoded.id); //doit retourner l id de l'utilisateur
        console.log('OK authentification');
        next();
    }
    catch (err) {
        console.log(err);
        res.send(err);
    }
};
app.get('/', (req, res, next) => {
    res.send('On est connecté, VAMOS!!!');
});
//gestionnaires de routage pour ajouter un meme
app.post('/api/add/meme', authentification, (req, res) => {
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
/** Affiche tous les memes --> authentification?? je croit pas */
app.get('/api/allMemes', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
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
app.get('/api/meme/:id', authentification, function (req, res) {
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
//gestionnaires de routage pour ajouter un utilisateur
//une autre maniere de creer une route qui donne l'option d'utiliser un methode get et post pour la meme route
app.post('/api/add/user', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(JSON.stringify(req.body)); //recupere tous les parametres
    console.log('this is req.body.user', req.body.user);
    const user = req.body.user; //userName sur React
    const mail = req.body.mail; //userMail
    const password = req.body.password; //userPassword
    /**mode synchrone, encrypte le password */
    const salt = yield bcrypt_1.default.genSalt(10);
    let psw_encr = bcrypt_1.default.hashSync(password, salt);
    connection.query('INSERT INTO users (name, mail,pwd) VALUES (?, ?, ?);', [user, mail, psw_encr], function (err, results) {
        console.log('POST request de la route add'),
            console.log('done');
        //res.send({ results });
    });
}));
/* Verification si l'user est bien enregistre dans la BDD*/
app.post('/api/login/', (req, res) => {
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
                //res.json({'id':results[0]['id'], 'mail': results[0]['mail'], 'name' :results[0]['name']});
                /*on crée un token, foo: 'bar' ==>la data dans le tocken, faire attention avec, et 'shhhhh' la cle, il faut
                le garder dans les secrets, dans les variable d'environements, pas le laiser dans le front */
                const token = jsonwebtoken_1.default.sign({ id: results[0]['id'] }, process.env.KEY_JWT);
                /*token reste dans le serveur pour verifier les connexions*/
                console.log('token : ', token);
                res.send(token); //il faudra le recuperer dans le front et le stocker dans le localstorage
            }
            else {
                res.send("Mots incorrecte !! pour l'email " + results[0]['mail']);
            }
        }
        else {
            res.send('Inexistante');
        }
    });
    //res.send('POST request ADD sur la BDD');
    console.log('POST request de la route add');
});
//on affiche tous les utilisateurs  
app.get('/api/allUsers', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    console.log('Entra au endpoint all user');
    const query = "SELECT * FROM users ";
    connection.query(query, (error, results) => {
        if (!results[0]) {
            res.json({ status: "not found" });
        }
        console.log({ results });
        //res.json({ results });
    });
}));
app.get('/api/memesUser/:id', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    console.log('Entra au endpoint memes par user');
    console.log(req.params.id);
    const id_user = req.params.id;
    connection.query('SELECT m.* FROM memes m , users u WHERE u.id = m.user_id AND u.id = ? ', [id_user], function (err, results, fields) {
        if (err)
            throw err;
        // if(results != undefined){
        console.log('Recupere : ' + JSON.stringify(results));
        res.json({ results });
        // }else{
        //   res.send("Memes inexistante !!") ;
        // }
    });
}));
app.listen(port, () => {
    //   if (err) {
    //     console.error(err); //return 
    //   }
    console.log(`Le serveur est activé dans le port : ${port}`); //return 
});
//# sourceMappingURL=app.js.map