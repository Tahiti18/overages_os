
import { GoogleGenAI, Type } from "@google/genai";

// Strictly adhering to Google GenAI SDK Coding Guidelines
// Using a getter to ensure the most stable reference to the shimmed process.env
const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

/**
 * Standard content generation wrapper
 */
async function generateJSON(prompt: string, schema?: any) {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });
  
  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("JSON Parse Error", e);
    return null;
  }
}

export const scanJurisdictionForSurplus = async (state: string, county: string) => {
  const prompt = `Analyze ${county} County, ${state} surplus list patterns. 
  Identify the DIRECT URL for "Excess Proceeds".
  Identify the ACCESS_TYPE: OPEN_PDF, HYBRID_WEB, or MOAT_GATED.
  Research the "Temporal Cadence" and predict the "Next Expected Update".`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      official_url: { type: Type.STRING },
      access_type: { type: Type.STRING, description: "OPEN_PDF | HYBRID_WEB | MOAT_GATED" },
      cadence: { type: Type.STRING },
      last_updated: { type: Type.STRING },
      next_expected_drop: { type: Type.STRING },
      cadence_rationale: { type: Type.STRING },
      search_summary: { type: Type.STRING },
      orr_instructions: { type: Type.STRING },
      discovery_links: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            url: { type: Type.STRING },
            reliability: { type: Type.STRING }
          }
        }
      }
    }
  };

  return await generateJSON(prompt, schema);
};

export const researchSpecializedCounsel = async (state: string, county: string, specialization: string = "Surplus Recovery") => {
  const prompt = `Find 3 specialized attorneys for "${specialization}" in ${county}, ${state}.
  Ensure the results have proven experience in ${specialization}.`;

  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        firm: { type: Type.STRING },
        expertise_score: { type: Type.NUMBER },
        contact_info: { type: Type.STRING },
        website: { type: Type.STRING },
        rationale: { type: Type.STRING }
      },
      required: ["name", "firm", "expertise_score", "contact_info", "website", "rationale"]
    }
  };

  return await generateJSON(prompt, schema);
};

export const extractDocumentData = async (base64Data: string, mimeType: string, jurisdiction?: { state: string, county: string }) => {
  const state = jurisdiction?.state || "Unknown";
  const prompt = `Analyze this legal document for a property in ${state}. Extract owner names, parcel IDs, and financials. Provide a confidence score (0-1) for each field.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      document_type: { type: Type.STRING },
      overall_confidence: { type: Type.NUMBER },
      fields: {
        type: Type.OBJECT,
        properties: {
          owner_name: { 
            type: Type.OBJECT, 
            properties: { value: { type: Type.STRING }, confidence: { type: Type.NUMBER } } 
          },
          parcel_id: { 
            type: Type.OBJECT, 
            properties: { value: { type: Type.STRING }, confidence: { type: Type.NUMBER } } 
          },
          address: { 
            type: Type.OBJECT, 
            properties: { value: { type: Type.STRING }, confidence: { type: Type.NUMBER } } 
          },
          surplus_amount: { 
            type: Type.OBJECT, 
            properties: { value: { type: Type.NUMBER }, confidence: { type: Type.NUMBER } } 
          }
        }
      }
    }
  };

  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { text: prompt },
        { inlineData: { data: base64Data, mimeType } }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });

  return JSON.parse(response.text || '{}');
};

export const generateOutreachArchitect = async (claimant: any, property: any, skipTraceData: string) => {
  const prompt = `Generate recovery outreach (Mail, SMS, Phone) for ${claimant.name} for property at ${property.address} with surplus $${property.surplus_amount}. Context: ${skipTraceData}`;
  
  const schema = {
    type: Type.OBJECT,
    properties: {
      direct_mail: { type: Type.STRING },
      sms_script: { type: Type.STRING },
      phone_script: { type: Type.STRING }
    }
  };

  return await generateJSON(prompt, schema);
};

export const performSkipTracing = async (ownerName: string, address: string) => {
  const prompt = `Perform skip tracing on ${ownerName} at ${address}. Search for current address, phone, email, and potential heirs.`;
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  return { 
    text: response.text, 
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] 
  };
};

export const generateClaimPackage = async (property: any, waterfallData: any) => {
  const prompt = `Generate court-ready demand letter, affidavit, and accounting for property at ${property.address}. Surplus: ${waterfallData.finalSurplus}`;
  
  const schema = {
    type: Type.OBJECT,
    properties: {
      demand_letter: { type: Type.STRING },
      affidavit: { type: Type.STRING },
      accounting_statement: { type: Type.STRING }
    }
  };

  return await generateJSON(prompt, schema);
};

export const discoverPropertyLiens = async (property: any) => {
  const prompt = `Identify potential senior liens for the property at ${property.address} in ${property.county}, ${property.state}.`;
  
  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        type: { type: Type.STRING, description: "MORTGAGE_1 | HOA | JUDGMENT | GOVERNMENT" },
        description: { type: Type.STRING },
        amount: { type: Type.NUMBER },
        priority: { type: Type.NUMBER }
      }
    }
  };

  return await generateJSON(prompt, schema);
};

export const generateORRLetter = async (state: string, county: string, treasurerContact: string) => {
  const prompt = `Generate a formal ORR/FOIA letter for ${county} County, ${state} regarding Tax Sale Excess Proceeds.`;
  
  const schema = {
    type: Type.OBJECT,
    properties: {
      subject: { type: Type.STRING },
      letter_body: { type: Type.STRING },
      statute_reference: { type: Type.STRING }
    }
  };

  return await generateJSON(prompt, schema);
};

export const generateVoiceGuide = async (text: string) => {
  console.warn("TTS functionality requires gemini-2.5-flash-preview-tts.");
  return null;
};
