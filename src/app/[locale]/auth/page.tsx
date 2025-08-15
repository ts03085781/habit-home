'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { getTranslations } from '@/lib/translations';

export default function AuthPage() {
  const params = useParams();
  const locale = params.locale as string;
  const isZh = locale === 'zh';
  const { t } = getTranslations(locale as 'en' | 'zh');
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        // 登入邏輯
        const response = await apiClient.login(formData.email, formData.password, locale);
        if (response.success) {
          // 登入成功，跳轉到主頁面
          window.location.href = `/${locale}/dashboard`;
        } else {
          setError(response.error || t('auth.errors.loginFailed'));
        }
      } else {
        // 註冊邏輯
        if (formData.password !== formData.confirmPassword) {
          setError(t('auth.errors.passwordMismatch'));
          return;
        }
        
        const response = await apiClient.register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          confirmPassword: formData.confirmPassword
        }, locale);
        
        if (response.success) {
          // 註冊成功，跳轉到主頁面
          window.location.href = `/${locale}/dashboard`;
        } else {
          setError(response.error || t('auth.errors.registerFailed'));
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : t('auth.errors.unknownError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-primary-600">
                🏠 HabitHome
              </h1>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin 
                ? (isZh ? '歡迎回來' : 'Welcome Back') 
                : (isZh ? '開始你的家務分配之旅' : 'Start Your Chore Distribution Journey')
              }
            </h2>
          </div>

          {/* Auth Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <p className="text-gray-600 text-center mb-4 text-lg">
                {isLogin 
                  ? (isZh ? '登入你的帳戶' : 'Sign in to your account') 
                  : (isZh ? '創建新帳戶' : 'Create a new account')
                }
            </p>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name field (only for registration) */}
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    {isZh ? '姓名' : 'Name'}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="text-gray-600 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors"
                    placeholder={isZh ? "請輸入你的姓名" : "Enter your name"}
                    required
                  />
                </div>
              )}

              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {isZh ? '電子郵件' : 'Email'}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="text-gray-600 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors"
                  placeholder={isZh ? "請輸入你的電子郵件" : "Enter your email"}
                  required
                />
              </div>

              {/* Password field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  {isZh ? '密碼' : 'Password'}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="text-gray-600 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors"
                  placeholder={isZh ? "請輸入你的密碼" : "Enter your password"}
                  required
                />
              </div>

              {/* Confirm Password field (only for registration) */}
              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    {isZh ? '確認密碼' : 'Confirm Password'}
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="text-gray-600 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors"
                    placeholder={isZh ? "請再次輸入密碼" : "Re-enter your password"}
                    required
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isZh ? '處理中...' : 'Processing...'}
                  </>
                ) : (
                  isLogin 
                    ? (isZh ? '登入' : 'Sign In')
                    : (isZh ? '註冊' : 'Sign Up')
                )}
              </button>
            </form>

            {/* Toggle Auth Mode */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {isLogin 
                  ? (isZh ? '還沒有帳戶？' : "Don't have an account?")
                  : (isZh ? '已經有帳戶了？' : 'Already have an account?')
                }
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-primary-600 hover:text-primary-700 font-semibold"
                >
                  {isLogin 
                    ? (isZh ? '立即註冊' : 'Sign up now')
                    : (isZh ? '立即登入' : 'Sign in now')
                  }
                </button>
              </p>
            </div>

            {/* Divider */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-500">
                {isZh 
                  ? '繼續使用即表示你同意我們的服務條款和隱私政策'
                  : 'By continuing, you agree to our Terms of Service and Privacy Policy'
                }
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link
              href={`/${locale}`}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              {isZh ? '返回首頁' : 'Back to Home'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}