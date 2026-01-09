import { convertFileSize, formatDateTime } from "@/lib/utils";
import FormattedDateTime from "../FormattedDateTime";
import Thumbnail from "../Thumbnail";

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
