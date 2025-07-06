import { useSearch, useNavigate, type Search } from "@tanstack/react-router";
import { useCallback } from "react";

/**
 * useQueryParam (dynamic, robust version)
 * - Returns the current value of the query param (from the router's location).
 * - Returns a stable setter that updates the query param only when called.
 * - The value is only updated when the setter is called.
 */
export const useQueryParam = (
  key: string
): [
  string | null,
  (value: string | null, options?: { replace?: boolean }) => void,
] => {
  const search = useSearch({ strict: false });
  const navigate = useNavigate();

  const paramValue = search[key] ?? null;

  // Stable setter that updates the query param, merging with current search object
  const setParam = useCallback(
    (value: string | null, options?: { replace?: boolean }) => {
      const newSearch = { ...search };
      if (value === null) {
        delete newSearch[key];
      } else {
        newSearch[key] = value;
      }
      navigate({
        search: newSearch, // Accept dynamic keys
        replace: options?.replace ?? false,
      });
    },
    [navigate, key, search]
  );

  return [paramValue, setParam];
};
