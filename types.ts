export enum RiskLevel {
  SAFE = 'SAFE',
  SUSPICIOUS = 'SUSPICIOUS',
  MALICIOUS = 'MALICIOUS',
  UNKNOWN = 'UNKNOWN'
}

export interface UrlComponents {
  protocol: string;
  hostname: string;
  path: string;
  queryParams: string;
}

export interface AnalysisResult {
  url: string;
  riskScore: number; // 0 to 100, where 100 is extremely dangerous
  riskLevel: RiskLevel;
  threatType: string; // e.g., "Phishing", "Malware", "Social Engineering", "None"
  explanation: string;
  technicalFlags: string[];
  analyzedAt: string;
}

export interface HistoryItem extends AnalysisResult {
  id: string;
}