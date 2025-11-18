import { StatType } from '@/mocks/players';
import { RiskLevel } from '@/mocks/wagers';

export interface MarketOdds {
  playerId: string;
  statType: StatType;
  overLine: number;           // e.g., 85.5 for receiving yards
  underLine: number;          // typically same as overLine
  overOdds: number;           // American odds (e.g., -110)
  underOdds: number;
  impliedProbOver: number;    // derived from odds
  impliedProbUnder: number;
  marketMean: number;          // derived from line
  marketSD: number;           // estimated from spread/historical
}

export interface DistributionParams {
  mean: number;
  sd: number;
}

export interface RiskConfig {
  offsets: number[];
  weights: number[];
  maxPayoutMultiplier: number;
}

export interface LadderConfig {
  edge: number;
  riskConfigs: Record<RiskLevel, RiskConfig>;
  globalLimits: {
    maxStake: number;
    maxWinPerWager: number;
    minStake: number;
    rounding: number;
  };
}

export interface LadderCalculationResult {
  rungs: Array<{ value: number; payout: number }>;
  metadata?: {
    C: number;
    D: number;
    probabilities: number[];
    expectedPayout: number;
  };
}

export interface LadderCalculationError {
  error: true;
  message: string;
}

