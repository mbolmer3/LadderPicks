export interface LeaderboardUser {
    id: string;
    username: string;
    avatar: string;
    totalEarnings: number;
    winRate: number;
    totalWagers: number;
    rank: number;
  }
  
  export const MOCK_LEADERBOARD: LeaderboardUser[] = [
    {
      id: 'u1',
      username: 'PropsKing',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
      totalEarnings: 12850,
      winRate: 68,
      totalWagers: 342,
      rank: 1,
    },
    {
      id: 'u2',
      username: 'LadderMaster',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop',
      totalEarnings: 11200,
      winRate: 64,
      totalWagers: 289,
      rank: 2,
    },
    {
      id: 'u3',
      username: 'StatGuru',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&h=200&fit=crop',
      totalEarnings: 9750,
      winRate: 62,
      totalWagers: 267,
      rank: 3,
    },
    {
      id: 'u4',
      username: 'BetSavvy',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
      totalEarnings: 8300,
      winRate: 59,
      totalWagers: 234,
      rank: 4,
    },
    {
      id: 'u5',
      username: 'PropHunter',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&h=200&fit=crop',
      totalEarnings: 7625,
      winRate: 57,
      totalWagers: 198,
      rank: 5,
    },
    {
      id: 'u6',
      username: 'RiskTaker',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      totalEarnings: 6890,
      winRate: 55,
      totalWagers: 176,
      rank: 6,
    },
    {
      id: 'u7',
      username: 'OddsWizard',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      totalEarnings: 6240,
      winRate: 54,
      totalWagers: 165,
      rank: 7,
    },
    {
      id: 'u8',
      username: 'SharpBetter',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
      totalEarnings: 5780,
      winRate: 52,
      totalWagers: 149,
      rank: 8,
    },
  ];
  