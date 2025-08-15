'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getTranslations, type Locale } from '@/lib/translations';

export default function NotFound() {
  const params = useParams();
  const locale = (params.locale as Locale) || 'en';
  const { t } = getTranslations(locale);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        {/* Language Switcher */}
        <div className="absolute top-4 right-4 bg-white p-2 rounded">
          <p>Current locale: <strong>{locale}</strong></p>
          <div className="flex gap-2 mt-2">
            <Link href="/zh" className="text-blue-600">中文</Link>
            <Link href="/en" className="text-blue-600">English</Link>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-gray-600 mb-6">
          {locale === 'zh' ? '找不到頁面' : 'Page not found'}
        </p>
        <Link
          href={`/${locale}`}
          className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          {t('navigation.backToHome')}
        </Link>
      </div>
    </div>
  );
}