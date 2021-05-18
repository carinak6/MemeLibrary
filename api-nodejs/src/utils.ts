import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import { upload_file } from "./azure-handlers";

export const storage = multer.memoryStorage();
export const upload_multer = multer({ storage: storage }).single("myImage");

export function authentication(req, res, next) {
    try {
        const { token } = req.query;
        const decoded = jwt.verify(token, process.env.KEY_JWT);
        console.log(decoded.id);
        console.log("ok authentication");
        next();
    } catch (err) {
        res.send(err);
    }
}

export function uploadNewFile(req: multer, res) {
    try {
        upload_file(
            req.file["originalname"],
            req.file["buffer"],
            req.file["mimetype"],
            req.body["user_id"]
        );
        res.send("ok");
    } catch (error) {
        res.send("file not send");
    }
}
