import { Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import UserRoutes from "./userRoutes";
import AdminRoutes from "./adminRoutes";


const AnimatedRoutes = () => {
    const location = useLocation();

    return (
    <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
        {UserRoutes()}
        {AdminRoutes()}
        </Routes>
    </AnimatePresence>
    );
};

export default AnimatedRoutes;
