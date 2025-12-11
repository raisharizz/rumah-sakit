import React from 'react';

const SchemaView: React.FC = () => {
    const schemas = [
        {
            name: "CONTROL_LOG",
            desc: "Audit and Delegation Agent",
            sql: `CREATE TABLE IF NOT EXISTS control_log (
    log_id INT64 PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL,
    user_request_text STRING,
    delegated_agent STRING,
    transaction_id STRING,
    delegation_success BOOL
);`
        },
        {
            name: "PATIENT_ADMIN",
            desc: "Patient Management Subagent",
            sql: `CREATE TABLE IF NOT EXISTS patient_admin (
    patient_id STRING PRIMARY KEY,
    nik STRING NOT NULL, -- Important for RME compliance
    full_name STRING NOT NULL,
    registration_date DATE,
    contact_number STRING,
    appointment_date TIMESTAMP
);`
        },
        {
            name: "RME_CLINICAL_DATA",
            desc: "Medical Records Subagent",
            sql: `CREATE TABLE IF NOT EXISTS rme_clinical_data (
    record_id INT64 PRIMARY KEY,
    patient_id STRING NOT NULL,
    encounter_date TIMESTAMP NOT NULL,
    diagnosis_code_icd STRING,
    clinical_summary STRING,
    health_data_hash STRING, -- Data integrity
    recorded_by_staff_id STRING,
    FOREIGN KEY (patient_id) REFERENCES patient_admin(patient_id)
);`
        },
        {
            name: "HR_STAFF_SCHEDULE",
            desc: "Staff Management Subagent",
            sql: `CREATE TABLE IF NOT EXISTS hr_staff_schedule (
    staff_id STRING PRIMARY KEY,
    staff_name STRING NOT NULL,
    role_or_position STRING,
    assigned_shift STRING,
    task_assignment STRING,
    department_id STRING,
    on_duty_status BOOL
);`
        },
        {
            name: "BILLING_FINANCE",
            desc: "Billing And Insurance Subagent",
            sql: `CREATE TABLE IF NOT EXISTS billing_finance (
    billing_id INT64 PRIMARY KEY,
    patient_id STRING NOT NULL,
    service_date DATE NOT NULL,
    total_charge NUMERIC(10, 2),
    insurance_claim_status STRING,
    insurance_verified BOOL,
    unit_cost_abc NUMERIC(10, 2), -- ABC Costing
    payment_received_date DATE,
    FOREIGN KEY (patient_id) REFERENCES patient_admin(patient_id)
);`
        }
    ];

    return (
        <div className="p-8 overflow-y-auto custom-scrollbar h-full">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">System Schema Definition (DDL)</h2>
            <p className="text-slate-500 mb-8">Defined for Google BigQuery / PostgreSQL compatibility.</p>
            
            <div className="space-y-8">
                {schemas.map((schema) => (
                    <div key={schema.name} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
                             <h3 className="font-bold text-slate-700">{schema.name}</h3>
                             <p className="text-xs text-slate-500">{schema.desc}</p>
                        </div>
                        <div className="p-4 bg-slate-900 overflow-x-auto">
                            <pre className="text-xs text-green-400 font-mono leading-relaxed">
                                {schema.sql}
                            </pre>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SchemaView;
