import React from 'react';

interface TableColumn<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  widthClass?: string;
  headerAlign?: 'left' | 'right' | 'center';
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export const Table = <T extends { id: string | number }>({
  data,
  columns,
  onRowClick,
  emptyMessage = 'No data registered yet.',
}: TableProps<T>) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-[#f8fafc] border-b border-border-subtle">
          <tr className="select-none">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-lg py-md font-headline text-[10px] font-extrabold text-[#5a5c79] uppercase tracking-wider
                  ${col.headerAlign === 'right' ? 'text-right' : col.headerAlign === 'center' ? 'text-center' : 'text-left'}
                  ${col.widthClass || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle text-xs">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-lg py-xl text-center text-secondary font-headline">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={item.id}
                onClick={() => onRowClick && onRowClick(item)}
                className={`transition-colors ${onRowClick ? 'hover:bg-[#6161ff]/[0.02] cursor-pointer' : ''}`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-lg py-md font-sans text-on-surface-variant align-middle
                      ${col.headerAlign === 'right' ? 'text-right' : col.headerAlign === 'center' ? 'text-center' : 'text-left'}`}
                  >
                    {col.render ? col.render(item) : (item as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
export default Table;
