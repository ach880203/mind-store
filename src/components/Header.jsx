import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser, clearCurrentUser } from "../utils/auth";
import "./Header.css";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [me, setMe] = useState(getCurrentUser());
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 로그인 상태 동기화
  useEffect(() => {
    setMe(getCurrentUser());
  }, []);

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      {/* 왼쪽 */}
      <div className="header-left">
        <Link to="/" className="logo">
          마음 상점
        </Link>
      </div>

      {/* 가운데 */}
      <nav className="header-center">
        <NavLink to="/mind-diary" className="nav-item">
          마음 일기장
        </NavLink>
        <NavLink to="/counseling" className="nav-item">
          상담 예약
        </NavLink>
        <NavLink to="/products" className="nav-item">
          상품
        </NavLink>
        <NavLink to="/about" className="nav-item">
          About
        </NavLink>
      </nav>

      {/* 오른쪽 */}
      <div className="header-right">
        <NavLink to="/reservation/check" className="icon-link">
          예약확인 <span className="icon">📋</span>
        </NavLink>

        <NavLink to="/oders/check" className="icon-link">
          주문확인 <span className="icon">📋</span>
        </NavLink>

        {me?.admin === 1 && (
          <NavLink to="/admin" className="icon-link admin">
            관리자 <span className="icon">⚙️</span>
          </NavLink>
        )}

        {me ? (
          <>
            <span className="user-nick">{me.nick}님</span>
            <button
              className="nav-item small"
              onClick={() => {
                clearCurrentUser();
                setMe(null);
                navigate("/");
              }}
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="nav-item small">
              로그인
            </NavLink>
            <NavLink to="/signup" className="signup-btn">
              회원가입
            </NavLink>
          </>
        )}

        <button className="menu-btn">☰</button>
      </div>
    </header>
  );
};

export default Header;
