import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import counselingdb from "../data/counselingdb";
import { getCurrentUser, setCurrentUser } from "../utils/auth";
import {
  initUsers,
  isDuplicateNick,
  loadUsers,
  updateUser,
} from "../utils/userStore";
import {
  initOrders,
  loadOrders,
} from "../utils/orderStore";
import { findProduct } from "../utils/productStore";
import {
  initReservations,
  loadReservations,
} from "./admin/reservationStorage";
import { loadDiaries } from "./mind-diary/diaryStorage";
import "./UserPage.css";
import "./MyPage.css";

const TAB_ITEMS = [
  { key: "reservations", label: "예약 내역" },
  { key: "orders", label: "주문 내역" },
  { key: "diaries", label: "내가 쓴 일기" },
  { key: "profile", label: "회원정보 수정" },
];

const counselingMap = new Map(counselingdb.map((item) => [String(item.id), item]));
const priceFormatter = new Intl.NumberFormat("ko-KR");

const toReservationTime = (date, time = "00:00") =>
  new Date(`${date}T${time}`).getTime();

const toOrderTime = (value) =>
  new Date(String(value || "").replace(" ", "T")).getTime();

const buildUserKeys = (user) => {
  const matchedUser = loadUsers().find((item) => item.user_id === user?.user_id);

  return new Set(
    [user?.user_id, user?.nick, user?.name, matchedUser?.nick, matchedUser?.name]
      .filter(Boolean)
      .map((value) => String(value))
  );
};

const MyPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [me, setMe] = useState(getCurrentUser());
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const menuRef = useRef(null);

  const activeTab = TAB_ITEMS.some((item) => item.key === searchParams.get("tab"))
    ? searchParams.get("tab")
    : "reservations";

  const [profileForm, setProfileForm] = useState({
    name: "",
    nick: "",
    phone: "",
    email: "",
    address: "",
    user_pw: "",
  });

  useEffect(() => {
    initUsers();
    initOrders();
    initReservations();
    setMe(getCurrentUser());
  }, []);

  useEffect(() => {
    if (!me) {
      return;
    }

    const freshUser =
      loadUsers().find((user) => user.user_id === me.user_id) ?? me;

    setProfileForm({
      name: freshUser.name ?? "",
      nick: freshUser.nick ?? "",
      phone: freshUser.phone ?? "",
      email: freshUser.email ?? "",
      address: freshUser.address ?? "",
      user_pw: freshUser.user_pw ?? "",
    });
  }, [me]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const userKeys = useMemo(() => buildUserKeys(me), [me]);

  const reservations = useMemo(() => {
    if (!me) {
      return [];
    }

    return loadReservations()
      .filter(
        (reservation) =>
          userKeys.has(String(reservation.userId)) ||
          userKeys.has(String(reservation.userName))
      )
      .sort(
        (left, right) =>
          toReservationTime(right.date, right.time) -
          toReservationTime(left.date, left.time)
      );
  }, [me, userKeys]);

  const orders = useMemo(() => {
    if (!me) {
      return [];
    }

    return loadOrders()
      .filter(
        (order) =>
          userKeys.has(String(order.userId)) ||
          userKeys.has(String(order.userNick)) ||
          userKeys.has(String(order.user))
      )
      .sort((left, right) => toOrderTime(right.date) - toOrderTime(left.date));
  }, [me, userKeys]);

  const diaries = useMemo(() => {
    if (!me?.user_id) {
      return [];
    }

    return loadDiaries()
      .filter((diary) => diary.userId === me.user_id)
      .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
  }, [me]);

  const upcomingReservations = reservations.filter(
    (reservation) => toReservationTime(reservation.date, reservation.time) >= Date.now()
  ).length;

  const changeTab = (nextTab) => {
    setSearchParams({ tab: nextTab });
    setMenuOpen(false);
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSaveMessage("");
    setSaveError("");
  };

  const handleProfileSave = () => {
    if (!me) {
      setSaveError("로그인 상태를 먼저 확인해 주세요.");
      return;
    }

    if (!profileForm.name.trim() || !profileForm.nick.trim()) {
      setSaveError("이름과 닉네임은 반드시 입력해 주세요.");
      return;
    }

    if (isDuplicateNick(profileForm.nick.trim(), me.user_id)) {
      setSaveError("이미 사용 중인 닉네임입니다.");
      return;
    }

    const updatedUser = updateUser(me.user_id, {
      name: profileForm.name.trim(),
      nick: profileForm.nick.trim(),
      phone: profileForm.phone.trim(),
      email: profileForm.email.trim(),
      address: profileForm.address.trim(),
      user_pw: profileForm.user_pw,
    });

    if (!updatedUser) {
      setSaveError("회원정보 저장에 실패했습니다.");
      return;
    }

    setCurrentUser(updatedUser);
    setMe(updatedUser);
    setSaveMessage("회원정보가 저장되었습니다.");
  };

  if (!me) {
    return (
      <div className="user-page my-page">
        <div className="empty-state">
          <h2 className="empty-title">마이페이지는 로그인 후 이용할 수 있습니다.</h2>
          <p className="empty-description">
            예약 내역, 주문 내역, 회원정보 수정은 같은 계정 기준으로 한 화면에서 확인할 수 있습니다.
          </p>
          <div className="page-actions">
            <Link to="/login" className="primary-link">
              로그인하기
            </Link>
            <Link to="/signup" className="secondary-link">
              회원가입하기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-page my-page">
      <section className="user-hero page-surface">
        <div className="hero-copy">
          <span className="page-eyebrow">마이페이지</span>
          <h1 className="page-title">{me.nick}님의 마이페이지</h1>
          <div className="page-actions">
            <button type="button" className="primary-link mypage-action" onClick={() => changeTab("reservations")}>
              예약 내역 보기
            </button>
            <button type="button" className="secondary-link mypage-action" onClick={() => changeTab("diaries")}>
              내가 쓴 일기
            </button>
          </div>
        </div>

        <div className="summary-list">
          <div className="summary-card">
            <span className="summary-label">예약 건수</span>
            <strong className="summary-value">{reservations.length}건</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">다가오는 일정</span>
            <strong className="summary-value">{upcomingReservations}건</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">주문 내역</span>
            <strong className="summary-value">{orders.length}건</strong>
          </div>
        </div>
      </section>

      <section className="user-section">
        <div className="mypage-tab-bar">
          <h2 className="section-title">내 기록 보기</h2>

          <div className={`mypage-dropdown ${menuOpen ? "open" : ""}`} ref={menuRef}>
            <button
              type="button"
              className="mypage-dropdown-button"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              {TAB_ITEMS.find((item) => item.key === activeTab)?.label}
              <span className="mypage-dropdown-arrow">{menuOpen ? "▲" : "▼"}</span>
            </button>

            {menuOpen && (
              <div className="mypage-dropdown-menu">
                {TAB_ITEMS.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    className={`mypage-dropdown-item ${activeTab === item.key ? "active" : ""}`}
                    onClick={() => changeTab(item.key)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {activeTab === "reservations" && (
          <>
            {reservations.length === 0 ? (
              <div className="empty-state">
                <h3 className="empty-title">아직 예약한 상담이 없습니다.</h3>
                <div className="page-actions">
                  <Link to="/counseling" className="primary-link">
                    상담 보러가기
                  </Link>
                </div>
              </div>
            ) : (
              <div className="record-list">
                {reservations.map((reservation) => {
                  const counseling = counselingMap.get(String(reservation.counselingId));

                  return (
                    <article key={reservation.id} className="record-card">
                      <div className="record-top">
                        <div>
                          <h3 className="record-title">
                            {reservation.title || counseling?.title || "상담 예약"}
                          </h3>
                          <div className="record-date">
                            {reservation.date} {reservation.time}
                          </div>
                        </div>
                        <span className="status-pill">{reservation.status}</span>
                      </div>

                      <div className="record-meta">
                        <div className="record-meta-item">
                          <span className="record-meta-label">예약 번호</span>
                          <strong className="record-meta-value">#{reservation.id}</strong>
                        </div>
                        <div className="record-meta-item">
                          <span className="record-meta-label">상담 종류</span>
                          <strong className="record-meta-value">
                            {counseling?.title || "개별 상담"}
                          </strong>
                        </div>
                        <div className="record-meta-item">
                          <span className="record-meta-label">현재 상태</span>
                          <strong className="record-meta-value">{reservation.status}</strong>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab === "orders" && (
          <>
            {orders.length === 0 ? (
              <div className="empty-state">
                <h3 className="empty-title">아직 주문한 상품이 없습니다.</h3>
                <div className="page-actions">
                  <Link to="/products" className="primary-link">
                    상품 보러가기
                  </Link>
                </div>
              </div>
            ) : (
              <div className="record-list">
                {orders.map((order) => (
                  <article
                    key={order.id}
                    className="record-card clickable-record"
                    onClick={() => {
                      const matchedProduct = findProduct({
                        productId: order.productId,
                        productName: order.product,
                      });

                      const query = matchedProduct
                        ? `id=${matchedProduct.id}`
                        : `name=${encodeURIComponent(order.product)}`;

                      navigate(`/products/detail?${query}&from=mypage`);
                    }}
                  >
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
                        <strong className="record-meta-value">
                          {priceFormatter.format(order.price)}원
                        </strong>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "diaries" && (
          <>
            {diaries.length === 0 ? (
              <div className="empty-state">
                <h3 className="empty-title">아직 작성한 일기가 없습니다.</h3>
                <div className="page-actions">
                  <Link to="/mind-diary" className="primary-link">
                    마음일기 보러가기
                  </Link>
                </div>
              </div>
            ) : (
              <div className="record-list">
                {diaries.map((diary) => (
                  <article
                    key={diary.id}
                    className="record-card clickable-record"
                    onClick={() => navigate(`/mind-diary?diaryId=${diary.id}`)}
                  >
                    <div className="record-top">
                      <div>
                        <h3 className="record-title">내가 쓴 마음일기</h3>
                        <div className="record-date">
                          {new Date(diary.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <span className="status-pill">{diary.emotion}</span>
                    </div>

                    <div className="record-meta">
                      <div className="record-meta-item">
                        <span className="record-meta-label">있었던 일</span>
                        <strong className="record-meta-value diary-snippet">
                          {diary.event || "기록 없음"}
                        </strong>
                      </div>
                      <div className="record-meta-item">
                        <span className="record-meta-label">느껴진 감정</span>
                        <strong className="record-meta-value diary-snippet">
                          {diary.emotionDetail || diary.emotion || "기록 없음"}
                        </strong>
                      </div>
                      <div className="record-meta-item">
                        <span className="record-meta-label">대화 수</span>
                        <strong className="record-meta-value">
                          {Array.isArray(diary.comments) ? diary.comments.length : 0}
                        </strong>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "profile" && (
          <div className="page-surface profile-card">
            <div className="section-header">
              <h2 className="section-title">회원정보 수정</h2>
            </div>

            <div className="profile-grid">
              <label className="profile-field">
                <span>이름</span>
                <input name="name" value={profileForm.name} onChange={handleProfileChange} />
              </label>
              <label className="profile-field">
                <span>아이디</span>
                <input value={me.user_id} readOnly className="readonly-field" />
              </label>
              <label className="profile-field">
                <span>닉네임</span>
                <input name="nick" value={profileForm.nick} onChange={handleProfileChange} />
              </label>
              <label className="profile-field">
                <span>전화번호</span>
                <input name="phone" value={profileForm.phone} onChange={handleProfileChange} />
              </label>
              <label className="profile-field">
                <span>이메일</span>
                <input name="email" value={profileForm.email} onChange={handleProfileChange} />
              </label>
              <label className="profile-field">
                <span>비밀번호</span>
                <input
                  type="password"
                  name="user_pw"
                  value={profileForm.user_pw}
                  onChange={handleProfileChange}
                />
              </label>
              <label className="profile-field profile-field-wide">
                <span>주소</span>
                <input name="address" value={profileForm.address} onChange={handleProfileChange} />
              </label>
            </div>

            <div className="profile-meta">
              <span>가입일: {me.reg_date || "기록 없음"}</span>
              <button type="button" className="primary-link mypage-action" onClick={handleProfileSave}>
                저장하기
              </button>
            </div>

            {saveMessage && <p className="profile-message success">{saveMessage}</p>}
            {saveError && <p className="profile-message error">{saveError}</p>}
          </div>
        )}
      </section>
    </div>
  );
};

export default MyPage;
