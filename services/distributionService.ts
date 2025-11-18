import { StatType } from '@/mocks/players';
import { DistributionParams, MarketOdds } from '@/types/ladder';

/**
 * Standard normal CDF approximation using error function
 */
function normalCDF(x: number, mean: number, sd: number): number {
  const z = (x - mean) / sd;
  // Approximation using error function: 0.5 * (1 + erf(z / sqrt(2)))
  // Using Abramowitz and Stegun approximation
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  
  if (z > 0) {
    return 1 - p;
  } else {
    return p;
  }
}

/**
 * Derives distribution parameters from market odds
 */
export function deriveDistributionFromMarket(marketOdds: MarketOdds): DistributionParams {
  return {
    mean: marketOdds.marketMean,
    sd: marketOdds.marketSD,
  };
}

/**
 * Fallback distribution parameters based on stat type
 * Used when market data is unavailable
 */
export function getDefaultDistribution(statType: StatType): DistributionParams {
  const defaults: Record<StatType, { mean: number; sd: number }> = {
    receiving_yards: { mean: 70, sd: 25 },
    rushing_yards: { mean: 60, sd: 24 },
    passing_yards: { mean: 270, sd: 68 },
    points: { mean: 20, sd: 6 },      // NFL
    rebounds: { mean: 8, sd: 3 },     // NBA
    assists: { mean: 6, sd: 2.5 },    // NBA
  };

  return defaults[statType];
}

/**
 * Computes probability for a bin [lower, upper) using CDF
 */
export function computeBinProbability(
  lower: number,
  upper: number,
  params: DistributionParams,
  direction: 'over' | 'under'
): number {
  const { mean, sd } = params;

  if (direction === 'over') {
    // For "over", bin [lower, upper) means lower <= x < upper
    const probLower = normalCDF(lower, mean, sd);
    const probUpper = normalCDF(upper, mean, sd);
    return Math.max(0, probUpper - probLower);
  } else {
    // For "under", bin [upper, lower) means upper < x <= lower (reversed)
    const probLower = normalCDF(lower, mean, sd);
    const probUpper = normalCDF(upper, mean, sd);
    return Math.max(0, probLower - probUpper);
  }
}

/**
 * Computes probability for the tail bin (last bin)
 */
export function computeTailProbability(
  threshold: number,
  params: DistributionParams,
  direction: 'over' | 'under'
): number {
  const { mean, sd } = params;

  if (direction === 'over') {
    // P(x >= threshold)
    return 1 - normalCDF(threshold, mean, sd);
  } else {
    // P(x <= threshold)
    return normalCDF(threshold, mean, sd);
  }
}

