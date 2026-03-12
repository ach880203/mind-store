import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import DiaryList from "./DiaryList";
import DiaryWrite from "./DiaryWrite";
import DiaryDetail from "./DiaryDetail";
import DiaryPasswordModal from "./DiaryPasswordModal";
import { loadDiaries, saveDiary, deleteDiary, toggleDiaryRead } from "./diaryStorage"; //setDiaryRead <- 바로 읽음처리 할때 사용
import DiarySendResult from "./DiarySendResult";

import "./MindDiary.base.css";
import { getCurrentUser } from "../../utils/auth";

const PAGE_SIZE = 5;

const MindDiaryHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  /** 화면 모드 */
  const [mode, setMode] = useState("list"); // list | write | password | detail | result

  /** 전체 일기 데이터 */
  const [diaries, setDiaries] = useState([]);

  /** 선택된 일기 (상세 보기용) */
  const [selectedDiary, setSelectedDiary] = useState(null);

  /** 비밀번호 확인 대상 */
  const [passwordTarget, setPasswordTarget] = useState(null);

  /** 검색/페이징 */
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    unreadOnly: false,
    mineOnly: false,
  });
  const [page, setPage] = useState(1);

  /** 앱 최초 진입 시 일기 로드 */
  useEffect(() => {
    setDiaries(loadDiaries());
  }, []);

  /** ESC 키로 모달 닫기 */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setMode("list");
        setPasswordTarget(null);
        setSelectedDiary(null);
      }
    };

    if (mode !== "list") {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [mode]);

  /** -----------------------------
   * 검색 필터(파생 상태)
   ------------------------------*/
  const filteredDiaries = useMemo(() => {
    const q = query.trim().toLowerCase();
    const me = getCurrentUser();

    return diaries.filter((d) => {
      const hay = [
        d.event,
        d.thought,
        d.emotionDetail,
        d.selfMessage,
        d.emotion,
        new Date(d.createdAt).toLocaleDateString(),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesQuery = !q || hay.includes(q);
      const matchesUnread = !filters.unreadOnly || !d.isRead;
      const matchesMine = !filters.mineOnly || (me?.user_id && d.userId === me.user_id);

      return matchesQuery && matchesUnread && matchesMine;
    });
  }, [diaries, filters.mineOnly, filters.unreadOnly, query]);

  /** 페이지 계산 */
  const totalPages = Math.max(1, Math.ceil(filteredDiaries.length / PAGE_SIZE));

  useEffect(() => {
    // 검색어 바뀌면 페이지 1로
    setPage(1);
  }, [query]);
   
  //페이지 바뀌면 스크롤 최상단으로
  useEffect(() => {
  if (mode === "list") {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}, [page, mode]);

  useEffect(() => {
    // 데이터 줄어들었을 때 page 범위 보호
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pagedDiaries = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredDiaries.slice(start, start + PAGE_SIZE);
  }, [filteredDiaries, page]);

  const targetDiaryId = useMemo(() => {
    return new URLSearchParams(location.search).get("diaryId");
  }, [location.search]);

  useEffect(() => {
    if (mode !== "list") return;
  
    const hasHighlight = diaries.some(d => d.highlight);
      if (!hasHighlight) return;

    const t = setTimeout(() => {
      const next = diaries.map(d =>
        d.highlight ? { ...d, highlight: false } : d
      );
      setDiaries(next);
      localStorage.setItem("mind_diary_v2", JSON.stringify(next));
  }, 800);

  return () => clearTimeout(t);
}, [diaries, mode]);


  /* ================================
     Handler 영역 (비즈니스 로직)
     ================================ */

  /** 일기 저장 */
  const handleSaveDiary = (data) => {
    const me = getCurrentUser();
    
     console.log("현재 로그인 유저:", me);

    if (!me) {
      alert("로그인이 필요합니다.");
      return;
    }

    saveDiary({
      ...data,
      userId: me.user_id, // 로그인 유저 받는 로직
      comments: data.comments || [],
      isRead: false,
    });
    setDiaries(loadDiaries());
    setMode("result");
  };

  /** 일기 삭제 */
  const handleDeleteDiary = (id) => {
    deleteDiary(id);
    setDiaries(loadDiaries());
    setMode("list");
  };

  /** 비밀번호 검증 성공 */
  const handlePasswordSuccess = useCallback((diary) => {
    // 상세 들어갈 때 읽음 처리(저장소 반영 + UI 반영)
    /*
    try {
      setDiaryRead(diary.id, true);
    } catch (e) {
      // setDiaryRead가 아직 없으면 그냥 넘어감
    }
      */

    const nextAll = loadDiaries();
    setDiaries(nextAll);

    // 최신 객체로 selectedDiary 갱신 (댓글/읽음 즉시 동기화 핵심)
    const fresh = nextAll.find((d) => d.id === diary.id) || diary;
    setSelectedDiary(fresh);

    setPasswordTarget(null);
    setMode("detail");
  }, []);

  /** 리스트에서 일기 선택 */
  const handleSelectDiary = useCallback((diary) => {
    const me = getCurrentUser();
    const isOwner = me?.user_id && diary.userId === me.user_id;

    if (Number(me?.admin) === 1 || isOwner) {
      handlePasswordSuccess(diary);
      return;
    }

    // 비밀번호 모달로 이동 (기존 흐름 유지)
    setPasswordTarget(diary);
    setMode("password");
  }, [handlePasswordSuccess]);

  useEffect(() => {
    if (!targetDiaryId || mode !== "list" || diaries.length === 0) {
      return;
    }

    const targetDiary = diaries.find((diary) => String(diary.id) === String(targetDiaryId));
    if (!targetDiary) {
      return;
    }

    handleSelectDiary(targetDiary);
  }, [diaries, handleSelectDiary, mode, targetDiaryId]);

  /** 비밀번호 모달 닫기 */
  const handlePasswordCancel = () => {
    setPasswordTarget(null);
    if (targetDiaryId) {
      navigate("/mind-diary", { replace: true });
    }
    setMode("list");
  };

  /** 댓글/상세 변경 이후 강제 동기화 (중요) */
  const refreshDiary = (id) => {
    const nextAll = loadDiaries();
    setDiaries(nextAll);
    if (selectedDiary?.id === id) {
      const fresh = nextAll.find((d) => d.id === id) || null;
      setSelectedDiary(fresh);
    }
  };

  /** 읽음/안읽음 토글 */
  const handleToggleRead = (id) => {
    try {
      toggleDiaryRead(id);
    } catch (e) {
      // 혹시 아직 구현 안 됐으면 fallback
      const nextAll = loadDiaries().map(d =>
        d.id === id ? { ...d, isRead: !d.isRead } : d
      );
      // 저장키는 diaryStorage가 처리해야 하지만 fallback이라 여기선 UI만 살림
      setDiaries(nextAll);
      return;
    }
    setDiaries(loadDiaries());
  };

  /* ================================
     Render
     ================================ */

  return (
    <div className="mind-diary-shell">
      {mode === "list" && (
        <DiaryList
          diaries={pagedDiaries}
          totalCount={filteredDiaries.length}
          page={page}
          totalPages={totalPages}
          query={query}
          filters={filters}
          onQueryChange={setQuery}
          onToggleUnreadFilter={() =>
            setFilters((prev) => ({ ...prev, unreadOnly: !prev.unreadOnly }))
          }
          onToggleMineFilter={() =>
            setFilters((prev) => ({ ...prev, mineOnly: !prev.mineOnly }))
          }
          onPrevPage={() => setPage((p) => Math.max(1, p - 1))}
          onNextPage={() => setPage((p) => Math.min(totalPages, p + 1))}
          onToggleRead={handleToggleRead}
          onWriteClick={() => setMode("write")}
          onSelectDiary={handleSelectDiary}
        />
      )}

      {mode === "write" && (
        <DiaryWrite
          onSubmit={handleSaveDiary}
          onCancel={() => setMode("list")}
        />
      )}

      {mode === "detail" && selectedDiary && (
        <DiaryDetail
          diary={selectedDiary}
          onBack={() => {
            if (targetDiaryId) {
              navigate("/mind-diary", { replace: true });
            }
            setMode("list");
          }}
          onDelete={handleDeleteDiary}
          onRefresh={refreshDiary}   // 계속 디테일 페이지 리프레쉬 해주는 호출
          onMarkRead={handleToggleRead}
        />
      )}

      {mode === "password" && passwordTarget && (
        <DiaryPasswordModal
          diary={passwordTarget}
          onSuccess={handlePasswordSuccess}
          onCancel={handlePasswordCancel}
        />
      )}

      {mode === "result" && (
        <DiarySendResult
          onDone={() => setMode("list")}
        />
      )}
    </div>
  );
};

export default MindDiaryHome;
