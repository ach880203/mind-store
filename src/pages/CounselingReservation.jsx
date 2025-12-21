import React, { useEffect, useRef, useState } from "react";
import "./CounselingReservation.css";
import counselingdb from "../data/counselingdb";
import { motion, useMotionValue } from "framer-motion";

const CounselingReservation = ({ counselingId, onClose }) => {
  const counseling = counselingdb.find((c) => Number(c.id) === Number(counselingId));

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [reservedInfo, setReservedInfo] = useState(null);
  const timeSectionRef = useRef(null);

        /* esc키로 창 닫기 */
  useEffect(() => {
    const handler = (e) => {
      if ( e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);}, [onClose]);
  /* end esc키로 창 닫기 */

  /* 모바일 스와이프로 창 닫기 */
  const X = useMotionValue(0);

    <motion.div
        className="reservation"
        drag="X"
        dragConstraints={{left: 0, right: 0}}
        onDragEnd={(e, info) => {
          if (info.offset.x > 120) onClose();
        }} style={{ X }}/>
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
        <p>늦지 않게 방문해 주세요.</p>
        </p>
        <button onClick={onClose}>확인</button>
      </motion.div>
    );
  }
  /* end 예약 완료 메세지 */

  return (
    <div className="counseling-page">
    <div className="reservation">

      <button className="panel-close" onClick={onClose}>X</button>

      <h1>상담 예약</h1>

      {/* 선택한 상담 상품 표시*/}
      {counseling && (
        <div className="selected-counseling">
          <h2>선택한 상담 상품</h2>
          <p>{counseling.title}</p>
          <p>
            {counseling.price.toLocaleString()}원 . {counseling.duration}
          </p>
        </div>
      )}

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
                    console.log("🔥 날짜 클릭됨", date);
                  setSelectedDate(date);
                  setSelectedTime(null);

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
                    console.log("🔥 시간 클릭됨", slot.start);
                    setSelectedTime(slot.start);}}
              >
                {slot.start} ~ {slot.end}
              </button>
            ))}
        </div>
        <button
          className="confirm-btn"
          disabled={!selectedDate || !selectedTime}
          onClick={() => {
            console.log("counseling :", counseling)

            if (!counseling) return;

            console.log("예약확정 클릭됨");

            setReservedInfo({
              title: counseling.title,
              date: selectedDate,
              time: selectedTime,
              
            });

            setDone(true);
          }}
        >
           예약확정
        </button>
      </div>
    </div>
  </div>  
  );
};

export default CounselingReservation;
