import React from "react";

interface BaseSearchInputProps {
  onSearch: (query: string | null) => void;
  defaultValue?: string;
  placeholder?: string;
}

const BaseSearchInput: React.FC<BaseSearchInputProps> = ({
  onSearch,
  defaultValue = "",
  placeholder,
}) => {
  const formAction = (formData: FormData) => {
    const query = formData.get("query") as string;
    if (query && query.trim()) {
      onSearch(query.trim());
    } else {
      onSearch(null);
    }
  };

  return (
    <form className="search-container" action={formAction}>
      <input
        type="text"
        defaultValue={defaultValue}
        placeholder={placeholder}
        name="query"
      />
      <button type="submit">検索</button>
    </form>
  );
};

export default BaseSearchInput;
