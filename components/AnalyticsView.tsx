import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BillingFinance, PatientAdmin } from '../types';

interface AnalyticsViewProps {
  billingData: BillingFinance[];
  patientData: PatientAdmin[];
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ billingData, patientData }) => {
  
  // Calculate Profitability (Revenue vs ABC Cost)
  const financialData = billingData.map(b => ({
    name: b.billing_id.toString(),
    Revenue: b.total_charge,
    Cost: b.unit_cost_abc,
    Margin: b.total_charge - b.unit_cost_abc
  }));

  // Patient Status
  const paidCount = billingData.filter(b => b.insurance_claim_status === 'Paid').length;
  const processingCount = billingData.filter(b => b.insurance_claim_status === 'Processing').length;
  const pieData = [
    { name: 'Paid', value: paidCount },
    { name: 'Processing', value: processingCount },
  ];
  const COLORS = ['#10b981', '#f59e0b'];

  return (
    <div className="p-6 h-full overflow-y-auto custom-scrollbar">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Financial & Operational Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* KPI Cards */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-slate-500 text-sm font-medium mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-slate-800">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
                    billingData.reduce((acc, curr) => acc + curr.total_charge, 0)
                )}
            </p>
            <div className="mt-4 text-sm text-green-600 flex items-center gap-1">
                <span>↑ 12% vs last month</span>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-slate-500 text-sm font-medium mb-2">Avg. Unit Cost (ABC)</h3>
            <p className="text-3xl font-bold text-slate-800">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
                    billingData.reduce((acc, curr) => acc + curr.unit_cost_abc, 0) / billingData.length
                )}
            </p>
             <div className="mt-4 text-sm text-slate-400">
                Activity Based Costing Metric
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost vs Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-80">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Revenue vs Unit Cost (ABC)</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `${value / 1000}k`} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        formatter={(value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)}
                    />
                    <Legend />
                    <Bar dataKey="Revenue" fill="#0f766e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Cost" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>

        {/* Claim Status */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-80">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Insurance Claim Status</h3>
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="middle" align="right" layout="vertical" />
                </PieChart>
             </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
