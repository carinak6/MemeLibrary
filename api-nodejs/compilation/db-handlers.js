"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userConnect = exports.addNewUser = exports.deleteMeme = exports.getAllMemesUser = exports.getAllMemes = exports.welcome = void 0;
const mysql_1 = __importDefault(require("mysql"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const azure_handlers_1 = require("./azure-handlers");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
/* connexion à la BDD */
const connection = mysql_1.default.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PWD,
    port: 3306,
    ssl: true,
    multipleStatements: true,
});
function welcome(req, res) {
    res.send("On est connecté, VAMOS!!!");
}
exports.welcome = welcome;
function getAllMemes(req, res) {
    const query = "SELECT * FROM memes;";
    connection.query(query, function (err, results, fields) {
        if (err)
            throw err;
        res.json({ results });
    });
}
exports.getAllMemes = getAllMemes;
function getAllMemesUser(req, res) {
    const id_meme = req.params.id;
    const query = "SELECT * from memes where user_id = ?";
    connection.query(query, [id_meme], function (err, results, fields) {
        if (err)
            throw err;
        res.json({ results });
    });
}
exports.getAllMemesUser = getAllMemesUser;
function deleteMeme(req, res) {
    const message_error = "blob not exist in azure storage";
    const id_meme = req.params.id;
    const query = "SELECT name, url_image from memes where id = ?;DELETE from memes where id = ?;";
    connection.query(query, [id_meme, id_meme], function (err, results, fields) {
        if (err)
            throw err;
        if (results[0][0].url_image.includes(`https://${azure_handlers_1.account}.blob.core.windows.net`)) {
            try {
                azure_handlers_1.containerClient.deleteBlob(results[0][0].name);
            }
            catch (error) {
                console.error(message_error);
            }
        }
        else {
            console.log(message_error);
        }
    });
}
exports.deleteMeme = deleteMeme;
function addNewUser(req, res) {
    const name = req.body.user; //userName sur React
    const mail = req.body.mail; //userMail
    const pwd = req.body.password; //userPassword
    const query = "INSERT INTO users (name, mail,pwd) VALUES (?, ?, ?);";
    /**mode synchrone, encrypte le password */
    const psw_encr = bcrypt_1.default.hashSync(pwd, 10);
    connection.query(query, [name, mail, psw_encr], function (err, results, fields) {
        if (err)
            throw err;
        res.json({ results });
    });
}
exports.addNewUser = addNewUser;
function userConnect(req, res) {
    const mail = req.body.mail;
    const pwd = req.body.password;
    const query = "SELECT * FROM users WHERE mail = ?";
    const error_message = {};
    connection.query(query, [mail], function (err, results, fields) {
        if (err)
            throw err;
        if (results[0] != undefined) {
            if (mail !== results[0]["name"]) {
                if (bcrypt_1.default.compareSync(pwd, results[0]["pwd"])) {
                    /*on crée un token, foo: 'bar' ==>la data dans le tocken, faire attention avec, et 'shhhhh' la cle, il faut
          le garder dans les secrets, dans les variable d'environements, pas le laiser dans le front */
                    const token = jsonwebtoken_1.default.sign({ id: results[0]["id"] }, process.env.KEY_JWT, {
                        expiresIn: 86400,
                    });
                    /*token reste dans le serveur pour verifier les connexions*/
                    console.log("token : ", token);
                    // res.send(token); //il faudra le recuperer dans le front et le stocker dans le localstorage
                    res.status(200).send({
                        id: results[0]["id"],
                        auth: true,
                        token: token,
                        name: results[0]["name"],
                        mail: results[0]["mail"],
                    });
                }
                else {
                    const error_message_pwd = `Mots de pass incorrecte !! pour l'email ${results[0]["mail"]}`;
                    res.send(error_message_pwd);
                }
            }
            else {
                const error_message_mail = `mail incorrect`;
                res.send(error_message_mail);
            }
        }
        else {
            const error_message_all = `mail et mots de passe incorrect`;
            res.send(error_message_all);
        }
    });
}
exports.userConnect = userConnect;
//# sourceMappingURL=db-handlers.js.map