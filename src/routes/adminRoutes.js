import { Navigate, Route } from "react-router-dom";
import AdminLayout from "../pages/admin/AdminLayout";
import AdminReservations from "../pages/admin/AdminReservations";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminProduct from "../pages/admin/AdminProduct";
import AdminProductNew from "../pages/admin/AdminProductNew";
import AdminOrders from './../pages/admin/AdminOrders';
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProductDetail from "../pages/admin/AdminProductDetail";
import AdminOrderDetail from "../pages/admin/AdminOrderDetail";
import { getCurrentUser } from "../utils/auth";

const AdminRouteGuard = () => {
  const currentUser = getCurrentUser();

  // 관리자 화면은 로그인 여부와 관리자 권한을 함께 확인해야 합니다.
  // 포트폴리오 프로젝트여도 이 보호 장치가 없으면 구조 이해도가 낮아 보일 수 있습니다.
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (Number(currentUser.admin) !== 1) {
    return <Navigate to="/" replace />;
  }

  return <AdminLayout />;
};

const AdminRoutes = () => {
  return (
    <Route path="/admin" element={<AdminRouteGuard />}>
      <Route index element={<Navigate to="reservations" replace />} />

      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="reservations" element={<AdminReservations />} />
      <Route path="users" element={<AdminUsers />} />

      <Route path="products" element={<AdminProduct />} />
      <Route path="products/new" element={<AdminProductNew />} />
      <Route path="products/:id" element={<AdminProductDetail />} />

      <Route path="orders" element={<AdminOrders />} />
      <Route path="orders/:id" element={<AdminOrderDetail />} />
      
    </Route>
  );
};

export default AdminRoutes;
