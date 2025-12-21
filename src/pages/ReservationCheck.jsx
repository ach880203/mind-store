import { useEffect, useState } from "react";
import { getCurrentUser } from "../utils/auth";
import { loadReservations } from "../pages/admin/reservationStorage";
import "./ReservationCheck.css";

const ReservationCheck = () => {
  const [list, setList] = useState([]);
  const me = getCurrentUser();
  /*<div style={{ color: "red", padding: 40 }}>
  ReservationCheck 화면 테스트
</div>  오버레이 테스트용 빨간 화면*/
  console.log("현재 유저:", me);
console.log("전체 예약:", loadReservations());
  useEffect(() => {
    const all = loadReservations();

    const filtered = all.filter(
      (r) =>
        r.userId === me?.user_id &&
        (r.status === "대기" || r.status === "확정")
    );

    setList(filtered);
  }, [me?.user_id]);

  if (!me) {
    return (
      <div className="reservation-check-page">
        <p className="reservation-login-required">
          로그인이 필요합니다.
        </p>
      </div>
    );
  }

        //임시 확인 후 삭제
    //console.log("예약 전체:", loadReservations());
    //console.log("현재 유저:", me);
    console.log("🔥 ReservationCheck 렌더됨");

  return (
    <div className="reservation-check-page" >
      <h2 className="reservation-title">예약 확인</h2>

      {list.length === 0 ? (
        <p className="reservation-empty">
          대기/확정 예약이 없습니다.
        </p>
      ) : (
        <div className="reservation-list">
          {list.map((r) => (
            <div key={r.id} className="reservation-card">
              <div className={`reservation-status ${r.status}`}>
                {r.status}
              </div>

              <div className="reservation-info">
                <div className="reservation-datetime">
                  {r.date} {r.time}
                </div>
                <div className="reservation-title-small">
                  {r.title || "상담 예약"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationCheck;
