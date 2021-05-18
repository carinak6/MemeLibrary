import {
    BlobServiceClient,
    ContainerClient,
    StorageSharedKeyCredential,
} from "@azure/storage-blob";
import * as dotenv from "dotenv";

dotenv.config();

export const account = process.env.ACCOUNT_NAME;
const accountKey = process.env.ACCOUNT_KEY;
const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net`,
    sharedKeyCredential
);
export const containerClient = blobServiceClient.getContainerClient(
    process.env.CONTAINER
);

export async function upload_file(filename, content_file, filetype, n_user) {
    const content = content_file;
    const blobName = `${filename.split(".")[0]}.${n_user}.${Date.now()}.${
        filename.split(".")[1]
    }`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    // ajouter la metadata
    const metadataProperties: { [user_id: string]: string } = {};
    metadataProperties.user_id = n_user;
    const uploadBlobResponse = await blockBlobClient.upload(
        content,
        Buffer.byteLength(content),
        {
            blobHTTPHeaders: { blobContentType: filetype },
            metadata: metadataProperties,
        }
    );
    // fin ajouter la metadata
    // containerClient.getBlobClient(filename).setMetadata( metadataProperties )
    console.log(
        `Upload block blob ${blobName} successfully`,
        uploadBlobResponse.requestId
    );
}
