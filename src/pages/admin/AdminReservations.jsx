import React, { useEffect, useRef, useState } from "react";
import reservationsdb from "../../data/reservationsdb";
import counselingdb from "../../data/counselingdb";
import "./AdminReservations.css";
import "./AdminModal.css";
import { useSearchParams } from "react-router-dom";
import { initReservations, saveReservations } from "./reservationStorage";

const STATUS = ["전체", "대기", "확정", "완료", "취소"];

const PAGE_SIZE = 9;
const PAGE_GROUP = 10;

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [modalTop, setModalTop] = useState(0);
  const [toast, setToast] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get("status") || "전체";

  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  const currentPage = Number(searchParams.get("page") || 1);

  const toastTimer = useRef(null);

  const getCounseling = (id) => counselingdb.find((c) => c.id === id);

  // URL status가 바뀌면 상태필터 반영
  useEffect(() => {
    const s = searchParams.get("status") || "전체";
    setStatusFilter(s);
  }, [searchParams]);

  const changeStatus = (s) => {
    setStatusFilter(s);

    // status 바꿀 때는 page=1로 리셋
    const params = {};
    if (s !== "전체") params.status = s;
    params.page = 1;

    setSearchParams(params);
  };

  const changePage = (p, totalPages) => {
    if (p < 1 || p > totalPages) return;

    const params = {};
    if (statusFilter !== "전체") params.status = statusFilter;
    params.page = p;

    setSearchParams(params);
  };

  /* debounce */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedKeyword(keyword.trim()), 300);
    return () => clearTimeout(t);
  }, [keyword]);

  const showToast = (msg) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(""), 2000);
  };

  const filteredReservations = reservations.filter((r) => {
    const counseling = getCounseling(r.counselingId);

    const matchStatus = statusFilter === "전체" || r.status === statusFilter;

    const k = debouncedKeyword;
    const matchKeyword =
      !k || r.userName.includes(k) || counseling?.title.includes(k);

    return matchStatus && matchKeyword;
  });

  const totalPages = Math.ceil(filteredReservations.length / PAGE_SIZE) || 1;

  // 페이지 그룹 계산(컴포넌트 스코프에 있어야 함)
  const startPage =
    Math.floor((currentPage - 1) / PAGE_GROUP) * PAGE_GROUP + 1;

  const endPage = Math.min(startPage + PAGE_GROUP - 1, totalPages);

  const pagedReservations = filteredReservations.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const openModal = (e, reservation) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const modalHeight = 420;
    const padding = 16;

    let top = rect.top + rect.height / 2 - modalHeight / 2 + window.scrollY;

    const minTop = window.scrollY + padding;
    const maxTop = window.scrollY + window.innerHeight - modalHeight - padding;

    if (top < minTop) top = minTop;
    if (top > maxTop) top = maxTop;

    setModalTop(top);
    setSelected(reservation);
  };

  useEffect(() => {
    if (!selected) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") setSelected(null);
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [selected]);

    const updateStatus = (id, newStatus) => {
      setReservations((prev) => {
        const next = prev.map((r) =>
          r.id === id ? { ...r, status: newStatus } : r
        );

      saveReservations(next); // ✅ LS 동기화
      return next;
      });

      setSelected((prev) =>
        prev ? { ...prev, status: newStatus } : prev
      );

      showToast(`예약이 '${newStatus}' 상태로 변경되었습니다`);
    };


  useEffect(() => {
    const data = initReservations(reservationsdb);
    setReservations(data);
  }, []);

  return (
    <>
      <div className="admin-page">
        <h1>상담 예약 관리</h1>

        <div className="admin-controls">
          <div className="status-filters">
            {STATUS.map((s) => (
              <button
                key={s}
                className={statusFilter === s ? "active" : ""}
                onClick={() => changeStatus(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <input
            className="search-input"
            placeholder="이름 또는 상담명 검색"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              // 검색 바뀌면 page=1로 리셋
              const params = {};
              if (statusFilter !== "전체") params.status = statusFilter;
              params.page = 1;
              setSearchParams(params);
            }}
          />
        </div>

        <table className="reservation-table">
          <thead>
            <tr>
              <th>이름</th>
              <th>상담</th>
              <th>예약일시</th>
              <th>상태</th>
            </tr>
          </thead>

          <tbody>
            {pagedReservations.length === 0 ? (
              <tr>
                <td colSpan={4} className="empty">
                  예약 내역이 없습니다
                </td>
              </tr>
            ) : (
              pagedReservations.map((r) => {
                const counseling = getCounseling(r.counselingId);
                return (
                  <tr key={r.id} onClick={(e) => openModal(e, r)}>
                    <td>{r.userName}</td>
                    <td>{counseling?.title}</td>
                    <td>
                      {r.date} {r.time}
                    </td>
                    <td>
                      <span className={`status ${r.status}`}>{r.status}</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* ✅ 페이지네이션 (10개 그룹) */}
        {totalPages > 1 && (
          <div className="pagination">
            {startPage > 1 && (
              <button
                className="arrow"
                onClick={() => changePage(startPage - 1, totalPages)}
              >
                ◀
              </button>
            )}

            {Array.from(
              { length: endPage - startPage + 1 },
              (_, i) => startPage + i
            ).map((p) => (
              <button
                key={p}
                className={p === currentPage ? "active" : ""}
                onClick={() => changePage(p, totalPages)}
              >
                {p}
              </button>
            ))}

            {endPage < totalPages && (
              <button
                className="arrow"
                onClick={() => changePage(endPage + 1, totalPages)}
              >
                ▶
              </button>
            )}
          </div>
        )}
      </div>

      {/* ✅ 모달은 admin-page 밖에서 렌더 */}
      {selected && (
        <div className="admin-modal-overlay" onClick={() => setSelected(null)}>
          <div
            className="admin-modal"
            style={{
              top: modalTop,
              left: "50%",
              transform: "translateX(-50%)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="admin-modal-close"
              onClick={() => setSelected(null)}
            >
              ✕
            </button>

            <h2>예약 상세</h2>

            <p>이름: {selected.userName}</p>
            <p>상담: {getCounseling(selected.counselingId)?.title}</p>
            <p>
              예약일시: {selected.date} {selected.time}
            </p>
            <p>
              상태:
              <span className={`status ${selected.status}`}>
                {selected.status}
              </span>
            </p>

            <div className="status-action">
              {STATUS.filter((s) => s !== "전체").map((s) => (
                <button
                  key={s}
                  disabled={selected.status === s}
                  onClick={() => updateStatus(selected.id, s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
};

export default AdminReservations;
