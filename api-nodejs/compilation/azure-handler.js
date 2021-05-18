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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload_file = exports.containerClient = exports.account = void 0;
const storage_blob_1 = require("@azure/storage-blob");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.account = process.env.ACCOUNT_NAME;
const accountKey = process.env.ACCOUNT_KEY;
const sharedKeyCredential = new storage_blob_1.StorageSharedKeyCredential(exports.account, accountKey);
const blobServiceClient = new storage_blob_1.BlobServiceClient(`https://${exports.account}.blob.core.windows.net`, sharedKeyCredential);
exports.containerClient = blobServiceClient.getContainerClient(process.env.CONTAINER);
function upload_file(filename, content_file, filetype, n_user) {
    return __awaiter(this, void 0, void 0, function* () {
        const content = content_file;
        const blobName = `${filename.split('.')[0]}.${n_user}.${filename.split('.')[1]}`;
        const blockBlobClient = exports.containerClient.getBlockBlobClient(blobName);
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
exports.upload_file = upload_file;
//# sourceMappingURL=azure-handler.js.map