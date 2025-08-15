import Link from 'next/link';
import { getTranslations, type Locale } from '@/lib/translations';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default async function About({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t, tArray } = getTranslations(locale as Locale);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-10">
        <LanguageSwitcher />
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('navigation.about')} <span className="text-primary-600">HabitHome</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {t('about.subtitle')}
            </p>
          </div>

          {/* Features sections */}
          <div className="space-y-12">
            {/* Fair Distribution */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-start space-x-6">
                <div className="text-5xl">⚖️</div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    {t('about.sections.distribution.title')}
                  </h2>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {t('about.sections.distribution.description')}
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                    {tArray('about.sections.distribution.features').map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <p className="text-gray-600">
                    {t('about.sections.distribution.summary')}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Tracking */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-start space-x-6">
                <div className="text-5xl">📊</div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    {t('about.sections.tracking.title')}
                  </h2>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {t('about.sections.tracking.description')}
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                    {tArray('about.sections.tracking.features').map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <p className="text-gray-600">
                    {t('about.sections.tracking.summary')}
                  </p>
                </div>
              </div>
            </div>

            {/* Point System */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-start space-x-6">
                <div className="text-5xl">🏆</div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    {t('about.sections.points.title')}
                  </h2>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {t('about.sections.points.description')}
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                    {tArray('about.sections.points.features').map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <p className="text-gray-600">
                    {t('about.sections.points.summary')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* How to get started steps */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {t('about.steps.title')}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="text-3xl mb-4">1️⃣</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('about.steps.step1.title')}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('about.steps.step1.description')}
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="text-3xl mb-4">2️⃣</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('about.steps.step2.title')}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('about.steps.step2.description')}
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="text-3xl mb-4">3️⃣</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('about.steps.step3.title')}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('about.steps.step3.description')}
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="text-3xl mb-4">4️⃣</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('about.steps.step4.title')}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('about.steps.step4.description')}
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <div className="bg-primary-50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('about.cta.title')}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('about.cta.description')}
              </p>
              <div className="space-x-4">
                <Link
                  href={`/${locale}/auth`}
                  className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  {t('navigation.getStarted')}
                </Link>
                <Link
                  href={`/${locale}`}
                  className="inline-block border border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  {t('navigation.backToHome')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}