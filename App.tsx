import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWidget from './components/ChatWidget';
import ControlLogTable from './components/ControlLogTable';
import DataTable from './components/DataTable';
import AnalyticsView from './components/AnalyticsView';
import SchemaView from './components/SchemaView';
import { ViewState, ChatMessage, ControlLog, PatientAdmin, RmeClinicalData, HrStaffSchedule, BillingFinance } from './types';
import { INITIAL_CONTROL_LOGS, MOCK_PATIENTS, MOCK_CLINICAL, MOCK_STAFF, MOCK_BILLING } from './mockData';
import { sendMessageToGemini } from './services/geminiService';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [controlLogs, setControlLogs] = useState<ControlLog[]>(INITIAL_CONTROL_LOGS);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Database State
  const [patients] = useState<PatientAdmin[]>(MOCK_PATIENTS);
  const [clinical] = useState<RmeClinicalData[]>(MOCK_CLINICAL);
  const [staff] = useState<HrStaffSchedule[]>(MOCK_STAFF);
  const [billing] = useState<BillingFinance[]>(MOCK_BILLING);

  // Tool Implementation Callbacks
  const handleToolCall = async (toolName: string, args: any) => {
    let result = null;
    let delegatedAgent = "Unknown";
    let transactionId = "N/A";
    let logSuccess = true;

    // Simulate database latency
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      if (toolName === 'query_patient_db') {
        delegatedAgent = "PatientAdmin";
        const query = args.query.toLowerCase();
        result = patients.filter(p => 
          p.full_name.toLowerCase().includes(query) || 
          p.patient_id.toLowerCase().includes(query)
        );
        transactionId = result[0]?.patient_id || "SEARCH-OP";
      } else if (toolName === 'query_clinical_db') {
        delegatedAgent = "MedicalRecords";
        result = clinical.filter(c => c.patient_id === args.patient_id);
        transactionId = result[0]?.patient_id || "CLINICAL-OP";
      } else if (toolName === 'query_staff_db') {
        delegatedAgent = "StaffMgmt";
        const query = args.role_or_name.toLowerCase();
        result = staff.filter(s => 
          s.staff_name.toLowerCase().includes(query) ||
          s.role_or_position.toLowerCase().includes(query)
        );
        transactionId = result[0]?.staff_id || "STAFF-OP";
      } else if (toolName === 'query_billing_db') {
        delegatedAgent = "BillingFinance";
        result = billing.filter(b => b.patient_id === args.patient_id);
        transactionId = result[0]?.billing_id.toString() || "BILL-OP";
      }
    } catch (e) {
      logSuccess = false;
      result = { error: "Database Connection Failed" };
    }

    // Update Control Log
    const newLog: ControlLog = {
      log_id: Math.floor(Math.random() * 10000) + 2000,
      timestamp: new Date().toISOString(),
      user_request_text: messages[messages.length - 1]?.text || "Automated System Check",
      delegated_agent: delegatedAgent,
      transaction_id: transactionId,
      delegation_success: logSuccess
    };
    
    setControlLogs(prev => [...prev, newLog]);

    return result;
  };

  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsAiLoading(true);

    try {
        const historyForApi = messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        }));

        const responseText = await sendMessageToGemini(historyForApi, text, handleToolCall);

        const botMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: responseText,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, botMsg]);
    } catch (error) {
        console.error("Chat error", error);
    } finally {
        setIsAiLoading(false);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-12 gap-6 h-full p-6">
            <div className="col-span-12 lg:col-span-5 h-[calc(100vh-6rem)]">
              <ChatWidget 
                messages={messages} 
                onSendMessage={handleSendMessage} 
                isLoading={isAiLoading} 
              />
            </div>
            <div className="col-span-12 lg:col-span-7 h-[calc(100vh-6rem)] flex flex-col gap-6">
                <div className="h-1/2">
                   <AnalyticsView billingData={billing} patientData={patients} />
                </div>
                <div className="h-1/2">
                   <ControlLogTable logs={controlLogs} />
                </div>
            </div>
          </div>
        );
      case 'patients':
        return <DataTable title="Patient Administration" tableName="patient_admin" columns={['patient_id', 'nik', 'full_name', 'registration_date', 'contact_number', 'appointment_date']} data={patients} />;
      case 'clinical':
        return <DataTable title="Clinical Records (RME)" tableName="rme_clinical_data" columns={['record_id', 'patient_id', 'encounter_date', 'diagnosis_code_icd', 'clinical_summary', 'health_data_hash', 'recorded_by_staff_id']} data={clinical} />;
      case 'staff':
        return <DataTable title="HR Staff Schedule" tableName="hr_staff_schedule" columns={['staff_id', 'staff_name', 'role_or_position', 'assigned_shift', 'task_assignment', 'department_id', 'on_duty_status']} data={staff} />;
      case 'billing':
        return <DataTable title="Billing & Finance" tableName="billing_finance" columns={['billing_id', 'patient_id', 'service_date', 'total_charge', 'insurance_claim_status', 'insurance_verified', 'unit_cost_abc', 'payment_received_date']} data={billing} />;
      case 'schema':
        return <SchemaView />;
      default:
        return <div>View not found</div>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 overflow-hidden relative">
        {!process.env.API_KEY && (
             <div className="absolute top-0 left-0 w-full bg-red-500 text-white text-center py-2 z-50 text-sm font-bold">
                API Key Missing. Please set process.env.API_KEY.
            </div>
        )}
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
