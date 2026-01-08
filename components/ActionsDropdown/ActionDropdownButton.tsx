import { constructDownloadUrl } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface Props {
  option: ActionType;
  file: FileData;
}

const ActionDropdownButton = ({ option, file }: Props) => {
  if (option.value === "download")
    return (
      <Link
        href={constructDownloadUrl(file.bucketFileId)}
        download={file.name}
        className="flex items-center gap-2"
      >
        <Image src={option.icon} alt={option.label} width={30} height={30} />
        {option.label}
      </Link>
    );

  return (
    <div className="flex items-center gap-2">
      <Image src={option.icon} alt={option.label} width={30} height={30} />
      {option.label}
    </div>
  );
};
export default ActionDropdownButton;
