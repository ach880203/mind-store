import React, { useCallback, useEffect, useRef, useState } from "react";
import "./CounselingReservation.css";
import counselingdb from "../data/counselingdb";
import { Link, useNavigate } from "react-router-dom";
import { motion, useMotionValue } from "framer-motion";
import { getCurrentUser } from "../utils/auth";
import { addReservation, initReservations } from "./admin/reservationStorage";

const CounselingReservation = ({ counselingId, onClose }) => {
  const navigate = useNavigate();
  const counseling = counselingdb.find((c) => Number(c.id) === Number(counselingId));
  const currentUser = getCurrentUser();

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [reservedInfo, setReservedInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const timeSectionRef = useRef(null);

  const closeReservationPanel = useCallback(() => {
    if (typeof onClose === "function") {
      onClose();
      return;
    }

    navigate("/counseling");
  }, [navigate, onClose]);

        /* esc키로 창 닫기 */
  useEffect(() => {
    initReservations();
    const handler = (e) => {
      if ( e.key === "Escape") closeReservationPanel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);}, [closeReservationPanel]);
  /* end esc키로 창 닫기 */

  /* 모바일 스와이프로 창 닫기 */
  const X = useMotionValue(0);
  /* end 모바일 스와이프로 창 닫기 */

  const getNextDays = (count = 14) => {
    const days = [];
    const today = new Date();

    for (let i = 0; i < count; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const timeSlots = [
    { start: "09:00", end: "11:00" },
    { start: "13:00", end: "15:00" },
    { start: "15:00", end: "17:00" },
    { start: "17:00", end: "19:00" },
    { start: "19:00", end: "21:00" },
  ];


  /* 예약 완료 메세지 */
  const [done, setDone] = useState(false);
  console.log("done:", done, "reservedInfo :", reservedInfo);

  if (done && reservedInfo) {
    return (
      <motion.div
        className="complete"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
      >
        <h1>예약이 완료되었어요 🌿</h1>
        <p>{reservedInfo.title}</p>
        <p>
          {reservedInfo.date.getMonth() + 1}월 {reservedInfo.date.getDate()}일{" "}
          {reservedInfo.time}
        </p>
        <p>늦지 않게 방문해 주세요.</p>
        <button onClick={() => navigate("/mypage?tab=reservations")}>마이페이지에서 확인</button>
      </motion.div>
    );
  }
  /* end 예약 완료 메세지 */

  if (!counseling) {
    return (
      <div className="counseling-page">
        <div className="reservation">
          <h1>상담 예약</h1>
          <p>선택한 상담 상품 정보를 찾을 수 없습니다.</p>
          <button className="confirm-btn" onClick={closeReservationPanel}>
            상담 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="counseling-page">
        <div className="reservation">
          <h1>상담 예약</h1>
          <p>예약 내역을 기억하고 마이페이지에서 다시 보려면 로그인 상태가 필요합니다.</p>
          <div className="page-actions">
            <Link to="/login" className="primary-link">
              로그인하기
            </Link>
            <button className="secondary-link mypage-action" onClick={closeReservationPanel}>
              상담 화면으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="counseling-page">
    <motion.div
      className="reservation"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(e, info) => {
        if (info.offset.x > 120) closeReservationPanel();
      }}
      style={{ x: X }}
    >

      <button className="panel-close" onClick={closeReservationPanel}>X</button>

      <h1>상담 예약</h1>

      {/* 선택한 상담 상품 표시*/}
      <div className="selected-counseling">
        <h2>선택한 상담 상품</h2>
        <p>{counseling.title}</p>
        <p>
          {counseling.price.toLocaleString()}원 . {counseling.duration}
        </p>
      </div>

      <div className="reservation-container">
        {/* 날짜 선택 */}
        <div className="calendar">
          <h2>날짜 선택</h2>

          <div className="calendar-grid">
            {getNextDays().map((date) => (
              <button
                key={date.toDateString()}
                className="date-btn"
                onClick={() => {
                  setSelectedDate(date);
                  setSelectedTime(null);
                  setErrorMessage("");

                  // 날짜를 선택 하면 → 시간 선택으로 이동
                  setTimeout(() => {
                      timeSectionRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                        });
                      }, 100);
                  }}
              >
                {date.getMonth() + 1}/{date.getDate()}
              </button>
            ))}
          </div>
          {selectedDate && (
            <p className="selected-date">
              선택한 날짜 : {selectedDate.getMonth() + 1}월{" "}
              {selectedDate.getDate()}일
            </p>
          )}
        </div>

        {/* 시간 선택 */}
        <div className="time-slots" ref={timeSectionRef}>
          <h2>시간 선택</h2>

          {!selectedDate && <p className="guide">날짜를 먼저 선택하세요.</p>}

          {selectedDate &&
            timeSlots.map((slot) => (
              <button
                key={slot.start}
                className={`time-btn ${
                  selectedTime === slot.start ? "active" : ""
                }`}
                onClick={() => {
                    setSelectedTime(slot.start);
                    setErrorMessage("");
                  }}
              >
                {slot.start} ~ {slot.end}
              </button>
            ))}
        </div>
        {errorMessage && <p className="guide">{errorMessage}</p>}
        <button
          className="confirm-btn"
          disabled={!selectedDate || !selectedTime}
          onClick={() => {
            try {
              addReservation({
                counselingId: counseling.id,
                title: counseling.title,
                date: [
                  selectedDate.getFullYear(),
                  String(selectedDate.getMonth() + 1).padStart(2, "0"),
                  String(selectedDate.getDate()).padStart(2, "0"),
                ].join("-"),
                time: selectedTime,
              });

              setReservedInfo({
                title: counseling.title,
                date: selectedDate,
                time: selectedTime,
              });

              setDone(true);
            } catch (error) {
              setErrorMessage(error.message || "예약 저장 중 문제가 발생했습니다.");
            }
          }}
        >
           예약확정
        </button>
      </div>
    </motion.div>
  </div>  
  );
};

export default CounselingReservation;
