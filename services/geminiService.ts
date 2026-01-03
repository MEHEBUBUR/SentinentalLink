import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, RiskLevel } from "../types";

const parseRiskLevel = (score: number): RiskLevel => {
  // Stricter thresholds to catch more potential threats
  if (score <= 15) return RiskLevel.SAFE;
  if (score < 75) return RiskLevel.SUSPICIOUS;
  return RiskLevel.MALICIOUS;
};

export const analyzeUrlWithGemini = async (url: string): Promise<AnalysisResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // We use gemini-3-flash-preview for fast, reasoning-capable analysis
    const modelId = "gemini-3-flash-preview";
    
    const systemInstruction = `
      You are a strict and paranoid cybersecurity AI. Your job is to detect even the slightest sign that a URL might be fake, malicious, or a phishing attempt.

      CRITICAL ANALYSIS RULES:
      1. **Brand Impersonation**: If a URL looks like a popular brand (Facebook, Google, Apple, Amazon, Bank, Netflix, etc.) but the domain is NOT the official one, you MUST mark it as MALICIOUS (Score 80-100). Example: "secure-google-login.com" is MALICIOUS.
      2. **Typosquatting**: If the URL has misspellings of popular names (e.g., "g0ogle.com", "faceb0ok.com", "amaz0n.net"), it is MALICIOUS (Score 90+).
      3. **Suspicious Structure**: Look for long random strings, excessive subdomains (e.g., "login.verify.account.update.com"), or suspicious TLDs (.xyz, .top) combined with brand names. Mark these as HIGH RISK.
      4. **IP Addresses**: If the URL uses an IP address (like http://192.168.1.5) instead of a domain name, mark it as SUSPICIOUS or MALICIOUS.
      5. **Unknown Domains**: If you do not recognize the domain as a well-known, safe website, DO NOT mark it as 0 risk. Mark it as SUSPICIOUS (Score 40-60) to be safe.

      ONLY mark a URL as "Safe" (Score 0-10) if you are 100% sure it is a legitimate, official website (like google.com, wikipedia.org, bbc.co.uk).

      Explanation Requirements:
      - Use simple, plain English.
      - Be direct. Tell the user exactly what is wrong.
      - Example: "This is dangerous because it tries to look like Facebook but is not the real facebook.com."
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Analyze this URL carefully: ${url}`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: {
              type: Type.NUMBER,
              description: "A score from 0 (Safe) to 100 (Deadly). Be strict.",
            },
            threatType: {
              type: Type.STRING,
              description: "Type of threat: 'Phishing', 'Malware', 'Fake Site', 'Scam', 'Suspicious', or 'Safe'.",
            },
            explanation: {
              type: Type.STRING,
              description: "A simple, easy-to-understand explanation for a non-technical user.",
            },
            technicalFlags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of red flags (e.g., 'Not official domain', 'Misspelled name').",
            },
          },
          required: ["riskScore", "threatType", "explanation", "technicalFlags"],
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No response from AI");
    }

    const data = JSON.parse(jsonText);

    return {
      url,
      riskScore: data.riskScore,
      riskLevel: parseRiskLevel(data.riskScore),
      threatType: data.threatType,
      explanation: data.explanation,
      technicalFlags: data.technicalFlags,
      analyzedAt: new Date().toISOString(),
    };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      url,
      riskScore: 0,
      riskLevel: RiskLevel.UNKNOWN,
      threatType: "Error",
      explanation: "We could not reach the analysis server. Please check your internet connection and try again.",
      technicalFlags: ["Connection Error"],
      analyzedAt: new Date().toISOString(),
    };
  }
};