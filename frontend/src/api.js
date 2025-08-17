import axios from "axios";


const API_URL = "http://localhost:5000/api/matches";

export async function createMatch(teamA, teamB) {
  const res = await fetch(`${API_URL}/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ teamA, teamB })
  });
  return res.json();
}

export async function getMatches() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function getMatch(matchId) {
  const res = await fetch(`${API_URL}/${matchId}`);
  return res.json();
}

export async function addCommentary(matchId, payload) {
  const res = await fetch(`${API_URL}/${matchId}/commentary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
}
export async function deleteLastCommentary(matchId) {
  const res = await axios.delete(`http://localhost:5000/api/matches/${matchId}/commentary/last`);
  return res.data;
}