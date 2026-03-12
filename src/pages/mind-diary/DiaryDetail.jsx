import { useEffect, useRef, useState } from "react";
import { addComment } from "./diaryStorage";
import "./MindDiary.detail.css";
import usersdb from "../../data/usersdb";
import { getCurrentUser } from "../../utils/auth";

/**
 * DiaryDetail
 * -----------------------------------
 * 단일 일기의 상세 + 댓글
 */
const DiaryDetail = ({ diary, onBack, onDelete, onRefresh, onMarkRead}) => {
  const [text, setText] = useState("");
  const me = getCurrentUser();
  const isAdminViewer = Number(me?.admin) === 1;
  const isOwner = me?.user_id && diary.userId === me.user_id;
  const role = isAdminViewer ? "admin" : "user"; // user | admin
  const author = usersdb.find(
    (u) => u.user_id === diary.userId
  );
  
  const inputRef = useRef(null);
  const inputWrapRef = useRef(null);

  //자동 높이 조절 로직
  useEffect(() =>{
    if(!inputRef.current) return;

    const el = inputRef.current;
    el.style.height = "auto";   //리셋
    el.style.height = el.scrollHeight + "px"; //내용만큼 늘림
  }, [text]);

  /** 댓글 추가 */
  const handleAddComment = () => {
    if (!text.trim()) return;

    const comment = {
      id: Date.now(),
      role,
      text,
      createdAt: new Date().toISOString(),
    };

    addComment(diary.id, comment);

    // ⭐ 저장소 반영 → 부모 state 즉시 동기화
    onRefresh?.(diary.id);

    setText("");
    requestAnimationFrame(() => {
      if (inputRef.current) inputRef.current.style.height = "auto"; //댓글 등록 후 높이 초기화
    });
    requestAnimationFrame(() => {
      inputWrapRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      });
    });

  };

  return (
    <div className={`diary-detail emotion-${diary.emotion}`}>
      {/* 헤더 */}
      <header className="diary-detail-header">
        <span className="diary-heart large" />

        <div className="diary-detail-title">
          <h2>일기 상세</h2>
          <span className="diary-author-name">
            {isAdminViewer
              ? `작성자 ${author ? `${author.nick} (${author.user_id})` : "알 수 없음"}`
              : isOwner
                ? "내가 쓴 글"
                : "익명"}
          </span>
          {isOwner && !isAdminViewer && <span className="diary-owner-chip">내가 쓴 글</span>}
        </div>

        <p className="diary-date">
          {new Date(diary.createdAt).toLocaleString()}
        </p>
      </header>

      {/* 🔥 스크롤 영역 (본문 + 댓글) */}
      <div className="diary-detail-body">
        {/* 본문 */}
        <section className="diary-content">
          <h4>있었던 일</h4>
          <p>{diary.event}</p>

          <h4>들었던 생각</h4>
          <p>{diary.thought}</p>

          <h4>느껴진 감정</h4>
          <p>{diary.emotionDetail}</p>

          <h4>나에게 해주고 싶은 말</h4>
          <p>{diary.selfMessage}</p>
        </section>

        {/* 댓글 */}
        <section className="diary-comments">
          <h4>대화</h4>

          <div className="comment-list">
            {(!diary.comments || diary.comments.length === 0) && (
              <p className="comment-empty">
                아직 대화가 없어요.
              </p>
            )}

            {(diary.comments || []).map((c) => (
              <div
                key={c.id}
                className={`comment-bubble ${c.role}`}
              >
                <p>{c.text}</p>
                <span>
                  {new Date(c.createdAt).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
            
            {/* 하단 입력창 고정 로직 */}
          <div className="comment-form" ref={inputWrapRef}>
            {isAdminViewer ? (
              <div className="comment-role-badge">관리자 답장</div>
            ) : (
              <div className="comment-role-badge">내 답장</div>
            )}

            <textarea
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={isAdminViewer ? "일기에 남길 답장을 입력하세요" : "추가로 남기고 싶은 말을 적어주세요"}
              rows={1}  //처음은 한 줄
              style={{ resize: "none", overfrlow: "hidden"}} //드래그 막기, 스크롤바 숨기기
            />

            <button onClick={handleAddComment}>
              등록
            </button>
          </div>

            {!diary.isRead && diary.comments && diary.comments.length > 0 && (
              <div className="comment-read-action">
                <button
                  className="diary-btn subtle"                //댓글 추가시 확인 버튼 눌러야 읽음으로 전환
                  onClick={() => {
                  onMarkRead(diary.id);
                  onRefresh?.(diary.id);
            }}
            >
                댓글 확인 완료
                </button>
                </div>
            )}
        </section>
      </div>

      {/* 푸터 */}
      <footer className="diary-detail-footer">
        <button className="diary-btn" onClick={onBack}>
          뒤로가기
        </button>
        <button
          className="diary-btn danger"
          onClick={() => onDelete(diary.id)}
        >
          삭제
        </button>
      </footer>
    </div>
  );
};

export default DiaryDetail;
