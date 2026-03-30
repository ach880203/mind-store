import React, { useCallback, useEffect, useRef, useState } from "react";
import "./CounselingReservation.css";
import counselingdb from "../../../data/counselingdb";
import { Link, useNavigate } from "react-router-dom";
import { motion, useMotionValue } from "framer-motion";
import { getCurrentUser } from "../../../utils/auth";
import {
  addReservation,
  initReservations,
  isReservationTaken,
} from "../../admin/reservationStorage";

const CounselingReservation = ({ counselingId, onClose }) => {
  const navigate = useNavigate();
  const counseling = counselingdb.find(
    (item) => Number(item.id) === Number(counselingId)
  );
  const currentUser = getCurrentUser();

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [reservedInfo, setReservedInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [done, setDone] = useState(false);
  const timeSectionRef = useRef(null);

  const closeReservationPanel = useCallback(() => {
    if (typeof onClose === "function") {
      onClose();
      return;
    }

    navigate("/counseling");
  }, [navigate, onClose]);

  /* ESC 키로 예약 패널을 닫을 수 있게 두면 모바일/데스크톱 모두 흐름이 자연스럽습니다. */
  useEffect(() => {
    initReservations();

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeReservationPanel();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [closeReservationPanel]);

  /* 드래그 값은 패널을 오른쪽으로 밀어서 닫을 때만 사용합니다. */
  const x = useMotionValue(0);

  const getNextDays = (count = 14) => {
    const nextDays = [];
    const today = new Date();

    for (let index = 0; index < count; index += 1) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + index);
      nextDays.push(nextDate);
    }

    return nextDays;
  };

  const timeSlots = [
    { start: "09:00", end: "11:00" },
    { start: "13:00", end: "15:00" },
    { start: "15:00", end: "17:00" },
    { start: "17:00", end: "19:00" },
    { start: "19:00", end: "21:00" },
  ];

  const selectedDateString = selectedDate
    ? [
        selectedDate.getFullYear(),
        String(selectedDate.getMonth() + 1).padStart(2, "0"),
        String(selectedDate.getDate()).padStart(2, "0"),
      ].join("-")
    : "";

  if (done && reservedInfo) {
    return (
      <motion.div
        className="complete"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
      >
        <h1>예약이 완료되었습니다</h1>
        <p>{reservedInfo.title}</p>
        <p>
          {reservedInfo.date.getMonth() + 1}월 {reservedInfo.date.getDate()}일{" "}
          {reservedInfo.time}
        </p>
        <p>예약 시간에 맞춰 방문해주세요.</p>
        <button onClick={() => navigate("/mypage?tab=reservations")}>
          마이페이지에서 확인
        </button>
      </motion.div>
    );
  }

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
          <p>
            예약 내역을 저장하고 마이페이지에서 다시 보려면 로그인 상태가
            필요합니다.
          </p>
          <div className="page-actions">
            <Link to="/login" className="primary-link">
              로그인하기
            </Link>
            <button
              className="secondary-link mypage-action"
              onClick={closeReservationPanel}
            >
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
        onDragEnd={(event, info) => {
          if (info.offset.x > 120) {
            closeReservationPanel();
          }
        }}
        style={{ x }}
      >
        <button className="panel-close" onClick={closeReservationPanel}>
          X
        </button>

        <h1>상담 예약</h1>

        {/* 선택한 상담 상품을 먼저 보여주면 사용자가 다른 상품으로 착각하지 않습니다. */}
        <div className="selected-counseling">
          <h2>선택한 상담 상품</h2>
          <p>{counseling.title}</p>
          <p>
            {counseling.price.toLocaleString()}원 · {counseling.duration}
          </p>
        </div>

        <div className="reservation-container">
          {/* 날짜를 먼저 고르게 해서 시간 버튼이 너무 이르게 활성화되지 않게 막습니다. */}
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

          <div className="time-slots" ref={timeSectionRef}>
            <h2>시간 선택</h2>

            {!selectedDate && (
              <p className="guide">날짜를 먼저 선택해주세요.</p>
            )}

            {selectedDate &&
              timeSlots.map((slot) => {
                const isTaken = isReservationTaken({
                  counselingId: counseling.id,
                  date: selectedDateString,
                  time: slot.start,
                });

                return (
                  <button
                    key={slot.start}
                    type="button"
                    className={`time-btn ${
                      selectedTime === slot.start ? "active" : ""
                    }`}
                    disabled={isTaken}
                    onClick={() => {
                      setSelectedTime(slot.start);
                      setErrorMessage("");
                    }}
                  >
                    {isTaken
                      ? `${slot.start} ~ ${slot.end} (예약 마감)`
                      : `${slot.start} ~ ${slot.end}`}
                  </button>
                );
              })}
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
                setErrorMessage(
                  error.message || "예약 처리 중 문제가 발생했습니다."
                );
              }
            }}
          >
            예약 확정
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CounselingReservation;
