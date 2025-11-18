import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Platform, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ChevronLeft, TrendingUp, TrendingDown } from "lucide-react-native";
import * as Haptics from 'expo-haptics';
import Svg, { Path, Line, Circle } from 'react-native-svg';
import Colors from "@/constants/colors";
import { useWagerDraft } from "@/contexts/WagerContext";
import { STAT_LABELS } from "@/mocks/players";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 80;
const CHART_HEIGHT = 200;

export default function Stage3Screen() {
  const router = useRouter();
  const { draft, updateDraft, calculateProjectedStat } = useWagerDraft();

  useEffect(() => {
    const computeProjection = async () => {
      if (draft.player && draft.statType && draft.projectedStat === 0) {
        const projected = await calculateProjectedStat(draft.player, draft.statType);
        updateDraft({ projectedStat: projected });
        console.log('Calculated projected stat:', projected);
      }
    };

    computeProjection();
  }, [draft.player, draft.statType, draft.projectedStat, calculateProjectedStat, updateDraft]);

  const handleNext = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    console.log('Moving to stage 4 with draft:', draft);
    router.push('/create-wager/stage-4');
  };

  const handleBack = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const maxPayout = Math.max(...draft.ladderRungs.map(r => r.payout), 0);

  const generateCurvePath = (): string => {
    if (draft.ladderRungs.length === 0) return '';

    const minValue = Math.min(...draft.ladderRungs.map(r => r.value));
    const maxValue = Math.max(...draft.ladderRungs.map(r => r.value));
    const valueRange = maxValue - minValue || 1;

    const points = draft.ladderRungs.map((rung) => {
      const x = ((rung.value - minValue) / valueRange) * CHART_WIDTH;
      const y = CHART_HEIGHT - (rung.payout / maxPayout) * CHART_HEIGHT;
      return { x, y };
    });

    if (points.length === 0) return '';

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }

    return path;
  };

  const getBreakevenX = (): number => {
    if (draft.ladderRungs.length === 0) return 0;
    const minValue = Math.min(...draft.ladderRungs.map(r => r.value));
    const maxValue = Math.max(...draft.ladderRungs.map(r => r.value));
    const valueRange = maxValue - minValue || 1;
    return ((draft.breakeven - minValue) / valueRange) * CHART_WIDTH;
  };

  const breakevenX = getBreakevenX();

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Review Your Play</Text>
          <Text style={styles.subtitle}>
            Check the details before confirming
          </Text>
        </View>

        <View style={styles.playerCard}>
          <Image 
            source={{ uri: draft.player?.imageUrl }}
            style={styles.playerImage}
          />
          <View style={styles.playerInfo}>
            <Text style={styles.playerName}>{draft.player?.name}</Text>
            <Text style={styles.playerMeta}>
              {draft.player?.team} · {STAT_LABELS[draft.statType || 'points']}
            </Text>
          </View>
          <View style={styles.projectionBadge}>
            <Text style={styles.projectionLabel}>Projection</Text>
            <Text style={styles.projectionValue}>{draft.projectedStat}</Text>
          </View>
        </View>

        <View style={styles.detailsGrid}>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Stake</Text>
            <Text style={styles.detailValue}>${draft.stake}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Breakeven</Text>
            <View style={styles.breakevenValue}>
              {draft.direction === 'over' ? (
                <TrendingUp color={Colors.dark.primary} size={18} />
              ) : (
                <TrendingDown color={Colors.dark.danger} size={18} />
              )}
              <Text style={styles.detailValue}>{draft.breakeven}</Text>
            </View>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Risk</Text>
            <Text style={[styles.detailValue, styles.riskValue]}>
              {draft.riskLevel.toUpperCase()}
            </Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Max Win</Text>
            <Text style={[styles.detailValue, styles.maxWinValue]}>
              ${maxPayout}
            </Text>
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Payout Curve</Text>
          <Text style={styles.chartSubtitle}>
            Expected payout based on performance
          </Text>

          <View style={styles.chartContainer}>
            <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
              <Line
                x1={breakevenX}
                y1={0}
                x2={breakevenX}
                y2={CHART_HEIGHT}
                stroke={Colors.dark.primary}
                strokeWidth="2"
                strokeDasharray="4,4"
              />

              <Path
                d={generateCurvePath()}
                stroke={Colors.dark.primary}
                strokeWidth="3"
                fill="none"
              />

              {draft.ladderRungs.map((rung, index) => {
                const minValue = Math.min(...draft.ladderRungs.map(r => r.value));
                const maxValue = Math.max(...draft.ladderRungs.map(r => r.value));
                const valueRange = maxValue - minValue || 1;
                const x = ((rung.value - minValue) / valueRange) * CHART_WIDTH;
                const y = CHART_HEIGHT - (rung.payout / maxPayout) * CHART_HEIGHT;

                if (Math.abs(rung.value - draft.breakeven) < 5) {
                  return (
                    <Circle
                      key={index}
                      cx={x}
                      cy={y}
                      r="5"
                      fill={Colors.dark.primary}
                    />
                  );
                }
                return null;
              })}
            </Svg>

            <View style={styles.chartLabels}>
              <Text style={styles.chartLabel}>Performance</Text>
              <Text style={styles.chartLabel}>Payout</Text>
            </View>

            <View style={styles.breakevenLabel}>
              <View style={[styles.breakevenDot, { left: breakevenX - 4 }]} />
              <Text style={[styles.breakevenText, { left: breakevenX - 30 }]}>
                Breakeven
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Key Points</Text>
          <View style={styles.summaryItem}>
            <View style={styles.summaryDot} />
            <Text style={styles.summaryText}>
              Projected stat: {draft.projectedStat} (from model)
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <View style={styles.summaryDot} />
            <Text style={styles.summaryText}>
              You profit if {draft.player?.name} goes {draft.direction} {draft.breakeven}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <View style={styles.summaryDot} />
            <Text style={styles.summaryText}>
              Max payout: {(maxPayout / draft.stake).toFixed(2)}x your stake
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
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
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
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.dark.text,
    marginBottom: 4,
  },
  playerMeta: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  projectionBadge: {
    backgroundColor: Colors.dark.inputBg,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  projectionLabel: {
    fontSize: 11,
    color: Colors.dark.textSecondary,
    marginBottom: 2,
    textTransform: 'uppercase' as const,
  },
  projectionValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.dark.primary,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  detailCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
  },
  detailLabel: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  breakevenValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  riskValue: {
    color: Colors.dark.warning,
  },
  maxWinValue: {
    color: Colors.dark.success,
  },
  chartCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.dark.text,
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginBottom: 24,
  },
  chartContainer: {
    position: 'relative',
    paddingTop: 10,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  chartLabel: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
  breakevenLabel: {
    position: 'absolute',
    top: -20,
  },
  breakevenDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.dark.primary,
    top: 12,
  },
  breakevenText: {
    position: 'absolute',
    fontSize: 11,
    color: Colors.dark.primary,
    fontWeight: '600' as const,
  },
  summaryCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.text,
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  summaryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.dark.primary,
    marginTop: 6,
  },
  summaryText: {
    flex: 1,
    fontSize: 14,
    color: Colors.dark.textSecondary,
    lineHeight: 20,
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
