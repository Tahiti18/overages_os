
import { GoogleGenAI, Type, Modality } from "@google/genai";

// AI Core v3.5 - Central Intelligence Library

/**
 * Scans the web for raw surplus/excess proceeds lists for a specific jurisdiction.
 */
export const scanJurisdictionForSurplus = async (state: string, county: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Find the official URL for the most recent "Property Tax Surplus List", "Excess Proceeds List", or "Tax Sale Overages" for ${county} County, ${state}. Identify if the list is available as a PDF or Excel download. Also find the contact information for the County Treasurer or Clerk responsible for these funds.`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a Jurisdictional Data Scout. Your goal is to find the exact landing page or file URL where surplus funds are listed by the government.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            official_url: { type: Type.STRING },
            data_format: { type: Type.STRING, description: "PDF, Excel, Web Table, or Unknown" },
            last_updated_mention: { type: Type.STRING },
            treasurer_contact: { type: Type.STRING },
            search_summary: { type: Type.STRING },
            discovery_links: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  url: { type: Type.STRING }
                }
              }
            }
          },
          required: ["official_url", "data_format", "search_summary"]
        },
      },
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Jurisdiction Scan Error:", error);
    throw error;
  }
};

/**
 * Researches and identifies attorneys specializing in property tax surplus/overage recovery.
 */
export const researchSpecializedCounsel = async (state: string, county: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for high-rated attorneys or law firms in ${county} County, ${state} who specialize specifically in "Property Tax Surplus Recovery", "Excess Proceeds Claims", or "Tax Sale Foreclosure Defense". Focus on those with a history of filing motions in local Circuit or Superior courts.`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a Legal Recruitment Specialist. Find Bar-verified counsel with specific surplus recovery expertise.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              firm: { type: Type.STRING },
              expertise_score: { type: Type.NUMBER, description: "1-100 score based on relevant practice areas found." },
              contact_info: { type: Type.STRING },
              website: { type: Type.STRING },
              rationale: { type: Type.STRING, description: "Why this attorney was selected." }
            },
            required: ["name", "firm", "expertise_score", "contact_info"]
          }
        },
      },
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Counsel Research Error:", error);
    throw error;
  }
};

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
 * Uses Gemini to search for potential liens or judgments on a property.
 */
export const discoverPropertyLiens = async (property: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for potential liens, judgments, or encumbrances associated with the property at ${property.address} (Parcel ID: ${property.parcel_id}) in ${property.county}, ${property.state}. Focus on tax records and judicial filings.`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a Forensic Title Researcher. Identify potential debts that might affect a surplus recovery waterfall.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, description: "Lien type like MORTGAGE_1, HOA, JUDGMENT, etc." },
              description: { type: Type.STRING },
              amount: { type: Type.NUMBER },
              priority: { type: Type.NUMBER, description: "1 for Gov, 2-3 for Mortgages, 4-7 for junior liens" },
            },
            required: ["type", "description", "amount", "priority"]
          }
        },
      },
    });

    // Check if the response text is JSON
    try {
      return JSON.parse(response.text || "[]");
    } catch (e) {
      console.warn("AI returned non-JSON for liens, returning empty array.");
      return [];
    }
  } catch (error) {
    console.error("Lien Discovery Error:", error);
    throw error;
  }
};

/**
 * Extracts structured data from property-related legal documents with jurisdiction awareness.
 */
export const extractDocumentData = async (base64Data: string, mimeType: string, jurisdiction?: { state: string, county: string }) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const state = jurisdiction?.state || "Unknown";
  const county = jurisdiction?.county || "Unknown";

  const jurisdictionDirectives = {
    'MD': "Maryland is a JUDICIAL state. Prioritize identifying Circuit Court headers, Case Numbers, and Attorney certifications (Rule 14-B compliance). Look for 'Motion for Distribution of Surplus'.",
    'GA': "Georgia is a REDEMPTION state. Identify if the document is a Tax Deed or Quitclaim. Focus on the 12-month redemption period status and expiration date.",
    'FL': "Florida has a 120-day junior lien window (HB 141). Look for 'Surplus Application' forms and notarized 'Affidavit of Ownership'.",
    'TX': "Texas has strict 2-year redemption for homesteads. Identify Homestead Affidavits and check for HOA priority seniority issues."
  }[state] || "Standard US property tax surplus context.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [
        {
          parts: [
            { inlineData: { data: base64Data, mimeType: mimeType } },
            { text: `Analyze this document for property in ${county}, ${state}. ${jurisdictionDirectives}` },
          ],
        },
      ],
      config: {
        systemInstruction: `You are a World-Class Senior Legal Document Auditor. Analyze for: 1. Owner names 2. Parcel IDs 3. Financials 4. Liens 5. Jurisdiction-specific compliance markers.`,
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
            extraction_rationale: { type: Type.STRING },
            jurisdiction_compliance_found: { type: Type.BOOLEAN, description: "True if state-specific required markers were identified." }
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
