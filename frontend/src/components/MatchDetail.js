import { useState, useEffect } from "react";
import { getMatch, addCommentary } from "../api";
import axios from "axios";

export default function MatchDetail({ matchId }) {
  const [match, setMatch] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    getMatch(matchId).then(setMatch);
  }, [matchId]);

  async function handleEvent(eventType, runs = 0) {
    const updated = await addCommentary(matchId, { eventType, runs, commentary: comment });
    setMatch(updated);
    setComment("");
  }

  const deleteLastCommentary = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/matches/${matchId}/commentary/last`
      );

      setMatch({
        ...res.data,
        commentary: res.data.commentary || [], 
      });
    } catch (err) {
      console.error("Error deleting last commentary:", err);
    }
  };

  if (!match) return <p>Loading...</p>;

  return (
    <div className="box">
      <h2>{match.teamA} vs {match.teamB}</h2>
      <p>Score: {match.scoreA}/{match.wicketsA} in {match.oversA} overs</p>

      <textarea
        placeholder="Add commentary..."
        value={comment}
        onChange={e => setComment(e.target.value)}
      />

      <div className="buttons">
        <button onClick={() => handleEvent("run", 1)}>1 Run</button>
        <button onClick={() => handleEvent("run", 2)}>2 Runs</button>
        <button onClick={() => handleEvent("run", 4)}>Four</button>
        <button onClick={() => handleEvent("run", 6)}>Six</button>
        <button onClick={() => handleEvent("wide")}>Wide</button>
        <button onClick={() => handleEvent("no-ball")}>No Ball</button>
        <button onClick={() => handleEvent("wicket")}>Wicket</button>
      </div>

      <h3>Commentary</h3>
      <ul>
        {(match.commentary || []).map((c, i) => (
          <li key={i}>
            Over {c.over}.{c.ball} - {c.commentary || c.eventType} ({c.runs || 0} runs)
          </li>
        ))}
      </ul>

   
      <button onClick={deleteLastCommentary}>Delete Last Commentary</button>
    </div>
  );
}
