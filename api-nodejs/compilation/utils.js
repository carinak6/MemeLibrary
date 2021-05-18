"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadNewFile = exports.authentication = exports.upload_multer = exports.storage = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const multer_1 = __importDefault(require("multer"));
const azure_handlers_1 = require("./azure-handlers");
exports.storage = multer_1.default.memoryStorage();
exports.upload_multer = multer_1.default({ storage: exports.storage }).single("myImage");
function authentication(req, res, next) {
    try {
        const { token } = req.query;
        const decoded = jsonwebtoken_1.default.verify(token, process.env.KEY_JWT);
        console.log(decoded.id);
        console.log("ok authentication");
        next();
    }
    catch (err) {
        res.send(err);
    }
}
exports.authentication = authentication;
function uploadNewFile(req, res) {
    try {
        azure_handlers_1.upload_file(req.file["originalname"], req.file["buffer"], req.file["mimetype"], req.body["user_id"]);
        res.send("ok");
    }
    catch (error) {
        res.send("file not send");
    }
}
exports.uploadNewFile = uploadNewFile;
//# sourceMappingURL=utils.js.map