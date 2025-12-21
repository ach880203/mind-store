import usersdb from "../../data/usersdb";
import "./MindDiary.list.css";

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
  onQueryChange,
  onPrevPage,
  onNextPage,
  onToggleRead,
  onWriteClick,
  onSelectDiary,
}) => {
  return (
    <div className="diary-list-page">
      {/* 히어로 영역 */}
      <section className="diary-hero">
        <h2>오늘 마음이 어땠나요?</h2>
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

      {/* 빈 상태 */}
      {totalCount === 0 && (
        <p className="diary-empty">아직 기록된 마음이 없어요.</p>
      )}

      {/* 리스트 */}
      <div className="diary-list">
        {diaries.map((d) => {
          const user = usersdb.find((u) => u.user_id === d.userId);
          const isRead = !!d.isRead;

          return (
              <div
                key={d.id}
                className={`diary-card emotion-${d.emotion} ${d.highlight ? "pulse" : ""}`}
                onClick={() => onSelectDiary(d)}
              >

              <div className="diary-card-header">
                <span className="diary-heart" />

                <span className="diary-author">
                  {/*{user?.nick || "익명"}*/}
                  {"익명"}
                </span>

                <span className="diary-date">
                  {new Date(d.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="diary-card-meta">
                <span className={`diary-badge ${isRead ? "read" : "unread"}`}>
                  {isRead ? "읽음" : "안읽음"}
                </span>

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
