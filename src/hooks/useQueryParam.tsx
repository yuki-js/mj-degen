import { useContext } from "react";
import { QueryParamContext } from "../context/QueryParamContext";

export const useQueryParam = (
  key: string
): [string | null, (value: string | null) => void] => {
  const context = useContext(QueryParamContext);
  if (context === undefined) {
    throw new Error("useQueryParam must be used within a QueryParamProvider");
  }

  const paramValue = new URLSearchParams(window.location.search).get(key);

  const setParam = (value: string | null) => {
    context.setQueryParam(key, value);
  };

  return [paramValue, setParam];
};
