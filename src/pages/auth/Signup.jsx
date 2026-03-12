import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setCurrentUser } from "../../utils/auth";
import {
  createUser,
  isDuplicateNick,
  isDuplicateUserId,
} from "../../utils/userStore";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    user_id: "",
    user_pw: "",
    confirm_pw: "",
    nick: "",
    phone: "",
    email: "",
    address: "",
  });
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFeedback("");
    setFeedbackType("");
  };

  const handleSignup = () => {
    const trimmedName = form.name.trim();
    const trimmedUserId = form.user_id.trim();
    const trimmedNick = form.nick.trim();

    if (
      !trimmedName ||
      !trimmedUserId ||
      !form.user_pw ||
      !form.confirm_pw ||
      !trimmedNick ||
      !form.phone.trim() ||
      !form.email.trim()
    ) {
      setFeedback("필수 항목을 모두 입력해 주세요.");
      setFeedbackType("error");
      return;
    }

    if (form.user_pw !== form.confirm_pw) {
      setFeedback("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      setFeedbackType("error");
      return;
    }

    if (isDuplicateUserId(trimmedUserId)) {
      setFeedback("이미 사용 중인 아이디입니다.");
      setFeedbackType("error");
      return;
    }

    if (isDuplicateNick(trimmedNick)) {
      setFeedback("이미 사용 중인 닉네임입니다.");
      setFeedbackType("error");
      return;
    }

    const newUser = createUser({
      name: trimmedName,
      user_id: trimmedUserId,
      user_pw: form.user_pw,
      nick: trimmedNick,
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
    });

    setCurrentUser(newUser);
    setFeedback("회원가입이 완료되었습니다. 마이페이지로 이동합니다.");
    setFeedbackType("success");

    setTimeout(() => {
      navigate("/mypage?tab=profile");
    }, 500);
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1 className="signup-title">회원가입</h1>
        <p className="signup-description">
          가입한 정보는 로그인, 마이페이지, 관리자 회원 관리 화면이 함께 사용하는 브라우저 저장소에 저장됩니다.
        </p>

        <div className="signup-grid">
          <label className="signup-field">
            <span>이름</span>
            <input name="name" value={form.name} onChange={handleChange} placeholder="이름을 입력해 주세요" />
          </label>
          <label className="signup-field">
            <span>아이디</span>
            <input
              name="user_id"
              value={form.user_id}
              onChange={handleChange}
              placeholder="로그인에 사용할 아이디"
            />
          </label>
          <label className="signup-field">
            <span>비밀번호</span>
            <input
              type="password"
              name="user_pw"
              value={form.user_pw}
              onChange={handleChange}
              placeholder="비밀번호를 입력해 주세요"
            />
          </label>
          <label className="signup-field">
            <span>비밀번호 확인</span>
            <input
              type="password"
              name="confirm_pw"
              value={form.confirm_pw}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력해 주세요"
            />
          </label>
          <label className="signup-field">
            <span>닉네임</span>
            <input name="nick" value={form.nick} onChange={handleChange} placeholder="화면에 표시할 닉네임" />
          </label>
          <label className="signup-field">
            <span>전화번호</span>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="010-0000-0000" />
          </label>
          <label className="signup-field">
            <span>이메일</span>
            <input name="email" value={form.email} onChange={handleChange} placeholder="example@test.com" />
          </label>
          <label className="signup-field signup-field-wide">
            <span>주소</span>
            <input name="address" value={form.address} onChange={handleChange} placeholder="주소를 입력해 주세요" />
          </label>
        </div>

        <p className={`signup-feedback ${feedbackType}`}>{feedback}</p>

        <div className="signup-actions">
          <button type="button" className="signup-submit" onClick={handleSignup}>
            가입하고 시작하기
          </button>
          <Link to="/login" className="signup-cancel">
            로그인으로 이동
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
