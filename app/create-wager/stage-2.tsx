import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Animated, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft } from "lucide-react-native";
import * as Haptics from 'expo-haptics';
import Colors from "@/constants/colors";
import { useWagerDraft } from "@/contexts/WagerContext";
import { RiskLevel } from "@/mocks/wagers";

const RISK_LEVELS: RiskLevel[] = ['low', 'medium', 'high'];

export default function Stage2Screen() {
  const router = useRouter();
  const { draft, updateDraft, calculateLadderRungs } = useWagerDraft();
  
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel>(draft.riskLevel);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const computeLadder = async () => {
      const ladderRungs = await calculateLadderRungs(
        draft.breakeven,
        draft.stake,
        selectedRisk,
        draft.direction,
        draft.player,
        draft.statType
      );
      updateDraft({ riskLevel: selectedRisk, ladderRungs });

      Animated.spring(animatedValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 40,
        friction: 7,
      }).start(() => {
        animatedValue.setValue(0);
      });
    };

    computeLadder();
  }, [selectedRisk, draft.breakeven, draft.stake, draft.direction, draft.player, draft.statType, calculateLadderRungs, updateDraft, animatedValue]);

  const handleRiskSelect = (risk: RiskLevel) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    console.log('Selected risk:', risk);
    setSelectedRisk(risk);
  };

  const handleNext = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    console.log('Moving to stage 3 with draft:', draft);
    router.push('/create-wager/stage-3');
  };

  const handleBack = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'low':
        return Colors.dark.success;
      case 'medium':
        return Colors.dark.warning;
      case 'high':
        return Colors.dark.danger;
    }
  };

  const maxPayout = Math.max(...draft.ladderRungs.map(r => r.payout), 0);

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Set Risk Level</Text>
          <Text style={styles.subtitle}>
            Higher risk means higher potential payouts
          </Text>
        </View>

        <View style={styles.riskSelector}>
          {RISK_LEVELS.map((risk) => (
            <TouchableOpacity
              key={risk}
              style={[
                styles.riskButton,
                selectedRisk === risk && styles.riskButtonActive,
                selectedRisk === risk && { borderColor: getRiskColor(risk) }
              ]}
              onPress={() => handleRiskSelect(risk)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.riskIndicator,
                { backgroundColor: getRiskColor(risk) }
              ]} />
              <Text style={[
                styles.riskText,
                selectedRisk === risk && styles.riskTextActive
              ]}>
                {risk.charAt(0).toUpperCase() + risk.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.ladderContainer}>
          <Text style={styles.ladderTitle}>Payout Ladder</Text>
          <Text style={styles.ladderSubtitle}>
            Win amount based on {draft.player?.name}&apos;s performance
          </Text>

          <View style={styles.ladder}>
            {draft.ladderRungs.slice().reverse().map((rung, index) => {
              const actualIndex = draft.ladderRungs.length - 1 - index;
              const isBreakeven = draft.direction === 'over' 
                ? rung.value >= draft.breakeven 
                : rung.value <= draft.breakeven;
              const barWidth = maxPayout > 0 ? (rung.payout / maxPayout) * 100 : 0;

              return (
                <Animated.View
                  key={actualIndex}
                  style={[
                    styles.ladderRung,
                    {
                      opacity: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.3, 1],
                      }),
                      transform: [{
                        translateX: animatedValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-10, 0],
                        }),
                      }],
                    }
                  ]}
                >
                  <View style={styles.rungValue}>
                    <Text style={styles.rungValueText}>{rung.value}</Text>
                  </View>
                  
                  <View style={styles.rungBarContainer}>
                    <View 
                      style={[
                        styles.rungBar,
                        { 
                          width: `${barWidth}%`,
                          backgroundColor: isBreakeven 
                            ? getRiskColor(selectedRisk)
                            : Colors.dark.border,
                        }
                      ]}
                    />
                  </View>
                  
                  <View style={styles.rungPayout}>
                    <Text style={[
                      styles.rungPayoutText,
                      isBreakeven && styles.rungPayoutActive
                    ]}>
                      ${rung.payout}
                    </Text>
                  </View>
                </Animated.View>
              );
            })}
          </View>

          <View style={styles.breakevenIndicator}>
            <View style={[styles.breakevenDot, { backgroundColor: getRiskColor(selectedRisk) }]} />
            <Text style={styles.breakevenText}>
              Breakeven: {draft.breakeven} {draft.direction}
            </Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Stake</Text>
            <Text style={styles.summaryValue}>${draft.stake}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Max Payout</Text>
            <Text style={[styles.summaryValue, styles.maxPayoutValue]}>
              ${maxPayout}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Multiplier</Text>
            <Text style={[styles.summaryValue, styles.multiplierValue]}>
              {(maxPayout / draft.stake).toFixed(2)}x
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <ChevronLeft color={Colors.dark.text} size={20} />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: Colors.dark.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
    lineHeight: 22,
  },
  riskSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  riskButton: {
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
  riskButtonActive: {
    backgroundColor: Colors.dark.inputBg,
    borderWidth: 2,
  },
  riskIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  riskText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.dark.textSecondary,
  },
  riskTextActive: {
    color: Colors.dark.text,
  },
  ladderContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
    marginBottom: 20,
  },
  ladderTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.dark.text,
    marginBottom: 4,
  },
  ladderSubtitle: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginBottom: 20,
  },
  ladder: {
    gap: 8,
  },
  ladderRung: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rungValue: {
    width: 50,
  },
  rungValueText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.dark.text,
    textAlign: 'right',
  },
  rungBarContainer: {
    flex: 1,
    height: 24,
    backgroundColor: Colors.dark.inputBg,
    borderRadius: 6,
    overflow: 'hidden',
  },
  rungBar: {
    height: '100%',
    borderRadius: 6,
  },
  rungPayout: {
    width: 60,
  },
  rungPayoutText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.dark.textSecondary,
  },
  rungPayoutActive: {
    color: Colors.dark.text,
  },
  breakevenIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  breakevenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  breakevenText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.dark.textSecondary,
  },
  summaryCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
  },
  summaryValue: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  maxPayoutValue: {
    color: Colors.dark.success,
  },
  multiplierValue: {
    color: Colors.dark.primary,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
    gap: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: Colors.dark.card,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
    flex: 1,
  },
  backButtonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  nextButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    flex: 2,
  },
  nextButtonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: '#000',
  },
});
