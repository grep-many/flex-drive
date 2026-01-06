import {
  fileAudioSVG,
  fileCSVSVG,
  fileDocSVG,
  fileDocumentSVG,
  fileDocxSVG,
  fileImageSVG,
  fileOtherSVG,
  filePDFSVG,
  fileTXTSVG,
  fileVideoSVG,
} from "@/assets";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = (value: unknown) => JSON.parse(JSON.stringify(value));

export const getFileType = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (!extension) return { type: "other", extension: "" };

  const documentExtensions = [
    "pdf",
    "doc",
    "docx",
    "txt",
    "xls",
    "xlsx",
    "csv",
    "rtf",
    "ods",
    "ppt",
    "odp",
    "md",
    "html",
    "htm",
    "epub",
    "pages",
    "fig",
    "psd",
    "ai",
    "indd",
    "xd",
    "sketch",
    "afdesign",
    "afphoto",
    "afphoto",
  ];
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"];
  const videoExtensions = ["mp4", "avi", "mov", "mkv", "webm"];
  const audioExtensions = ["mp3", "wav", "ogg", "flac"];

  if (documentExtensions.includes(extension)) return { type: "document", extension };
  if (imageExtensions.includes(extension)) return { type: "image", extension };
  if (videoExtensions.includes(extension)) return { type: "video", extension };
  if (audioExtensions.includes(extension)) return { type: "audio", extension };

  return { type: "other", extension };
};

export const getFileIcon = (extension: string | undefined, type: FileType | string) => {
  switch (extension) {
    // Document
    case "pdf":
      return filePDFSVG;
    case "doc":
      return fileDocSVG;
    case "docx":
      return fileDocxSVG;
    case "csv":
      return fileCSVSVG;
    case "txt":
      return fileTXTSVG;
    case "xls":
    case "xlsx":
      return fileDocumentSVG;
    // Image
    case "svg":
      return fileImageSVG;
    // Video
    case "mkv":
    case "mov":
    case "avi":
    case "wmv":
    case "mp4":
    case "flv":
    case "webm":
    case "m4v":
    case "3gp":
      return fileVideoSVG;
    // Audio
    case "mp3":
    case "mpeg":
    case "wav":
    case "aac":
    case "flac":
    case "ogg":
    case "wma":
    case "m4a":
    case "aiff":
    case "alac":
      return fileAudioSVG;

    default:
      switch (type) {
        case "image":
          return fileImageSVG;
        case "document":
          return fileDocumentSVG;
        case "video":
          return fileVideoSVG;
        case "audio":
          return fileAudioSVG;
        default:
          return fileOtherSVG;
      }
  }
};

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  return null;
};

export const constructFileUrl = (bucketFileId: string) =>
  `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET}/files/${bucketFileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
