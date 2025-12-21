import React, { useEffect, useMemo, useRef, useState } from "react";
import usersdb from "../../data/usersdb";
import "./AdminUsers.css";
import "./AdminModal.css";

const LS_KEY = "admin_users_v1";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [modalTop, setModalTop] = useState(0);
  const [toast, setToast] = useState("");

  const [roleFilter, setRoleFilter] = useState("전체");
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  const toastTimer = useRef(null);
  const hydratedRef = useRef(false);


  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setUsers(parsed);
          hydratedRef.current = true;
          return;
        }
      }
    } catch {}
    setUsers(usersdb);
    hydratedRef.current = true;
  }, []);


  useEffect(() => {
    if (!hydratedRef.current) return;
    localStorage.setItem(LS_KEY, JSON.stringify(users));
  }, [users]);

  /* debounce */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedKeyword(keyword.trim()), 300);
    return () => clearTimeout(t);
  }, [keyword]);

  const showToast = (msg) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(""), 2000);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchRole =
        roleFilter === "전체" ||
        (roleFilter === "관리자" ? u.admin === 1 : u.admin === 0);

      const k = debouncedKeyword;
      const matchKeyword =
        !k ||
        u.name.includes(k) ||
        u.user_id.includes(k) ||
        u.nick.includes(k) ||
        u.phone.includes(k) ||
        u.email.includes(k);

      return matchRole && matchKeyword;
    });
  }, [users, roleFilter, debouncedKeyword]);

    const openModal = (e, user) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const modalHeight = 420;
    const padding = 16;

    let top =
      rect.top + rect.height / 2 - modalHeight / 2 + window.scrollY;

    const minTop = window.scrollY + padding;
    const maxTop =
      window.scrollY + window.innerHeight - modalHeight - padding;

    if (top < minTop) top = minTop;
    if (top > maxTop) top = maxTop;

    setModalTop(top);
    setSelected(user);
  };

    useEffect(() => {
    if (!selected) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setSelected(null);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [selected]);

  const toggleAdmin = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, admin: u.admin === 1 ? 0 : 1 } : u
      )
    );
    setSelected((prev) =>
      prev ? { ...prev, admin: prev.admin === 1 ? 0 : 1 } : prev
    );
    showToast("권한이 변경되었습니다");
  };

  const removeUser = (id) => {
    const u = users.find((x) => x.id === id);
    if (!window.confirm(`정말 삭제할까요?\n- ${u?.name} (${u?.user_id})`)) return;

    setUsers((prev) => prev.filter((x) => x.id !== id));
    setSelected(null);
    showToast("삭제 완료");
  };

  return (
    <>
      <div className="admin-page">
        <h1>회원 관리</h1>

        <div className="admin-controls">
          <div className="status-filters">
            {["전체", "관리자", "일반"].map((r) => (
              <button
                key={r}
                className={roleFilter === r ? "active" : ""}
                onClick={() => setRoleFilter(r)}
              >
                {r}
              </button>
            ))}
          </div>

          <input
            className="search-input"
            placeholder="이름/아이디/닉/전화/이메일 검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <table className="reservation-table">
          <thead>
            <tr>
              <th>이름</th>
              <th>아이디</th>
              <th>닉네임</th>
              <th>전화</th>
              <th>권한</th>
              <th>가입일</th>
            </tr>
          </thead>
          
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id} onClick={(e) => openModal(e, u)}>
                <td>{u.name}</td>
                <td>{u.user_id}</td>
                <td>{u.nick}</td>
                <td>{u.phone}</td>
                <td>
                  <span className={`status ${u.admin ? "관리자" : "일반"}`}>
                    {u.admin ? "관리자" : "일반"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

        
      {selected && (
        <div className="admin-modal-overlay" onClick={() => setSelected(null)}>
          <div
            className="admin-modal"
            style={{ top: modalTop, left: "50%", transform: "translateX(-50%)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="admin-modal-close"
              onClick={() => setSelected(null)}
            >
              ✕
            </button>

            <h2>회원 상세</h2>
            <p>이름: {selected.name}</p>
            <p>아이디: {selected.user_id}</p>
            <p>닉네임: {selected.nick}</p>
            <p>전화: {selected.phone}</p>
            <p>이메일: {selected.email}</p>

            <div className="status-action">
              <button onClick={() => toggleAdmin(selected.id)}>
                {selected.admin ? "관리자 해제" : "관리자 지정"}
              </button>
              <button className="danger" onClick={() => removeUser(selected.id)}>
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
};

export default AdminUsers;