/**
 * Suspense-ready hook to fetch and parse public/mj_all.csv,
 * returning an array of objects representing each row.
 */

import { parseCSV } from "../utils/csvUtils";
import { MjAllDataRow } from "../types/MjAllData";

// Resource for Suspense
let resource: {
  status: "pending" | "success" | "error";
  promise: Promise<MjAllDataRow[]> | null;
  result: MjAllDataRow[] | null;
  error: Error | null;
} = {
  status: "pending",
  promise: null,
  result: null,
  error: null,
};

const fetchMjAllData = () => {
  if (resource.status === "pending" && !resource.promise) {
    resource.promise = fetch("/mj_all.csv")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.text();
      })
      .then((text) => {
        const data = parseCSV<MjAllDataRow>(text);
        resource.status = "success";
        resource.result = data;
        return data;
      })
      .catch((error) => {
        resource.status = "error";
        resource.error = error;
        throw error;
      });
  }
  return resource.promise;
};

/**
 * Hook to access the full MJ_all.csv data
 * @returns Array of MjAllDataRow objects
 * @throws Promise when data is loading (for Suspense)
 * @throws Error when data loading fails
 */
export const useMjAllData = (): MjAllDataRow[] => {
  if (resource.status === "pending") {
    throw fetchMjAllData();
  } else if (resource.status === "error") {
    throw resource.error!;
  } else if (resource.status === "success") {
    return resource.result!;
  }
  throw new Error("Unexpected state in useMjAllData");
};
