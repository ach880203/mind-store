import React, { useEffect, useState } from "react";
import counselingdb from "../data/counselingdb";
import "./Counseling.css"
import { AnimatePresence, motion } from "framer-motion"
import CounselingDetail from "./CounselingDetail";
import CounselingReservation from "./CounselingReservation";

const Counseling = () => {
    const [selectedId, setSelectedId] = useState(null);
    const [showReserve, setShowReserve] = useState(false);

    /* esc 순서 대로 닫기 */
    useEffect(() => {
        const handler = (e) => {
            if(e.key !== "Escape") return;
        
            if(showReserve) {
                setShowReserve(false);
            } else if (selectedId) {
                setSelectedId(null);
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
        }, [showReserve, selectedId]);
        
    /* esc 순서 대로 닫기 */

    return (
    <div className="counseling-page">
        <div className={`counseling ${selectedId ? "has-detail" : ""} ${showReserve ? "has-reserve" : ""}`}>
        <h1>상담 상품</h1>

        <div className="counseling-list">
        {counselingdb.map((c) => (
            <motion.div 
                key={c.id} 
                layoutId={`counseling-${c.id}`}  
                className={`counseling-card ${
                    selectedId && selectedId !== c.id ? "dimmed" : ''
                }`}
                onClick={() => setSelectedId(c.id)}
                whileHover={{ scale: 1.02 }}
            >
                <h2>{c.title}</h2>
                <p>{c.summary}</p>
                <p className="price">
                    {c.price.toLocaleString()}원. {c.duration}
                </p>
                
                <button className="detail-btn">
                    자세히 보기
                </button>
            </motion.div>
        ))}
        </div>
    <AnimatePresence>
    {selectedId && !showReserve && (
        <>
        <div className="overlay" 
            onClick={() => {
                setShowReserve(false);
                setSelectedId(null);}} />
                
        <motion.div
            layoutId={`counseling-${selectedId}`}
            className="detail-card"
            initial={{ x: -60, opacity: 0}}
            animate={{ x:0, opacity: 1}}
            exit={{ x: -60, opacity: 0}}
            transition={{duration: 0.35}}
            onClick={(e) => e.stopPropagation()}
            >
            <CounselingDetail
                id={selectedId}
                onClose={() => setSelectedId(null)}
                onReserve={() => setShowReserve(true)}
            />
        </motion.div>
        </>
    )}
    </AnimatePresence>

    <AnimatePresence>
    {showReserve && (
        <motion.div
            key="reserve"
            className="reservation-panel"
            initial={{ x : "100%" }}
            animate={{ x : 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4}}
        >
            <CounselingReservation
                counselingId={selectedId}
                onClose={() => setShowReserve(false)}/>
        </motion.div>
    )}
    </AnimatePresence>
</div>
</div>

    );
};
export default Counseling;