import { useEffect } from "react";
import "./MindDiary.result.css";

const DiarySendResult = ({ onDone }) => {
  // 자동 복귀 (2초)
  useEffect(() => {
    if (!onDone) return;

    const timer = setTimeout(() => {
      onDone();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="diary-result">
      <h2 className="diary-result-title">
        마음이 잘 전해졌어요
      </h2>

      <p className="diary-result-desc">
        오늘의 기록이 조용히 저장되었습니다.
      </p>

      <button
        className="diary-btn result"
        onClick={onDone}
      >
        마치기
      </button>
    </div>
  );
};

export default DiarySendResult;
