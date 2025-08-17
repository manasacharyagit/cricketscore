// MatchList.js
import React from "react";
import axios from "axios";

export default function MatchList({ matches, onSelect, refreshMatches }) {

  const deleteMatch = async (matchId) => {

    const confirmDelete = window.confirm(
      `Are you sure you want to delete match ${matchId}?`
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/matches/${matchId}`);
      refreshMatches();
    } catch (err) {
      console.error("Error deleting match:", err);
    }
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
      {matches.map((m) => (
        <div
          key={m.matchId}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "15px",
            width: "260px",
            boxShadow: "2px 2px 6px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h3>{m.teamA} vs {m.teamB}</h3>
            <p>ID: {m.matchId}</p>
            <p>Score: {m.scoreA || 0}/{m.wicketsA || 0} ({m.oversA || 0} overs)</p>

          </div>

          <div style={{ marginTop: "10px" }}>
            <button
              onClick={() => onSelect(m.matchId)}
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "5px",
                cursor: "pointer",
                borderRadius: "5px",
              }}
            >
              View
            </button>

            <button
              onClick={() => deleteMatch(m.matchId)}
              style={{
                width: "100%",
                padding: "8px",
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
