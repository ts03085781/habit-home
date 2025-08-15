import { useState } from "react";
import { apiClient } from '@/lib/api-client';
import { getTranslations, type Locale } from '@/lib/translations';

// 創建群組彈窗組件
export default function CreateFamilyModal({ onClose, onSuccess, locale = 'zh' }: { onClose: () => void; onSuccess: () => void; locale?: Locale }) {
  const { t } = getTranslations(locale);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');
  
      try {
        const response = await apiClient.createFamily(formData);
        if (response.success) {
          onSuccess();
          onClose();
        } else {
          setError(response.error || t('groupModal.errors.createFailed'));
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : t('groupModal.errors.createFailed'));
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <div className="text-gray-600 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{t('groupModal.create.title')}</h3>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
  
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('groupModal.fields.name')}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder={t('groupModal.fields.namePlaceholder')}
                required
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('groupModal.fields.description')}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder={t('groupModal.fields.descriptionPlaceholder')}
                rows={3}
              />
            </div>
  
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={isLoading || !formData.name.trim()}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                {isLoading ? t('groupModal.create.loading') : t('groupModal.create.button')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  