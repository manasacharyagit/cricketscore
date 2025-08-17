import Counter from "../models/counter.js";

export async function getNextMatchId() {
  const counter = await Counter.findOneAndUpdate(
    { name: "matchId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return counter.seq; 
}
