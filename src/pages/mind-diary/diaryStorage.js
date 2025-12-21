const LS_KEY= "mind_diary_v2";


// ✅ 읽기
export const loadDiaries = () => {
  return JSON.parse(localStorage.getItem(LS_KEY)) || [];
};

// ✅ 쓰기
export const saveDiary = (data) => {
  const prev = loadDiaries();

  const entry = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    comments: [],
    isRead: false,
    ...data,
  };

  localStorage.setItem(
    LS_KEY,
    JSON.stringify([entry, ...prev])
  );
};

// 댓글 추가
export const addComment = (diaryId, comment) => {
  const diaries = loadDiaries().map((d) =>
    d.id === diaryId
      ? { ...d, comments: [...d.comments, comment],
        isRead: false, //댓글 추가시 안읽음으로 전환
        Highlight: true, // 새 댓글  등록하면 강조 알림
       }
      : d

  );
  localStorage.setItem(LS_KEY, JSON.stringify(diaries));
};


// ✅ 삭제
export const deleteDiary = (id) => {
  const prev = loadDiaries();
  const next = prev.filter((d) => String(d.id) !== String(id));
  localStorage.setItem(LS_KEY, JSON.stringify(next));
};

export const setDiaryRead = (id, isRead) => {
  const diaries = loadDiaries();
  const next = diaries.map(d =>
    d.id === id ? { ...d, isRead } : d
  );
  // ⚠️ 너희 diaryStorage.js 안에 있는 "저장" 로직/키 방식 그대로 사용해야 함
  // 보통은 localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) 형태일 거야.
  localStorage.setItem(LS_KEY, JSON.stringify(next)); // ✅ 너희 키가 다르면 여기만 바꿔!
  return next;
};

export const toggleDiaryRead = (id) => {
  const diaries = loadDiaries();
  const target = diaries.find(d => d.id === id);
  const nextRead = !(target?.isRead ?? false);
  return setDiaryRead(id, nextRead);
};

