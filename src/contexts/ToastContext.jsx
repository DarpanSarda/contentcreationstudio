// src/contexts/ToastContext.jsx
'use client';

import { createContext, useContext } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  // Success toast
  const success = (message, options = {}) => {
    return toast.success(message, {
      position: 'top-right',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
      style: {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
      },
      ...options,
    });
  };

  // Error toast
  const error = (message, options = {}) => {
    return toast.error(message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
      style: {
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
      },
      ...options,
    });
  };

  // Loading toast
  const loading = (message, options = {}) => {
    return toast.loading(message, {
      position: 'top-right',
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: 'dark',
      style: {
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
      },
      ...options,
    });
  };

  // Info toast
  const info = (message, options = {}) => {
    return toast.info(message, {
      position: 'top-right',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
      style: {
        background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
        border: '1px solid rgba(6, 182, 212, 0.3)',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
      },
      ...options,
    });
  };

  // Warning toast
  const warning = (message, options = {}) => {
    return toast.warning(message, {
      position: 'top-right',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
      style: {
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
      },
      ...options,
    });
  };

  // Dismiss all toasts
  const dismiss = () => {
    toast.dismiss();
  };

  // Dismiss specific toast
  const dismissToast = (toastId) => {
    toast.dismiss(toastId);
  };

  const value = {
    success,
    error,
    loading,
    info,
    warning,
    dismiss,
    dismissToast,
    toast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{
          top: '20px',
          right: '20px',
        }}
        toastStyle={{
          background: 'rgba(31, 41, 55, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)',
        }}
      />
    </ToastContext.Provider>
  );
};