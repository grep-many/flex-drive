"use server";

import { InputFile } from "node-appwrite/file";
import { createAdminClient } from "../appwrite";
import { constructFileUrl, getFileType, handleError, parseStringify } from "../utils";
import { appwriteConfig } from "../appwrite/config";
import { ID, Query } from "node-appwrite";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.actions";

const createQueries = (user: UserData) => {
  const queries = [
    Query.or([Query.equal("owner", [user.$id]), Query.contains("users", [user.email])]),
  ];

  return queries;
};

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

export const getFiles = async () => {
  const { tablesDB } = await createAdminClient();

  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not found!");
    const queries = [...createQueries(user), Query.select(["*", "owner", "owner.*"])];

    const files = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: "files",
      queries,
    });
    return parseStringify(files);
  } catch (err) {
    handleError(err, "Something went wrong while fetching files!");
  }
};

export const renameFile = async ({ fileId, name, extension, path }: RenameFileProps) => {
  try {
    const { tablesDB } = await createAdminClient();
    const newName = `${name}.${extension}`;
    const updatedFile = await tablesDB.updateRow({
      databaseId: appwriteConfig.databaseId,
      tableId: "files",
      rowId: fileId,
      data: {
        name: newName,
      },
    });
    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (err) {
    handleError(err, "Something went wrong while renaming file!");
  }
};

export const updateFileUsers = async ({ fileId, emails, path }: UpdateFileUsersProps) => {
  try {
    const { tablesDB } = await createAdminClient();
    const updatedFile = await tablesDB.updateRow({
      databaseId: appwriteConfig.databaseId,
      tableId: "files",
      rowId: fileId,
      data: {
        users: emails,
      },
    });
    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (err) {
    handleError(err, "Something went wrong while updating file!");
  }
};

export const deleteFile = async ({ fileId, bucketFileId, path }: DeleteFileProps) => {
  try {
    const { tablesDB, storage } = await createAdminClient();
    const deletedFile = await tablesDB.deleteRow({
      databaseId: appwriteConfig.databaseId,
      tableId: "files",
      rowId: fileId,
    });
    if (deletedFile) {
      await storage.deleteFile({ bucketId: appwriteConfig.bucketId, fileId: bucketFileId });
    }
    revalidatePath(path);
    return parseStringify({ status: "success" });
  } catch (err) {
    handleError(err, "Something went wrong while removing file!");
  }
};
