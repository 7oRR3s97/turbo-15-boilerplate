"use client";

import { ArrowUpDown } from "lucide-react";
import { useQueryStates } from "nuqs";

import { Button } from "@packages/ui/base/ui/button";

import { homeParsers } from "../home/searchParams";

export default function SortButton() {
  const [{ sort }, setSearchParams] = useQueryStates(homeParsers);
  async function toggleSort() {
    if (sort === "desc") {
      await setSearchParams({ sort: "asc" }, { shallow: false });
    } else {
      await setSearchParams({ sort: "desc" }, { shallow: false });
    }
  }
  return (
    <div className="flex items-center justify-between">
      <Button onClick={toggleSort} variant="outline">
        Sort by Date <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
