
import { GoogleGenAI, Type } from "@google/genai";

// AI Core v3.0 - Central Intelligence Library
// This library provides high-precision legal extraction, skip-tracing research, 
// and automated document packaging powered by Gemini 3.0 models.

/**
 * Extracts structured data from property-related legal documents.
 * Upgraded to extract Encumbrances and Lien data for Waterfall auto-population.
 */
export const extractDocumentData = async (base64Data: string, mimeType: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [
        {
          parts: [
            { inlineData: { data: base64Data, mimeType: mimeType } },
            { text: "Perform a deep legal audit. Extract critical fields including potential liens, senior encumbrances, and judgments." },
          ],
        },
      ],
      config: {
        systemInstruction: `You are a Senior Legal Document Auditor specialized in US Property Tax Surplus. 
        Extract data for automated waterfall processing.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            owner_name: { type: Type.STRING },
            parcel_id: { type: Type.STRING },
            address: { type: Type.STRING },
            surplus_amount: { type: Type.NUMBER },
            tax_sale_date: { type: Type.STRING },
            document_type: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            // NEW: Automated Lien Extraction
            discovered_liens: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, description: "MORTGAGE_1, HOA, JUDGMENT, etc." },
                  description: { type: Type.STRING },
                  amount: { type: Type.NUMBER },
                  priority: { type: Type.NUMBER }
                }
              }
            },
            confidence_score: { type: Type.NUMBER }
          },
          required: ["owner_name", "parcel_id", "document_type", "confidence_score"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw error;
  }
};

/**
 * Generates high-conversion outreach materials based on skip-trace grounding.
 */
export const generateOutreachArchitect = async (claimant: any, property: any, skipTraceData: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Generate personalized outreach scripts for ${claimant.name} regarding a potential surplus recovery of $${property.surplus_amount} at ${property.address}. 
      Ground the copy in these research findings: ${skipTraceData}`,
      config: {
        systemInstruction: "You are a specialized Legal Outreach Strategist. Create empathetic, authoritative, and non-spammy copy for Direct Mail and SMS.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            direct_mail: { type: Type.STRING },
            sms_script: { type: Type.STRING },
            phone_script: { type: Type.STRING }
          },
          required: ["direct_mail", "sms_script", "phone_script"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Outreach Generation Error", error);
    throw error;
  }
};

/**
 * Performs web-grounded research to locate claimants or heirs.
 */
export const performSkipTracing = async (ownerName: string, address: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Deep skip trace: ${ownerName} at ${address}. Find current contact info, next of kin, and obituaries.`,
      config: { tools: [{ googleSearch: {} }] },
    });
    return {
      text: response.text || "No info.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) { throw error; }
};

/**
 * Generates a complete claim package.
 */
export const generateClaimPackage = async (property: any, waterfallData: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Generate claim package for ${property.address}. Waterfall: ${JSON.stringify(waterfallData)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            demand_letter: { type: Type.STRING },
            affidavit: { type: Type.STRING },
            accounting_statement: { type: Type.STRING },
          },
          required: ["demand_letter", "affidavit", "accounting_statement"],
        },
      },
    });
    return JSON.parse(response.text || "{}");
  } catch (error) { throw error; }
};
