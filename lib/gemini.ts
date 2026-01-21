
import { GoogleGenAI, Type } from "@google/genai";

const getAIClient = () => {
  const apiKey = process.env?.API_KEY || "";
  return new GoogleGenAI({ apiKey });
};

export const extractDocumentData = async (base64Data: string, mimeType: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: "Analyze this legal artifact for property tax surplus recovery. Extract key data and suggest classification tags. Include tags like 'Deed', 'ID', 'Proof of Mailing', 'Affidavit', 'Death Certificate', 'Tax Bill', 'Probate Record'.",
          },
        ],
      },
    ],
    config: {
      systemInstruction: "You are a specialized legal document auditor for Property Tax Surplus Recovery. Analyze the document and return structured JSON. Ensure you classify the document correctly and provide multiple relevant descriptive tags.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          owner_name: { type: Type.STRING, description: "Full name of the property owner or claimant" },
          parcel_id: { type: Type.STRING, description: "The APN or Parcel Identification Number" },
          address: { type: Type.STRING, description: "Full physical address of the property" },
          surplus_amount: { type: Type.NUMBER, description: "The calculated excess proceeds or surplus amount" },
          tax_sale_date: { type: Type.STRING, description: "The date the tax sale occurred (YYYY-MM-DD)" },
          document_type: { type: Type.STRING, description: "Primary classification: DEED, TAX_BILL, ID, AFFIDAVIT, PROBATE, MAILING_PROOF, or OTHER" },
          tags: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING }, 
            description: "Suggested descriptive tags based on content (e.g., 'Notarized', 'Heirship', 'Outdated', 'Primary ID')" 
          },
          confidence_score: { type: Type.NUMBER, description: "AI confidence level 0-1" }
        },
        required: ["owner_name", "parcel_id", "document_type", "tags"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return null;
  }
};

export const performSkipTracing = async (ownerName: string, lastKnownAddress: string) => {
  const ai = getAIClient();
  const prompt = `Research the current contact information, potential heirs, and obituary status for: ${ownerName}, formerly associated with the address: ${lastKnownAddress}. Focus on finding potential claimants for property surplus recovery. Return a comprehensive summary of findings including social links, obituary mentions, and potential relative names.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text || "No information found.";
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

  return { text, sources };
};

export const generateClaimPackage = async (property: any, waterfallResults: any) => {
  const ai = getAIClient();
  const prompt = `Draft a formal Property Tax Surplus Claim Package for the following case:
  Address: ${property.address}
  Parcel ID: ${property.parcel_id}
  County: ${property.county}, ${property.state}
  Surplus Amount: $${property.surplus_amount}
  Net Recovery after Liens: $${waterfallResults.finalSurplus}

  Draft 3 documents:
  1. A formal 'Letter of Demand' to the County Treasurer.
  2. A 'Claimant Affidavit' template ready for notarization.
  3. A 'Final Accounting Statement' detailing the waterfall deduction of liens.
  
  Format the response as JSON with keys for each document.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          demand_letter: { type: Type.STRING },
          affidavit: { type: Type.STRING },
          accounting_statement: { type: Type.STRING },
        },
        required: ["demand_letter", "affidavit", "accounting_statement"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse claim package", e);
    return null;
  }
};
