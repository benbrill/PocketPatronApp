import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { Text, View } from 'tamagui';
import ShowCard from './ShowCard';


type Show = {
    show_id: number;
    season: number;
    title: string;
    description: string;
    image_filename: string;
    on_broadway: boolean;
}

export default function BroadwayShows() {
    const [shows, setShows] = useState<Show[]>([]);

    useEffect(() => {
        const fetchShows = async () => {
            const { data, error } = await supabase
                .from('shows')
                .select('*')
                .eq('on_broadway', true)

            setShows(data || []);
        }
        fetchShows();
    }, []);

    return (
        <View flex={1}>
            <View
                borderWidth={2}
                borderStyle="dashed"
                borderColor={'grey'}
                borderRadius={10}
                flex={1}
                alignItems='center'
                justifyContent='center'
                padding={15}
                margin={10}
           >
                <Text fontFamily='InstrumentSans_700Bold' fontSize={24} textAlign='center'>
                    Currently showing on Broadway
                </Text>
            </View>
             <FlatList
                    data={shows}
                    keyExtractor={(item) => item.show_id.toString()}
                    numColumns={3}
                    columnWrapperStyle={{ justifyContent: 'center', marginBottom: 16,  }}
                    renderItem={({ item }) => <ShowCard show={item} />}
                    onEndReachedThreshold={0.6}
                  />
        </View>
    )
}
