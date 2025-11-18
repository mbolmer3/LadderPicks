export type Sport = 'NFL' | 'NBA';
export type StatType = 'receiving_yards' | 'rushing_yards' | 'passing_yards' | 'points' | 'rebounds' | 'assists';

export interface Player {
  id: string;
  name: string;
  team: string;
  sport: Sport;
  position: string;
  imageUrl: string;
  availableStats: StatType[];
}

export const PLAYERS: Player[] = [
  {
    id: 'p1',
    name: 'Tyreek Hill',
    team: 'MIA',
    sport: 'NFL',
    position: 'WR',
    imageUrl: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&h=400&fit=crop',
    availableStats: ['receiving_yards', 'points'],
  },
  {
    id: 'p2',
    name: 'Christian McCaffrey',
    team: 'SF',
    sport: 'NFL',
    position: 'RB',
    imageUrl: 'https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=400&h=400&fit=crop',
    availableStats: ['rushing_yards', 'receiving_yards', 'points'],
  },
  {
    id: 'p3',
    name: 'Patrick Mahomes',
    team: 'KC',
    sport: 'NFL',
    position: 'QB',
    imageUrl: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&h=400&fit=crop',
    availableStats: ['passing_yards', 'points'],
  },
  {
    id: 'p4',
    name: 'Justin Jefferson',
    team: 'MIN',
    sport: 'NFL',
    position: 'WR',
    imageUrl: 'https://images.unsplash.com/photo-1587241321921-91a834d82f0e?w=400&h=400&fit=crop',
    availableStats: ['receiving_yards', 'points'],
  },
  {
    id: 'p5',
    name: 'LeBron James',
    team: 'LAL',
    sport: 'NBA',
    position: 'F',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=400&fit=crop',
    availableStats: ['points', 'rebounds', 'assists'],
  },
  {
    id: 'p6',
    name: 'Luka Dončić',
    team: 'DAL',
    sport: 'NBA',
    position: 'G',
    imageUrl: 'https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=400&h=400&fit=crop',
    availableStats: ['points', 'rebounds', 'assists'],
  },
  {
    id: 'p7',
    name: 'Giannis Antetokounmpo',
    team: 'MIL',
    sport: 'NBA',
    position: 'F',
    imageUrl: 'https://images.unsplash.com/photo-1611419010196-735f3f82f3d0?w=400&h=400&fit=crop',
    availableStats: ['points', 'rebounds', 'assists'],
  },
  {
    id: 'p8',
    name: 'Stephen Curry',
    team: 'GSW',
    sport: 'NBA',
    position: 'G',
    imageUrl: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?w=400&h=400&fit=crop',
    availableStats: ['points', 'assists'],
  },
];

export const STAT_LABELS: Record<StatType, string> = {
  receiving_yards: 'Receiving Yards',
  rushing_yards: 'Rushing Yards',
  passing_yards: 'Passing Yards',
  points: 'Points',
  rebounds: 'Rebounds',
  assists: 'Assists',
};
