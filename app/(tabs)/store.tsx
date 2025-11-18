import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { Coins } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";

interface StorePackage {
  id: string;
  coins: number;
  price: number;
  popular?: boolean;
}

const STORE_PACKAGES: StorePackage[] = [
  { id: 'small', coins: 100, price: 4.99 },
  { id: 'medium', coins: 500, price: 19.99, popular: true },
  { id: 'large', coins: 1200, price: 39.99 },
  { id: 'xlarge', coins: 2500, price: 74.99 },
];

export default function StoreScreen() {
  const insets = useSafeAreaInsets();

  const handlePurchase = (pkg: StorePackage) => {
    console.log('Purchase package:', pkg);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Store</Text>
        <View style={styles.balanceCard}>
          <Coins color={Colors.dark.warning} size={20} />
          <Text style={styles.balanceText}>2,450 coins</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {STORE_PACKAGES.map((pkg) => (
          <TouchableOpacity
            key={pkg.id}
            style={[styles.packageCard, pkg.popular && styles.popularCard]}
            onPress={() => handlePurchase(pkg)}
            activeOpacity={0.8}
          >
            {pkg.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>MOST POPULAR</Text>
              </View>
            )}
            <View style={styles.packageHeader}>
              <Coins color={Colors.dark.warning} size={32} />
              <Text style={styles.coinAmount}>{pkg.coins.toLocaleString()}</Text>
              <Text style={styles.coinLabel}>coins</Text>
            </View>
            <View style={styles.packageFooter}>
              <Text style={styles.priceText}>${pkg.price.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>
            These are sweepstakes coins for entertainment purposes. No purchase necessary to participate.
          </Text>
        </View>
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
    marginBottom: 16,
  },
  balanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
  },
  balanceText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  packageCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
    position: 'relative',
  },
  popularCard: {
    borderColor: Colors.dark.primary,
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  popularText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: '#000000',
    letterSpacing: 0.5,
  },
  packageHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  coinAmount: {
    fontSize: 36,
    fontWeight: 'bold' as const,
    color: Colors.dark.text,
    marginTop: 12,
  },
  coinLabel: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },
  packageFooter: {
    alignItems: 'center',
  },
  priceText: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: Colors.dark.primary,
  },
  disclaimerBox: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
  },
  disclaimerText: {
    fontSize: 12,
    color: Colors.dark.textTertiary,
    lineHeight: 18,
    textAlign: 'center',
  },
});
