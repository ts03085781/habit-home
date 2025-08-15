import Link from 'next/link';
import { getTranslations, type Locale } from '@/lib/translations';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = getTranslations(locale as Locale);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-10">
        <LanguageSwitcher />
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              🏠 <span className="text-primary-600">HabitHome</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {t('home.hero.subtitle')}<br />
              {t('home.hero.subtitle2')}
            </p>
            <div className="space-x-4">
              <Link
                href={`/${locale}/auth`}
                className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                {t('navigation.getStarted')}
              </Link>
              <Link
                href={`/${locale}/about`}
                className="inline-block border border-primary-600 text-primary-600 hover:bg-primary-50 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                {t('navigation.learnMore')}
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-4xl mb-4">⚖️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('home.features.fairDistribution.title')}
              </h3>
              <p className="text-gray-600">
                {t('home.features.fairDistribution.description')}
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('home.features.progressTracking.title')}
              </h3>
              <p className="text-gray-600">
                {t('home.features.progressTracking.description')}
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('home.features.pointSystem.title')}
              </h3>
              <p className="text-gray-600">
                {t('home.features.pointSystem.description')}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('home.status.title')}
            </h2>
            <p className="text-gray-600 mb-4">
              {t('home.status.description')}
            </p>
            <div className="flex justify-center">
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                ✅ {t('home.status.mvp')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}