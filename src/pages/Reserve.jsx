import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Reserve() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    student_id: "",
    phone: "",
    people_count: "1"
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!/^\d{4}$/.test(form.student_id)) {
      alert("! 4자리 학번을 입력 !");
      return;
    }

    if (!/^[0-9-]{9,20}$/.test(form.phone)) {
      alert("! 전화번호를 입력 !");
      return;
    }

    if (!form.name.trim()) {
      alert("! 이름을 입력 !");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("reservations")
      .insert([{
        name: form.name.trim(),
        student_id: form.student_id,
        phone: form.phone,
        people_count: Number(form.people_count)
      }]);

    setLoading(false);

    if (error) {
      console.error(error);
      alert("예약 등록 실패 (っ °Д °;)っ");
      return;
    }

    alert("예약 완료 (〜￣▽￣)〜");
    navigate("/");
  }

  return (
    <main className="container">
      <h1>RESERVATION</h1>
      <p className="subtitle">예약 정보 입력</p>

      <form onSubmit={handleSubmit}>
        <label>이름</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          maxLength={30}
          placeholder="이름 입력"
          required
        />

        <label>학번 (4자리)</label>
        <input
          name="student_id"
          value={form.student_id}
          onChange={handleChange}
          maxLength={4}
          inputMode="numeric"
          placeholder="예: 1234"
          required
        />

        <label>전화번호(- 생략)</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          inputMode="tel"
          placeholder="01012341234"
          required
        />

        <label>예약 인원</label>
        <select
          name="people_count"
          value={form.people_count}
          onChange={handleChange}
        >
          <option value="1">1인</option>
          <option value="2">2인</option>
          <option value="3">3인</option>
          <option value="4">4인</option>
        </select>

        <button
          className="primary-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "등록 중..." : "예약 등록"}
        </button>
      </form>

      <button
        className="back-button"
        onClick={() => navigate("/")}
      >
        돌아가기
      </button>
    </main>
  );
}

export default Reserve;
