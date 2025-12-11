import React from 'react';
import { ControlLog } from '../types';
import { ShieldCheck, AlertCircle, Clock } from 'lucide-react';

interface ControlLogTableProps {
  logs: ControlLog[];
}

const ControlLogTable: React.FC<ControlLogTableProps> = ({ logs }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
        <h2 className="font-semibold text-slate-700 flex items-center gap-2">
          <ShieldCheck className="text-teal-600" size={20} />
          Control Log (Audit Trail)
        </h2>
        <span className="text-xs font-mono text-slate-500 bg-slate-200 px-2 py-1 rounded">TABLE: CONTROL_LOG</span>
      </div>
      <div className="overflow-auto flex-1 custom-scrollbar">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3">Log ID</th>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Agent</th>
              <th className="px-4 py-3">Transaction ID</th>
              <th className="px-4 py-3">Request</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.slice().reverse().map((log) => (
              <tr key={log.log_id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-mono text-slate-600">{log.log_id}</td>
                <td className="px-4 py-3 text-slate-500 flex items-center gap-1">
                   <Clock size={12} />
                   {new Date(log.timestamp).toLocaleTimeString()}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {log.delegated_agent}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-slate-600">{log.transaction_id}</td>
                <td className="px-4 py-3 text-slate-700 max-w-xs truncate" title={log.user_request_text}>
                  {log.user_request_text}
                </td>
                <td className="px-4 py-3">
                  {log.delegation_success ? (
                    <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium">
                      <ShieldCheck size={12} /> Success
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-600 text-xs font-medium">
                      <AlertCircle size={12} /> Failed
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
                <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400">No audit logs available yet.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ControlLogTable;
