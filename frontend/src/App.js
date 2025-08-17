import { useState, useEffect } from "react";
import { getMatches } from "./api";
import CreateMatch from "./components/CreateMatch";
import MatchList from "./components/MatchList";
import MatchDetail from "./components/MatchDetail";
import axios from "axios";
import "./App.css";

function App() {
  const [matches, setMatches] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getMatches().then(setMatches);
  }, []);

  function handleCreated(match) {
    setMatches([match, ...matches]);
  }

  const fetchMatches = async () => {
  const res = await axios.get("http://localhost:5000/api/matches");
  setMatches(res.data);
};

useEffect(() => {
  fetchMatches();
}, []);

  return (
    <div className="container">
      <h1>Cricket Scoreboard</h1>
      {!selected && (
        <>
          <CreateMatch onCreated={handleCreated} />
          <MatchList matches={matches} onSelect={setSelected}   refreshMatches={fetchMatches}
 />
        </>
      )}
      {selected && <MatchDetail matchId={selected} />}
      {selected && <button onClick={() => setSelected(null)}>Back</button>}
    </div>
  );
}

export default App;
