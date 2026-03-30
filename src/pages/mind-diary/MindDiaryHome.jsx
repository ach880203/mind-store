import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import DiaryList from "./DiaryList";
import DiaryWrite from "./DiaryWrite";
import DiaryDetail from "./DiaryDetail";
import DiaryPasswordModal from "./DiaryPasswordModal";
import {
  loadDiaries,
  saveDiary,
  deleteDiary,
  toggleDiaryRead,
} from "./diaryStorage"; // setDiaryRead 는 바로 읽음 처리할 때 사용할 수 있습니다.
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

  /** 선택한 일기 (상세 보기용) */
  const [selectedDiary, setSelectedDiary] = useState(null);

  /** 비밀번호 확인 대상 */
  const [passwordTarget, setPasswordTarget] = useState(null);

  /** 검색과 페이지 */
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    unreadOnly: false,
    mineOnly: false,
  });
  const [page, setPage] = useState(1);
  const [listNoticeMessage, setListNoticeMessage] = useState("");

  /** 첫 진입 시 일기 로드 */
  useEffect(() => {
    setDiaries(loadDiaries());
  }, []);

  /** ESC 키로 모달 닫기 */
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMode("list");
        setPasswordTarget(null);
        setSelectedDiary(null);
      }
    };

    if (mode !== "list") {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [mode]);

  /** -----------------------------
   * 검색 필터 (파생 상태)
   ------------------------------*/
  const filteredDiaries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const currentUser = getCurrentUser();

    return diaries.filter((diary) => {
      const searchTarget = [
        diary.event,
        diary.thought,
        diary.emotionDetail,
        diary.selfMessage,
        diary.emotion,
        new Date(diary.createdAt).toLocaleDateString(),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesQuery =
        !normalizedQuery || searchTarget.includes(normalizedQuery);
      const matchesUnread = !filters.unreadOnly || !diary.isRead;
      const matchesMine =
        !filters.mineOnly ||
        (currentUser?.user_id && diary.userId === currentUser.user_id);

      return matchesQuery && matchesUnread && matchesMine;
    });
  }, [diaries, filters.mineOnly, filters.unreadOnly, query]);

  /** 페이지 계산 */
  const totalPages = Math.max(1, Math.ceil(filteredDiaries.length / PAGE_SIZE));

  useEffect(() => {
    // 검색어가 바뀌면 페이지를 1로 돌립니다.
    setPage(1);
  }, [query]);

  // 페이지가 바뀌면 목록 상단으로 자연스럽게 이동시킵니다.
  useEffect(() => {
    if (mode === "list") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [page, mode]);

  useEffect(() => {
    // 데이터가 줄어들면 현재 페이지가 범위를 넘지 않게 맞춥니다.
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const pagedDiaries = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    return filteredDiaries.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredDiaries, page]);

  const targetDiaryId = useMemo(() => {
    return new URLSearchParams(location.search).get("diaryId");
  }, [location.search]);

  useEffect(() => {
    if (mode !== "list") return;

    const hasHighlight = diaries.some((diary) => diary.highlight);
    if (!hasHighlight) return;

    const timer = setTimeout(() => {
      const nextDiaries = diaries.map((diary) =>
        diary.highlight ? { ...diary, highlight: false } : diary
      );
      setDiaries(nextDiaries);
      localStorage.setItem("mind_diary_v2", JSON.stringify(nextDiaries));
    }, 800);

    return () => clearTimeout(timer);
  }, [diaries, mode]);

  /* ================================
     Handler 영역 (비즈니스 로직)
     ================================ */

  /** 일기 저장 */
  const handleSaveDiary = (data) => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      /* 갑작스러운 alert 대신 목록 상단에 이유를 남겨서 사용자가 흐름을 이해하게 합니다. */
      setListNoticeMessage("마음일기를 저장하려면 로그인 후 이용해주세요.");
      setMode("list");
      return;
    }

    setListNoticeMessage("");
    saveDiary({
      ...data,
      userId: currentUser.user_id, // 로그인한 사용자의 일기로 저장합니다.
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
    const nextAll = loadDiaries();
    setDiaries(nextAll);

    // 최신 객체로 selectedDiary 를 다시 맞춰야 댓글/읽음 상태가 바로 반영됩니다.
    const freshDiary = nextAll.find((item) => item.id === diary.id) || diary;
    setSelectedDiary(freshDiary);

    setPasswordTarget(null);
    setMode("detail");
  }, []);

  /** 리스트에서 일기 선택 */
  const handleSelectDiary = useCallback(
    (diary) => {
      const currentUser = getCurrentUser();
      const isOwner = currentUser?.user_id && diary.userId === currentUser.user_id;

      if (Number(currentUser?.admin) === 1 || isOwner) {
        handlePasswordSuccess(diary);
        return;
      }

      // 비밀번호 모달로 이동합니다.
      setPasswordTarget(diary);
      setMode("password");
    },
    [handlePasswordSuccess]
  );

  useEffect(() => {
    if (!targetDiaryId || mode !== "list" || diaries.length === 0) {
      return;
    }

    const targetDiary = diaries.find(
      (diary) => String(diary.id) === String(targetDiaryId)
    );
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

  /** 댓글/상세 변경 이후 선택된 일기를 최신 데이터로 갱신합니다. */
  const refreshDiary = (id) => {
    const nextAll = loadDiaries();
    setDiaries(nextAll);
    if (selectedDiary?.id === id) {
      const freshDiary = nextAll.find((diary) => diary.id === id) || null;
      setSelectedDiary(freshDiary);
    }
  };

  /** 읽음/안읽음 토글 */
  const handleToggleRead = (id) => {
    try {
      toggleDiaryRead(id);
    } catch (error) {
      // 혹시 저장 로직이 실패해도 화면이 완전히 멈추지 않도록 최소한의 UI 반영을 남깁니다.
      const nextAll = loadDiaries().map((diary) =>
        diary.id === id ? { ...diary, isRead: !diary.isRead } : diary
      );
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
          noticeMessage={listNoticeMessage}
          onQueryChange={setQuery}
          onToggleUnreadFilter={() =>
            setFilters((prev) => ({ ...prev, unreadOnly: !prev.unreadOnly }))
          }
          onToggleMineFilter={() =>
            setFilters((prev) => ({ ...prev, mineOnly: !prev.mineOnly }))
          }
          onPrevPage={() => setPage((prev) => Math.max(1, prev - 1))}
          onNextPage={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          onToggleRead={handleToggleRead}
          onWriteClick={() => {
            setListNoticeMessage("");
            setMode("write");
          }}
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
          onRefresh={refreshDiary}
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

      {mode === "result" && <DiarySendResult onDone={() => setMode("list")} />}
    </div>
  );
};

export default MindDiaryHome;
