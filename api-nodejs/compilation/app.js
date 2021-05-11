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
const bodyParser = require("body-parser");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
    ssl: true,
    multipleStatements: true
});
/* verification de la connexion à la BDD*/
function connectDB() {
    connection.connect(function (err) {
        if (err) { // or restarting (takes a while sometimes).
            console.log('CARINA ==> error when connecting to db:', err);
            // connection.end();
            //mysql_handleDisconnect(); // We introduce a delay before attempting to reconnect,
        }
        else { // to avoid a hot loop, and to allow our node script to
            console.log('Connection established !!');
        }
    });
}
connectDB();
const account = process.env.ACCOUNT_NAME;
const accountKey = process.env.ACCOUNT_KEY;
const sharedKeyCredential = new storage_blob_1.StorageSharedKeyCredential(account, accountKey);
const blobServiceClient = new storage_blob_1.BlobServiceClient(`https://${account}.blob.core.windows.net`, sharedKeyCredential);
const containerClient = blobServiceClient.getContainerClient('memes');
// const containerClient = blobServiceClient.getContainerClient('memes').deleteBlob('toto', {
//   conditions: {
//     tagConditions: ''
//   }
// });
app.use(bodyParser.json());
app.use(express_1.default.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors_1.default());
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // // Pass to next layer of middleware
    next();
});
function upload_file(filename, content_file, filetype, n_user) {
    return __awaiter(this, void 0, void 0, function* () {
        const content = content_file;
        const blobName = `${filename.split('.')[0]}.${n_user}.${filename.split('.')[1]}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        // ajouter la metadata
        const metadataProperties = {};
        metadataProperties.user_id = n_user;
        const uploadBlobResponse = yield blockBlobClient.upload(content, Buffer.byteLength(content), {
            blobHTTPHeaders: { blobContentType: filetype },
            metadata: metadataProperties
        });
        // fin ajouter la metadata
        // containerClient.getBlobClient(filename).setMetadata( metadataProperties )
        console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
    });
}
app.post('/upload', upload.single('myImage'), (req, res) => {
    upload_file(req.file['originalname'], req.file['buffer'], req.file['mimetype'], req.body['user_id']);
    res.send('ok');
});
app.get('/', (req, res, next) => {
    res.send('On est connecté, VAMOS!!!');
});
/** Affiche tous les memes --> authentification?? je croit pas */
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
app.get('/api/allMeme/:id', function (req, res) {
    const id_meme = req.params.id;
    connection.query('SELECT * from memes where user_id = ? ', [id_meme], function (err, results, fields) {
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
app.get('/api/deleteMeme/:id', function (req, res) {
    const id_meme = req.params.id;
    const sql = "SELECT name from memes where id = ?;DELETE from memes where id = ?;";
    connection.query(sql, [id_meme, id_meme], function (err, results, fields) {
        if (err)
            throw err;
        try {
            containerClient.deleteBlob(results[0][0].name);
        }
        catch (error) {
            console.error(error);
        }
    });
});
//gestionnaires de routage pour ajouter un utilisateur
//une autre maniere de creer une route qui donne l'option d'utiliser un methode get et post pour la meme route
app.post('/api/add/user', (req, res) => {
    const name = req.body.user; //userName sur React
    const mail = req.body.mail; //userMail
    const pwd = req.body.password; //userPassword
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
/* Verification si l'user est bien enregistre dans la BDD*/
app.route('/api/login/')
    .post(function (req, res) {
    const mail = req.body.mail;
    const pwd = req.body.password;
    connection.query('SELECT * FROM users WHERE mail = ?', [mail], function (err, results, fields) {
        if (err)
            throw err;
        console.log('Trouvé : ' + JSON.stringify(results) + ' .');
        if (results[0] != undefined) {
            if (bcrypt_1.default.compareSync(pwd, results[0]['pwd'])) {
                //res.json({'id':results[0]['id'], 'mail': results[0]['mail'], 'name' :results[0]['name']});
                /*on crée un token, foo: 'bar' ==>la data dans le tocken, faire attention avec, et 'shhhhh' la cle, il faut
                le garder dans les secrets, dans les variable d'environements, pas le laiser dans le front */
                const token = jsonwebtoken_1.default.sign({ id: results[0]['id'] }, process.env.KEY_JWT, {
                    expiresIn: 86400 // expires in 24 hours
                });
                /*token reste dans le serveur pour verifier les connexions*/
                console.log('token : ', token);
                // res.send(token); //il faudra le recuperer dans le front et le stocker dans le localstorage
                res.status(200).send({
                    id: results[0]['id'],
                    auth: true,
                    token: token,
                    name: results[0]['name'],
                    mail: results[0]['mail']
                });
            }
            else {
                res.send("Mots incorrecte !! pour l'email " + results[0]['mail']);
            }
        }
        else {
            res.send('Inexistante');
        }
    });
    console.log('POST request de la route add');
});
app.listen(port, () => {
    console.log(`Le serveur est activé dans le port : ${port}`);
});
//# sourceMappingURL=app.js.map