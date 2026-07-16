type ReviewPreviewTableProps = {
  rows: Record<string, string>[];
  columns: string[];
};

export function ReviewPreviewTable({ rows, columns }: ReviewPreviewTableProps) {
  if (rows.length === 0 || columns.length === 0) {
    return (
      <div className="elevated-card rounded-xl p-6 text-sm text-graphite">
        No rows available for preview yet.
      </div>
    );
  }

  return (
    <div className="elevated-card overflow-hidden rounded-2xl">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-ink/10 bg-paper/70 text-xs font-semibold uppercase text-graphite">
            <tr>
              {columns.map((column) => (
                <th key={column} className="whitespace-nowrap px-4 py-3">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {rows.slice(0, 10).map((row, rowIndex) => (
              <tr
                key={`${rowIndex}-${columns[0]}`}
                className="align-top transition duration-150 hover:bg-sage/18"
              >
                {columns.map((column) => (
                  <td key={column} className="max-w-[280px] px-4 py-3 text-graphite">
                    <span className="line-clamp-3">{row[column] || "-"}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
