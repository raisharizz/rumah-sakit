import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import { ControlLog } from '../types';

// Define tools using FunctionDeclaration
const queryPatientTool: FunctionDeclaration = {
  name: 'query_patient_db',
  description: 'Query the Patient Administration Database. Use this to find patient details, NIK, contact info, or appointments.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: { type: Type.STRING, description: 'The search term (name or patient_id)' },
    },
    required: ['query'],
  },
};

const queryClinicalTool: FunctionDeclaration = {
  name: 'query_clinical_db',
  description: 'Query the RME/Clinical Data Database. Use this to retrieve medical records, diagnosis (ICD), or clinical summaries.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      patient_id: { type: Type.STRING, description: 'The patient ID to look up' },
    },
    required: ['patient_id'],
  },
};

const queryStaffTool: FunctionDeclaration = {
  name: 'query_staff_db',
  description: 'Query the HR Staff Schedule. Use this to check staff availability, shifts, or roles.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      role_or_name: { type: Type.STRING, description: 'Role or name of the staff member' },
    },
    required: ['role_or_name'],
  },
};

const queryBillingTool: FunctionDeclaration = {
  name: 'query_billing_db',
  description: 'Query the Billing and Finance Database. Use this to check insurance status, total charges, or ABC unit costs.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      patient_id: { type: Type.STRING, description: 'The patient ID' },
    },
    required: ['patient_id'],
  },
};

const tools = [queryPatientTool, queryClinicalTool, queryStaffTool, queryBillingTool];

const systemInstruction = `
You are the "Hospital Operations Manager" (Main Agent) in a Multi-Agent AIS (Accounting Information System).
Your role is to orchestrate hospital functions by strictly adhering to the "Segregation of Duties" principle.
You do NOT have direct access to raw data. You MUST delegate tasks to the specialized sub-agents by calling their respective tools.

The Sub-Agents are:
1. Patient Admin Agent (Table: PATIENT_ADMIN) - Registration and scheduling.
2. Medical Records Agent (Table: RME_CLINICAL_DATA) - Clinical history and ICD codes.
3. Staff Management Agent (Table: HR_STAFF_SCHEDULE) - Shift management.
4. Billing & Finance Agent (Table: BILLING_FINANCE) - Invoicing, Insurance, Unit Cost (ABC).

When a user makes a request:
1. Identify the intent.
2. Call the appropriate tool(s) to get the data.
3. Formulate a professional response based on the tool output.

Always maintain a professional, academic, yet operational tone suitable for a Hospital Information System interface.
If the user asks about the system architecture, mention "Segregation of Duties" and "Internal Controls".
`;

export const sendMessageToGemini = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
  onToolCall: (toolName: string, args: any) => Promise<any>
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Error: API Key is missing. Please set it in the environment variables.";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Create a chat session
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
      tools: [{ functionDeclarations: tools }],
    },
    history: history.map(h => ({
        role: h.role,
        parts: h.parts
    }))
  });

  try {
    const result = await chat.sendMessage({ message });
    const response = result.response;
    
    // Check for tool calls
    const toolCalls = response.functionCalls;
    
    if (toolCalls && toolCalls.length > 0) {
      const toolResponses = [];
      
      for (const call of toolCalls) {
        // Execute client-side logic for the tool
        const functionResponse = await onToolCall(call.name, call.args);
        
        toolResponses.push({
          name: call.name,
          response: { result: functionResponse },
          id: call.id
        });
      }

      // Send tool output back to the model
      const finalResult = await chat.sendMessage(toolResponses);
      return finalResult.response.text || "Processed request.";
    }

    return response.text || "I understand, but I couldn't process that request.";

  } catch (error) {
    console.error("Gemini Error:", error);
    return "System Error: Unable to communicate with the Operations Agent.";
  }
};
