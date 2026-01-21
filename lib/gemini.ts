
import { GoogleGenAI, Type } from "@google/genai";

// We wrap initialization to avoid top-level ReferenceErrors if process is weirdly handled
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
            text: "Extract key property tax and surplus information from this document. Provide owner names, parcel IDs, dollar amounts, and relevant dates.",
          },
        ],
      },
    ],
    config: {
      systemInstruction: "You are a professional legal document extractor. Return ONLY valid JSON that matches the requested schema. If a value is unknown, use null.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          owner_name: { type: Type.STRING, description: "Full name of the property owner or claimant" },
          parcel_id: { type: Type.STRING, description: "The APN or Parcel Identification Number" },
          address: { type: Type.STRING, description: "Full physical address of the property" },
          surplus_amount: { type: Type.NUMBER, description: "The calculated excess proceeds or surplus amount" },
          tax_sale_date: { type: Type.STRING, description: "The date the tax sale occurred (YYYY-MM-DD)" },
          document_type: { type: Type.STRING, description: "Classification: DEED, TAX_BILL, ID, or OTHER" },
        },
        required: ["owner_name", "parcel_id", "document_type"],
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
