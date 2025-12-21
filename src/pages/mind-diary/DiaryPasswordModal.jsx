import { useEffect, useState } from "react";
import "./DiaryPasswordModal.css";

/**
 * DiaryPasswordModal
 * -----------------------------------
 * 일기 접근을 위한 비밀번호 확인 모달
 */
const DiaryPasswordModal = ({ diary, onSuccess, onCancel }) => {
  const [inputPw, setInputPw] = useState("");
  const [error, setError] = useState("");

  /** ESC 키로 닫기 */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onCancel]);

  /** 비밀번호 확인 */
  const handleConfirm = () => {
    if (inputPw === diary.password) {
      onSuccess(diary);
    } else {
      setError("비밀번호가 맞지 않아요");
    }
  };

  return (
    <div className="password-overlay" onClick={onCancel}>
      <div
        className="password-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="password-close" onClick={onCancel}>
          ✕
        </button>

        <h3 className="password-title">비밀번호를 입력하세요</h3>

        <input
          type="password"
          className="password-input"
          value={inputPw}
          onChange={(e) => {
            setInputPw(e.target.value);
            setError("");
          }}
          placeholder="비밀번호"
        />

        {error && <p className="password-error">{error}</p>}

        <div className="password-actions">
          <button className="password-btn cancel" onClick={onCancel}>
            취소
          </button>
          <button className="password-btn confirm" onClick={handleConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiaryPasswordModal;
