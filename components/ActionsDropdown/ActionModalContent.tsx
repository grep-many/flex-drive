import { convertFileSize, formatDateTime } from "@/lib/utils";
import FormattedDateTime from "../FormattedDateTime";
import Thumbnail from "../Thumbnail";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";
import { removeSVG } from "@/assets";

interface Props {
  file: FileRowData;
}

interface DetailProps {
  label: string;
  value: string;
}

const ImageThumbnail = ({ file }: Props) => (
  <div className="file-details-thumbnail">
    <Thumbnail type={file.type} extension={file.extension} url={file.url} />
    <div className="flex flex-col">
      <p className="subtitle-2 mb-1">{file.name}</p>
      <FormattedDateTime date={file.$createdAt} className="caption" />
    </div>
  </div>
);

const DetailRow = ({ label, value }: DetailProps) => (
  <div className="flex">
    <p className="file-details-label text-left">{label}</p>
    <p className="file-details-value text-left">{value}</p>
  </div>
);

export const FileDetails = ({ file }: Props) => {
  return (
    <div>
      <ImageThumbnail file={file} />
      <DetailRow label="Format:" value={file.extension} />
      <DetailRow label="Size:" value={convertFileSize(file.size)} />
      <DetailRow label="Owner:" value={file.owner.fullName} />
      <DetailRow label="Last edit:" value={formatDateTime(file.$updatedAt)} />
    </div>
  );
};

interface ShareProps {
  file: FileRowData;
  onRemove: (email: string) => void;
  onInputChange: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ShareInput = ({ file, onRemove, onInputChange }: ShareProps) => {
  return (
    <>
      <ImageThumbnail file={file} />
      <div className="share-wrapper">
        <p className="subtitle-2 text-light-100 pl-1">Share file with other users</p>
        <Input
          type="email"
          placeholder="Enter email address"
          onChange={(e) => onInputChange(e.target.value.trim().split(","))}
          className="share-input-field"
        />
        <div className="pt-4">
          <div className="flex justify-between">
            <p className="subtitle-2 text-light-100"> Share with</p>
            <p className="subtitle-2 text-light-100"> {file.users.length || 0} users</p>
          </div>
          <ul className="h-20 overflow-x-scroll pt-2">
            {file.users.map((email: string) => (
              <li key={email} className="flex items-center justify-between gap-2">
                <p className="subtitle-2">{email}</p>
                <Button onClick={() => onRemove(email)} className="share-remove-user">
                  <Image
                    src={removeSVG}
                    alt="remove"
                    width={24}
                    height={24}
                    className="remove-icon"
                  />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
