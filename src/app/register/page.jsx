// app/register/page.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { AuthUtils } from '../../lib/authUtils';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!AuthUtils.validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = AuthUtils.validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.feedback[0] || 'Password does not meet requirements';
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculatePasswordStrength = (password) => {
    const validation = AuthUtils.validatePassword(password);
    setPasswordStrength(validation.score);
    return validation;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Sanitize input
      const sanitizedEmail = AuthUtils.sanitizeInput(formData.email);
      const sanitizedFullName = AuthUtils.sanitizeInput(formData.fullName);
      const password = formData.password; // Don't sanitize password

      // Generate username from full name (or use email prefix)
      const username = sanitizedFullName.toLowerCase().replace(/\s+/g, '-') || sanitizedEmail.split('@')[0];

      // Call AuthContext register method (includes toast notifications)
      await register(sanitizedEmail, password, username);

      // Redirect to dashboard on successful registration
      router.push('/dashboard');
    } catch (error) {
      // Error handling is now done by AuthContext with toast notifications
      // No need for additional error handling here
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Update password strength
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const getPasswordStrengthText = () => {
    return AuthUtils.getPasswordStrengthText({ score: passwordStrength });
  };

  const getPasswordStrengthColor = () => {
    return AuthUtils.getPasswordStrengthBgColor({ score: passwordStrength });
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-dark-bg px-4 pt-32 lg:pt-20">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-orange/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-orange to-accent-yellow rounded-lg flex items-center justify-center font-bold text-xl transition-transform group-hover:scale-110">
              C
            </div>
            <span className="text-2xl font-bold">
              Content<span className="text-accent-orange">Studio</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-text-muted">
            Start creating amazing content with AI today
          </p>
        </div>

        {/* Register Form */}
        <div className="glass rounded-2xl p-8 border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-text-light mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-text-muted" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-3 bg-card-bg/20 border rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light placeholder-text-muted transition-all ${
                    errors.fullName ? 'border-red-500' : 'border-white/20'
                  }`}
                  placeholder="John Doe"
                  disabled={isLoading}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-light mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-text-muted" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-3 bg-card-bg/20 border rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light placeholder-text-muted transition-all ${
                    errors.email ? 'border-red-500' : 'border-white/20'
                  }`}
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-light mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-text-muted" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-3 bg-card-bg/20 border rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light placeholder-text-muted transition-all ${
                    errors.password ? 'border-red-500' : 'border-white/20'
                  }`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-text-muted hover:text-text-light" />
                  ) : (
                    <Eye className="h-5 w-5 text-text-muted hover:text-text-light" />
                  )}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-text-muted">
                      Password strength: <span className={`font-medium ${AuthUtils.getPasswordStrengthColor({ score: passwordStrength })}`}>{getPasswordStrengthText()}</span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${getPasswordStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 100) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              {errors.password && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-light mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-text-muted" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-3 bg-card-bg/20 border rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light placeholder-text-muted transition-all ${
                    errors.confirmPassword ? 'border-red-500' : 'border-white/20'
                  }`}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-text-muted hover:text-text-light" />
                  ) : (
                    <Eye className="h-5 w-5 text-text-muted hover:text-text-light" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div>
              <div className="flex items-start gap-2">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="w-4 h-4 bg-card-bg/20 border-white/20 rounded focus:ring-2 focus:ring-accent-cyan text-accent-cyan mt-1"
                  disabled={isLoading}
                />
                <label htmlFor="acceptTerms" className="text-sm text-text-light">
                  I accept the{' '}
                  <Link href="/terms" className="text-accent-cyan hover:text-accent-cyan/80 transition-colors">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-accent-cyan hover:text-accent-cyan/80 transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.acceptTerms}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent-orange hover:bg-opacity-90 text-white font-semibold py-3 px-4 rounded-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-accent-orange/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Benefits */}
          <div className="mt-6 p-4 bg-accent-green/10 border border-accent-green/30 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-accent-green flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-text-light">14-day free trial</p>
                <p className="text-xs text-text-muted mt-1">
                  No credit card required. Full access to all features.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-text-muted">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-accent-cyan hover:text-accent-cyan/80 font-medium transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}