import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useMemo } from 'react';
import { Player, StatType } from '@/mocks/players';
import { WagerDirection, RiskLevel } from '@/mocks/wagers';

export interface LadderRung {
  value: number;
  payout: number;
}

export interface WagerDraft {
  player: Player | null;
  statType: StatType | null;
  stake: number;
  breakeven: number;
  direction: WagerDirection;
  riskLevel: RiskLevel;
  projectedStat: number;
  ladderRungs: LadderRung[];
}

const INITIAL_DRAFT: WagerDraft = {
  player: null,
  statType: null,
  stake: 10,
  breakeven: 50,
  direction: 'over',
  riskLevel: 'medium',
  projectedStat: 0,
  ladderRungs: [],
};

export const [WagerProvider, useWagerDraft] = createContextHook(() => {
  const [draft, setDraft] = useState<WagerDraft>(INITIAL_DRAFT);

  const updateDraft = useCallback((updates: Partial<WagerDraft>) => {
    console.log('Updating draft:', updates);
    setDraft(prev => ({ ...prev, ...updates }));
  }, []);

  const resetDraft = useCallback(() => {
    console.log('Resetting draft');
    setDraft(INITIAL_DRAFT);
  }, []);

  const calculateLadderRungs = useCallback((
    breakeven: number,
    stake: number,
    riskLevel: RiskLevel,
    direction: WagerDirection
  ): LadderRung[] => {
    console.log('Calculating ladder rungs:', { breakeven, stake, riskLevel, direction });
    
    const riskMultipliers = {
      low: { base: 1.5, increment: 0.3 },
      medium: { base: 2.0, increment: 0.5 },
      high: { base: 3.0, increment: 0.8 },
    };

    const { base, increment } = riskMultipliers[riskLevel];
    const rungs: LadderRung[] = [];
    const step = direction === 'over' ? 10 : -10;
    const startValue = direction === 'over' ? 0 : breakeven * 2;
    const numRungs = 10;

    for (let i = 0; i < numRungs; i++) {
      const value = startValue + (i * step);
      let payout = 0;

      if (direction === 'over') {
        if (value >= breakeven) {
          const multiplier = base + ((value - breakeven) / 10) * increment;
          payout = stake * multiplier;
        }
      } else {
        if (value <= breakeven) {
          const multiplier = base + ((breakeven - value) / 10) * increment;
          payout = stake * multiplier;
        }
      }

      rungs.push({ value, payout: Math.round(payout) });
    }

    return rungs;
  }, []);

  const calculateProjectedStat = useCallback((player: Player | null, statType: StatType | null): number => {
    if (!player || !statType) return 0;

    const projections: Record<StatType, [number, number]> = {
      receiving_yards: [60, 120],
      rushing_yards: [50, 100],
      passing_yards: [250, 350],
      points: [18, 32],
      rebounds: [8, 14],
      assists: [6, 12],
    };

    const [min, max] = projections[statType];
    return Math.round(min + Math.random() * (max - min));
  }, []);

  return useMemo(() => ({
    draft,
    updateDraft,
    resetDraft,
    calculateLadderRungs,
    calculateProjectedStat,
  }), [draft, updateDraft, resetDraft, calculateLadderRungs, calculateProjectedStat]);
});
