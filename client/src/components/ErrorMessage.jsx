import React, { useState, useEffect } from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ 
  message, 
  type = 'error', 
  duration = 5000, 
  onClose,
  show = true 
}) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);
  }, [show]);

  useEffect(() => {
    if (duration > 0 && visible) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose && onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    onClose && onClose();
  };

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'error':
      default:
        return '❌';
    }
  };

  return (
    <div className={`error-message ${type} ${visible ? 'show' : 'hide'}`}>
      <div className="error-content">
        <span className="error-icon">{getIcon()}</span>
        <span className="error-text">{message}</span>
        <button 
          className="error-close"
          onClick={handleClose}
          aria-label="关闭"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;
