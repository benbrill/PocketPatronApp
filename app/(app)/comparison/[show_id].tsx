import { Screen } from "@/components/Screen";
import { computeAndUpdateBTForUser } from "@/lib/btAlgo";
import { supabase } from "@/lib/supabase";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import { Pressable } from "react-native";
import { Button, Image, Separator, Text, XStack, YStack } from "tamagui";

type Show = {
  show_id: number;
  image_url: string;
  image_filename: string;
  elo_score: number;
  title: string;
  season: number;
  created_at: EpochTimeStamp;
  url: string;
};

type ComparisonKey = `${number}-${number}`;

export default function ShowComparison() {
  const [userShows, setUserShows] = useState<Show[]>([]);
  const [currentPair, setCurrentPair] = useState<[Show, Show] | null>(null);
  const [comparisonHistory, setComparisonHistory] = useState<Set<ComparisonKey>>(new Set());
  const [matchups, setMatchups] = useState<{ winner_id: number; loser_id: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const { show_id } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user?.id) return;

      const { data: shows, error } = await supabase
        .from("user_show_w_rankings")
        .select('*')
        .eq('user_id', user.user.id);

      if (error || !shows) {
        console.error("Error fetching shows:", error);
        return;
      }

      if (shows.length < 2) {
        router.replace("/profile?reason=not-enough-shows");
        return;
      }

      setUserShows(shows);
      selectRandomPair(shows);
      setLoading(false);
    };

    load();
  }, []);

  console.log("userShows", userShows);

  const selectRandomPair = (data: Show[]) => {
    const mainShow = data.find((s) => s.show_id === Number(show_id));
    if (!mainShow) return;

    const others = data.filter((s) => s.show_id !== Number(show_id));
    for (let i = others.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [others[i], others[j]] = [others[j], others[i]];
    }

    for (const candidate of others) {
      const key: ComparisonKey = `${Math.min(mainShow.show_id, candidate.show_id)}-${Math.max(mainShow.show_id, candidate.show_id)}`;
      if (!comparisonHistory.has(key)) {
        setComparisonHistory((prev) => new Set(prev).add(key));
        setCurrentPair([mainShow, candidate]);
        return;
      }
    }

    console.warn('No unique comparisons left.');
    setCurrentPair(null);
  };

  const handleShowClick = (selectedId: number) => {
    if (!currentPair) return;

    const [a, b] = currentPair;
    const winner_id = selectedId;
    const loser_id = a.show_id === selectedId ? b.show_id : a.show_id;

    setMatchups((prev) => [...prev, { winner_id, loser_id }]);
    selectRandomPair(userShows);
  };

  const handleSubmit = async () => {
    if (matchups.length === 0) return;

    const { data: user } = await supabase.auth.getUser();
    if (!user?.user?.id) return;

    const withUserId = matchups.map(m => ({ ...m, user_id: user.user.id }));
    const { error } = await supabase.from("user_show_comparisons").insert(withUserId);

    if (error) {
      console.error("Failed to save matchups:", error);
    } else {
      await computeAndUpdateBTForUser(user.user.id);
      router.push("/profile?reason=success");
    }
  };

  if (loading) return null;

  return (
    <Screen>
    <YStack flex={1} alignItems="center" justifyContent="center">
      {currentPair && (
        <>
          <ShowCard show={currentPair[0]} onPress={handleShowClick} />

          <XStack width={"100%"} height={50} alignItems="center" justifyContent="center" gap="$1" padding="$4">
            <Separator borderColor="white" borderWidth={1} />
            <Text fontFamily="InstrumentSerif_400Regular" fontSize={30} padding={10}>vs</Text>
            <Separator borderColor="white" borderWidth={1} />
          </XStack>

          <ShowCard show={currentPair[1]} onPress={handleShowClick} />
        </>
      )}

      <Button onPress={handleSubmit}>Submit Rankings</Button>
    </YStack>
    </Screen>
  );
}

interface ShowCardProps {
  show: Show;
  onPress: (show_id: number) => void;
}

const ShowCard: React.FC<ShowCardProps> = ({ show, onPress }) => {
  return (
    <Pressable onPress={() => onPress(show.show_id)}>
      <YStack gap="$2" margin="$2" padding="$2" alignItems="center" justifyContent="center">
        <Image
          source={{
            uri: `https://vygupxxkyumsyvqotetf.supabase.co/storage/v1/object/public/pocket-patron-covers/covers/${show.image_filename.slice(5)}`
          }}
          width={150}
          height={225}
        />
        <Text fontFamily="InstrumentSans_400Regular" fontSize={10}>{show.season}</Text>
        <Text fontFamily="InstrumentSerif_400Regular" fontSize={30}>{show.title}</Text>
      </YStack>
    </Pressable>
  );
};
