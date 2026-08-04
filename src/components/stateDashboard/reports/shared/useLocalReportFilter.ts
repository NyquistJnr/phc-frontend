"use client";

import { useMemo, useState } from "react";

interface FilterableRow {
  facility: string;
  lga: string;
}

export function useLocalReportFilter<T extends FilterableRow>(rows: T[]) {
  const [search, setSearch] = useState("");
  const [lga, setLga] = useState("All");

  const lgaOptions = useMemo(
    () => ["All", ...Array.from(new Set(rows.map((r) => r.lga).filter(Boolean))).sort()],
    [rows],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (lga === "All" || r.lga === lga) &&
        (term === "" || r.facility.toLowerCase().includes(term)),
    );
  }, [rows, search, lga]);

  return { search, setSearch, lga, setLga, lgaOptions, filtered };
}
