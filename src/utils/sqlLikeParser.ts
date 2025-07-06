/**
 * Simple SQL-like query parser for MJ_all.csv data
 * Supports basic syntax like:
 * - SELECT * WHERE 画数 = 5
 * - SELECT * WHERE 部首 = "水" AND 画数 > 10
 * - SELECT * WHERE 辞書 CONTAINS "大漢和"
 */

import { MjAllDataRow } from "../types/MjAllData";

// Supported operators
type Operator = "=" | "!=" | ">" | "<" | ">=" | "<=" | "CONTAINS" | "LIKE";

// Condition structure
interface Condition {
  field: string;
  operator: Operator;
  value: string | number | boolean;
}

// Logical operators
type LogicalOperator = "AND" | "OR";

// Query structure
interface ParsedQuery {
  conditions: Condition[];
  logicalOperators: LogicalOperator[];
}

/**
 * Parse a SQL-like query string into a structured query object
 * @param queryString SQL-like query string
 * @returns Parsed query object or null if invalid
 */
export function parseQuery(queryString: string): ParsedQuery | null {
  // Normalize the query string
  const normalized = queryString.trim().toUpperCase();

  // Check if it's a SQL-like query
  if (!normalized.startsWith("SELECT")) {
    return null;
  }

  // Extract the WHERE clause
  const whereIndex = normalized.indexOf("WHERE");
  if (whereIndex === -1) {
    return null;
  }

  const whereClause = queryString.substring(whereIndex + 5).trim();

  // Split by AND/OR
  const conditions: Condition[] = [];
  const logicalOperators: LogicalOperator[] = [];

  // Split by logical operators
  const parts = whereClause.split(/\s+(AND|OR)\s+/i);

  // Process each condition
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      // This is a condition
      const condition = parseCondition(parts[i]);
      if (!condition) {
        return null;
      }
      conditions.push(condition);
    } else {
      // This is a logical operator
      logicalOperators.push(parts[i].toUpperCase() as LogicalOperator);
    }
  }

  return {
    conditions,
    logicalOperators,
  };
}

/**
 * Parse a condition string into a structured condition object
 * @param conditionStr Condition string like "field = value"
 * @returns Parsed condition object or null if invalid
 */
function parseCondition(conditionStr: string): Condition | null {
  // Match patterns like "field operator value"
  const operatorRegex = /\s*(=|!=|>|<|>=|<=|CONTAINS|LIKE)\s*/i;
  const parts = conditionStr.split(operatorRegex);

  if (parts.length !== 3) {
    return null;
  }

  const field = parts[0].trim();
  const operator = conditionStr
    .match(operatorRegex)?.[0]
    .trim()
    .toUpperCase() as Operator;
  let value: string | number | boolean = parts[2].trim();

  // Remove quotes from string values
  if (value.startsWith('"') && value.endsWith('"')) {
    value = value.substring(1, value.length - 1);
  } else if (value.startsWith("'") && value.endsWith("'")) {
    value = value.substring(1, value.length - 1);
  } else if (!isNaN(Number(value))) {
    // Convert to number if it's numeric
    value = Number(value);
  } else if (value.toLowerCase() === "true") {
    // Convert "true" to boolean (Note: "\"true\"" is string)
    value = true;
  } else if (value.toLowerCase() === "false") {
    // Convert "false" to boolean (Note: "\"false\"" is string)
    value = false;
  }

  return {
    field,
    operator,
    value,
  };
}

/**
 * Execute a parsed query against MJ_all.csv data
 * @param data Array of MjAllDataRow objects
 * @param query Parsed query object
 * @returns Filtered array of MjAllDataRow objects
 */
export function executeQuery(
  data: MjAllDataRow[],
  query: ParsedQuery
): MjAllDataRow[] {
  return data.filter((row) => {
    let result = evaluateCondition(row, query.conditions[0]);

    for (let i = 0; i < query.logicalOperators.length; i++) {
      const operator = query.logicalOperators[i];
      const nextCondition = query.conditions[i + 1];

      if (operator === "AND") {
        result = result && evaluateCondition(row, nextCondition);
      } else if (operator === "OR") {
        result = result || evaluateCondition(row, nextCondition);
      }
    }

    return result;
  });
}

/**
 * Evaluate a single condition against a data row
 * @param row MjAllDataRow object
 * @param condition Condition to evaluate
 * @returns Boolean result of the condition
 */
function evaluateCondition(row: MjAllDataRow, condition: Condition): boolean {
  // Handle special field mappings
  let fieldValue: unknown;

  // Map common field names to actual data fields
  // Map common field names to actual data fields
  switch (condition.field.toLowerCase()) {
    case "画数":
      fieldValue = row["総画数(参考)"];
      break;
    case "部首":
      fieldValue = [
        row["部首1(参考)"],
        row["部首2(参考)"],
        row["部首3(参考)"],
        row["部首4(参考)"],
      ].find(Boolean);
      break;
    case "辞書":
      fieldValue = [
        row.大漢和,
        row.日本語漢字辞典,
        row.新大字典,
        row.大字源,
        row.大漢語林,
      ]
        .filter(Boolean)
        .join(",");
      break;
    case "ivs":
    case "ivs有無":
      fieldValue = Boolean(row.実装したMoji_JohoコレクションIVS);
      break;
    case "漢字":
      // For kanji field, we compare with 実装したUCS
      // Convert the value to UCS code point if it's a single character
      if (
        typeof condition.value === "string" &&
        condition.value.length === 1 &&
        /\p{Script=Han}/u.test(condition.value)
      ) {
        const ucsCodePoint = `U+${condition.value.charCodeAt(0).toString(16).toUpperCase()}`;
        fieldValue = row.実装したUCS;
        // Override the condition value to use the UCS code point
        condition = {
          ...condition,
          value: ucsCodePoint,
        };
      } else {
        fieldValue = null; // Not a valid kanji query
      }
      break;
    default:
      // Try to access the field directly
      fieldValue = row[condition.field as keyof MjAllDataRow];
      break;
  }
  // If field doesn't exist, return false
  if (fieldValue === undefined) {
    return false;
  }

  // Convert to string for string operations
  const stringValue = String(fieldValue).toLowerCase();
  const conditionValue =
    typeof condition.value === "string"
      ? condition.value.toLowerCase()
      : condition.value;

  // Evaluate based on operator
  switch (condition.operator) {
    case "=":
      return fieldValue == condition.value;
    case "!=":
      return fieldValue != condition.value;
    case ">":
      return Number(fieldValue) > Number(condition.value);
    case "<":
      return Number(fieldValue) < Number(condition.value);
    case ">=":
      return Number(fieldValue) >= Number(condition.value);
    case "<=":
      return Number(fieldValue) <= Number(condition.value);
    case "CONTAINS":
      return stringValue.includes(String(conditionValue));
    case "LIKE": {
      // Simple LIKE implementation with * as wildcard
      const pattern = String(conditionValue).replace(/\*/g, ".*");
      const regex = new RegExp(pattern, "i");
      return regex.test(stringValue);
    }
    default:
      return false;
  }
}

/**
 * Process a SQL-like query string against MJ_all.csv data
 * @param data Array of MjAllDataRow objects
 * @param queryString SQL-like query string
 * @returns Filtered array of MjAllDataRow objects or null if query is invalid
 */
export function processSqlLikeQuery(
  data: MjAllDataRow[],
  queryString: string
): MjAllDataRow[] | null {
  const parsedQuery = parseQuery(queryString);
  if (!parsedQuery) {
    return null;
  }

  return executeQuery(data, parsedQuery);
}
