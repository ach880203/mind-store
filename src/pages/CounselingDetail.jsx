import React, { useEffect } from "react";
import counselingdb from "../data/counselingdb";
import "./CounselingDetail.css";
import { motion, useMotionValue } from "framer-motion";

const CounselingDetail = ({ id, onClose, onReserve }) => {
  console.log("받은 id:", id);

  const counseling = counselingdb.find(
    c => Number(c.id) === Number(id)
  );

          /* esc키로 창 닫기 */
    useEffect(() => {
      const handler = (e) => {
        if ( e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);}, [onClose]);
    /* end esc키로 창 닫기 */

    const X = useMotionValue(0);

    <motion.div
        className="reservation"
        drag="X"
        dragConstraints={{left: 0, right: 0}}
        onDragEnd={(e, info) => {
          if (info.offset.x > 120) onClose();
        }} style={{ X }}/>
  /* end 모바일 스와이프로 창 닫기 */

  console.log("찾은 counseling:", counseling);

  if (!counseling) {
    return (
      <div className="detail-content">
        <p>상담 데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="detail-content">
        <button className="close-btn" onClick={onClose}>X</button>

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
