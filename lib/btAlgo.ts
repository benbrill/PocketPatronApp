import { supabase } from "./supabase";

type Matchup = {
  winner_id: number;
  loser_id: number;
};

export async function computeAndUpdateBTForUser(user_id: string): Promise<void> {
  // 1. Fetch all matchups by the user
  const { data: matchups, error } = await supabase
    .from("user_show_comparisons")
    .select("winner_id, loser_id")
    .eq("user_id", user_id);

  if (error) throw new Error("Error fetching matchups: " + error.message);
  if (!matchups || matchups.length === 0) return;

  // 2. Initialize BT scores
  const scores: Record<number, number> = {};
  for (const { winner_id, loser_id } of matchups) {
    scores[winner_id] ??= 1;
    scores[loser_id] ??= 1;
  }

  // ✅ Add regularization to avoid wild score swings
  const PRIOR_MATCHES = 5;
  const PRIOR_SCORE = 1;

  // 3. Run iterative updates
  for (let iter = 0; iter < 100; iter++) {
    const updated: Record<number, number> = {};

    for (const idStr in scores) {
      const id = Number(idStr);
      let numerator = PRIOR_MATCHES * PRIOR_SCORE;
      let denominator = PRIOR_MATCHES;

      for (const { winner_id, loser_id } of matchups) {
        const pw = scores[winner_id];
        const pl = scores[loser_id];

        if (id === winner_id) {
          numerator += 1;
          denominator += 1 / (pw + pl);
        } else if (id === loser_id) {
          denominator += 1 / (pw + pl);
        }
      }

      updated[id] = numerator / (denominator || 1e-8);
    }

    Object.assign(scores, updated);
  }

  // 4. Normalize scores (log + safe max)
  const scoreValues = Object.values(scores);
  const mean = scoreValues.reduce((sum, val) => sum + val, 0) / scoreValues.length;
  const variance = scoreValues.reduce((sum, val) => sum + (val - mean) ** 2, 0) / scoreValues.length;
  const stdDev = Math.sqrt(variance);
  const maxScore = Math.max(...scoreValues);
  const safeMaxScore = Math.max(maxScore, 1.5); // ✅ Prevent division by low log values

  // 5. Adaptive scale based on number of shows and variability
  const scale =
    scoreValues.length < 4
      ? 7 // ✅ Reduce exaggerated spread when there are <4 shows
      : maxScore > mean + stdDev
      ? 10
      : 9.5;

  // 6. Prepare updates
  const updates = Object.entries(scores).map(([show_id, bt_score]) => ({
    user_id,
    show_id: Number(show_id),
    score: (Math.log(bt_score + 1) / Math.log(safeMaxScore + 1)) * scale,
  }));

  // 7. Push scores to Supabase
  const { error: updateError } = await supabase
    .from("user_shows")
    .upsert(updates, { onConflict: "user_id,show_id" });

  if (updateError) {
    throw new Error("Error updating scores: " + updateError.message);
  }

  console.log(`✅ BT scores updated for user ${user_id}`);
}
