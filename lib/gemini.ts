
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
            { text: "Perform a deep legal audit of this document. Focus on identifying the current owner, the parcel ID, and any recorded encumbrances or liens that might affect a surplus recovery claim." },
          ],
        },
      ],
      config: {
        systemInstruction: `You are a World-Class Senior Legal Document Auditor specialized in US Property Tax Surplus. 
        Your task is to extract data for automated waterfall processing. 
        Analyze for: 
        1. Owner names (Claimants)
        2. Property identification (Parcel IDs, APNs)
        3. Financials (Surplus amounts, sale prices)
        4. Liens/Encumbrances: Specifically look for Senior Mortgages, HOA Liens, Judgments, and Government Liens. 
        Assign priority (1 for Gov, 2-3 for Mortgages, 4+ for others).`,
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
            discovered_liens: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, description: "MORTGAGE_1, MORTGAGE_2, HOA, JUDGMENT, MECHANIC, or OTHER" },
                  description: { type: Type.STRING },
                  amount: { type: Type.NUMBER },
                  priority: { type: Type.NUMBER }
                }
              }
            },
            confidence_score: { type: Type.NUMBER },
            extraction_rationale: { type: Type.STRING }
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
        systemInstruction: "You are a specialized Legal Outreach Strategist. Your goal is to create empathetic, authoritative, and professional copy for Direct Mail, SMS, and Phone. Avoid spammy language. Use the 'helpful neighbor' tone. Clearly explain that the recipient may be entitled to funds from a previous property sale.",
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
      contents: `Perform a deep skip trace on ${ownerName} who previously owned ${address}. Identify: 1. Current address 2. Known phone numbers 3. Potential relatives or heirs 4. Obituary records if deceased.`,
      config: { 
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a Private Investigator specialized in asset recovery. Provide factual, verified data points from your search results."
      },
    });
    return {
      text: response.text || "No actionable data found in current index.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) { 
    console.error("Skip Tracing Error:", error);
    throw error; 
  }
};

/**
 * Generates a complete claim package.
 */
export const generateClaimPackage = async (property: any, waterfallData: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Generate a complete claim package for the property at ${property.address}. 
      Jurisdiction: ${property.county}, ${property.state}. 
      Net Recovery to Owner: $${waterfallData.finalSurplus}. 
      Lien Details: ${JSON.stringify(waterfallData.steps)}`,
      config: {
        systemInstruction: "You are a Legal Documentation Specialist. Draft professional, court-ready claim forms. Use precise legal terminology. Ensure the accounting section clearly shows gross surplus minus identified liens.",
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
