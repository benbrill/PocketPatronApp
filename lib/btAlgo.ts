import { supabase } from "./supabase";

type Matchup = {
  winner_id: number;
  loser_id: number;
};

export async function computeAndUpdateBTForUser(user_id: string) {
  // 1. Get matchups for this user
  const { data: matchups, error } = await supabase
    .from('user_show_comparisons')
    .select('winner_id, loser_id')
    .eq('user_id', user_id);

  if (error) throw new Error('Error fetching matchups: ' + error.message);
  if (!matchups || matchups.length === 0) return;

  // 2. Compute BT scores
  const scores: Record<number, number> = {};
  for (const { winner_id, loser_id } of matchups) {
    scores[winner_id] ??= 1;
    scores[loser_id] ??= 1;
  }

  for (let iter = 0; iter < 100; iter++) {
    const updated: Record<number, number> = {};

    for (const id in scores) {
      let numerator = 0;
      let denominator = 0;

      for (const { winner_id, loser_id } of matchups) {
        const i = Number(id);

        if (i === winner_id) {
          const pw = scores[winner_id];
          const pl = scores[loser_id];
          numerator += 1;
          denominator += 1 / (pw + pl);
        } else if (i === loser_id) {
          const pw = scores[winner_id];
          const pl = scores[loser_id];
          denominator += 1 / (pw + pl);
        }
      }

      updated[id] = numerator / (denominator || 1e-8);
    }

    Object.assign(scores, updated);
  }

  // 3. Upsert scores to user_show_scores
  const updates = Object.entries(scores).map(([show_id, bt_score]) => ({
    user_id: user_id,
    show_id: Number(show_id),
    score: bt_score,
  }));

  const { error: updateError } = await supabase
    .from('user_shows')
    .upsert(updates, { onConflict: 'user_id,show_id' });

  if (updateError) throw new Error('Error updating scores: ' + updateError.message);

  console.log(`✅ BT scores updated for user ${user_id}`);
}