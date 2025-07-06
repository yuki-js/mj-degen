import React, { useState } from "react";

interface SqlQueryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (query: string) => void;
}

export const SqlQueryModal: React.FC<SqlQueryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [query, setQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("manual");
  const [selectedField, setSelectedField] = useState<string>("");
  const [selectedOperator, setSelectedOperator] = useState<string>("=");
  const [fieldValue, setFieldValue] = useState<string>("");
  const [logicalOperator, setLogicalOperator] = useState<string>("AND");
  const [conditions, setConditions] = useState<string[]>([]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(query);
    onClose();
  };

  const addCondition = () => {
    if (!selectedField) return;

    let value = fieldValue;
    // Add quotes for string values
    if (
      isNaN(Number(value)) &&
      !value.startsWith('"') &&
      !value.startsWith("'")
    ) {
      value = `"${value}"`;
    }

    const condition = `${selectedField} ${selectedOperator} ${value}`;
    setConditions([...conditions, condition]);

    // Reset fields
    setSelectedField("");
    setFieldValue("");
  };

  const buildQuery = () => {
    if (conditions.length === 0) return;

    const whereClause = conditions.join(` ${logicalOperator} `);
    const builtQuery = `SELECT * WHERE ${whereClause}`;
    setQuery(builtQuery);
    setActiveTab("manual");
  };

  const removeCondition = (index: number) => {
    const newConditions = [...conditions];
    newConditions.splice(index, 1);
    setConditions(newConditions);
  };

  const fields = [
    { value: "画数", label: "画数" },
    { value: "部首", label: "部首" },
    { value: "辞書", label: "辞書" },
    { value: "ivs有無", label: "IVS有無" },
    { value: "漢字", label: "漢字" },
    { value: "MJ文字図形名", label: "MJ文字図形名" },
    { value: "対応するUCS", label: "対応するUCS" },
    { value: "実装したUCS", label: "実装したUCS" },
    { value: "読み(参考)", label: "読み" },
  ];

  const operators = [
    { value: "=", label: "=" },
    { value: "!=", label: "!=" },
    { value: ">", label: ">" },
    { value: "<", label: "<" },
    { value: ">=", label: ">=" },
    { value: "<=", label: "<=" },
    { value: "CONTAINS", label: "含む" },
    { value: "LIKE", label: "類似" },
  ];

  return (
    <div className="sql-modal-overlay">
      <div className="sql-modal">
        <div className="sql-modal-header">
          <h3>SQL風検索</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="sql-modal-tabs">
          <button
            className={`tab-button ${activeTab === "manual" ? "active" : ""}`}
            onClick={() => setActiveTab("manual")}
          >
            手動入力
          </button>
          <button
            className={`tab-button ${activeTab === "builder" ? "active" : ""}`}
            onClick={() => setActiveTab("builder")}
          >
            クエリビルダー
          </button>
        </div>

        <div className="sql-modal-content">
          {activeTab === "manual" ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="sql-query">SQL風クエリ:</label>
                <textarea
                  id="sql-query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder='例: SELECT * WHERE 画数 = 5 AND 部首 = "水"'
                  rows={5}
                  className="sql-textarea"
                />
              </div>
              <div className="sql-examples">
                <h4>例:</h4>
                <ul>
                  <li>
                    <code onClick={() => setQuery("SELECT * WHERE 画数 = 5")}>
                      SELECT * WHERE 画数 = 5
                    </code>
                  </li>
                  <li>
                    <code
                      onClick={() =>
                        setQuery('SELECT * WHERE 部首 = "水" AND 画数 > 10')
                      }
                    >
                      SELECT * WHERE 部首 = "水" AND 画数 &gt; 10
                    </code>
                  </li>
                  <li>
                    <code
                      onClick={() =>
                        setQuery('SELECT * WHERE 辞書 CONTAINS "大漢和"')
                      }
                    >
                      SELECT * WHERE 辞書 CONTAINS "大漢和"
                    </code>
                  </li>
                  <li>
                    <code
                      onClick={() => setQuery('SELECT * WHERE 漢字 = "水"')}
                    >
                      SELECT * WHERE 漢字 = "水"
                    </code>
                  </li>
                  <li>
                    <code
                      onClick={() => setQuery("SELECT * WHERE ivs有無 = true")}
                    >
                      SELECT * WHERE ivs有無 = true
                    </code>
                  </li>
                </ul>
              </div>
              <div className="modal-buttons">
                <button type="submit" className="submit-button">
                  検索
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={onClose}
                >
                  キャンセル
                </button>
              </div>
            </form>
          ) : (
            <div className="query-builder">
              <div className="condition-builder">
                <div className="form-row">
                  <select
                    value={selectedField}
                    onChange={(e) => setSelectedField(e.target.value)}
                    className="field-select"
                  >
                    <option value="">フィールドを選択</option>
                    {fields.map((field) => (
                      <option key={field.value} value={field.value}>
                        {field.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedOperator}
                    onChange={(e) => setSelectedOperator(e.target.value)}
                    className="operator-select"
                  >
                    {operators.map((op) => (
                      <option key={op.value} value={op.value}>
                        {op.label}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={fieldValue}
                    onChange={(e) => setFieldValue(e.target.value)}
                    placeholder="値"
                    className="value-input"
                  />

                  <button
                    type="button"
                    onClick={addCondition}
                    className="add-condition-button"
                    disabled={!selectedField || !fieldValue}
                  >
                    追加
                  </button>
                </div>
              </div>

              {conditions.length > 0 && (
                <div className="conditions-list">
                  <h4>条件:</h4>
                  <ul>
                    {conditions.map((condition, index) => (
                      <li key={index}>
                        <span>{condition}</span>
                        <button
                          type="button"
                          onClick={() => removeCondition(index)}
                          className="remove-condition"
                        >
                          ×
                        </button>
                        {index < conditions.length - 1 && (
                          <span className="logical-operator">
                            {logicalOperator}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>

                  {conditions.length > 1 && (
                    <div className="logical-operator-selector">
                      <label>論理演算子:</label>
                      <select
                        value={logicalOperator}
                        onChange={(e) => setLogicalOperator(e.target.value)}
                      >
                        <option value="AND">AND (かつ)</option>
                        <option value="OR">OR (または)</option>
                      </select>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={buildQuery}
                    className="build-query-button"
                  >
                    クエリを生成
                  </button>
                </div>
              )}

              <div className="modal-buttons">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="submit-button"
                  disabled={!query}
                >
                  検索
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={onClose}
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
