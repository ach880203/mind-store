// src/pages/admin/AdminDashboard.jsx
import React, { useMemo } from "react";
import "./AdminDashboard.css";

import reservationsdb from "../../data/reservationsdb";
import usersdb from "../../data/usersdb";
import productsdb from "../../data/productsdb";
import ordersdb from "../../data/ordersdb";
import { useNavigate } from "react-router-dom";

const LS_USERS = "admin_users_v1";
const LS_PRODUCTS = "admin_products_v1";

const todayStr = new Date().toLocaleDateString("sv-SE");

const getLS = (key) => {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return Array.isArray(v) && v.length ? v : null;
  } catch {
    return null;
  }
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const users = getLS(LS_USERS) ?? usersdb;
  const products = getLS(LS_PRODUCTS) ?? productsdb;

  /* ===== 상단 KPI ===== */
  const todayReservations = reservationsdb.filter(
    (r) => r.date === todayStr).length;

  const sellingProducts = products.filter(
    (p) => p.status === "판매중"
  ).length;

  const todayOrderAmount = ordersdb
    .filter((o) => o.date.startsWith(todayStr))
    .reduce((sum, o) => sum + o.price, 0);

  /* ===== 예약 상태 ===== */
  const reservationStatus = useMemo(() => {
    const base = { 대기: 0, 확정: 0, 완료: 0, 취소: 0 };
    reservationsdb.forEach((r) => base[r.status]++);
    return base;
  }, []);

  /* ===== 주문 상태 ===== */
  const orderStatus = useMemo(() => {
    const base = {
      결제완료: 0,
      배송준비중: 0,
      배송중: 0,
      배송완료: 0,
      취소: 0,
    };
    ordersdb.forEach((o) => base[o.status]++);
    return base;
  }, []);

  const maxOrderCount = Math.max(...Object.values(orderStatus), 1);

  return (
    <div className="admin-page">
      <h1>관리자 대시보드</h1>

      {/* ===== KPI ===== */}
      <div className="dashboard-grid">
        <div className="dash-card">
          <h3>오늘 예약</h3>
          <strong>{todayReservations}</strong>
        </div>

        <div className="dash-card">
          <h3>총 회원</h3>
          <strong>{users.length}</strong>
        </div>

        <div className="dash-card">
          <h3>판매중 상품</h3>
          <strong>{sellingProducts}</strong>
        </div>

        <div className="dash-card">
          <h3>오늘 주문 금액</h3>
          <strong>₩{todayOrderAmount.toLocaleString()}</strong>
        </div>
      </div>

      {/* ===== 예약 상태 ===== */}
      <h2 className="dash-section-title">예약 현황</h2>
      <div className="dashboard-grid four">
        {Object.entries(reservationStatus).map(([k, v]) => (
          <div key={k} 
                className={`dash-card status-card ${k}`}
                onClick={() => navigate(`/admin/reservations?staus=${k}`)}
                style={{cursor: "pointer"}}>
            <h3>{k}</h3>
            <strong>{v}</strong>
          </div>
        ))}
      </div>

      {/* ===== 주문 상태 차트 ===== */}
      <h2 className="dash-section-title">주문 상태</h2>
      <div className="dash-card chart-card">
        {Object.entries(orderStatus).map(([k, v]) => (
          <div key={k} 
              className="chart-row"
              onClick={() => navigate(`/admin/orders?status=${k}`)}
              style={{ cursor: "pointer" }}>
            <span className={`status-label ${k}`}>{k}</span>
            <div className="bar-wrap">
              <div
                className={`bar ${k}`}
                style={{ width: `${(v / maxOrderCount) * 100}%` }}
              />
            </div>
            <span className="bar-value">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
