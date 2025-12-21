import { createContext, useContext, useEffect, useState } from "react";
import { loadDiaries, saveDiary } from "../pages/mind-diary/diaryStorage";

const DiaryContext = createContext();

export const DiaryProvider = ({ children }) => {
  const [diaries, setDiaries] = useState([]);
  const [selectedDiaryId, setSelectedDiaryId] = useState(null);

  /* -------------------------------
     초기 로딩
  -------------------------------- */
  useEffect(() => {
    setDiaries(loadDiaries());
  }, []);

  /* -------------------------------
     선택된 일기 자동 정리
  -------------------------------- */
  useEffect(() => {
    if (!selectedDiaryId) return;
    const exists = diaries.some(d => d.id === selectedDiaryId);
    if (!exists) setSelectedDiaryId(null);
  }, [diaries, selectedDiaryId]);

  /* ===============================
     액션들
  =============================== */

  const selectDiary = (id) => {
    setSelectedDiaryId(id);
    setDiaries(prev =>
      prev.map(d =>
        d.id === id ? { ...d, isRead: true } : d
      )
    );
  };

  const addDiary = (data) => {
    saveDiary(data);
    setDiaries(loadDiaries());
  };

  const addComment = (diaryId, comment) => {
    const updated = diaries.map(d =>
      d.id === diaryId
        ? {
            ...d,
            comments: [...(d.comments || []), comment],
            isRead: false,
          }
        : d
    );
    setDiaries(updated);
  };

  return (
    <DiaryContext.Provider
      value={{
        diaries,
        selectedDiaryId,
        selectedDiary:
          diaries.find(d => d.id === selectedDiaryId) || null,
        selectDiary,
        addDiary,
        addComment,
      }}
    >
      {children}
    </DiaryContext.Provider>
  );
};

export const useDiary = () => useContext(DiaryContext);
