import React, { useEffect } from "react";
import counselingdb from "../../../data/counselingdb";
import "./CounselingDetail.css";

const CounselingDetail = ({ id, onClose, onReserve }) => {
  const counseling = counselingdb.find(
    (item) => Number(item.id) === Number(id)
  );

  /* ESC 키로 패널을 닫을 수 있게 두면 마우스 없이도 쉽게 빠져나올 수 있습니다. */
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && typeof onClose === "function") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!counseling) {
    return (
      <div className="detail-content">
        <p>상담 정보를 불러오지 못했습니다.</p>
      </div>
    );
  }

  return (
    <div className="detail-content">
      <button className="close-btn" onClick={onClose}>
        X
      </button>

      <span className="category">상담 상품</span>
      <h1>{counseling.title}</h1>

      <p className="description">{counseling.description}</p>

      <div className="meta">
        <span>{counseling.duration}</span>
        <span>{counseling.price.toLocaleString()}원</span>
      </div>

      <button className="reserve-btn" onClick={onReserve}>
        예약하기
      </button>
    </div>
  );
};

export default CounselingDetail;
