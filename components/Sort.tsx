"use client";
import { sortTypes } from "@/constants";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useRouter, useSearchParams } from "next/navigation";

const Sort = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const handleSort = (sort: string) => {
    if (sort) {
      params.set("sort", sort);
    } else {
      params.delete("sort");
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };
  return (
    <Select onValueChange={handleSort} defaultValue={params.get("sort") || sortTypes[0].value}>
      <SelectTrigger className="sort-select">
        <SelectValue placeholder={sortTypes[0].label} />
      </SelectTrigger>
      <SelectContent className="sort-select-content">
        <SelectGroup>
          <SelectLabel>Sort By</SelectLabel>
          {sortTypes.map(({ label, value }) => (
            <SelectItem value={value} key={label} className="shad-select-item">
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default Sort;
