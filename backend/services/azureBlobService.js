import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = "profile-pictures";
const blobServiceClient = BlobServiceClient.fromConnectionString(
  AZURE_STORAGE_CONNECTION_STRING
);
const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

const uploadToBlobStorage = async (fileBuffer, fileName, fileType) => {
  try {
    const blobName = `${uuidv4()}-${fileName}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const uploadOptions = { blobHTTPHeaders: { blobContentType: fileType } };
    await blockBlobClient.uploadData(fileBuffer, uploadOptions);

    return blockBlobClient.url;
  } catch (error) {
    throw new Error("Error uploading file to Azure Blob Storage");
  }
};

export { uploadToBlobStorage };
