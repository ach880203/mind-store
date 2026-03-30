import React, { useMemo, useState } from "react";
import "./MindDiary.write.css";

/**
 * DiaryWrite (통합 버전)
 * - 감정 선택
 * - 글 작성
 * - 비밀번호 설정
 * - onSubmit 하나로만 동작
 */

const EMOTIONS = [
  {
    key: "매우 우울",
    label: "매우 우울",
    img: `${process.env.PUBLIC_URL}/img/emotion1.png`,
  },
  {
    key: "우울",
    label: "우울",
    img: `${process.env.PUBLIC_URL}/img/emotion2.png`,
  },
  {
    key: "보통",
    label: "보통",
    img: `${process.env.PUBLIC_URL}/img/emotion3.png`,
  },
  {
    key: "행복",
    label: "행복",
    img: `${process.env.PUBLIC_URL}/img/emotion4.png`,
  },
  {
    key: "매우 행복",
    label: "매우 행복",
    img: `${process.env.PUBLIC_URL}/img/emotion5.png`,
  },
];

const DiaryWrite = ({ onSubmit, onCancel }) => {
  const [emotion, setEmotion] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");
  const [form, setForm] = useState({
    event: "",
    thought: "",
    emotionDetail: "",
    selfMessage: "",
    password: "",
  });

  const emotionLabel = useMemo(() => {
    return EMOTIONS.find((item) => item.key === emotion)?.label || "";
  }, [emotion]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    /* 입력을 다시 시작하면 이전 경고 문구를 지워서 현재 상태에 집중하게 합니다. */
    setSubmitMessage("");
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // textarea 자동 높이 (스크롤바 대신 내용이 자연스럽게 늘어납니다.)
  const autoResize = (event) => {
    event.target.style.height = "auto";
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  const handleSubmit = () => {
    if (!emotion) {
      setSubmitMessage("감정을 먼저 선택해주세요.");
      return;
    }

    if (!form.password.trim()) {
      setSubmitMessage("비밀번호를 입력해주세요.");
      return;
    }

    if (typeof onSubmit !== "function") {
      setSubmitMessage("일기 저장 기능을 다시 확인해주세요.");
      return;
    }

    setSubmitMessage("");
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
              ×
            </button>
          )}

          <header className="diary-write-header">
            <h2 className="diary-write-title">
              오늘, 내 마음은 어디쯤에 있나요?
            </h2>
            {emotion && (
              <p className="diary-write-subtitle">
                지금 선택한 감정: <b>{emotionLabel}</b>
              </p>
            )}
          </header>

          {submitMessage && <p className="diary-inline-notice">{submitMessage}</p>}

          {/* 감정 선택 */}
          <section className="emotion-section">
            {EMOTIONS.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`emotion-btn ${emotion === item.key ? "active" : ""}`}
                onClick={() => {
                  setEmotion(item.key);
                  setSubmitMessage("");
                }}
              >
                <span className="emotion-img">
                  <img src={item.img} alt={item.label} />
                </span>
                <span className="emotion-label">{item.label}</span>
              </button>
            ))}
          </section>

          {/* 작성 폼은 내용이 길어져도 모달 전체가 깨지지 않게 내부만 스크롤됩니다. */}
          <section className="diary-form">
            <div className="field">
              <label>무슨 일이 있었나요?</label>
              <textarea
                name="event"
                placeholder="오늘 있었던 일을 적어주세요."
                value={form.event}
                onChange={handleChange}
                onInput={autoResize}
              />
            </div>

            <div className="field">
              <label>어떤 생각이 들었나요?</label>
              <textarea
                name="thought"
                placeholder="그때 어떤 생각이 들었는지 적어주세요."
                value={form.thought}
                onChange={handleChange}
                onInput={autoResize}
              />
            </div>

            <div className="field">
              <label>감정은 어떻게 느껴졌나요?</label>
              <textarea
                name="emotionDetail"
                placeholder="감정이 몸과 마음에서 어떻게 느껴졌는지 적어주세요."
                value={form.emotionDetail}
                onChange={handleChange}
                onInput={autoResize}
              />
            </div>

            <div className="field">
              <label>나에게 전하고 싶은 말</label>
              <textarea
                name="selfMessage"
                placeholder="지금의 나에게 해주고 싶은 말을 적어주세요."
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
                placeholder="비밀번호를 입력해주세요."
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <p className="pw-hint">
                * 비밀번호는 상세 보기에서 글을 확인할 때 사용됩니다.
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
