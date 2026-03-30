import usersdb from "../../data/usersdb";
import "./MindDiary.list.css";
import { getCurrentUser } from "../../utils/auth";

/**
 * DiaryList
 * -----------------------------------
 * 마음일기 목록 전용 컴포넌트
 */
const DiaryList = ({
  diaries,
  totalCount,
  page,
  totalPages,
  query,
  filters,
  noticeMessage,
  onQueryChange,
  onToggleUnreadFilter,
  onToggleMineFilter,
  onPrevPage,
  onNextPage,
  onToggleRead,
  onWriteClick,
  onSelectDiary,
}) => {
  const me = getCurrentUser();
  const isAdminViewer = Number(me?.admin) === 1;

  return (
    <div className="diary-list-page">
      {/* 히어로 영역 */}
      <section className="diary-hero">
        <h2>오늘 마음을 기록해볼까요?</h2>
        <p>
          말로 꺼내기 어려운 마음도 마음일기에 차분하게 적어보면 정리가
          시작됩니다.
        </p>
        <button className="diary-btn primary" onClick={onWriteClick}>
          마음일기 쓰기
        </button>
      </section>

      {noticeMessage && <p className="diary-inline-notice">{noticeMessage}</p>}

      {/* 검색 */}
      <div className="diary-search-row">
        <input
          className="diary-search-input"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="검색어를 입력해주세요. (내용, 감정, 날짜)"
        />
        <span className="diary-search-count">총 {totalCount}개</span>
      </div>

      <div className="diary-filter-row">
        <button
          type="button"
          className={`diary-filter-btn ${filters.unreadOnly ? "active" : ""}`}
          onClick={onToggleUnreadFilter}
        >
          읽지 않음
        </button>
        <button
          type="button"
          className={`diary-filter-btn ${filters.mineOnly ? "active" : ""}`}
          onClick={onToggleMineFilter}
        >
          내 글만
        </button>
      </div>

      {/* 빈 상태 */}
      {totalCount === 0 && (
        <p className="diary-empty">아직 기록된 마음일기가 없습니다.</p>
      )}

      {/* 리스트 */}
      <div className="diary-list">
        {diaries.map((diary) => {
          const isRead = !!diary.isRead;
          const commentCount = Array.isArray(diary.comments)
            ? diary.comments.length
            : 0;
          const isMine = me?.user_id && diary.userId === me.user_id;
          const author = usersdb.find((user) => user.user_id === diary.userId);
          const authorLabel = isAdminViewer
            ? `${author?.nick || "이름 없음"} (${author?.user_id || "미확인"})`
            : isMine
            ? "익명 · 내 글"
            : "익명";

          return (
            <div
              key={diary.id}
              className={`diary-card emotion-${diary.emotion} ${
                diary.highlight ? "pulse" : ""
              }`}
              onClick={() => onSelectDiary(diary)}
            >
              <div className="diary-card-header">
                <span className="diary-heart" />

                <span className="diary-author">{authorLabel}</span>

                <span className="diary-date">
                  {new Date(diary.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="diary-card-meta">
                <span className={`diary-badge ${isRead ? "read" : "unread"}`}>
                  {isRead ? "읽음" : "읽지 않음"}
                </span>
                {isMine && <span className="diary-mine-badge">내 글</span>}
                <span className="diary-comment-count">댓글 {commentCount}</span>

                {/* 읽음 상태를 바로 바꾸는 기능은 지금은 숨기고, 구조만 남겨둡니다. */}
                {/*<button
                  className="diary-read-toggle"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleRead(diary.id);
                  }}
                  title="읽음/읽지 않음 전환"
                >
                  {isRead ? "읽지 않음으로" : "읽음으로"}
                </button>*/}
              </div>

              <p className="diary-preview muted">
                탭하면 비밀글의 자세한 내용을 확인할 수 있습니다.
              </p>
            </div>
          );
        })}
      </div>

      {/* 페이지 */}
      {totalCount > 0 && (
        <div className="diary-pagination">
          <button
            className="diary-page-btn"
            onClick={onPrevPage}
            disabled={page <= 1}
          >
            이전
          </button>
          <span className="diary-page-info">
            {page} / {totalPages}
          </span>
          <button
            className="diary-page-btn"
            onClick={onNextPage}
            disabled={page >= totalPages}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default DiaryList;
