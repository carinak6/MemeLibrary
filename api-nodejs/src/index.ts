import express, { Request, Response } from "express";
import cors from "cors";
import {
    addNewUser,
    deleteMeme,
    getAllMemes,
    getAllMemesUser,
    userConnect,
    welcome,
} from "./db-handlers";
import * as dotenv from "dotenv";
import { authentication, uploadNewFile, upload_multer } from "./utils";

dotenv.config();

const app = express();
const port = process.env.PORT || 3500;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/", welcome);
app.get("/api/allMemes/", getAllMemes);
app.get("/api/allMeme/:id/", authentication, getAllMemesUser);
app.get("/api/deleteMeme/:id/", authentication, deleteMeme);
app.post("/api/add/user", addNewUser);
app.post("/api/login/", userConnect);
app.post("/upload/", upload_multer, authentication, uploadNewFile);

app.listen(port, () => {
    console.log(`Le serveur est activé dans le port : ${port}`);
});
