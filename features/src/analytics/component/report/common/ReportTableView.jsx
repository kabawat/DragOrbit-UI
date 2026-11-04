"use client";
import { NumberedTable } from "@dragorbit/ui";
export function ReportTableView({ model }) {
  const { styles, columns, data } = model;
  return (
    <NumberedTable className={styles.table}>
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th
              key={index}
              style={col.align === "right" ? { textAlign: "right" } : {}}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((col, colIndex) => (
              <td
                key={colIndex}
                className={col.align === "right" ? styles.amount : styles.label}
              >
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </NumberedTable>
  );
}
