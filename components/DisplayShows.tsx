import { supabase } from '@/lib/supabase';
import { View } from 'tamagui';


export default function DisplayShows() { 
    async function fetchShows() {
        const { data: shows, error } = await supabase.from("shows").select('*')
        if (error) {
            console.error("Error fetching shows:", error);
            return null;
        }
        console.log("Fetched shows1:", shows);
        return shows;
    }
    const shows = fetchShows();

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            
        </View>
    )
}