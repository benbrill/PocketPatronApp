import { Link, useRouter } from 'expo-router';
import { Image, Text, YStack } from 'tamagui';

type Show = {
    show_id: number;
    title: string;
    description: string;
    season: number;
    image_filename: string;
};

export default function ShowCard({ show }: { show: Show }) {
    const router = useRouter();
    const show_id = show.show_id.toString()
    return (
        // <Pressable onPress={() => router.push(`/shows/${show_id}`)}>
    <Link href={`/shows/${show.show_id}`} asChild>
    <YStack width="33%" padding="$2">
        <Image
        source={{
            uri: `https://vygupxxkyumsyvqotetf.supabase.co/storage/v1/object/public/pocket-patron-covers/covers/${show.image_filename.slice(5,)}`,
        }}
        width={100}
        height={150}
        />
        <Text fontSize="$1">{show.season}</Text>
        <Text fontSize="$6" fontWeight="bold" fontFamily="InstrumentSans_400Regular">
        {show.title}
        </Text>
    </YStack>
    </Link>
        // </Pressable>
    )
}