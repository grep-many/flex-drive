"use server";
import { Query, ID, Account } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { avatarImg } from "@/assets";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { error } from "console";

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  return null;
};

const getUserByEmail = async (email: string) => {
  try {
    const { tablesDB } = await createAdminClient();

    const result = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: "users",
      queries: [Query.equal("email", email)],
    });

    return result.total > 0 ? result.rows[0] : null;
  } catch (err) {
    handleError(err, "Failed to fetch user!");
  }
};

export const sendEmailOTP = async (email: string) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailToken({ userId: ID.unique(), email });
    return session.userId;
  } catch (err) {
    handleError(err, "Failed to send email OTP!");
  }
};

export const createAccount = async ({ fullName, email }: { fullName: string; email: string }) => {
  try {
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
  } catch (err) {
    handleError(err, "Something went wrong while creating user");
  }
};

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createSession({ userId: accountId, secret: password });

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify({ sessionId: session.$id });
  } catch (err) {
    handleError(err, "Failed to verify OTP");
  }
};

export const getCurrentUser = async () => {
  try {
    const { tablesDB, account } = await createSessionClient();
    const result = await account.get();

    const user = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: "users",
      queries: [Query.equal("accountId", [result.$id])],
    });

    if (!user || user.total <= 0) return null;
    return parseStringify(user.rows[0]);
  } catch (err) {
    handleError(err, "Something went wrong while fetching user!");
  }
};

export const signInUser = async (email: string) => {
  try {
    const exist = await getUserByEmail(email);
    if (!exist) return parseStringify({ accountId: null, error: "User not found!" });
    await sendEmailOTP(email);
    return parseStringify({ accountId: exist.accountId });
  } catch (err) {
    handleError(err, "Something went while sigining user");
  }
};

export const signOutUser = async () => {
  try {
    const { account } = await createSessionClient();

    await account.deleteSessions();
    (await cookies()).delete("appwrite-session");
    redirect("/sign-in");
  } catch (err) {
    handleError(err, "Failed to sign out user");
  }
};
