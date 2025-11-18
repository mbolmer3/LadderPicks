import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Trophy, TrendingUp } from "lucide-react-native";
import Colors from "@/constants/colors";
import { MOCK_LEADERBOARD, LeaderboardUser } from "@/mocks/leaderboard";

export default function LeaderboardScreen() {
  const insets = useSafeAreaInsets();

  const renderLeaderboardItem = (user: LeaderboardUser) => {
    const isTop3 = user.rank <= 3;
    const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32'];

    return (
      <View
        key={user.id}
        style={[styles.leaderboardItem, isTop3 && styles.top3Item]}
      >
        <View style={styles.rankContainer}>
          {isTop3 ? (
            <View style={[styles.rankBadge, { backgroundColor: rankColors[user.rank - 1] }]}>
              <Trophy color="#000000" size={16} />
            </View>
          ) : (
            <Text style={styles.rankText}>{user.rank}</Text>
          )}
        </View>

        <Image 
          source={{ uri: user.avatar }}
          style={styles.avatar}
        />

        <View style={styles.userInfo}>
          <Text style={styles.username}>{user.username}</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statText}>{user.totalWagers} wagers</Text>
            <Text style={styles.statDivider}>·</Text>
            <Text style={styles.statText}>{user.winRate}% win</Text>
          </View>
        </View>

        <View style={styles.earningsContainer}>
          <View style={styles.earningsRow}>
            <TrendingUp color={Colors.dark.success} size={16} />
            <Text style={styles.earningsText}>${user.totalEarnings.toLocaleString()}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.subtitle}>Top players this month</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_LEADERBOARD.map(renderLeaderboardItem)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold' as const,
    color: Colors.dark.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
  },
  top3Item: {
    borderColor: Colors.dark.primary,
    borderWidth: 1.5,
  },
  rankContainer: {
    width: 32,
    marginRight: 12,
    alignItems: 'center',
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.textSecondary,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: Colors.dark.inputBg,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.text,
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
  },
  statDivider: {
    fontSize: 13,
    color: Colors.dark.textTertiary,
  },
  earningsContainer: {
    alignItems: 'flex-end',
  },
  earningsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  earningsText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.dark.success,
  },
});
