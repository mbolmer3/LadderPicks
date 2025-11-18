import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useMemo } from 'react';
import { Player, StatType } from '@/mocks/players';
import { WagerDirection, RiskLevel } from '@/mocks/wagers';
import { calculateLadderRungs as calculateLadderRungsService } from '@/services/ladderCalculator';
import { fetchMarketOdds } from '@/services/oddsApiService';
import { deriveDistributionFromMarket, getDefaultDistribution } from '@/services/distributionService';

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

  const calculateLadderRungs = useCallback(async (
    breakeven: number,
    stake: number,
    riskLevel: RiskLevel,
    direction: WagerDirection,
    player: Player | null,
    statType: StatType | null
  ): Promise<LadderRung[]> => {
    console.log('Calculating ladder rungs:', { breakeven, stake, riskLevel, direction, player: player?.id, statType });
    
    if (!player || !statType) {
      console.warn('Missing player or statType for ladder calculation');
      return [];
    }

    try {
      // Fetch market odds
      const marketOdds = await fetchMarketOdds(player.id, statType);
      
      // Derive distribution from market or use defaults
      const distribution = marketOdds
        ? deriveDistributionFromMarket(marketOdds)
        : getDefaultDistribution(statType);

      // Calculate ladder rungs using the new service
      const result = calculateLadderRungsService({
        stake,
        breakeven,
        direction,
        riskLevel,
        distribution,
      });

      // Handle errors
      if ('error' in result) {
        console.error('Ladder calculation error:', result.message);
        return [];
      }

      return result;
    } catch (error) {
      console.error('Error calculating ladder rungs:', error);
      return [];
    }
  }, []);

  const calculateProjectedStat = useCallback(async (player: Player | null, statType: StatType | null): Promise<number> => {
    if (!player || !statType) return 0;

    try {
      // Fetch market odds to get projection
      const marketOdds = await fetchMarketOdds(player.id, statType);
      
      if (marketOdds) {
        // Use market mean as projection
        return Math.round(marketOdds.marketMean);
      }

      // Fallback to default distribution mean
      const defaultDist = getDefaultDistribution(statType);
      return Math.round(defaultDist.mean);
    } catch (error) {
      console.error('Error calculating projected stat:', error);
      // Fallback to default distribution mean
      const defaultDist = getDefaultDistribution(statType);
      return Math.round(defaultDist.mean);
    }
  }, []);

  return useMemo(() => ({
    draft,
    updateDraft,
    resetDraft,
    calculateLadderRungs,
    calculateProjectedStat,
  }), [draft, updateDraft, resetDraft, calculateLadderRungs, calculateProjectedStat]);
});
