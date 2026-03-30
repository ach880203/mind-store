import { Navigate, Route } from "react-router-dom";
import Layout from "../components/Layout";

import Home from "../pages/user/home/Home";
import Counseling from "../pages/user/counseling/Counseling";
import Products from "../pages/user/products/Products";
import ProductDetail from "../pages/user/products/ProductDetail";
import About from "../pages/user/about/About";

import MindDiaryHome from "../pages/mind-diary/MindDiaryHome";
import Login from "../pages/auth/Login";
import Signup from './../pages/auth/Signup';
import MyPage from "../pages/user/mypage/MyPage";



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
