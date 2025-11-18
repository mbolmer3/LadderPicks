import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TrendingUp, TrendingDown, Clock } from "lucide-react-native";
import Colors from "@/constants/colors";
import { MOCK_WAGERS, Wager } from "@/mocks/wagers";
import { STAT_LABELS } from "@/mocks/players";

export default function WagersScreen() {
  const insets = useSafeAreaInsets();

  const renderWagerCard = (wager: Wager) => {
    const isWon = wager.status === 'won';
    const isLost = wager.status === 'lost';
    const isPending = wager.status === 'pending';

    return (
      <TouchableOpacity
        key={wager.id}
        style={styles.wagerCard}
        activeOpacity={0.8}
      >
        <View style={styles.wagerHeader}>
          <View style={styles.playerInfo}>
            <Text style={styles.playerName}>{wager.player.name}</Text>
            <Text style={styles.playerTeam}>{wager.player.team} · {STAT_LABELS[wager.statType]}</Text>
          </View>
          {isPending && (
            <View style={styles.statusBadge}>
              <Clock color={Colors.dark.warning} size={14} />
              <Text style={styles.statusText}>Live</Text>
            </View>
          )}
          {isWon && (
            <View style={[styles.statusBadge, styles.wonBadge]}>
              <Text style={styles.wonText}>WON</Text>
            </View>
          )}
          {isLost && (
            <View style={[styles.statusBadge, styles.lostBadge]}>
              <Text style={styles.lostText}>LOST</Text>
            </View>
          )}
        </View>

        <View style={styles.wagerDetails}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Stake</Text>
              <Text style={styles.detailValue}>${wager.stake}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Breakeven</Text>
              <View style={styles.breakevenContainer}>
                {wager.direction === 'over' ? (
                  <TrendingUp color={Colors.dark.primary} size={16} />
                ) : (
                  <TrendingDown color={Colors.dark.danger} size={16} />
                )}
                <Text style={styles.detailValue}>{wager.breakeven}</Text>
              </View>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Risk</Text>
              <Text style={styles.detailValue}>{wager.riskLevel.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {!isPending && (
          <View style={styles.resultRow}>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Actual</Text>
              <Text style={styles.resultValue}>{wager.actualStat}</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Payout</Text>
              <Text style={[styles.resultValue, isWon && styles.wonValue]}>
                ${wager.payout}
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>My Wagers</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_WAGERS.map(renderWagerCard)}

        {MOCK_WAGERS.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No wagers yet</Text>
            <Text style={styles.emptySubtext}>Create your first Ladder Play to get started</Text>
          </View>
        )}
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  wagerCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
  },
  wagerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.dark.text,
    marginBottom: 4,
  },
  playerTeam: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.dark.inputBg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.dark.warning,
  },
  wonBadge: {
    backgroundColor: Colors.dark.success + '20',
  },
  wonText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.dark.success,
  },
  lostBadge: {
    backgroundColor: Colors.dark.danger + '20',
  },
  lostText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.dark.danger,
  },
  wagerDetails: {
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  breakevenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resultRow: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
    gap: 16,
  },
  resultItem: {
    flex: 1,
  },
  resultLabel: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  wonValue: {
    color: Colors.dark.success,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.dark.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
});
