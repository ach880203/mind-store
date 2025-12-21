import { useState } from "react";
import { useNavigate } from "react-router-dom";
import usersdb from "../../data/usersdb";
import { setCurrentUser } from "../../utils/auth";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const user = usersdb.find(
      (u) => u.user_id === userId && u.user_pw === pw
    );

    if (!user) {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
      return;
    }

    // ✅ 로그인 성공 (중요)
    setCurrentUser({
      user_id: user.user_id,
      nick: user.nick,
      admin: user.admin,
    });

    navigate("/"); // 홈으로 이동
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">로그인</h2>

        <input
          className="login-input"
          value={userId}
          onChange={(e) => {
            setUserId(e.target.value);
            setError("");
          }}
          placeholder="아이디"
        />

        <input
          type="password"
          className="login-input"
          value={pw}
          onChange={(e) => {
            setPw(e.target.value);
            setError("");
          }}
          placeholder="비밀번호"
        />

        {error && <p className="login-error">{error}</p>}

        <button className="login-btn" onClick={handleLogin}>
          로그인
        </button>

        <p className="login-hint">
            테스트 계정: <b>hyunwoo / dummy</b><br />
                        <b>junho / dummy / 관리자</b><br />
                        <b>sehoon / dummy</b><br />
                        <b>minho / dummy</b><br />
                        <b>yewon / dummy</b><br />
                        <b>hyunsu2 / dummy</b>
        </p>
      </div>
    </div>
  );
};

export default Login;
