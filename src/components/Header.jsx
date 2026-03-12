import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getCurrentUser, clearCurrentUser } from "../utils/auth";
import "./Header.css";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [me, setMe] = useState(getCurrentUser());
  const [myPageOpen, setMyPageOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const myPageMenuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 로그인 상태 동기화
  useEffect(() => {
    setMe(getCurrentUser());
    setMyPageOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!myPageMenuRef.current?.contains(event.target)) {
        setMyPageOpen(false);
      }
    };

    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
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
          소개
        </NavLink>
      </nav>

      {/* 오른쪽 */}
      <div className="header-right">
        {me?.admin === 1 && (
          <NavLink to="/admin" className="icon-link admin">
            관리자 <span className="icon">⚙️</span>
          </NavLink>
        )}

        {me ? (
          <>
            <div className="mypage-header-menu" ref={myPageMenuRef}>
              <button
                type="button"
                className="mypage-header-button"
                onClick={() => setMyPageOpen((prev) => !prev)}
              >
                마이페이지 <span className="icon">{myPageOpen ? "▲" : "▼"}</span>
              </button>

              {myPageOpen && (
                <div className="mypage-header-dropdown">
                  <Link to="/mypage?tab=reservations" className="mypage-header-link">
                    예약 내역
                  </Link>
                  <Link to="/mypage?tab=orders" className="mypage-header-link">
                    주문 내역
                  </Link>
                  <Link to="/mypage?tab=diaries" className="mypage-header-link">
                    내가 쓴 일기
                  </Link>
                  <Link to="/mypage?tab=profile" className="mypage-header-link">
                    회원정보 수정
                  </Link>
                </div>
              )}
            </div>
            <span className="user-nick">{me.nick}님</span>
            <button
              className="nav-item small logout-btn"
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
