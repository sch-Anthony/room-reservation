import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Home() {
  const navigate = useNavigate();
  const [teamCount, setTeamCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  async function loadCount(showLoading = false) {
  if (showLoading) {
    setLoading(true);
  }

  const { data, error } = await supabase.rpc("get_reservation_count");

  if (!error) {
    setTeamCount(Number(data));
  } else {
    console.error(error);
  }

  if (showLoading) {
    setLoading(false);
  }
}
  

  useEffect(() => {
  loadCount(true);

  const interval = setInterval(() => {
    loadCount();
  }, 1000);

  return () => clearInterval(interval);
}, []);
  

  return (
    <main className="container">
      <h1>ROOM RESERVATION</h1>
      <p className="subtitle">예약 현황</p>

      <section className="count-card">
        <span className="count">
          {loading ? "..." : teamCount}
        </span>
        <span>예약 팀</span>
      </section>

      <button
        className="primary-button"
        onClick={() => navigate("/reserve")}
      >
        예약하기
      </button>

      <footer>
        ROOM RESERVATION
      </footer>
    </main>
  );
}

export default Home;
