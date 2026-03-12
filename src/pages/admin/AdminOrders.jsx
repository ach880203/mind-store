// src/pages/admin/AdminOrders.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./AdminOrders.css";
import { initOrders, saveOrders } from "../../utils/orderStore";

const STATUS = ["전체", "결제완료", "배송준비중", "배송중", "배송완료", "취소"];

const PAGE_SIZE = 8;
const PAGE_GROUP = 10;

const AdminOrders = () => {
  /* ===============================
     URL (Single Source of Truth)
  =============================== */
  const [searchParams, setSearchParams] = useSearchParams();

  const statusFilter = searchParams.get("status") || "전체";
  const keyword = searchParams.get("keyword") || "";
  const page = Number(searchParams.get("page") || 1);

  /* ===============================
     기존 state (유지)
  =============================== */
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [closing, setClosing] = useState(false);
  const [toast, setToast] = useState("");

  const toastTimer = useRef(null);

  useEffect(() => {
    setOrders(initOrders());
  }, []);

  /* ===============================
     URL 업데이트 (유일한 출구)
  =============================== */
  const updateQuery = (next = {}) => {
    const params = {};

    if (next.status && next.status !== "전체") params.status = next.status;
    if (next.keyword) params.keyword = next.keyword;
    if (next.page && next.page !== 1) params.page = next.page;

    setSearchParams(params);
  };

  /* ===============================
     필터링 (기존 기능 유지)
  =============================== */
  const filteredOrders = useMemo(() => {
    if (!Array.isArray(orders)) return [];

    return orders.filter((o) => {
      const matchStatus =
        statusFilter === "전체" || o.status === statusFilter;

      const matchKeyword =
        !keyword ||
        String(o.user || "").includes(keyword) ||
        String(o.product || "").includes(keyword);

      return matchStatus && matchKeyword;
    });
  }, [orders, statusFilter, keyword]);

  /* ===============================
     페이지네이션 (추가)
  =============================== */
  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);

  const startPage =
    Math.floor((page - 1) / PAGE_GROUP) * PAGE_GROUP + 1;

  const endPage = Math.min(startPage + PAGE_GROUP - 1, totalPages);

  const pagedOrders = filteredOrders.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* ===============================
     기존 핸들러들 (유지)
  =============================== */
  const showToast = (msg) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(""), 2000);
  };

  const closePanel = () => {
    setClosing(true);
    setTimeout(() => {
      setSelected(null);
      setClosing(false);
    }, 220);
  };

  const updateStatus = (newStatus) => {
    setOrders((prev) => {
      const nextOrders = prev.map((o) =>
        o.id === selected.id ? { ...o, status: newStatus } : o
      );
      saveOrders(nextOrders);
      return nextOrders;
    });

    setSelected((prev) => ({ ...prev, status: newStatus }));
    showToast(`상태가 '${newStatus}'로 변경되었습니다`);
  };

  /* ===============================
     Render
  =============================== */
  return (
    <>
      <div className="admin-page">
        <h1>주문 관리</h1>

        {/* ===== 필터 + 검색 ===== */}
        <div className="admin-controls">
          <div className="status-filters">
            {STATUS.map((s) => (
              <button
                key={s}
                className={statusFilter === s ? "active" : ""}
                onClick={() =>
                  updateQuery({ status: s, keyword, page: 1 })
                }
              >
                {s}
              </button>
            ))}
          </div>

          <input
            className="search-input"
            placeholder="주문자 / 상품 검색"
            value={keyword}
            onChange={(e) =>
              updateQuery({
                status: statusFilter,
                keyword: e.target.value,
                page: 1,
              })
            }
          />
        </div>

        {/* ===== 테이블 ===== */}
        <table className="reservation-table">
          <thead>
            <tr>
              <th>주문자</th>
              <th>상품</th>
              <th>수량</th>
              <th>금액</th>
              <th>상태</th>
              <th>주문일</th>
            </tr>
          </thead>

          <tbody>
            {pagedOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty">
                  주문 내역이 없습니다
                </td>
              </tr>
            ) : (
              pagedOrders.map((o) => (
                <tr key={o.id} onClick={() => setSelected(o)}>
                  <td>{o.user}</td>
                  <td>{o.product}</td>
                  <td>{o.quantity}</td>
                  <td>{o.price.toLocaleString()}원</td>
                  <td>
                    <span className={`status ${o.status}`}>
                      {o.status}
                    </span>
                  </td>
                  <td>{o.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* ===== 페이지네이션 ===== */}
        {totalPages > 1 && (
          <div className="pagination">
            {startPage > 1 && (
              <button
                className="arrow"
                onClick={() =>
                  updateQuery({
                    status: statusFilter,
                    keyword,
                    page: startPage - 1,
                  })
                }
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
                className={p === page ? "active" : ""}
                onClick={() =>
                  updateQuery({
                    status: statusFilter,
                    keyword,
                    page: p,
                  })
                }
              >
                {p}
              </button>
            ))}

            {endPage < totalPages && (
              <button
                className="arrow"
                onClick={() =>
                  updateQuery({
                    status: statusFilter,
                    keyword,
                    page: endPage + 1,
                  })
                }
              >
                ▶
              </button>
            )}
          </div>
        )}
      </div>

      {/* ===== 상세 패널 (기존 그대로) ===== */}
      {selected && (
        <>
          <div className="admin-overlay" onClick={closePanel} />
          <div className={`admin-detail-panel ${closing ? "closing" : ""}`}>
            <button className="panel-close" onClick={closePanel}>
              ✕
            </button>

            <h2>주문 상세</h2>

            <p>주문자: {selected.user}</p>
            <p>상품: {selected.product}</p>
            <p>수량: {selected.quantity}</p>
            <p>금액: {selected.price.toLocaleString()}원</p>
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
                  onClick={() => updateStatus(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
};

export default AdminOrders;
