
// AI Core v4.0 - OpenRouter Integration for Gemini Flash
// Note: This implementation uses standard fetch to support OpenRouter's OpenAI-compatible endpoint.

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL_NAME = "google/gemini-2.0-flash-001"; // Standard OpenRouter string for Gemini Flash

async function callOpenRouter(messages: any[], jsonMode = false, tools = []) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured in the environment.");
  }

  const body: any = {
    model: MODEL_NAME,
    messages: messages,
    response_format: jsonMode ? { type: "json_object" } : undefined,
  };

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": window.location.origin, // Required by OpenRouter
      "X-Title": "Prospector AI", // Required by OpenRouter
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "OpenRouter Request Failed");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Scans for surplus lists.
 */
export const scanJurisdictionForSurplus = async (state: string, county: string) => {
  const prompt = `Analyze ${county} County, ${state} surplus list patterns. 
  Identify the DIRECT URL for "Excess Proceeds".
  Identify the ACCESS_TYPE: OPEN_PDF, HYBRID_WEB, or MOAT_GATED.
  Research the "Temporal Cadence" and predict the "Next Expected Update".
  Return a JSON object matching this schema:
  {
    "official_url": "string",
    "access_type": "OPEN_PDF | HYBRID_WEB | MOAT_GATED",
    "cadence": "string",
    "last_updated": "string",
    "next_expected_drop": "string",
    "cadence_rationale": "string",
    "search_summary": "string",
    "orr_instructions": "string",
    "discovery_links": [{"title": "string", "url": "string", "reliability": "VERIFIED_GOV"}]
  }`;

  const result = await callOpenRouter([{ role: "user", content: prompt }], true);
  return JSON.parse(result);
};

/**
 * Generates a formal Open Records Request (ORR) letter.
 */
export const generateORRLetter = async (state: string, county: string, treasurerContact: string) => {
  const prompt = `Generate a formal ORR/FOIA letter for ${county} County, ${state} regarding Tax Sale Excess Proceeds. 
  Return JSON: { "subject": "string", "letter_body": "string", "statute_reference": "string" }`;
  const result = await callOpenRouter([{ role: "user", content: prompt }], true);
  return JSON.parse(result);
};

/**
 * Researches and identifies specialized attorneys.
 */
export const researchSpecializedCounsel = async (state: string, county: string) => {
  const prompt = `Find specialized attorneys for "Property Tax Surplus Recovery" in ${county}, ${state}.
  Return a JSON array of objects with keys: name, firm, expertise_score (1-100), contact_info, website, rationale.`;
  const result = await callOpenRouter([{ role: "user", content: prompt }], true);
  return JSON.parse(result);
};

/**
 * Generates audio narration (FALLBACK: Standard TTS used if OpenRouter/Gemini doesn't support direct audio generation).
 */
export const generateVoiceGuide = async (text: string) => {
  console.warn("Native Multimodal Audio requires a Direct Google AI Studio Key. Fallback to text-only processing.");
  return null; 
};

/**
 * Identifies potential liens or judgments.
 */
export const discoverPropertyLiens = async (property: any) => {
  const prompt = `Identify potential senior liens for the property at ${property.address} in ${property.county}, ${property.state}.
  Return a JSON array: [{"type": "MORTGAGE_1 | HOA | JUDGMENT", "description": "string", "amount": number, "priority": number}]`;
  const result = await callOpenRouter([{ role: "user", content: prompt }], true);
  return JSON.parse(result);
};

/**
 * Extracts structured data from property documents.
 */
export const extractDocumentData = async (base64Data: string, mimeType: string, jurisdiction?: { state: string, county: string }) => {
  const state = jurisdiction?.state || "Unknown";
  const prompt = `Analyze this legal document for a property in ${state}. Extract owner names, parcel IDs, and financials.
  Provide a confidence score for each field.
  Return JSON:
  {
    "document_type": "string",
    "overall_confidence": number,
    "fields": {
      "owner_name": { "value": "string", "confidence": number },
      "parcel_id": { "value": "string", "confidence": number },
      "address": { "value": "string", "confidence": number },
      "surplus_amount": { "value": number, "confidence": number }
    }
  }`;

  const messages = [
    {
      role: "user",
      content: [
        { type: "text", text: prompt },
        { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Data}` } }
      ]
    }
  ];

  const result = await callOpenRouter(messages, true);
  return JSON.parse(result);
};

export const generateOutreachArchitect = async (claimant: any, property: any, skipTraceData: string) => {
  const prompt = `Generate recovery outreach (Mail, SMS, Phone) for ${claimant.name} ($${property.surplus_amount}).
  Return JSON: { "direct_mail": "string", "sms_script": "string", "phone_script": "string" }`;
  const result = await callOpenRouter([{ role: "user", content: prompt }], true);
  return JSON.parse(result);
};

export const performSkipTracing = async (ownerName: string, address: string) => {
  const prompt = `Perform skip tracing on ${ownerName} at ${address}. Return a summary dossier.`;
  const result = await callOpenRouter([{ role: "user", content: prompt }]);
  return { text: result, sources: [] };
};

export const generateClaimPackage = async (property: any, waterfallData: any) => {
  const prompt = `Generate court-ready demand letter, affidavit, and accounting for ${property.address}.
  Return JSON: { "demand_letter": "string", "affidavit": "string", "accounting_statement": "string" }`;
  const result = await callOpenRouter([{ role: "user", content: prompt }], true);
  return JSON.parse(result);
};
