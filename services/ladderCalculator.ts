import { RiskLevel, WagerDirection } from '@/mocks/wagers';
import { ladderConfig } from '@/config/ladderConfig';
import { DistributionParams } from '@/types/ladder';
import { computeBinProbability, computeTailProbability } from './distributionService';

const EPSILON = 1e-10;

export interface LadderCalculationInput {
  stake: number;
  breakeven: number;
  direction: WagerDirection;
  riskLevel: RiskLevel;
  distribution: DistributionParams;
}

export interface LadderRung {
  value: number;
  payout: number;
}

export interface LadderCalculationError {
  error: true;
  message: string;
}

export type LadderCalculationResult = LadderRung[] | LadderCalculationError;

/**
 * Main ladder calculation function
 * Implements the full algorithm from the prompt
 */
export function calculateLadderRungs(
  input: LadderCalculationInput
): LadderCalculationResult {
  const { stake, breakeven, direction, riskLevel, distribution } = input;
  const config = ladderConfig;

  // Step 1: Input validation
  if (stake > config.globalLimits.maxStake) {
    return {
      error: true,
      message: `Stake exceeds maximum of ${config.globalLimits.maxStake}`,
    };
  }

  if (stake < config.globalLimits.minStake) {
    return {
      error: true,
      message: `Stake below minimum of ${config.globalLimits.minStake}`,
    };
  }

  // Step 2: Load risk configuration
  const riskConfig = config.riskConfigs[riskLevel];
  const { offsets, weights, maxPayoutMultiplier } = riskConfig;

  // Step 3: Build thresholds array relative to breakeven
  const thresholds: number[] = [];
  if (direction === 'over') {
    thresholds.push(...offsets.map(offset => breakeven + offset));
    // Sort ascending for "over"
    thresholds.sort((a, b) => a - b);
  } else {
    thresholds.push(...offsets.map(offset => breakeven - offset));
    // Sort descending for "under"
    thresholds.sort((a, b) => b - a);
  }

  // Step 4: Compute bin probabilities
  const probabilities: number[] = [];
  const numBins = thresholds.length;

  for (let i = 0; i < numBins; i++) {
    if (direction === 'over') {
      if (i === numBins - 1) {
        // Last bin (tail) for "over": P(x >= threshold)
        const prob = computeTailProbability(thresholds[i], distribution, direction);
        probabilities.push(Math.max(0, prob));
      } else {
        // Interior bins for "over": P(lower <= x < upper)
        const lower = thresholds[i];
        const upper = thresholds[i + 1];
        const prob = computeBinProbability(lower, upper, distribution, direction);
        probabilities.push(Math.max(0, prob));
      }
    } else {
      // "under" direction
      if (i === 0) {
        // First bin (tail) for "under": P(x <= threshold)
        const prob = computeTailProbability(thresholds[i], distribution, direction);
        probabilities.push(Math.max(0, prob));
      } else {
        // Interior bins for "under": P(upper < x <= lower) where thresholds are descending
        const lower = thresholds[i - 1];  // Previous (higher) threshold
        const upper = thresholds[i];      // Current (lower) threshold
        const prob = computeBinProbability(lower, upper, distribution, direction);
        probabilities.push(Math.max(0, prob));
      }
    }
  }

  // Ensure probabilities sum to approximately 1 (handle floating point errors)
  const probSum = probabilities.reduce((sum, p) => sum + p, 0);
  if (probSum > 0) {
    const remainder = 1 - probSum;
    if (remainder > 0 && probabilities.length > 0) {
      probabilities[probabilities.length - 1] += remainder;
    }
  }

  // Step 5: Compute denominator D = Σ(prob_k * w_k)
  let D = 0;
  for (let i = 0; i < probabilities.length; i++) {
    D += probabilities[i] * weights[i];
  }

  if (D <= EPSILON) {
    return {
      error: true,
      message: 'Invalid calculation: denominator too small',
    };
  }

  // Step 6: Compute scaling constant C
  const edge = config.edge;
  let C = ((1 - edge) * stake) / D;

  // Step 7: Compute raw payouts
  const rawPayouts = weights.map(w => C * w);

  // Step 8: Apply caps
  const perRiskCap = Math.min(
    maxPayoutMultiplier * stake,
    config.globalLimits.maxWinPerWager
  );

  const cappedIndices: number[] = [];
  const uncappedIndices: number[] = [];

  for (let i = 0; i < rawPayouts.length; i++) {
    if (rawPayouts[i] > perRiskCap) {
      cappedIndices.push(i);
    } else {
      uncappedIndices.push(i);
    }
  }

  // Step 9: Recompute C if capping occurred
  if (cappedIndices.length > 0) {
    // Calculate reserved amount for capped rungs
    let reserved = 0;
    for (const i of cappedIndices) {
      reserved += probabilities[i] * perRiskCap;
    }

    // Calculate denominator for uncapped rungs
    let D_uncapped = 0;
    for (const i of uncappedIndices) {
      D_uncapped += probabilities[i] * weights[i];
    }

    if (D_uncapped <= EPSILON) {
      return {
        error: true,
        message: 'Invalid calculation: insufficient uncapped mass',
      };
    }

    // Recompute C
    const targetPayout = (1 - edge) * stake;
    C = (targetPayout - reserved) / D_uncapped;

    if (C < 0) {
      return {
        error: true,
        message: 'Invalid calculation: negative scaling constant after capping',
      };
    }
  }

  // Step 10: Compute final payouts
  const payouts: number[] = [];
  for (let i = 0; i < weights.length; i++) {
    let payout = C * weights[i];
    
    // Apply cap
    if (payout > perRiskCap) {
      payout = perRiskCap;
    }

    // Round to nearest integer
    payout = Math.round(payout / config.globalLimits.rounding) * config.globalLimits.rounding;

    // Minimum payout of 0 (no negative payouts)
    payout = Math.max(0, payout);

    payouts.push(payout);
  }

  // Step 11: Build rungs array
  // Display value is the minimum of the bin (threshold[i])
  const rungs: LadderRung[] = [];
  for (let i = 0; i < thresholds.length; i++) {
    rungs.push({
      value: thresholds[i], // Minimum of bin for display
      payout: payouts[i],
    });
  }

  // Step 12: Final validation - check expected payout
  const expectedPayout = probabilities.reduce(
    (sum, prob, i) => sum + prob * payouts[i],
    0
  );
  const targetPayout = (1 - edge) * stake;
  const tolerance = 2; // Allow ±2 credits tolerance

  if (Math.abs(expectedPayout - targetPayout) > tolerance) {
    console.warn(
      `Expected payout ${expectedPayout} differs from target ${targetPayout} by more than tolerance`
    );
  }

  return rungs;
}

