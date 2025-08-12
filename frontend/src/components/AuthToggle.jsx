// src/components/AuthToggle.jsx
import React, { useState } from 'react';
import SignUpForm from '../pages/SignUpPage';
import LoginForm from '../pages/LoginPage';
import { motion, AnimatePresence } from 'framer-motion';

const AuthToggle = () => {
  const [isLogin, setIsLogin] = useState(true);

  const switchMode = () => setIsLogin(!isLogin);

  const variants = {
    enter: { x: isLogin ? '100%' : '-100%', opacity: 0 },
    center: { x: '0%', opacity: 1 },
    exit: { x: isLogin ? '-100%' : '100%', opacity: 0 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-indigo-900 p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <button
            onClick={switchMode}
            className="text-indigo-600 font-medium hover:underline"
          >
            {isLogin ? 'Go to Sign Up' : 'Back to Login'}
          </button>
        </div>

        <AnimatePresence exitBeforeEnter>
          {isLogin ? (
            <motion.div
              key="login"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.7 }}
              className="p-8"
            >
              <LoginForm />
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.8 }}
              className="p-8"
            >
              <SignUpForm />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthToggle;
