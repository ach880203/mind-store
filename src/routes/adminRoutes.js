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




const AdminRoutes = () => {
  return (
    <Route path="/admin" element={<AdminLayout />}>
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
