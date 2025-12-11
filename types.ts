export interface ControlLog {
  log_id: number;
  timestamp: string;
  user_request_text: string;
  delegated_agent: string;
  transaction_id: string;
  delegation_success: boolean;
}

export interface PatientAdmin {
  patient_id: string;
  nik: string;
  full_name: string;
  registration_date: string;
  contact_number: string;
  appointment_date: string;
}

export interface RmeClinicalData {
  record_id: number;
  patient_id: string;
  encounter_date: string;
  diagnosis_code_icd: string;
  clinical_summary: string;
  health_data_hash: string;
  recorded_by_staff_id: string;
}

export interface HrStaffSchedule {
  staff_id: string;
  staff_name: string;
  role_or_position: string;
  assigned_shift: string;
  task_assignment: string;
  department_id: string;
  on_duty_status: boolean;
}

export interface BillingFinance {
  billing_id: number;
  patient_id: string;
  service_date: string;
  total_charge: number;
  insurance_claim_status: 'Processing' | 'Paid' | 'Denied';
  insurance_verified: boolean;
  unit_cost_abc: number;
  payment_received_date: string | null;
}

export type ViewState = 'dashboard' | 'patients' | 'clinical' | 'staff' | 'billing' | 'schema';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
