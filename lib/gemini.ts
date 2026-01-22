import { GoogleGenAI, Type, Modality } from "@google/genai";

// Strictly adhering to Google GenAI SDK Coding Guidelines
const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

/**
 * Standard content generation wrapper
 */
async function generateJSON(prompt: string, schema?: any, useSearch: boolean = false) {
  const ai = getAIClient();
  
  // Guideline check: When using googleSearch, response.text may not be in JSON format.
  // We avoid strict responseMimeType when search is active to prevent model errors.
  const config: any = {
    ...(useSearch ? {} : { 
      responseMimeType: "application/json",
      responseSchema: schema 
    }),
  };

  if (useSearch) {
    config.tools = [{ googleSearch: {} }];
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: config,
    });
    
    const text = response.text || '[]';
    
    // Extraction logic for grounded responses which often include narrative text
    if (useSearch) {
      const jsonMatch = text.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      // If search is on but no JSON block found, attempt to parse text directly
      try { return JSON.parse(text); } catch { return []; }
    }
    
    return JSON.parse(text.trim());
  } catch (e) {
    console.error("AI Protocol Failure:", e);
    // Provide non-crashing fallback
    return [];
  }
}

/**
 * PRODUCTION COUNTY SCANNER PROTOCOL
 * Orchestrates multi-source scraping (HTML/PDF) via AI grounding.
 */
export const performCountyAuctionScan = async (county: string, state: string, url: string, sourceType: string) => {
  const prompt = `
    COUNTY SCANNER PROTOCOL - MISSION CRITICAL
    Jurisdiction: ${county} County, ${state}
    Source URL: ${url}
    Source Type: ${sourceType}

    TASK: Locate completed tax sales with excess proceeds.
    
    INSTRUCTIONS:
    1. Search for: "${county} ${state} completed tax sale results" or "${county} tax deed auction surplus list".
    2. Identify rows with "Sold" or "Completed" status.
    3. Calculate Overage: Sold Amount minus Final Judgment/Debt.
    
    RETURN ONLY A VALID JSON ARRAY. NO MARKDOWN. NO INTRO TEXT.
    SCHEMA: [{ "address": string, "parcelId": string, "status": string, "judgmentAmount": number, "soldAmount": number, "saleDate": string, "overage": number, "sourceUrl": string }]
  `;

  // We pass null for schema when searching to avoid SDK validation issues with grounded text
  return await generateJSON(prompt, null, true);
};

export const scanJurisdictionForSurplus = async (state: string, county: string) => {
  const prompt = `Analyze ${county} County, ${state} surplus list patterns. 
  Identify the DIRECT URL for "Excess Proceeds".
  Return JSON: { "official_url": string, "access_type": string, "cadence": string }`;

  return await generateJSON(prompt, null, true);
};

export const researchSpecializedCounsel = async (state: string, county: string, specialization: string = "Surplus Recovery") => {
  const prompt = `Find 3 verified attorneys or firms practicing "${specialization}" in ${county}, ${state}.
  Return JSON array: [{ "name": string, "firm": string, "expertise_score": number, "contact_info": string, "website": string, "rationale": string }]`;

  return await generateJSON(prompt, null, true);
};

export const extractDocumentData = async (base64Data: string, mimeType: string, jurisdiction?: { state: string, county: string }) => {
  const state = jurisdiction?.state || "Unknown";
  const prompt = `Extract owner names, parcel IDs, and financials from this legal document in ${state}.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      document_type: { type: Type.STRING },
      overall_confidence: { type: Type.NUMBER },
      fields: {
        type: Type.OBJECT,
        properties: {
          owner_name: { type: Type.OBJECT, properties: { value: { type: Type.STRING }, confidence: { type: Type.NUMBER } } },
          parcel_id: { type: Type.OBJECT, properties: { value: { type: Type.STRING }, confidence: { type: Type.NUMBER } } },
          address: { type: Type.OBJECT, properties: { value: { type: Type.STRING }, confidence: { type: Type.NUMBER } } },
          surplus_amount: { type: Type.OBJECT, properties: { value: { type: Type.NUMBER }, confidence: { type: Type.NUMBER } } }
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
  const prompt = `Draft recovery outreach scripts for ${claimant.name} for property at ${property.address}. Surplus: $${property.surplus_amount}. Context: ${skipTraceData}`;
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
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Perform deep research skip tracing on ${ownerName} at ${address}. Find current address and phone.`,
    config: { tools: [{ googleSearch: {} }] }
  });
  return { 
    text: response.text, 
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] 
  };
};

export const generateClaimPackage = async (property: any, waterfallData: any) => {
  const prompt = `Assemble court-ready demand letter and affidavit for property at ${property.address}. Overage: ${waterfallData.finalSurplus}`;
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
  const prompt = `List potential senior liens for the property at ${property.address} in ${property.county}, ${property.state}.`;
  return await generateJSON(prompt, null, true);
};

export const generateVoiceGuide = async (text: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Narrate professionally: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });
  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  return base64Audio || null;
};
