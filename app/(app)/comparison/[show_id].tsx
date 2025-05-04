import { computeAndUpdateBTForUser } from "@/lib/btAlgo";
import { supabase } from "@/lib/supabase";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from "react";
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
  }

type ComparisonKey = `${number}-${number}`;

interface ComparisonProps {
    show_id: number;
}


export default function ShowComparison() {
    const [userShows, setUserShows] = useState<Show[]>([]);
    const [loading, setLoading] = useState(true);
    const { show_id } = useLocalSearchParams();

    const [currentPair, setCurrentPair] = useState<[Show, Show] | null>(null);
    const [comparisonHistory, setComparisonHistory] = useState<Set<ComparisonKey>>(new Set());
    const [matchups, setMatchups] = useState<{ winner_id: number; loser_id: number }[]>([])

    const router = useRouter()

    const selectRandomPair = (data: Show[]) => {
        if (data.length < 2) return;

        let show1 = data.find((show) => show.show_id === Number(show_id));
        if (!show1) {
            console.warn(`Show with id ${show_id} not found.`);
            return;
        }
        const remainingShows = data.filter((show) => show.show_id !== Number(show_id));
        let show2 = remainingShows[Math.floor(Math.random() * remainingShows.length)];
        // Shuffle the array and find a unique pair

        for (const potentialShow of remainingShows) {
            const key: ComparisonKey = `${Math.min(show1!.show_id, potentialShow.show_id)}-${Math.max(show1!.show_id, potentialShow.show_id)}`;
            if (!comparisonHistory.has(key)) {
                show2 = potentialShow;
                setComparisonHistory((prev) => new Set(prev).add(key));
                break;
            }
        }
        if (show2) {
            setCurrentPair([show1, show2]);
        } else {
            console.warn('No unique comparisons left.');
            setCurrentPair(null);
        }
        setLoading(false);
    };

    async function fetchUserShows() {
        const user = await supabase.auth.getUser();
        console.log(user)
        if (!user.data.user) {
            console.error('User not found');
            return;
        }
        
        const { data: shows, error: showError } = await supabase.from("user_show_w_rankings").select('*').eq('user_id', user.data.user?.id);
        if (showError) {
            console.error('Error fetching shows:', showError);
        } else {
            setUserShows(shows || []);
        }
        
    }

    const handleShowClick = (show_id: number) => {
        if (!currentPair) return;
    
        const [show1, show2] = currentPair;
        const winnerId = show_id;
        const loserId = show1.show_id === show_id ? show2.show_id : show1.show_id;
    
        // Save locally
        setMatchups((prev) => [...prev, { winner_id: winnerId, loser_id: loserId }]);
        // Select next pair
        console.log(matchups);
        selectRandomPair(userShows);
    };

    // load shows
    if (loading) {
        fetchUserShows();
        selectRandomPair(userShows);
    }

    const handleSubmit = async () => {
        if (matchups.length === 0) return;
        const user = await supabase.auth.getUser();
        const userId = user.data.user?.id; 
        const matchupsWithUserId = matchups.map((matchup) => ({
            ...matchup,
            user_id: userId,
        }));
        const { error } = await supabase.from("user_show_comparisons").insert(matchupsWithUserId);
        if (error) {
            console.error('Error saving matchups:', error);
        } else {
            console.log('Matchups saved successfully!');
        }
        // recalculated BT algoithm
        computeAndUpdateBTForUser(userId!)
            .then(() => {
                console.log('BT scores updated successfully!');
                router.push('/home')
            })
            .catch((error) => {
                console.error('Error updating BT scores:', error);
            });
    };



    return (
        <YStack flex={1} alignItems="center" justifyContent="center">
            {console.log("here", currentPair)}
            {currentPair && (
               <ShowCard show={currentPair[0]} onPress={handleShowClick} />
            )}
            <XStack width={"100%"} height={50} alignItems="center" justifyContent="center" gap="$1" padding="$4">
                <Separator borderColor="white" borderWidth={1}/>
                <Text fontFamily="InstrumentSerif_400Regular" fontSize={30} padding={10}>vs</Text>
                <Separator borderColor="white" borderWidth={1}/>
            </XStack>
            {currentPair && (
                <ShowCard show={currentPair[1]} onPress={handleShowClick} />
            )}
            <Button onPress={handleSubmit}>Submit Rankings</Button>
        </YStack>
    )
}

interface ShowCardProps {
    show: Show;
    onPress: (show_id: number) => void;
}

const ShowCard: React.FC<ShowCardProps> = ({ show, onPress }) => {
    return (
        <Pressable onPress={() => onPress(show.show_id)}>
            <YStack gap={"$2"} margin={"$2"} padding={"$2"} alignItems="center" justifyContent="center">
                <Image
                        // source={{
                            // uri: `https://vygupxxkyumsyvqotetf.supabase.co/storage/v1/object/public/pocket-patron-covers/covers/${show?.image_filename.slice(5,)}`,
                            
                        // }}
                        source={require('@/assets/images/2025_Death_Becomes_Her.png')}
                        width={150}
                        height={225}
                    />
                <Text fontFamily="InstrumentSans_400Regular" fontSize={10}>{show.season}</Text>
                <Text fontFamily="InstrumentSerif_400Regular" fontSize={30}>{show.title}</Text>
            </YStack>
        </Pressable>
    );
};