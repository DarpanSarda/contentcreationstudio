// app/reset-password/page.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // TODO: Implement actual password reset logic
      console.log('Password reset request for:', email);

      setIsSubmitted(true);

    } catch (error) {
      console.error('Reset password error:', error);
      // TODO: Show error message
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);

    // Clear error when user starts typing
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-start justify-center bg-dark-bg px-4 pt-32 lg:pt-20">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-96 h-96 bg-accent-green/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="glass rounded-2xl p-8 border border-white/10 text-center">
            {/* Success Icon */}
            <div className="w-16 h-16 bg-accent-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-accent-green" />
            </div>

            {/* Success Message */}
            <h1 className="text-2xl font-bold text-text-light mb-3">
              Check Your Email
            </h1>
            <p className="text-text-muted mb-6">
              We've sent a password reset link to<br />
              <span className="text-accent-cyan font-medium">{email}</span>
            </p>

            {/* Instructions */}
            <div className="bg-accent-cyan/10 border border-accent-cyan/30 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-medium text-text-light mb-2">Next Steps:</h3>
              <ol className="text-sm text-text-muted space-y-1 list-decimal list-inside">
                <li>Check your email inbox</li>
                <li>Look for an email from ContentStudio</li>
                <li>Click the reset link in the email</li>
                <li>Create a new password</li>
              </ol>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/login"
                className="block bg-accent-orange hover:bg-opacity-90 text-white font-semibold py-3 px-4 rounded-lg transition-all hover:scale-105 text-center"
              >
                Back to Sign In
              </Link>
              <button
                onClick={() => setIsSubmitted(false)}
                className="block w-full text-accent-cyan hover:text-accent-cyan/80 font-medium py-3 px-4 transition-colors"
              >
                Try different email address
              </button>
            </div>

            {/* Tip */}
            <p className="text-xs text-text-muted mt-6">
              Didn't receive the email? Check your spam folder or request another reset.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center bg-dark-bg px-4 pt-32 lg:pt-20">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-orange/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back to Login */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-accent-cyan hover:text-accent-cyan/80 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Sign In
        </Link>

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
          <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
          <p className="text-text-muted">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {/* Reset Form */}
        <div className="glass rounded-2xl p-8 border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  value={email}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent-orange hover:bg-opacity-90 text-white font-semibold py-3 px-4 rounded-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-accent-orange/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending reset link...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          {/* Help Section */}
          <div className="mt-6 p-4 bg-card-bg/20 border border-white/20 rounded-lg">
            <h3 className="font-medium text-text-light mb-2">Remember your password?</h3>
            <p className="text-sm text-text-muted mb-3">
              If you remember your password, you can sign in directly without resetting it.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-accent-cyan hover:text-accent-cyan/80 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </div>
        </div>

        {/* Contact Support */}
        <div className="text-center mt-6">
          <p className="text-sm text-text-muted">
            Need help?{' '}
            <Link
              href="/support"
              className="text-accent-cyan hover:text-accent-cyan/80 font-medium transition-colors"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}