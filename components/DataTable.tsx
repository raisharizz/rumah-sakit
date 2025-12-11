import React from 'react';

interface DataTableProps {
  title: string;
  tableName: string;
  columns: string[];
  data: any[];
}

const DataTable: React.FC<DataTableProps> = ({ title, tableName, columns, data }) => {
  return (
    <div className="h-full flex flex-col p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
            <p className="text-slate-500 text-sm font-mono mt-1">SELECT * FROM {tableName}</p>
        </div>
      </div>
      
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="overflow-auto custom-scrollbar flex-1">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200 sticky top-0">
              <tr>
                {columns.map((col) => (
                  <th key={col} className="px-6 py-3 capitalize">{col.replace(/_/g, ' ')}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  {columns.map((col) => {
                    let val = row[col as keyof typeof row];
                    if (typeof val === 'boolean') val = val ? 'True' : 'False';
                    if (val === null) val = 'NULL';
                    
                    // Formatting for currency
                    if (col === 'total_charge' || col === 'unit_cost_abc') {
                        val = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(val));
                    }

                    return (
                      <td key={col} className="px-6 py-4 text-slate-700 whitespace-nowrap">
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-xs text-slate-400">
            Showing {data.length} records
        </div>
      </div>
    </div>
  );
};

export default DataTable;
