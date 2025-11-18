import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, TextInput, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Search, ChevronRight } from "lucide-react-native";
import * as Haptics from 'expo-haptics';
import { useState } from "react";
import Colors from "@/constants/colors";
import { PLAYERS, Player } from "@/mocks/players";
import { useWagerDraft } from "@/contexts/WagerContext";

export default function CreateWagerScreen() {
  const router = useRouter();
  const { updateDraft } = useWagerDraft();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPlayers = PLAYERS.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const nflPlayers = filteredPlayers.filter(p => p.sport === 'NFL');
  const nbaPlayers = filteredPlayers.filter(p => p.sport === 'NBA');

  const handlePlayerSelect = (player: Player) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    console.log('Selected player:', player);
    updateDraft({ player, statType: null });
    router.push('/create-wager/stage-1');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Athlete</Text>
        <Text style={styles.subtitle}>
          Choose a player to create a Ladder Play
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Search color={Colors.dark.textSecondary} size={20} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search athletes..."
          placeholderTextColor={Colors.dark.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {nflPlayers.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>NFL</Text>
            {nflPlayers.map(player => (
              <TouchableOpacity
                key={player.id}
                style={styles.playerCard}
                onPress={() => handlePlayerSelect(player)}
                activeOpacity={0.7}
              >
                <Image 
                  source={{ uri: player.imageUrl }}
                  style={styles.playerImage}
                />
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <Text style={styles.playerDetails}>{player.team} · {player.position}</Text>
                </View>
                <ChevronRight color={Colors.dark.textSecondary} size={20} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {nbaPlayers.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>NBA</Text>
            {nbaPlayers.map(player => (
              <TouchableOpacity
                key={player.id}
                style={styles.playerCard}
                onPress={() => handlePlayerSelect(player)}
                activeOpacity={0.7}
              >
                <Image 
                  source={{ uri: player.imageUrl }}
                  style={styles.playerImage}
                />
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <Text style={styles.playerDetails}>{player.team} · {player.position}</Text>
                </View>
                <ChevronRight color={Colors.dark.textSecondary} size={20} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {filteredPlayers.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No athletes found</Text>
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
    padding: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold' as const,
    color: Colors.dark.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    lineHeight: 22,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.dark.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.dark.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    marginBottom: 12,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
  },
  playerImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.dark.inputBg,
    marginRight: 14,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: Colors.dark.text,
    marginBottom: 3,
  },
  playerDetails: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
  },
});
