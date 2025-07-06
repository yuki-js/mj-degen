import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from "react";

interface QueryParamContextType {
  setQueryParam: (key: string, value: string | null) => void;
  // This is a dummy value to trigger re-renders in consumers
  // when the URL changes.
  triggerUpdate: number;
}

// eslint-disable-next-line react-refresh/only-export-components
export const QueryParamContext = createContext<
  QueryParamContextType | undefined
>(undefined);

export const QueryParamProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // useReducer is used here as a simple way to get a dispatch function
  // that can force a re-render by incrementing a dummy state.
  const [triggerUpdate, forceUpdate] = useReducer((x) => x + 1, 0);

  const setQueryParam = useCallback((key: string, value: string | null) => {
    const currentParams = new URLSearchParams(window.location.search);
    if (value === null) {
      currentParams.delete(key);
    } else {
      currentParams.set(key, value);
    }
    const newSearch = currentParams.toString();
    const newUrl = `${window.location.pathname}${
      newSearch ? `?${newSearch}` : ""
    }${window.location.hash}`;
    window.history.pushState({ path: newUrl }, "", newUrl);
    forceUpdate(); // Trigger a re-render in all consumers
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      forceUpdate(); // Trigger a re-render on browser navigation (back/forward)
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const contextValue = useMemo(
    () => ({
      setQueryParam,
      triggerUpdate, // Pass the trigger to consumers so they re-render when it changes
    }),
    [setQueryParam, triggerUpdate]
  );

  return (
    <QueryParamContext.Provider value={contextValue}>
      {children}
    </QueryParamContext.Provider>
  );
};
