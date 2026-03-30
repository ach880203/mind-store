import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setCurrentUser } from "../../utils/auth";
import { findUserByCredentials, initUsers } from "../../utils/userStore";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    initUsers();
  }, []);

  const handleLogin = () => {
    const trimmedUserId = userId.trim();

    if (!trimmedUserId || !pw.trim()) {
      setError("아이디와 비밀번호를 모두 입력해 주세요.");
      return;
    }

    const user = findUserByCredentials(trimmedUserId, pw);

    if (!user) {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
      return;
    }

    // ✅ 로그인 성공 (중요)
    setCurrentUser(user);
    navigate(user.admin === 1 ? "/admin/dashboard" : "/mypage?tab=reservations");
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
          autoComplete="username"
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
          autoComplete="current-password"
          placeholder="비밀번호"
        />

        {error && <p className="login-error">{error}</p>}

        <button type="button" className="login-btn" onClick={handleLogin}>
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

        <p className="login-hint">
          아직 계정이 없다면 <Link to="/signup">회원가입</Link> 후 바로 마이페이지를 사용할 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default Login;
