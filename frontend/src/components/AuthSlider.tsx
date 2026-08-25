import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

export default function AuthSlider() {
  const [isLogin] = useState(true);

  return (
    <AnimatePresence mode="wait">
      {isLogin ? (
        <Login key="login" />
      ) : (
        <Register key="register" />
      )}
    </AnimatePresence>
  );
}