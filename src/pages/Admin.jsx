
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Admin() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadReservations() {
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert("예약 정보를 불러오지 못했습니다.");
      console.error(error);
      return;
    }

    setReservations(data);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      loadReservations();
    }
  }, [session]);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setLoading(false);

    if (error) {
      alert("로그인에 실패했습니다.");
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setReservations([]);
  }

  async function handleDelete(id) {
    if (!window.confirm("이 예약을 삭제하시겠습니까?")) {
      return;
    }

    const { error } = await supabase
      .from("reservations")
      .delete()
      .eq("id", id);

    if (error) {
      alert("삭제에 실패했습니다.");
      return;
    }

    loadReservations();
  }

  if (!session) {
    return (
      <main className="container">
        <h1>ADMIN</h1>
        <p className="subtitle">관리자 로그인</p>

        <form onSubmit={handleLogin}>
          <label>이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="primary-button" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="container admin-container">
      <h1>ADMIN</h1>
      <p className="subtitle">예약 관리</p>

      <div className="admin-summary">
        전체 예약 <strong>{reservations.length}팀</strong>
      </div>

      <button className="back-button" onClick={loadReservations}>
        새로고침
      </button>

      {reservations.map((item) => (
        <section className="reservation-card" key={item.id}>
          <div>
            <strong>{item.name}</strong>
            <span>{item.student_id}</span>
          </div>

          <span
            onClick={async () => {
              await navigator.clipboard.writeText(item.phone);
              alert("전화번호가 복사되었습니다.");
            }}
            title="클릭하여 전화번호 복사"
            style={{ cursor: "pointer", userSelect: "none" }}
          >
            {item.phone} <span title="복사">⧉</span>
          </span>
          <p>예약 인원: {item.people_count}명</p>
          <p>
            예약 시간: {new Date(item.created_at).toLocaleString("ko-KR")}
          </p>

          <button
            className="delete-button"
            onClick={() => handleDelete(item.id)}
          >
            예약 삭제
          </button>
        </section>
      ))}

      <button className="back-button" onClick={handleLogout}>
        로그아웃
      </button>
    </main>
  );
}

export default Admin;
