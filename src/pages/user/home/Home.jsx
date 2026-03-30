import "./Home.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DiaryWrite from "../../mind-diary/DiaryWrite";
import DiarySendResult from "../../mind-diary/DiarySendResult";
import ModalPortal from "../../../components/ModalPortal";
import { saveDiary } from "../../mind-diary/diaryStorage";
import { getCurrentUser } from "../../../utils/auth";

const Home = () => {
  const navigate = useNavigate();
  const [openDiary, setOpenDiary] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [diaryNotice, setDiaryNotice] = useState("");

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

  /** 모달이 열릴 때만 body 스크롤을 잠그고, 화면을 벗어나면 반드시 원복합니다. */
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = openDiary ? "hidden" : "";

    // 전역 body를 건드린 값은 이 화면이 사라질 때 복구해야 다른 페이지까지 영향이 번지지 않습니다.
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [openDiary]);

  /** 공통 닫기 */
  const closeAll = () => {
    setOpenDiary(false);
    setShowResult(false);
    setDiaryNotice("");
  };

  /** 홈에서 바로 일기를 저장하고 완료 화면으로 넘깁니다. */
  const handleSubmitDiary = (data) => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      // 홈에서 바로 일기를 쓰더라도 작성자는 현재 로그인 사용자와 정확히 연결되어야 합니다.
      // 로그인 없이 저장하면 마이페이지와 소유자 연결이 틀어지므로 먼저 로그인으로 안내합니다.
      setDiaryNotice("마음일기를 저장하려면 먼저 로그인해 주세요.");
      navigate("/login");
      return;
    }

    saveDiary({
      ...data,
      userId: currentUser.user_id,
    });

    setDiaryNotice("");
    setShowResult(true);
  };

  return (
    <div className="home-page">
      <div className="home">
        {/* 기본 안내 카드 */}
        {!openDiary && (
          <section className="home-hero">
            <span className="home-eyebrow">기록하고, 정리하고, 다시 돌아보는 마음 루틴</span>
            <h1 className="home-message">오늘 마음은 어땠나요?</h1>
            <p className="home-submessage">말로하기 어려운 마음을, 마음 일기장에 천천히 적어주세요.</p>
            {diaryNotice && <p className="home-submessage">{diaryNotice}</p>}
            <button className="diary-btn" onClick={() => setOpenDiary(true)}>
              마음일기 쓰기
            </button>
          </section>
        )}

        {/* 일기 모달 */}
        {openDiary && (
          <ModalPortal>
            <div className="diary-overlay" onClick={closeAll}>
              <div className="diary-modal" onClick={(e) => e.stopPropagation()}>
                {!showResult ? (
                  <DiaryWrite onSubmit={handleSubmitDiary} onCancel={closeAll} />
                ) : (
                  <DiarySendResult onDone={closeAll} />
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
