// lib/authUtils.js
export const AuthUtils = {
  // Validate email format
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate password strength
  validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const strength = {
      score: 0,
      feedback: [],
      isValid: false,
    };

    // Length check
    if (password.length >= minLength) {
      strength.score += 25;
    } else {
      strength.feedback.push(`Password must be at least ${minLength} characters`);
    }

    // Uppercase letter
    if (hasUpperCase) {
      strength.score += 25;
    } else {
      strength.feedback.push('Include at least one uppercase letter');
    }

    // Lowercase letter
    if (hasLowerCase) {
      strength.score += 25;
    } else {
      strength.feedback.push('Include at least one lowercase letter');
    }

    // Numbers or special characters
    if (hasNumbers || hasSpecialChar) {
      strength.score += 25;
    } else {
      strength.feedback.push('Include numbers or special characters');
    }

    strength.isValid = strength.score === 100;

    return strength;
  },

  // Get password strength text
  getPasswordStrengthText(strength) {
    if (strength.score < 50) return 'Weak';
    if (strength.score < 75) return 'Fair';
    if (strength.score < 100) return 'Strong';
    return 'Very Strong';
  },

  // Get password strength color
  getPasswordStrengthColor(strength) {
    if (strength.score < 50) return 'text-red-500';
    if (strength.score < 75) return 'text-yellow-500';
    if (strength.score < 100) return 'text-blue-500';
    return 'text-green-500';
  },

  // Get password strength background color
  getPasswordStrengthBgColor(strength) {
    if (strength.score < 50) return 'bg-red-500';
    if (strength.score < 75) return 'bg-yellow-500';
    if (strength.score < 100) return 'bg-blue-500';
    return 'bg-green-500';
  },

  // Format error messages from API
  formatErrorMessage(error) {
    // Handle FastAPI validation error format
    if (error?.data?.detail) {
      const detail = error.data.detail;

      // If detail is an array of validation errors
      if (Array.isArray(detail)) {
        return detail.map(err => {
          if (typeof err === 'string') return err;
          if (typeof err === 'object' && err.msg) return err.msg;
          if (typeof err === 'object' && err.message) return err.message;
          return 'Validation error';
        }).join(', ');
      }

      // If detail is an object with validation errors
      if (typeof detail === 'object' && detail !== null) {
        if (detail.msg) return detail.msg;
        if (detail.message) return detail.message;
        if (detail.detail) return detail.detail;
      }

      // If detail is a string
      if (typeof detail === 'string') {
        return detail;
      }
    }

    // Handle other error formats
    if (error?.data?.message) {
      return error.data.message;
    }
    if (error?.message) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }

    return 'An unexpected error occurred. Please try again.';
  },

  // Check if error is authentication related
  isAuthError(error) {
    return error?.status === 401 || error?.status === 403;
  },

  // Check if error is validation related
  isValidationError(error) {
    return error?.status === 400 || error?.status === 422;
  },

  // Sanitize user input
  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/[<>]/g, '');
  },

  // Generate random string for tokens
  generateRandomString(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  // Debounce function for search inputs
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
};