import Sort from "@/components/Sort";
import { getFiles } from "@/lib/actions/file.actions";
import { constructFileUrl } from "@/lib/utils";
import Image from "next/image";
import { Models } from "node-appwrite";

const Page = async ({ params }: SearchParamProps) => {

  const type = (await params)?.type;
  const files = await getFiles();
  const totalSize = () => {
    let size = 0;
    for (let i = 0; i < files.total; i++) {
      size += files.rows[i].size/1024;
    }
    return `${String(size.toFixed(2))} MB`;
  };

  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>
        <div className="total-size-section">
          <p className="body-1">
            Total: <span className="h-5 font-semibold">{totalSize()}</span>
          </p>
          <div className="sort-container">
            <p className="body-1 text-light-200 hidden sm:block">Sort by:</p>
            <Sort />
          </div>
        </div>
      </section>

      {files?.total > 0 ? (
        <section className="file-list">
          {files.rows.map(
            (
              file: Models.Row & {
                name: string;
                url: string;
                type: string;
                bucketFileId: string;
                accountId: string;
                extension: string;
                size: number;
              },
            ) => (
              <>
              <h1 className="h1" key={file.$id}>
                {file.name}
              </h1>
                <img src={file.url} height={100 } width={100} />
              </>
            ),
          )}
        </section>
      ) : (
        <p>No files Found!</p>
      )}
    </div>
  );
};

export default Page;
