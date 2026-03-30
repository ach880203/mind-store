import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import counselingdb from "../../../data/counselingdb";
import usersdb from "../../../data/usersdb";
import { getCurrentUser } from "../../../utils/auth";
import { loadReservations } from "../../admin/reservationStorage";
import "../shared/UserPage.css";
import "./ReservationCheck.css";

const buildUserKeys = (user) => {
  const matchedUser = usersdb.find((item) => item.user_id === user?.user_id);

  return new Set(
    [user?.user_id, user?.nick, matchedUser?.nick, matchedUser?.name]
      .filter(Boolean)
      .map((value) => String(value))
  );
};

const toDateTime = (date, time = "00:00") => new Date(`${date}T${time}`);

const ReservationCheck = () => {
  const [list, setList] = useState([]);
  const me = getCurrentUser();
  /*<div style={{ color: "red", padding: 40 }}>
  ReservationCheck ?붾㈃ ?뚯뒪??
</div>  ?ㅻ쾭?덉씠 ?뚯뒪?몄슜 鍮④컙 ?붾㈃*/
  useEffect(() => {
    if (!me) {
      setList([]);
      return;
    }

    const userKeys = buildUserKeys(me);
    const filtered = loadReservations()
      .filter(
        (reservation) =>
          userKeys.has(String(reservation.userId)) || userKeys.has(String(reservation.userName))
      )
      .sort((left, right) => toDateTime(right.date, right.time) - toDateTime(left.date, left.time));

    setList(filtered);
  }, [me]);

  if (!me) {
    return (
      <div className="user-page reservation-check-page">
        <div className="empty-state">
          <h2 className="empty-title">예약 확인은 로그인 후 이용할 수 있습니다.</h2>
          <p className="empty-description">로그인하면 내가 신청한 상담 일정을 같은 화면에서 바로 확인할 수 있습니다.</p>
          <div className="page-actions">
            <Link to="/login" className="primary-link">
              로그인하기
            </Link>
            <Link to="/counseling" className="secondary-link">
              상담 보러가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const upcomingCount = list.filter((reservation) => toDateTime(reservation.date, reservation.time) >= new Date()).length;
  const latestReservation = list[0];

  return (
    <div className="user-page reservation-check-page">
      <section className="user-hero page-surface">
        <div className="hero-copy">
          <span className="page-eyebrow">예약 확인</span>
          <h1 className="page-title">내 상담 일정과 상태를 한 화면에서 확인합니다.</h1>
          <p className="page-description">
            예약 일시와 현재 상태를 카드 단위로 정리해 두었습니다. 관리 화면처럼 빽빽한 표 대신, 사용자가 필요한 정보만
            바로 읽을 수 있도록 구성했습니다.
          </p>
          <div className="page-actions">
            <Link to="/counseling" className="primary-link">
              상담 다시 보기
            </Link>
            <Link to="/mind-diary" className="secondary-link">
              마음일기 쓰기
            </Link>
          </div>
        </div>

        <div className="summary-list">
          <div className="summary-card">
            <span className="summary-label">전체 예약</span>
            <strong className="summary-value">{list.length}건</strong>
            <span className="summary-note">로그인한 사용자와 연결된 예약만 모아 보여 줍니다.</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">다가오는 일정</span>
            <strong className="summary-value">{upcomingCount}건</strong>
            <span className="summary-note">현재 시점 이후 일정만 따로 계산했습니다.</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">가장 최근 예약</span>
            <strong className="summary-value">
              {latestReservation ? `${latestReservation.date} ${latestReservation.time}` : "기록 없음"}
            </strong>
            <span className="summary-note">최근 예약을 먼저 확인할 수 있게 정렬했습니다.</span>
          </div>
        </div>
      </section>

      {list.length === 0 ? (
        <div className="empty-state">
          <h2 className="empty-title">아직 확인할 예약이 없습니다.</h2>
          <p className="empty-description">상담 상품을 둘러보고 지금 필요한 상담부터 천천히 골라 보세요.</p>
          <div className="page-actions">
            <Link to="/counseling" className="primary-link">
              상담 상품 보기
            </Link>
          </div>
        </div>
      ) : (
        <section className="user-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">예약 내역</h2>
              <p className="section-description">날짜, 시간, 상태, 상담 종류를 빠르게 읽을 수 있도록 카드형으로 정리했습니다.</p>
            </div>
          </div>

          <div className="record-list">
            {list.map((reservation) => {
              const counseling = counselingdb.find(
                (item) => String(item.id) === String(reservation.counselingId)
              );

              return (
                <article key={reservation.id} className="record-card">
                  <div className="record-top">
                    <div>
                      <h3 className="record-title">{reservation.title || counseling?.title || "상담 예약"}</h3>
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
                      <strong className="record-meta-value">{counseling?.title || "개별 상담"}</strong>
                    </div>
                    <div className="record-meta-item">
                      <span className="record-meta-label">예약 상태</span>
                      <strong className="record-meta-value">{reservation.status}</strong>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default ReservationCheck;
