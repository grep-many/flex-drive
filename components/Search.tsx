"use client";
import { searchSVG } from "@/assets";
import Image from "next/image";
import React from "react";
import { Input } from "./ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { getFiles } from "@/lib/actions/file.actions";
import Thumbnail from "./Thumbnail";
import FormattedDateTime from "./FormattedDateTime";
import Link from "next/link";

const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchText, setSearchText] = React.useState(searchParams.get("search") ?? "");
  const [searchResults, setSearchResults] = React.useState<FileRowData[]>([]);
  const [showResults, setShowResults] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchText) {
        params.set("search", searchText);
        (async () => {
          const files = await getFiles({ searchText });
          setSearchResults(files?.rows || []);
          setShowResults(true);
        })();
      } else {
        params.delete("search");
      }
      router.replace(`?${params.toString()}`, { scroll: false });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [searchText]);

  return (
    <div className="search">
      <div className="search-input-wrapper">
        <Image src={searchSVG} height={24} width={24} alt="search" />
        <Input
          value={searchText}
          placeholder="Search..."
          className="search-input px-2"
          onChange={(e) => setSearchText(e.target.value || "")}
        />
        {showResults && (
          <div className="absolute top-16! rounded-3xl bg-white">
            <ul className="search-result m-3 max-h-[70vh] overflow-x-scroll">
              {searchResults.length > 0 ? (
                searchResults.map(({ $id, name, type, extension, url, $createdAt }) => (
                  <Link
                    className="flex cursor-pointer items-center justify-between gap-2"
                    key={$id}
                    href={
                      ["video", "audio"].includes(type)
                        ? `/media?search=${searchText}`
                        : `/${type}s?search=${searchText}`
                    }
                    onClick={() => setShowResults(false)}
                  >
                    <div className="flex items-center gap-4">
                      <Thumbnail
                        type={type}
                        extension={extension}
                        url={url}
                        className="size-9 min-w-9"
                      />
                      <p className="subtitle-2 text-light-100 line-clamp-1">{name}</p>
                    </div>
                    <FormattedDateTime
                      date={$createdAt}
                      className="caption text-light-200 line-clamp-1"
                    />
                  </Link>
                ))
              ) : (
                <p className="empty-result"> No files found</p>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
