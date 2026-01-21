
import { GoogleGenAI, Type, Modality } from "@google/genai";

// AI Core v3.0 - Central Intelligence Library

/**
 * Generates audio narration for user guides and workflow steps.
 */
export const generateVoiceGuide = async (text: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say the following in a professional, authoritative, and helpful narrator voice: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Professional narrator voice
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("Intelligence Engine did not return audio stream.");
    return base64Audio;
  } catch (error) {
    console.error("Voice Generation Error:", error);
    throw error;
  }
};

/**
 * Extracts structured data from property-related legal documents.
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
            { text: "Perform a deep legal audit of this document. Focus on identifying the current owner, the parcel ID, and any recorded encumbrances or liens." },
          ],
        },
      ],
      config: {
        systemInstruction: `You are a World-Class Senior Legal Document Auditor. Analyze for: 1. Owner names 2. Parcel IDs 3. Financials 4. Liens (MORTGAGE, HOA, etc).`,
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
            confidence_score: { type: Type.NUMBER },
            extraction_rationale: { type: Type.STRING }
          },
          required: ["owner_name", "parcel_id", "document_type", "confidence_score"],
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw error;
  }
};

export const generateOutreachArchitect = async (claimant: any, property: any, skipTraceData: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Generate personalized outreach for ${claimant.name} for $${property.surplus_amount} at ${property.address}. Research: ${skipTraceData}`,
      config: {
        systemInstruction: "You are a Legal Outreach Strategist. Tone: Professional, empathetic, authoritative.",
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
  } catch (error) { throw error; }
};

export const performSkipTracing = async (ownerName: string, address: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Perform a deep skip trace on ${ownerName} at ${address}.`,
      config: { 
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a Private Investigator. Provide factual, verified data points."
      },
    });
    return {
      text: response.text || "No actionable data found.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) { throw error; }
};

export const generateClaimPackage = async (property: any, waterfallData: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Generate claim package for ${property.address}. Net Recovery: $${waterfallData.finalSurplus}.`,
      config: {
        systemInstruction: "Legal Documentation Specialist. Draft professional, court-ready forms.",
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
