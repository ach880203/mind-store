import reservationsdb from "../../data/reservationsdb";
import { getCurrentUser } from "../../utils/auth";

const LS_KEY = "mind_reservations_v1";

/* --------------------------------
   초기화 (한 번만)
--------------------------------- */
export const initReservations = (seed = reservationsdb) => {
  const saved = localStorage.getItem(LS_KEY);
  if (!saved) {
    localStorage.setItem(LS_KEY, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(saved);
};

/* --------------------------------
   읽기
--------------------------------- */
export const loadReservations = () => {
  return JSON.parse(localStorage.getItem(LS_KEY)) || [];
};

/* --------------------------------
   전체 저장 (관리자/일괄 수정용)
--------------------------------- */
export const saveReservations = (list) => {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
  return list;
};

/* --------------------------------
   ✅ 예약 추가 (유저 연동 핵심)
--------------------------------- */
export const addReservation = (data) => {
  const user = getCurrentUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  const prev = loadReservations();
  const hasDuplicateReservation = prev.some(
    (reservation) =>
      reservation.counselingId === data.counselingId &&
      reservation.date === data.date &&
      reservation.time === data.time &&
      reservation.status !== "취소"
  );

  // 예약 프로젝트라도 같은 시간대를 중복으로 받아버리면 너무 데모처럼 보입니다.
  // 최소한의 슬롯 중복 체크를 넣어 예약 흐름이 자연스럽게 이어지도록 합니다.
  if (hasDuplicateReservation) {
    throw new Error("선택한 날짜와 시간은 이미 예약이 완료되었습니다.");
  }

  const reservation = {
    id: Date.now(),
    userId: user.user_id,     // ⭐ ReservationCheck 필터 기준
    userName: user.nick,      // 관리자 화면 표시용
    status: "대기",           // 기본 상태
    createdAt: Date.now(),
    ...data,                  // date, time, counselingId, title 등
  };

  const next = [reservation, ...prev];
  saveReservations(next);
  return reservation;
};

export const isReservationTaken = ({ counselingId, date, time }) => {
  return loadReservations().some(
    (reservation) =>
      reservation.counselingId === counselingId &&
      reservation.date === date &&
      reservation.time === time &&
      reservation.status !== "취소"
  );
};

/* --------------------------------
   상태 업데이트 (관리자 ↔ 유저 연동)
--------------------------------- */
export const updateReservationStatus = (id, status) => {
  const next = loadReservations().map(r =>
    r.id === id ? { ...r, status } : r
  );
  saveReservations(next);
  return next;
};
