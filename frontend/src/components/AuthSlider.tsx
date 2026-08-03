import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

export default function AuthSlider() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <AnimatePresence mode="wait">
      {isLogin ? (
        <Login key="login" onSwitch={() => setIsLogin(false)} />
      ) : (
        <Register key="register" onSwitch={() => setIsLogin(true)} />
      )}
    </AnimatePresence>
  );
}
