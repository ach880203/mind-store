import "./Home.css";
import { useEffect, useState } from "react";
import DiaryWrite from "./mind-diary/DiaryWrite";
import DiarySendResult from "./mind-diary/DiarySendResult";
import ModalPortal from "../components/ModalPortal";
import { saveDiary } from "./mind-diary/diaryStorage";

const Home = () => {
  const [openDiary, setOpenDiary] = useState(false);
  const [showResult, setShowResult] = useState(false);

  /** ESC 키로 모달 닫기 */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        closeAll();
      }
    };

    if (openDiary) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [openDiary]);

  /** 모달 열릴 때 body 스크롤 잠금 */
  useEffect(() => {
    document.body.style.overflow = openDiary ? "hidden" : "auto";
  }, [openDiary]);

  /** 공통 닫기 */
  const closeAll = () => {
    setOpenDiary(false);
    setShowResult(false);
  };

  /** 홈에서 일기 저장 */
  const handleSubmitDiary = (data) => {
    saveDiary({
      ...data,
      userId: "minji", // 임시 로그인 유저
    });

    setShowResult(true);
  };

  return (
  <div className="home-page">  
    <div className="home">
      {/* 홈 기본 카드 */}
      {!openDiary && (
        <div className="home-center">
          <h1>오늘 마음이 어땠나요?</h1>
          <p>
            말로 하기 어려운 마음을,
            마음 일기장에 천천히 적어도 괜찮아요.
          </p>

          <button
            className="diary-btn"
            onClick={() => setOpenDiary(true)}
          >
            마음일기 쓰기
          </button>
        </div>
      )}

      {/* 일기 모달 */}
      {openDiary && (
        <ModalPortal>
          <div
            className="diary-overlay"
            onClick={closeAll}
          >
            <div
              className="diary-modal"
              onClick={(e) => e.stopPropagation()}
            >

              {!showResult ? (
                <DiaryWrite
                  onSubmit={handleSubmitDiary}
                  onCancel={closeAll}
                />
              ) : (
                <DiarySendResult
                  onDone={closeAll}
                />
              )}
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  </div>  
  );
};

export default Home;
