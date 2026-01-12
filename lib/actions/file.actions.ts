"use server";

import { InputFile } from "node-appwrite/file";
import { createAdminClient, createSessionClient } from "../appwrite";
import { constructFileUrl, getFileType, handleError, parseStringify } from "../utils";
import { appwriteConfig } from "../appwrite/config";
import { ID, Query } from "node-appwrite";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.actions";

const createQueries = (
  user: UserData,
  types: string[],
  searchText: string,
  sort: string,
  limit?: number,
) => {
  const queries = [
    Query.or([Query.equal("owner", [user.$id]), Query.contains("users", [user.email])]),
  ];

  if (types.length > 0) queries.push(Query.equal("type", types));
  if (searchText) queries.push(Query.contains("name", searchText));
  if (limit) queries.push(Query.limit(limit));

  const [sortBy, orderBy] = sort.split("-");

  queries.push(orderBy === "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy));

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

export const getFiles = async ({
  types = [],
  searchText = "",
  sort = "$createdAt-desc",
  limit,
}: GetFilesProps) => {
  const { tablesDB } = await createAdminClient();

  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not found!");
    const queries = [
      ...createQueries(user, types, searchText, sort, limit),
      Query.select(["*", "owner", "owner.*"]),
    ];

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

export async function getTotalSpaceUsed() {
  try {
    const { tablesDB } = await createSessionClient();
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User is not authenticated.");

    const files = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: "files",
      queries: [Query.equal("owner", [currentUser.$id])],
    });

    const totalSpace = {
      image: { size: 0, latestDate: "" },
      document: { size: 0, latestDate: "" },
      video: { size: 0, latestDate: "" },
      audio: { size: 0, latestDate: "" },
      other: { size: 0, latestDate: "" },
      used: 0,
      all: 2 * 1024 * 1024 * 1024 /* 2GB available bucket storage */,
    };

    files.rows.forEach((file) => {
      const fileType = file.type as FileType;
      totalSpace[fileType].size += file.size;
      totalSpace.used += file.size;

      if (
        !totalSpace[fileType].latestDate ||
        new Date(file.$updatedAt) > new Date(totalSpace[fileType].latestDate)
      ) {
        totalSpace[fileType].latestDate = file.$updatedAt;
      }
    });

    return parseStringify(totalSpace);
  } catch (error) {
    handleError(error, "Error calculating total space used:, ");
  }
}
