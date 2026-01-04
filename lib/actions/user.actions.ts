"use server";
import { Query, ID } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { avatarImg } from "@/assets";
import { parseStringify } from "../utils";

const getUserByEmail = async (email: string) => {
  const { tablesDB } = await createAdminClient();

  const result = await tablesDB.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: "users",
    queries: [Query.equal("email", email)],
  });

  return result.total > 0 ? result.rows[0] : null;
};

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  return error;
};

const sendEmailOTP = async (email: string) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken({ userId: ID.unique(), email });
    return session.userId;
  } catch (err) {
    handleError(err, "Failed to send email OTP!");
  }
};

export const createAccount = async ({ fullName, email }: { fullName: string; email: string }) => {
  const exists = await getUserByEmail(email);

  if (exists) throw new Error("Account already exists!");

  const accountId = await sendEmailOTP(email);

  if (!accountId) throw new Error("Failed to send an OTP!");

  const { tablesDB } = await createAdminClient();

  await tablesDB.createRow({
    databaseId: appwriteConfig.databaseId,
    tableId: "users",
    rowId: ID.unique(),
    data: { fullName, email, avatar: avatarImg.src, accountId },
  });

  return parseStringify({ accountId });
};
