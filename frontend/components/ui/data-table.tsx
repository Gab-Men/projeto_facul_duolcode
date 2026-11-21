import type { ReactNode } from "react";

export interface Column<T> {
  header: string;
  cell: (row: T) => ReactNode;
  /** Quando verdadeiro, a célula é o cabeçalho da linha (acessibilidade). */
  rowHeader?: boolean;
}

/** Tabela genérica: recebe as linhas e a definição das colunas. */
export function DataTable<T>({
  rows,
  columns,
  rowKey,
  caption,
  emptyMessage = "Nenhum registro encontrado.",
  actions,
}: {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string | number;
  caption: ReactNode;
  emptyMessage?: string;
  actions?: (row: T) => ReactNode;
}) {
  return (
    <div className="admin-table-wrap">
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th scope="col" key={column.header}>
                {column.header}
              </th>
            ))}
            {actions && <th scope="col">Ações</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((column) =>
                column.rowHeader ? (
                  <th scope="row" key={column.header}>
                    {column.cell(row)}
                  </th>
                ) : (
                  <td key={column.header}>{column.cell(row)}</td>
                ),
              )}
              {actions && (
                <td>
                  <div className="admin-actions">{actions(row)}</div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <p className="admin-empty">{emptyMessage}</p>}
    </div>
  );
}
