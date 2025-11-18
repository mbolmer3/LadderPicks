import { Player, StatType } from './players';
import { LadderRung } from '@/contexts/WagerContext';

export type WagerDirection = 'over' | 'under';
export type RiskLevel = 'low' | 'medium' | 'high';
export type WagerStatus = 'pending' | 'won' | 'lost';

export interface Wager {
  id: string;
  player: Player;
  statType: StatType;
  stake: number;
  breakeven: number;
  direction: WagerDirection;
  riskLevel: RiskLevel;
  projectedStat: number;
  status: WagerStatus;
  actualStat?: number;
  payout?: number;
  ladderRungs?: LadderRung[];
  createdAt: Date;
}

export const MOCK_WAGERS: Wager[] = [
  {
    id: 'w1',
    player: {
      id: 'p1',
      name: 'Tyreek Hill',
      team: 'MIA',
      sport: 'NFL',
      position: 'WR',
      imageUrl: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&h=400&fit=crop',
      availableStats: ['receiving_yards', 'points'],
    },
    statType: 'receiving_yards',
    stake: 50,
    breakeven: 85,
    direction: 'over',
    riskLevel: 'medium',
    projectedStat: 92,
    status: 'pending',
    createdAt: new Date('2025-11-13'),
  },
  {
    id: 'w2',
    player: {
      id: 'p5',
      name: 'LeBron James',
      team: 'LAL',
      sport: 'NBA',
      position: 'F',
      imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=400&fit=crop',
      availableStats: ['points', 'rebounds', 'assists'],
    },
    statType: 'points',
    stake: 100,
    breakeven: 28,
    direction: 'under',
    riskLevel: 'low',
    projectedStat: 24,
    status: 'won',
    actualStat: 22,
    payout: 180,
    createdAt: new Date('2025-11-12'),
  },
  {
    id: 'w3',
    player: {
      id: 'p3',
      name: 'Patrick Mahomes',
      team: 'KC',
      sport: 'NFL',
      position: 'QB',
      imageUrl: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&h=400&fit=crop',
      availableStats: ['passing_yards', 'points'],
    },
    statType: 'passing_yards',
    stake: 75,
    breakeven: 310,
    direction: 'over',
    riskLevel: 'high',
    projectedStat: 340,
    status: 'lost',
    actualStat: 288,
    payout: 0,
    createdAt: new Date('2025-11-11'),
  },
];
