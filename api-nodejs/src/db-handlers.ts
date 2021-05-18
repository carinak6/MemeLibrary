import { Request, Response, NextFunction } from "express";
import mysql from "mysql";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { account, containerClient } from "./azure-handlers";
import * as dotenv from "dotenv";

dotenv.config();

/* connexion à la BDD */
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PWD,
    port: 3306,
    ssl: true,
    multipleStatements: true,
});

export function welcome(req, res) {
    res.send("On est connecté, VAMOS!!!");
}

export function getAllMemes(req, res) {
    const query = "SELECT * FROM memes;";
    connection.query(query, function (err: any, results: any, fields: any) {
        if (err) throw err;
        res.json({ results });
    });
}

export function getAllMemesUser(req, res) {
    const id_meme = req.params.id;
    const query = "SELECT * from memes where user_id = ?";
    connection.query(
        query,
        [id_meme],
        function (err: any, results: any, fields: any) {
            if (err) throw err;
            res.json({ results });
        }
    );
}

export function deleteMeme(req, res) {
    const message_error = "blob not exist in azure storage";
    const id_meme = req.params.id;
    const query =
        "SELECT name, url_image from memes where id = ?;DELETE from memes where id = ?;";
    connection.query(
        query,
        [id_meme, id_meme],
        function (err: any, results: any, fields: any) {
            if (err) throw err;
            if (
                results[0][0].url_image.includes(
                    `https://${account}.blob.core.windows.net`
                )
            ) {
                try {
                    containerClient.deleteBlob(results[0][0].name);
                } catch (error) {
                    console.error(message_error);
                }
            } else {
                console.log(message_error);
            }
        }
    );
}

export function addNewUser(req, res) {
    const name = req.body.user; //userName sur React
    const mail = req.body.mail; //userMail
    const pwd = req.body.password; //userPassword

    const query = "INSERT INTO users (name, mail,pwd) VALUES (?, ?, ?);";

    /**mode synchrone, encrypte le password */
    const psw_encr = bcrypt.hashSync(pwd, 10);

    connection.query(
        query,
        [name, mail, psw_encr],
        function (err: any, results: any, fields: any) {
            if (err) throw err;
            res.json({ results });
        }
    );
}

export function userConnect(req, res) {
    const mail = req.body.mail;
    const pwd = req.body.password;
    const query = "SELECT * FROM users WHERE mail = ?";
    const error_message = {};

    connection.query(
        query,
        [mail],
        function (err: any, results: any, fields: any) {
            if (err) throw err;
            if (results[0] != undefined) {
                if (mail !== results[0]["name"]) {
                    if (bcrypt.compareSync(pwd, results[0]["pwd"])) {
                        /*on crée un token, foo: 'bar' ==>la data dans le tocken, faire attention avec, et 'shhhhh' la cle, il faut
              le garder dans les secrets, dans les variable d'environements, pas le laiser dans le front */
                        const token = jwt.sign(
                            { id: results[0]["id"] },
                            process.env.KEY_JWT,
                            {
                                expiresIn: 86400, // expires in 24 hours
                            }
                        );
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
                    } else {
                        const error_message_pwd = `Mots de pass incorrecte !! pour l'email ${results[0]["mail"]}`;
                        res.send(error_message_pwd);
                    }
                } else {
                    const error_message_mail = `mail incorrect`;
                    res.send(error_message_mail);
                }
            } else {
                const error_message_all = `mail et mots de passe incorrect`;
                res.send(error_message_all);
            }
        }
    );
}
