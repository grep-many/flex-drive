"use server";

import { InputFile } from "node-appwrite/file";
import { createAdminClient } from "../appwrite";
import { constructFileUrl, getFileType, handleError, parseStringify } from "../utils";
import { appwriteConfig } from "../appwrite/config";
import { ID } from "node-appwrite";
import { revalidatePath } from "next/cache";

export const uploadFile = async ({ file, ownerId, accountId, path }: UploadFileProps) => {
  const { storage, tablesDB } = await createAdminClient();

  try {
    const inputFile = InputFile.fromBuffer(file, file.name);

    const bucketFile = await storage.createFile({
      bucketId: appwriteConfig.bucketId,
      fileId: ID.unique(),
      file: inputFile,
    });

    const data = {
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      type: getFileType(bucketFile.name).type,
      bucketFileId: bucketFile.$id,
      accountId,
      owner: ownerId,
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      users: [],
    };

    const newFile = await tablesDB
      .createRow({
        databaseId: appwriteConfig.databaseId,
        tableId: "files",
        rowId: ID.unique(),
        data,
      })
      .catch(async (err: unknown) => {
        await storage.deleteFile({
          bucketId: appwriteConfig.bucketId,
          fileId: bucketFile.$id,
        });
        handleError(err, "Something went wrong while creating the row!");
      });

    revalidatePath(path);
    return parseStringify(newFile);
  } catch (err) {
    handleError(err, "Something went wrong while uploading file!");
  }
};
