import { useState } from "react";
import { createMatch } from "../api";

export default function CreateMatch({ onCreated }) {
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!teamA || !teamB) return;
    const newMatch = await createMatch(teamA, teamB);
    onCreated(newMatch);
    setTeamA("");
    setTeamB("");
  }

  return (
    <div className="box">
      <h2>Create Match</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Team A"
          value={teamA}
          onChange={e => setTeamA(e.target.value)}
        />
        <input
          type="text"
          placeholder="Team B"
          value={teamB}
          onChange={e => setTeamB(e.target.value)}
        />
        <button type="submit">Start Match</button>
      </form>
    </div>
  );
}
