import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ordersdb from "../data/ordersdb";
import usersdb from "../data/usersdb";
import { getCurrentUser } from "../utils/auth";
import "./UserPage.css";
import "./OrdersCheck.css";

const ORDER_STORAGE_KEY = "admin_orders_v1";
const priceFormatter = new Intl.NumberFormat("ko-KR");

const loadOrders = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(ORDER_STORAGE_KEY));
    if (Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
  } catch (error) {
    // 주문 저장 데이터가 비정상이어도 확인 화면은 기본 더미 데이터로 열리도록 처리합니다.
  }

  return ordersdb;
};

const normalizeDate = (value) => {
  if (!value) {
    return "기록 없음";
  }

  return value;
};

const buildUserKeys = (user) => {
  const matchedUser = usersdb.find((item) => item.user_id === user?.user_id);

  return new Set(
    [user?.user_id, user?.nick, matchedUser?.nick, matchedUser?.name]
      .filter(Boolean)
      .map((value) => String(value))
  );
};

const OrdersCheck = () => {
  const [orders, setOrders] = useState([]);
  const me = getCurrentUser();

  useEffect(() => {
    if (!me) {
      setOrders([]);
      return;
    }

    const userKeys = buildUserKeys(me);
    const next = loadOrders()
      .filter((order) => userKeys.has(String(order.user)) || userKeys.has(String(order.userId)))
      .sort((left, right) => {
        const leftTime = new Date(String(left.date).replace(" ", "T")).getTime();
        const rightTime = new Date(String(right.date).replace(" ", "T")).getTime();
        return rightTime - leftTime;
      });

    setOrders(next);
  }, [me]);

  const totalAmount = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.price || 0), 0),
    [orders]
  );

  const latestOrder = orders[0];

  if (!me) {
    return (
      <div className="user-page orders-check-page">
        <div className="empty-state">
          <h2 className="empty-title">주문 확인은 로그인 후 이용할 수 있습니다.</h2>
          <p className="empty-description">로그인하면 내 주문 이력과 상태를 같은 화면에서 바로 확인할 수 있습니다.</p>
          <div className="page-actions">
            <Link to="/login" className="primary-link">
              로그인하기
            </Link>
            <Link to="/products" className="secondary-link">
              상품 먼저 보기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-page orders-check-page">
      <section className="user-hero page-surface">
        <div className="hero-copy">
          <span className="page-eyebrow">주문 확인</span>
          <h1 className="page-title">내가 담았던 상품 흐름을 한눈에 확인합니다.</h1>
          <p className="page-description">
            주문 수량과 금액, 현재 상태를 한 화면에서 읽기 쉽게 정리했습니다. 복잡한 관리형 표보다 사용자 기준으로
            빠르게 확인되는 카드형 구성을 선택했습니다.
          </p>
          <div className="page-actions">
            <Link to="/products" className="primary-link">
              상품 다시 보기
            </Link>
            <Link to="/about" className="secondary-link">
              서비스 소개 보기
            </Link>
          </div>
        </div>

        <div className="summary-list">
          <div className="summary-card">
            <span className="summary-label">총 주문 수</span>
            <strong className="summary-value">{orders.length}건</strong>
            <span className="summary-note">로그인한 계정과 연결된 주문만 골라서 보여 줍니다.</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">총 주문 금액</span>
            <strong className="summary-value">{priceFormatter.format(totalAmount)}원</strong>
            <span className="summary-note">현재 화면에 보이는 주문 기준 합계입니다.</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">가장 최근 주문</span>
            <strong className="summary-value">{normalizeDate(latestOrder?.date)}</strong>
            <span className="summary-note">최근 주문 시점을 먼저 확인할 수 있게 정렬했습니다.</span>
          </div>
        </div>
      </section>

      {orders.length === 0 ? (
        <div className="empty-state">
          <h2 className="empty-title">아직 확인할 주문이 없습니다.</h2>
          <p className="empty-description">상품 페이지에서 어떤 구성들이 준비되어 있는지 먼저 천천히 둘러보세요.</p>
          <div className="page-actions">
            <Link to="/products" className="primary-link">
              상품 보러가기
            </Link>
          </div>
        </div>
      ) : (
        <section className="user-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">주문 내역</h2>
              <p className="section-description">최근 주문이 위로 오도록 정렬해 현재 상태를 빠르게 확인할 수 있게 했습니다.</p>
            </div>
          </div>

          <div className="record-list">
            {orders.map((order) => (
              <article key={order.id} className="record-card">
                <div className="record-top">
                  <div>
                    <h3 className="record-title">{order.product}</h3>
                    <div className="record-date">{order.date}</div>
                  </div>
                  <span className="status-pill">{order.status}</span>
                </div>

                <div className="record-meta">
                  <div className="record-meta-item">
                    <span className="record-meta-label">주문 번호</span>
                    <strong className="record-meta-value">#{order.id}</strong>
                  </div>
                  <div className="record-meta-item">
                    <span className="record-meta-label">주문 수량</span>
                    <strong className="record-meta-value">{order.quantity}개</strong>
                  </div>
                  <div className="record-meta-item">
                    <span className="record-meta-label">결제 금액</span>
                    <strong className="record-meta-value order-total">{priceFormatter.format(order.price)}원</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default OrdersCheck;
