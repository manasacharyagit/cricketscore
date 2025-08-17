import express from "express";
import Match from "../models/match.js";
import Counter from "../models/counter.js";

const router = express.Router();


async function getNextMatchId() {
  const counter = await Counter.findOneAndUpdate(
    { name: "matchId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return counter.seq;
}


router.post("/start", async (req, res) => {
  try {
    const { teamA, teamB } = req.body;

    const matchId = await getNextMatchId();

    const match = new Match({
      matchId, 
      teamA,
      teamB,
      scoreA: 0,
      scoreB: 0,
      wicketsA: 0,
      wicketsB: 0,
      oversA: 0,
      oversB: 0,
      commentary: []
    });

    await match.save();
    res.status(201).json(match);
  } catch (err) {
    console.error("Error starting match:", err);
    res.status(500).json({ error: "Failed to start match" });
  }
});


const isLegal = (type) => type !== "wide" && type !== "no-ball";

function getLastLegalOverBall(comments) {

  for (let i = comments.length - 1; i >= 0; i--) {
    const c = comments[i];
    if (isLegal(c.eventType)) return { over: c.over, ball: c.ball };
  }
  return { over: 0, ball: 0 };
}

function nextOverBallFor(eventType, lastLegal) {
  if (!isLegal(eventType)) {
 
    return { over: lastLegal.over, ball: lastLegal.ball };
  }
  let over = lastLegal.over;
  let ball = lastLegal.ball + 1;
  if (ball > 6) {
    over += 1;
    ball = 1;
  }
  return { over, ball };
}

function computeOversFromCommentary(comments) {

  const legal = comments.filter(c => isLegal(c.eventType)).length;
  if (legal === 0) return 0;
  const over = Math.floor((legal - 1) / 6);
  const ball = ((legal - 1) % 6) + 1; 
  return over + ball / 10;
}


router.post("/:matchId/commentary", async (req, res) => {
  try {
    let { eventType, runs = 0, commentary } = req.body;

    const match = await Match.findOne({ matchId: req.params.matchId });
    if (!match) return res.status(404).json({ error: "Match not found" });

    const lastLegal = getLastLegalOverBall(match.commentary);
    const { over, ball } = nextOverBallFor(eventType, lastLegal);

    switch (eventType) {
      case "run":
        match.scoreA += runs;
        break;
      case "four":
        runs = 4;
        match.scoreA += 4;
        eventType = "run";
        break;
      case "six":
        runs = 6;
        match.scoreA += 6;
        eventType = "run";
        break;
      case "wicket":
        match.wicketsA += 1;
        break;
      case "wide":
      case "no-ball":
        match.scoreA += 1; 
        break;
      default:
        break;
    }

    match.commentary.push({ over, ball, eventType, runs, commentary });

    match.oversA = computeOversFromCommentary(match.commentary);

    await match.save();
    res.json(match);
  } catch (err) {
    console.error("Error adding commentary:", err);
    res.status(500).json({ error: "Failed to add commentary" });
  }
});




router.get("/:matchId", async (req, res) => {
  try {
    const match = await Match.findOne({ matchId: req.params.matchId });
    if (!match) return res.status(404).json({ error: "Match not found" });

    res.json(match);
  } catch (err) {
    console.error("Error fetching match:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/", async (_req, res) => {
  try {
    const matches = await Match.find().sort({ createdAt: -1 });
    res.json(matches);
  } catch (err) {
    console.error("Error listing matches:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.delete("/:matchId/commentary/last", async (req, res) => {
  try {
    const match = await Match.findOne({ matchId: req.params.matchId });
    if (!match) return res.status(404).json({ error: "Match not found" });

    // remove only the last commentary
    match.commentary.pop(); 

    await match.save();
    res.json(match);
  } catch (err) {
    console.error("Error deleting last commentary:", err);
    res.status(500).json({ error: "Failed to delete last commentary" });
  }
});

router.delete("/:matchId", async (req, res) => {
  try {
    const match = await Match.findOneAndDelete({ matchId: req.params.matchId });
    if (!match) {
      return res.status(404).json({ error: "Match not found" });
    }
    res.json({ message: "Match deleted successfully", match });
  } catch (err) {
    console.error("Error deleting match:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



router.get("/current/latest", async (req, res) => {
  try {
    const latestMatch = await Match.findOne().sort({ createdAt: -1 });
    if (!latestMatch) return res.status(404).json({ error: "No match found" });

    res.json({ currentMatchId: latestMatch.matchId });
  } catch (err) {
    console.error("Error fetching current match:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
