import { Player, StatType } from '@/mocks/players';
import { MarketOdds } from '@/types/ladder';

/**
 * Converts American odds to implied probability
 */
function americanOddsToImpliedProb(odds: number): number {
  if (odds > 0) {
    return 100 / (odds + 100);
  } else {
    return Math.abs(odds) / (Math.abs(odds) + 100);
  }
}

/**
 * Estimates standard deviation based on stat type and market line
 * Uses historical variance patterns for different stat types
 */
function estimateSD(statType: StatType, marketLine: number): number {
  // Base SD estimates as percentage of mean, adjusted by stat type
  const sdMultipliers: Record<StatType, number> = {
    receiving_yards: 0.35,  // ~35% of mean
    rushing_yards: 0.40,
    passing_yards: 0.25,
    points: 0.30,           // NFL points
    rebounds: 0.35,          // NBA
    assists: 0.40,           // NBA
  };

  return marketLine * sdMultipliers[statType];
}

/**
 * Mock Odds API service
 * Returns realistic market odds data for player+stat combinations
 */
export async function fetchMarketOdds(
  playerId: string,
  statType: StatType
): Promise<MarketOdds | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // Mock market lines based on player and stat type
  const mockLines: Record<string, Record<StatType, number>> = {
    'p1': { // Tyreek Hill
      receiving_yards: 85.5,
      points: 12.5,
    },
    'p2': { // Christian McCaffrey
      rushing_yards: 75.5,
      receiving_yards: 45.5,
      points: 15.5,
    },
    'p3': { // Patrick Mahomes
      passing_yards: 285.5,
      points: 22.5,
    },
    'p4': { // Justin Jefferson
      receiving_yards: 90.5,
      points: 13.5,
    },
    'p5': { // LeBron James
      points: 25.5,
      rebounds: 7.5,
      assists: 7.5,
    },
    'p6': { // Luka Dončić
      points: 28.5,
      rebounds: 9.5,
      assists: 9.5,
    },
    'p7': { // Giannis Antetokounmpo
      points: 30.5,
      rebounds: 11.5,
      assists: 6.5,
    },
    'p8': { // Stephen Curry
      points: 27.5,
      assists: 5.5,
    },
  };

  const marketLine = mockLines[playerId]?.[statType];
  if (!marketLine) {
    return null;
  }

  // Standard American odds for player props (typically -110)
  const overOdds = -110;
  const underOdds = -110;

  const impliedProbOver = americanOddsToImpliedProb(overOdds);
  const impliedProbUnder = americanOddsToImpliedProb(underOdds);

  // Market line represents the median/mean of the distribution
  const marketMean = marketLine;
  const marketSD = estimateSD(statType, marketLine);

  return {
    playerId,
    statType,
    overLine: marketLine,
    underLine: marketLine,
    overOdds,
    underOdds,
    impliedProbOver,
    impliedProbUnder,
    marketMean,
    marketSD,
  };
}

