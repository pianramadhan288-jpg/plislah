
export enum AIMode {
  SCALPING = 'SCALPING',
  SWING = 'SWING',
  INVESTASI = 'INVESTASI',
  ALL = 'ALL'
}

export enum AIPersona {
  INSTITUSI = 'INSTITUSI',
  RITEL = 'RITEL'
}

export interface AnalysisResult {
  score: number;
  explanation: string;
  trendTomorrow: 'UP' | 'DOWN' | '___';
  trendProbability: number;
  entryPrice: number;
  takeProfit: number;
  stopLoss: number;
  recommendedLots: number;
  fullAnalysisText: string;
}

export interface BrokerInfo {
  code: string;
  type: 'RICH' | 'KONGLO' | 'AMPAS' | 'CAMPUR';
  desc: string;
}
