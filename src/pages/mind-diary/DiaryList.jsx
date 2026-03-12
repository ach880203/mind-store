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
        <h2>오늘 마음이 어땠나요?</h2>
        <p>말로하기 어려운 마음을, 마음 일기장에 천천히 적어주세요.</p>
        <button className="diary-btn primary" onClick={onWriteClick}>
          마음일기 쓰기
        </button>
      </section>

      {/* 검색 */}
      <div className="diary-search-row">
        <input
          className="diary-search-input"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="검색 (내용/생각/감정/날짜 등)"
        />
        <span className="diary-search-count">
          총{totalCount}개
        </span>
      </div>

      <div className="diary-filter-row">
        <button
          type="button"
          className={`diary-filter-btn ${filters.unreadOnly ? "active" : ""}`}
          onClick={onToggleUnreadFilter}
        >
          안읽음
        </button>
        <button
          type="button"
          className={`diary-filter-btn ${filters.mineOnly ? "active" : ""}`}
          onClick={onToggleMineFilter}
        >
          내가쓴글
        </button>
      </div>

      {/* 빈 상태 */}
      {totalCount === 0 && (
        <p className="diary-empty">아직 기록된 마음이 없어요.</p>
      )}

      {/* 리스트 */}
      <div className="diary-list">
        {diaries.map((d) => {
          const isRead = !!d.isRead;
          const commentCount = Array.isArray(d.comments) ? d.comments.length : 0;
          const isMine = me?.user_id && d.userId === me.user_id;
          const author = usersdb.find((user) => user.user_id === d.userId);
          const authorLabel = isAdminViewer
            ? `${author?.nick || "알 수 없음"} (${author?.user_id || "미확인"})`
            : isMine
              ? "익명 · 내가 쓴 글"
              : "익명";

          return (
              <div
                key={d.id}
                className={`diary-card emotion-${d.emotion} ${d.highlight ? "pulse" : ""}`}
                onClick={() => onSelectDiary(d)}
              >

              <div className="diary-card-header">
                <span className="diary-heart" />

                <span className="diary-author">
                  {authorLabel}
                </span>

                <span className="diary-date">
                  {new Date(d.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="diary-card-meta">
                <span className={`diary-badge ${isRead ? "read" : "unread"}`}>
                  {isRead ? "읽음" : "안읽음"}
                </span>
                {isMine && <span className="diary-mine-badge">내가 쓴 글</span>}
                <span className="diary-comment-count">대화 {commentCount}</span>

                {/*<button
                  className="diary-read-toggle"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleRead(d.id);
                  }}
                  title="읽음/안읽음 전환"
                >
                  {isRead ? "안읽음으로" : "읽음으로"}
                </button>*/}
              </div>

              <p className="diary-preview muted">
                소중한 누군가의 마음입니다.
              </p>
            </div>
          );
        })}
      </div>

      {/* 페이징 */}
      {totalCount > 0 && (
        <div className="diary-pagination">
          <button
            className="diary-page-btn"
            onClick={onPrevPage}
            disabled={page <= 1}
          >
            ◀
          </button>
          <span className="diary-page-info">
            {page} / {totalPages}
          </span>
          <button
            className="diary-page-btn"
            onClick={onNextPage}
            disabled={page >= totalPages}
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default DiaryList;
