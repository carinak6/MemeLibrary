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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_handlers_1 = require("./db-handlers");
const dotenv = __importStar(require("dotenv"));
const utils_1 = require("./utils");
dotenv.config();
const app = express_1.default();
const port = process.env.PORT || 3500;
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(cors_1.default());
app.get("/", db_handlers_1.welcome);
app.get("/api/allMemes/", db_handlers_1.getAllMemes);
app.get("/api/allMeme/:id/", utils_1.authentication, db_handlers_1.getAllMemesUser);
app.get("/api/deleteMeme/:id/", utils_1.authentication, db_handlers_1.deleteMeme);
app.post("/api/add/user", db_handlers_1.addNewUser);
app.post("/api/login/", db_handlers_1.userConnect);
app.post("/upload/", utils_1.upload_multer, utils_1.authentication, utils_1.uploadNewFile);
app.listen(port, () => {
    console.log(`Le serveur est activé dans le port : ${port}`);
});
//# sourceMappingURL=index.js.map