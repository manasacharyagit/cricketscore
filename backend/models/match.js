import mongoose from "mongoose";

const commentarySchema = new mongoose.Schema({
  over:     { type: Number, required: true },
  ball:     { type: Number, required: true },
  eventType:{ type: String, required: true }, 
  runs:     { type: Number, default: 0 },
  commentary: { type: String },
  ts:       { type: Date, default: Date.now }
});

const matchSchema = new mongoose.Schema({
  matchId:   { type: Number, unique: true, required: true }, 
  teamA:     { type: String, required: true },
  teamB:     { type: String, required: true },
  scoreA:    { type: Number, default: 0 },
  wicketsA:  { type: Number, default: 0 },
  oversA:    { type: Number, default: 0 },  
  commentary:[commentarySchema],
  createdAt: { type: Date, default: Date.now }
});

const Match = mongoose.model("Match", matchSchema);
export default Match;
