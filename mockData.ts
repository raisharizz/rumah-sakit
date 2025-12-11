import { PatientAdmin, RmeClinicalData, HrStaffSchedule, BillingFinance, ControlLog } from './types';

export const INITIAL_CONTROL_LOGS: ControlLog[] = [
  {
    log_id: 1001,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    user_request_text: "Register new patient John Doe",
    delegated_agent: "PatientAdmin",
    transaction_id: "P-2024-001",
    delegation_success: true
  },
  {
    log_id: 1002,
    timestamp: new Date(Date.now() - 43200000).toISOString(),
    user_request_text: "Process billing for P-2024-001",
    delegated_agent: "BillingFinance",
    transaction_id: "B-5001",
    delegation_success: true
  }
];

export const MOCK_PATIENTS: PatientAdmin[] = [
  {
    patient_id: "P-2024-001",
    nik: "3171012001900001",
    full_name: "Ahmad Santoso",
    registration_date: "2024-01-15",
    contact_number: "+6281234567890",
    appointment_date: "2024-05-20T09:00:00Z"
  },
  {
    patient_id: "P-2024-002",
    nik: "3174051505850002",
    full_name: "Siti Aminah",
    registration_date: "2024-02-10",
    contact_number: "+6281398765432",
    appointment_date: "2024-05-21T14:30:00Z"
  },
  {
    patient_id: "P-2024-003",
    nik: "3201010101800003",
    full_name: "Budi Pratama",
    registration_date: "2024-03-05",
    contact_number: "+628111222333",
    appointment_date: "2024-05-22T10:00:00Z"
  },
   {
    patient_id: "P-2024-004",
    nik: "3276010101950004",
    full_name: "Citra Dewi",
    registration_date: "2024-04-12",
    contact_number: "+628567890123",
    appointment_date: "2024-05-23T11:00:00Z"
  }
];

export const MOCK_CLINICAL: RmeClinicalData[] = [
  {
    record_id: 50001,
    patient_id: "P-2024-001",
    encounter_date: "2024-05-20T09:30:00Z",
    diagnosis_code_icd: "J00",
    clinical_summary: "Acute nasopharyngitis. Prescribed antipyretics and rest.",
    health_data_hash: "a1b2c3d4e5f6...",
    recorded_by_staff_id: "DR-001"
  },
  {
    record_id: 50002,
    patient_id: "P-2024-002",
    encounter_date: "2024-05-21T15:00:00Z",
    diagnosis_code_icd: "E11",
    clinical_summary: "Type 2 Diabetes Mellitus checkup. Blood sugar stable.",
    health_data_hash: "f6e5d4c3b2a1...",
    recorded_by_staff_id: "DR-002"
  }
];

export const MOCK_STAFF: HrStaffSchedule[] = [
  {
    staff_id: "DR-001",
    staff_name: "Dr. Setiawan",
    role_or_position: "General Practitioner",
    assigned_shift: "Morning (07:00 - 15:00)",
    task_assignment: "Outpatient Clinic A",
    department_id: "DEPT-GP",
    on_duty_status: true
  },
  {
    staff_id: "DR-002",
    staff_name: "Dr. Linda",
    role_or_position: "Specialist - Internal Medicine",
    assigned_shift: "Afternoon (14:00 - 21:00)",
    task_assignment: "Specialist Clinic B",
    department_id: "DEPT-IM",
    on_duty_status: false
  },
  {
    staff_id: "NS-001",
    staff_name: "Nurse Rina",
    role_or_position: "Head Nurse",
    assigned_shift: "Morning (07:00 - 15:00)",
    task_assignment: "Triage",
    department_id: "DEPT-ER",
    on_duty_status: true
  }
];

export const MOCK_BILLING: BillingFinance[] = [
  {
    billing_id: 9001,
    patient_id: "P-2024-001",
    service_date: "2024-05-20",
    total_charge: 450000,
    insurance_claim_status: 'Paid',
    insurance_verified: true,
    unit_cost_abc: 320000,
    payment_received_date: "2024-05-20"
  },
  {
    billing_id: 9002,
    patient_id: "P-2024-002",
    service_date: "2024-05-21",
    total_charge: 1200000,
    insurance_claim_status: 'Processing',
    insurance_verified: true,
    unit_cost_abc: 950000,
    payment_received_date: null
  }
];
