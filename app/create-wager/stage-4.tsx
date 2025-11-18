import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Modal, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Check, Sparkles } from "lucide-react-native";
import * as Haptics from 'expo-haptics';
import Colors from "@/constants/colors";
import { useWagerDraft } from "@/contexts/WagerContext";
import { STAT_LABELS } from "@/mocks/players";

export default function Stage4Screen() {
  const router = useRouter();
  const { draft, resetDraft } = useWagerDraft();
  const [showSuccess, setShowSuccess] = useState(false);

  const maxPayout = Math.max(...draft.ladderRungs.map(r => r.payout), 0);

  const handleConfirm = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    console.log('Wager confirmed:', draft);
    setShowSuccess(true);
  };

  const handleDone = () => {
    setShowSuccess(false);
    resetDraft();
    router.push('/(tabs)/wagers');
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Sparkles color={Colors.dark.primary} size={32} />
          </View>
          <Text style={styles.title}>Ready to Play?</Text>
          <Text style={styles.subtitle}>
            Review your wager one last time before confirming
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.playerRow}>
            <Image 
              source={{ uri: draft.player?.imageUrl }}
              style={styles.playerImage}
            />
            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>{draft.player?.name}</Text>
              <Text style={styles.playerMeta}>
                {draft.player?.team} · {draft.player?.position}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Stat Type</Text>
            <Text style={styles.detailValue}>
              {STAT_LABELS[draft.statType || 'points']}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Direction</Text>
            <Text style={[
              styles.detailValue,
              { color: draft.direction === 'over' ? Colors.dark.primary : Colors.dark.danger }
            ]}>
              {draft.direction.toUpperCase()}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Breakeven Point</Text>
            <Text style={styles.detailValue}>{draft.breakeven}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Projected Stat</Text>
            <Text style={[styles.detailValue, styles.projectedValue]}>
              {draft.projectedStat}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Risk Level</Text>
            <Text style={[styles.detailValue, styles.riskValue]}>
              {draft.riskLevel.toUpperCase()}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.stakeRow}>
            <Text style={styles.stakeLabel}>Stake Amount</Text>
            <Text style={styles.stakeValue}>${draft.stake}</Text>
          </View>

          <View style={styles.payoutRow}>
            <Text style={styles.payoutLabel}>Maximum Payout</Text>
            <Text style={styles.payoutValue}>${maxPayout}</Text>
          </View>

          <View style={styles.multiplierRow}>
            <Text style={styles.multiplierText}>
              {(maxPayout / draft.stake).toFixed(2)}x multiplier
            </Text>
          </View>
        </View>

        <View style={styles.ladderPreview}>
          <Text style={styles.ladderTitle}>Payout Ladder Preview</Text>
          <View style={styles.ladderList}>
            {draft.ladderRungs.slice().reverse().slice(0, 5).map((rung, index) => (
              <View key={index} style={styles.ladderItem}>
                <Text style={styles.ladderStat}>{rung.value}</Text>
                <View style={styles.ladderArrow} />
                <Text style={styles.ladderPayout}>${rung.payout}</Text>
              </View>
            ))}
            {draft.ladderRungs.length > 5 && (
              <Text style={styles.ladderMore}>
                +{draft.ladderRungs.length - 5} more levels
              </Text>
            )}
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            By confirming, you agree that this is a sweepstakes play for entertainment purposes.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirm}
          activeOpacity={0.8}
        >
          <Text style={styles.confirmButtonText}>Place Ladder Play</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
        onRequestClose={handleDone}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIcon}>
              <Check color="#000" size={48} strokeWidth={3} />
            </View>
            <Text style={styles.successTitle}>Wager Placed!</Text>
            <Text style={styles.successMessage}>
              Your Ladder Play is now active. Good luck!
            </Text>
            <TouchableOpacity
              style={styles.doneButton}
              onPress={handleDone}
              activeOpacity={0.8}
            >
              <Text style={styles.doneButtonText}>View My Wagers</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.dark.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.dark.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: Colors.dark.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  summaryCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  playerImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.dark.inputBg,
    marginRight: 12,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    marginBottom: 4,
  },
  playerMeta: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.dark.border,
    marginVertical: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  projectedValue: {
    color: Colors.dark.primary,
  },
  riskValue: {
    color: Colors.dark.warning,
  },
  stakeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  stakeLabel: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
  },
  stakeValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  payoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  payoutLabel: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
  },
  payoutValue: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.dark.success,
  },
  multiplierRow: {
    alignItems: 'flex-end',
  },
  multiplierText: {
    fontSize: 14,
    color: Colors.dark.primary,
    fontWeight: '600' as const,
  },
  ladderPreview: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
  },
  ladderTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.text,
    marginBottom: 12,
  },
  ladderList: {
    gap: 8,
  },
  ladderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ladderStat: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: Colors.dark.text,
    width: 40,
  },
  ladderArrow: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.dark.border,
  },
  ladderPayout: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.dark.primary,
  },
  ladderMore: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
  },
  infoText: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    lineHeight: 18,
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  confirmButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.dark.card,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
  },
  successIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.dark.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: Colors.dark.text,
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  doneButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    width: '100%',
  },
  doneButtonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: '#000',
  },
});
