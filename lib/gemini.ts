
import { GoogleGenAI, Type } from "@google/genai";

// Strictly adhering to Google GenAI SDK Coding Guidelines
const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

/**
 * Standard content generation wrapper
 */
async function generateJSON(prompt: string, schema?: any, useSearch: boolean = false) {
  const ai = getAIClient();
  const config: any = {
    responseMimeType: "application/json",
    responseSchema: schema,
  };

  if (useSearch) {
    config.tools = [{ googleSearch: {} }];
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: config,
  });
  
  try {
    const text = response.text || '{}';
    const cleanJson = text.includes('```json') 
      ? text.split('```json')[1].split('```')[0] 
      : text;
    
    return JSON.parse(cleanJson.trim());
  } catch (e) {
    console.error("AI Logic Exception: JSON Parse Failure", e);
    return null;
  }
}

/**
 * Perform a real-time scan of a county auction source (URL).
 * Follows the County Scanner Protocol for extraction and filtering.
 */
export const performCountyAuctionScan = async (county: string, state: string, url: string, sourceType: string) => {
  const prompt = `
    COUNTY SCANNER PROTOCOL START
    Jurisdiction: ${county} County, ${state}
    Source URL: ${url}
    Source Type: ${sourceType}

    TASK:
    1. Navigate to the auction calendar or PDF list at the provided URL.
    2. Identify auctions from the last 7 days.
    3. Extract: Property Address, Parcel/Case Number, Status, Final Judgment Amount (A), Auction Sold Amount (B), Sale Date.
    
    STRICT FILTERING:
    - EXCLUDE: "Cancelled", "Bankruptcy", "Postponed", "Withdrawn", "Rescheduled", "Dismissed".
    - INCLUDE ONLY: "Auction Sold", "Sold", "Completed Sale".
    
    CALCULATION:
    - Only include records where Final Judgment Amount (A) > Auction Sold Amount (B).
    - Overage = A - B.
    
    Return an array of objects matching the specified schema.
    COUNTY SCANNER PROTOCOL END
  `;

  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        address: { type: Type.STRING },
        parcelId: { type: Type.STRING },
        status: { type: Type.STRING },
        judgmentAmount: { type: Type.NUMBER },
        soldAmount: { type: Type.NUMBER },
        saleDate: { type: Type.STRING },
        overage: { type: Type.NUMBER },
        sourceUrl: { type: Type.STRING }
      },
      required: ["address", "parcelId", "status", "judgmentAmount", "soldAmount", "saleDate", "overage", "sourceUrl"]
    }
  };

  return await generateJSON(prompt, schema, true);
};

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

  return await generateJSON(prompt, schema, true);
};

export const researchSpecializedCounsel = async (state: string, county: string, specialization: string = "Surplus Recovery") => {
  const prompt = `SEARCH GROUNDING REQUIRED: Find 3 real-world attorneys or law firms currently practicing "${specialization}" in ${county}, ${state}.
  You MUST return valid JSON. Do not return placeholders.
  Include their actual firm name, expertise score (80-100), verified contact email or phone, and website URL.
  Rationale should explain why they are a good fit for ${specialization} in this specific county.`;

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

  return await generateJSON(prompt, schema, true);
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

  return await generateJSON(prompt, schema, true);
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

/**
 * Generates speech audio for a given text using the specialized TTS model.
 */
export const generateVoiceGuide = async (text: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Narrate the following system documentation professionally: ${text}` }] }],
    config: {
      responseModalities: ['AUDIO'],
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
