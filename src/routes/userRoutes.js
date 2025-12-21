import { Route } from "react-router-dom";
import Layout from "../components/Layout";

import Home from "../pages/Home";
import Counseling from "../pages/Counseling";
import Products from "../pages/Products";
import CounselingReservation from "../pages/CounselingReservation";
import About from "../pages/About";

import MindDiaryHome from "../pages/mind-diary/MindDiaryHome";
import Login from "../pages/auth/Login";
import ReservationCheck from "../pages/ReservationCheck";
import Signup from './../pages/auth/Signup';
import OrdersCheck from "../pages/OrdersCheck";



const UserRoutes = () => {

    return (
    <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/counseling" element={<Counseling />} />
        <Route path="/products" element={<Products />} />
        <Route path="/reservation" element={<CounselingReservation />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reservation/check" element={<ReservationCheck />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/orders/check" element={<OrdersCheck />} />

        
        <Route path="/mind-diary" element={<MindDiaryHome />}/>

        

    </Route>
    );
};

export default UserRoutes;
