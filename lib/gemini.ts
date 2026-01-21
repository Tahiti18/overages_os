
import { GoogleGenAI, Type } from "@google/genai";

// AI Core v3.0 - Central Intelligence Library
// This library provides high-precision legal extraction, skip-tracing research, 
// and automated document packaging powered by Gemini 3.0 models.

/**
 * Extracts structured data from property-related legal documents.
 * Uses gemini-3-pro-preview for high-precision legal extraction.
 */
export const extractDocumentData = async (base64Data: string, mimeType: string) => {
  // Create a new instance for each call as per SDK guidelines to ensure latest configuration
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
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
              text: "Please perform a deep audit of this legal document for property tax surplus recovery. Extract critical data with high precision. If a field is not found or is highly ambiguous, set it to null and provide a detailed warning in the 'extraction_warnings' field.",
            },
          ],
        },
      ],
      config: {
        systemInstruction: `You are a Senior Legal Document Auditor specialized in US Property Tax Surplus/Excess Proceeds. 
        Your goal is to extract structured data from diverse documents (Deeds, Tax Bills, Affidavits, IDs, etc.).
        
        PRECISION RULES:
        1. PARCEL ID: Also known as APN, PIN, Folio, or Tax ID. Look for specific alphanumeric patterns.
        2. OWNER NAME: Identify the primary Grantee or Taxpayer. Distinguish between previous and current owners if multiple are listed.
        3. DATES: Standardize all dates to YYYY-MM-DD.
        4. SURPLUS: Look for 'Excess Proceeds', 'Bid Surplus', or the difference between Sale Price and Opening Bid.
        5. CONFIDENCE: Provide a confidence score reflecting extraction certainty.
        
        If the document is a generic letter or irrelevant, mark the 'document_type' as 'OTHER'.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            owner_name: { type: Type.STRING, description: "Primary owner/claimant name found on document." },
            parcel_id: { type: Type.STRING, description: "APN, PIN, or Folio Number." },
            address: { type: Type.STRING, description: "Subject property address." },
            surplus_amount: { type: Type.NUMBER, description: "The calculated or stated surplus proceeds." },
            tax_sale_date: { type: Type.STRING, description: "Date of the tax sale auction in YYYY-MM-DD format." },
            document_type: { 
              type: Type.STRING, 
              description: "Categorize as: DEED, TAX_BILL, ID, AFFIDAVIT, PROBATE, MAILING_PROOF, or OTHER." 
            },
            tags: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING }, 
              description: "Descriptive labels like 'Notarized', 'Multi-Parcel', 'Handwritten'." 
            },
            extraction_warnings: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of issues like 'OCR unreadable', 'Missing signature', 'Ambiguous owner'."
            },
            confidence_score: { type: Type.NUMBER, description: "Value from 0.0 to 1.0 reflecting extraction certainty." }
          },
          required: ["owner_name", "parcel_id", "document_type", "tags", "confidence_score"],
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
 * Performs web-grounded research to locate claimants or heirs.
 * Uses gemini-3-flash-preview with Google Search Grounding.
 */
export const performSkipTracing = async (ownerName: string, address: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Conduct deep skip tracing research for ${ownerName} last known at ${address}. Look for potential current addresses, phone numbers, family members, or obituary records. Provide a structured summary of findings suitable for a legal dossier.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      text: response.text || "No information discovered via web grounding.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Gemini Skip-Tracing Error:", error);
    throw error;
  }
};

/**
 * Generates a complete claim package including demand letters and affidavits.
 * Uses gemini-3-pro-preview for complex legal reasoning and document generation.
 */
export const generateClaimPackage = async (property: any, waterfallData: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Generate a formal property surplus claim package based on the following context:
      Property Data: ${JSON.stringify(property)}
      Waterfall Analysis: ${JSON.stringify(waterfallData)}
      
      Generate content for the following legal artifacts:
      1. demand_letter: A formal demand for surplus proceeds addressed to the relevant county authority.
      2. affidavit: A sworn statement of claim for the owner/heir.
      3. accounting_statement: A professional breakdown of the surplus, senior liens, and final net recovery.`,
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

    const text = response.text;
    if (!text) throw new Error("Failed to generate claim package artifacts");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Packaging Error:", error);
    throw error;
  }
};
