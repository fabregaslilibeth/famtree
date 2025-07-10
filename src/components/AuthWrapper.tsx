'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { AuthService } from '../lib/auth-service';
import { User as FirebaseUser } from 'firebase/auth';

interface AuthWrapperProps {
  onAuthSuccess: (user: FirebaseUser) => void;
}

export default function AuthWrapper({ onAuthSuccess }: AuthWrapperProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const unsubscribe = AuthService.onAuthStateChange((user) => {
      if (user) {
        onAuthSuccess(user);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [onAuthSuccess]);

  const handleLoginSuccess = () => {
    const user = AuthService.getCurrentUser();
    if (user) {
      onAuthSuccess(user);
    }
  };

  const handleRegisterSuccess = () => {
    const user = AuthService.getCurrentUser();
    if (user) {
      onAuthSuccess(user);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600">Loading...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <LoginForm
                onSwitchToRegister={() => setIsLogin(false)}
                onLoginSuccess={handleLoginSuccess}
              />
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <RegisterForm
                onSwitchToLogin={() => setIsLogin(true)}
                onRegisterSuccess={handleRegisterSuccess}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 