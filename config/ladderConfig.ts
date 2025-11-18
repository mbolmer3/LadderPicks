import { LadderConfig } from '@/types/ladder';

export const ladderConfig: LadderConfig = {
  edge: 0.10,
  riskConfigs: {
    low: {
      offsets: [-10, 0, 10, 20, 30],
      weights: [0.25, 0.5, 1.0, 1.5, 3.0],
      maxPayoutMultiplier: 5,
    },
    medium: {
      offsets: [0, 10, 20, 30, 40],
      weights: [0.2, 0.6, 1.2, 2.5, 5.0],
      maxPayoutMultiplier: 10,
    },
    high: {
      offsets: [10, 20, 30, 40, 60],
      weights: [0.0, 0.0, 0.8, 1.8, 6.0],
      maxPayoutMultiplier: 20,
    },
  },
  globalLimits: {
    maxStake: 1000,
    maxWinPerWager: 5000,
    minStake: 1,
    rounding: 1,
  },
};

