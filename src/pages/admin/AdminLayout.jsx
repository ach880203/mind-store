import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "./AdminLayout.css";

// 탭은 상대 경로로 (adminRoutes에서 /admin → /admin/reservations로 정규화)
const tabs = [
  { path: "reservations", label: "상담 예약" },
  { path: "users", label: "회원 관리" },
  { path: "products", label: "상품 관리" },
  { path: "orders", label: "주문 관리" },
  { path: "dashboard", label: "통계"}
];

const AdminLayout = () => {
  const location = useLocation();
  const Navigate = useNavigate();

  return (
    <div className="admin-layout">
      <div className="admin-shell">
        {/* ✅ shell의 일부로 흡수된 헤더(탭) */}
        <header className="admin-header">
          <nav className="admin-tabs" aria-label="Admin tabs">
            {tabs.map((tab) => (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={({ isActive }) =>
                  isActive ? "admin-tab active" : "admin-tab"
                }
              >
                {tab.label}
              </NavLink>
            ))}
            <button
              className="admin-home-btn"
              onClick={() => Navigate("/")}
            >
              홈으로
            </button>
          </nav>
        </header>

        {/* ✅ 내용 */}
        <div className="admin-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
