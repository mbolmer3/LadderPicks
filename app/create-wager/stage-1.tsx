import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ChevronRight, TrendingUp, TrendingDown } from "lucide-react-native";
import * as Haptics from 'expo-haptics';
import Colors from "@/constants/colors";
import { useWagerDraft } from "@/contexts/WagerContext";
import { StatType, STAT_LABELS } from "@/mocks/players";

export default function Stage1Screen() {
  const router = useRouter();
  const { draft, updateDraft } = useWagerDraft();
  
  const [showStatPicker, setShowStatPicker] = useState(false);

  const availableStats = draft.player?.availableStats || [];

  const handleStatSelect = (statType: StatType) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    console.log('Selected stat:', statType);
    updateDraft({ statType });
    setShowStatPicker(false);
  };

  const handleDirectionToggle = (direction: 'over' | 'under') => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    console.log('Selected direction:', direction);
    updateDraft({ direction });
  };

  const handleNext = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    console.log('Moving to stage 2 with draft:', draft);
    router.push('/create-wager/stage-2');
  };

  const isValid = Boolean(draft.statType && draft.stake > 0 && draft.breakeven > 0);

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {draft.player && (
          <View style={styles.selectedPlayerHeader}>
            <Image 
              source={{ uri: draft.player.imageUrl }}
              style={styles.playerImageLarge}
            />
            <View style={styles.playerHeaderDetails}>
              <Text style={styles.playerNameLarge}>{draft.player.name}</Text>
              <Text style={styles.playerTeamLarge}>{draft.player.team} · {draft.player.position}</Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Stat Type</Text>
          <TouchableOpacity
            style={styles.card}
            onPress={() => setShowStatPicker(!showStatPicker)}
            activeOpacity={0.7}
          >
            <Text style={draft.statType ? styles.selectedText : styles.placeholderText}>
              {draft.statType ? STAT_LABELS[draft.statType] : 'Select stat type'}
            </Text>
            <ChevronRight color={Colors.dark.textSecondary} size={20} />
          </TouchableOpacity>

          {showStatPicker && (
            <View style={styles.picker}>
              {availableStats.map(stat => (
                <TouchableOpacity
                  key={stat}
                  style={styles.statItem}
                  onPress={() => handleStatSelect(stat)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.statText}>{STAT_LABELS[stat]}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Stake Amount (coins)</Text>
          <View style={styles.inputCard}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={Colors.dark.textSecondary}
              value={draft.stake.toString()}
              onChangeText={(text) => {
                const value = parseInt(text) || 0;
                updateDraft({ stake: value });
              }}
            />
          </View>
          <View style={styles.quickAmounts}>
            {[10, 25, 50, 100].map(amount => (
              <TouchableOpacity
                key={amount}
                style={styles.quickAmountBtn}
                onPress={() => updateDraft({ stake: amount })}
                activeOpacity={0.7}
              >
                <Text style={styles.quickAmountText}>{amount}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Breakeven Point</Text>
          <View style={styles.inputCard}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={Colors.dark.textSecondary}
              value={draft.breakeven.toString()}
              onChangeText={(text) => {
                const value = parseInt(text) || 0;
                updateDraft({ breakeven: value });
              }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Direction</Text>
          <View style={styles.directionToggle}>
            <TouchableOpacity
              style={[
                styles.directionButton,
                draft.direction === 'over' && styles.directionButtonActive
              ]}
              onPress={() => handleDirectionToggle('over')}
              activeOpacity={0.7}
            >
              <TrendingUp 
                color={draft.direction === 'over' ? '#000' : Colors.dark.primary} 
                size={20} 
              />
              <Text style={[
                styles.directionText,
                draft.direction === 'over' && styles.directionTextActive
              ]}>Over</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.directionButton,
                draft.direction === 'under' && styles.directionButtonActive
              ]}
              onPress={() => handleDirectionToggle('under')}
              activeOpacity={0.7}
            >
              <TrendingDown 
                color={draft.direction === 'under' ? '#000' : Colors.dark.danger} 
                size={20} 
              />
              <Text style={[
                styles.directionText,
                draft.direction === 'under' && styles.directionTextActive
              ]}>Under</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, !isValid && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!isValid}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
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
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.dark.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
    minHeight: 64,
  },
  selectedPlayerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
  },
  playerImageLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.dark.inputBg,
    marginRight: 16,
  },
  playerHeaderDetails: {
    flex: 1,
  },
  playerNameLarge: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    marginBottom: 4,
  },
  playerTeamLarge: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
  },
  placeholderText: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
  },
  selectedText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  picker: {
    marginTop: 12,
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
    overflow: 'hidden',
    maxHeight: 300,
  },
  statItem: {
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  statText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  inputCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
    paddingHorizontal: 16,
  },
  input: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: Colors.dark.text,
    paddingVertical: 16,
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  quickAmountBtn: {
    flex: 1,
    backgroundColor: Colors.dark.inputBg,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  directionToggle: {
    flexDirection: 'row',
    gap: 12,
  },
  directionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.dark.cardBorder,
  },
  directionButtonActive: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  directionText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  directionTextActive: {
    color: '#000',
  },
  footer: {
    padding: 20,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  nextButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.4,
  },
  nextButtonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: '#000',
  },
});
