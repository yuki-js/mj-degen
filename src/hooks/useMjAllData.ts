/**
 * Suspense-ready hook to fetch and parse public/mj_all.csv,
 * returning an array of objects representing each row.
 */

import { parseCSV } from "../utils/csvUtils";
import { MjAllDataRow } from "../types/MjAllData";
import { createSuspenseResource } from "../utils/createSuspenseResource";

const fetchMjAllData = () =>
  fetch("/mj_all.csv")
    .then((res) => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.text();
    })
    .then(
      (text) =>
        parseCSV<Record<string, string>>(text) as unknown as MjAllDataRow[]
    );

const mjAllDataResource =
  createSuspenseResource<MjAllDataRow[]>(fetchMjAllData);

/**
 * Hook to access the full MJ_all.csv data
 * @returns Array of MjAllDataRow objects
 * @throws Promise when data is loading (for Suspense)
 * @throws Error when data loading fails
 */
/**
 * Hook to access the full MJ_all.csv data
 * @returns Array of MjAllDataRow objects
 * @throws Promise when data is loading (for Suspense)
 * @throws Error when data loading fails
 */
export const useMjAllData = (): MjAllDataRow[] => {
  return mjAllDataResource.read();
};
