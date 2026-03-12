import { Navigate, Route } from "react-router-dom";
import Layout from "../components/Layout";

import Home from "../pages/Home";
import Counseling from "../pages/Counseling";
import Products from "../pages/Products";
import ProductDetail from "../pages/ProductDetail";
import About from "../pages/About";

import MindDiaryHome from "../pages/mind-diary/MindDiaryHome";
import Login from "../pages/auth/Login";
import Signup from './../pages/auth/Signup';
import MyPage from "../pages/MyPage";



const UserRoutes = () => {

    return (
    <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/counseling" element={<Counseling />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/detail" element={<ProductDetail />} />
        <Route path="/reservation" element={<Navigate to="/counseling" replace />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/reservation/check" element={<Navigate to="/mypage?tab=reservations" replace />} />
        <Route path="/orders/check" element={<Navigate to="/mypage?tab=orders" replace />} />

        
        <Route path="/mind-diary" element={<MindDiaryHome />}/>

        

    </Route>
    );
};

export default UserRoutes;
