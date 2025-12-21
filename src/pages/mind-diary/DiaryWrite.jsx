import React, { useMemo, useState } from "react";
import "./MindDiary.write.css";

/**
 * DiaryWrite (통합 버전)
 * - 감정 선택 (이미지)
 * - 글 작성
 * - 비밀번호
 * - onSubmit 하나로만 동작
 */

const EMOTIONS = [
  { key: "매우아픔", label: "매우 아픔", img: `${process.env.PUBLIC_URL}/img/emotion1.png` },
  { key: "아픔", label: "아픔", img: `${process.env.PUBLIC_URL}/img/emotion2.png` },
  { key: "보통", label: "보통", img: `${process.env.PUBLIC_URL}/img/emotion3.png` },
  { key: "행복", label: "행복", img: `${process.env.PUBLIC_URL}/img/emotion4.png` },
  { key: "매우행복", label: "매우 행복", img: `${process.env.PUBLIC_URL}/img/emotion5.png` },
];

const DiaryWrite = ({ onSubmit, onCancel }) => {
  const [emotion, setEmotion] = useState(null);

  const [form, setForm] = useState({
    event: "",
    thought: "",
    emotionDetail: "",
    selfMessage: "",
    password: "",
  });

  const emotionLabel = useMemo(() => {
    return EMOTIONS.find((e) => e.key === emotion)?.label || "";
  }, [emotion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // textarea 자동 높이 (스크롤바 덜 보이게)
  const autoResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSubmit = () => {
    if (!emotion) return alert("감정을 선택해주세요");
    if (!form.password.trim()) return alert("비밀번호를 입력해주세요");
    if (typeof onSubmit !== "function") {
      console.error("DiaryWrite: onSubmit이 함수가 아닙니다:", onSubmit);
      return;
    }


    onSubmit({
      emotion,
      ...form,
    });
  };

  return (
    <div className="diary-overlay">
    <div className="diary-modal">
    <div className={`diary-write ${emotion ? `emotion-${emotion}` : ""}`}>
      {onCancel && (
        <button className="diary-close" onClick={onCancel} aria-label="닫기">
          ✕
        </button>
      )}

      <header className="diary-write-header">
        <h2 className="diary-write-title">오늘, 내 마음은 어디쯤이었나요?</h2>
        {emotion && (
          <p className="diary-write-subtitle">
            지금 선택한 감정: <b>{emotionLabel}</b>
          </p>
        )}
      </header>

      {/* 감정 선택 */}
      <section className="emotion-section">
        {EMOTIONS.map((e) => (
          <button
            key={e.key}
            type="button"
            className={`emotion-btn ${emotion === e.key ? "active" : ""}`}
            onClick={() => setEmotion(e.key)}
          >
            <span className="emotion-img">
              <img src={e.img} alt={e.label} />
            </span>
            <span className="emotion-label">{e.label}</span>
          </button>
        ))}
      </section>

      {/* 작성 폼 (여기가 길어지면 내부만 스크롤) */}
      <section className="diary-form">
        <div className="field">
          <label>있었던 일</label>
          <textarea
            name="event"
            placeholder="오늘 있었던 일을 적어주세요"
            value={form.event}
            onChange={handleChange}
            onInput={autoResize}
          />
        </div>

        <div className="field">
          <label>들었던 생각</label>
          <textarea
            name="thought"
            placeholder="그때 어떤 생각이 들었나요"
            value={form.thought}
            onChange={handleChange}
            onInput={autoResize}
          />
        </div>

        <div className="field">
          <label>느껴진 감정</label>
          <textarea
            name="emotionDetail"
            placeholder="감정이 몸/마음에서 어떻게 느껴졌나요"
            value={form.emotionDetail}
            onChange={handleChange}
            onInput={autoResize}
          />
        </div>

        <div className="field">
          <label>나에게 해주고 싶은 말</label>
          <textarea
            name="selfMessage"
            placeholder="지금의 나에게 해주고 싶은 말을 적어주세요"
            value={form.selfMessage}
            onChange={handleChange}
            onInput={autoResize}
          />
        </div>

        <div className="field">
          <label>비밀번호</label>
          <input
            className="pw-input"
            type="password"
            name="password"
            placeholder="비밀번호를 입력하세요"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
          />
          <p className="pw-hint">
            * 비밀번호는 상세 보기(잠금 해제)에만 사용돼요.
          </p>
        </div>
      </section>

      <footer className="diary-write-footer">
        <button className="diary-btn primary" onClick={handleSubmit}>
          내 마음 보내기
        </button>
      </footer>
    </div>
    </div>
    </div>
  );
};

export default DiaryWrite;
