import { useState } from "react";
import { Task } from '@/types/common'
import { apiClient } from '@/lib/api-client';
import { getTranslations, type Locale } from '@/lib/translations';

// 刪除確認對話框組件
export default function DeleteConfirmModal({ task, onClose, onSuccess, locale = 'zh' }: {
    task: Task;
    onClose: () => void;
    onSuccess: () => void;
    locale?: Locale;
  }) {
    const { t } = getTranslations(locale);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
  
    const handleDelete = async () => {
      setIsLoading(true);
      setError('');
  
      try {
        const response = await apiClient.deleteTask(task.id);
        if (response.success) {
          onSuccess();
          onClose();
        } else {
          setError(response.error || t('deleteModal.error'));
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : t('deleteModal.error'));
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-bold text-gray-900">{t('deleteModal.title')}</h3>
            </div>
          </div>
  
          <div className="mb-4">
            <p className="text-gray-600 mb-3">
              {t('deleteModal.message').replace('{title}', task.title)}
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-800 text-sm">
                ⚠️ {t('deleteModal.warning')}
              </p>
            </div>
          </div>
  
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
  
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              disabled={isLoading}
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {isLoading ? t('deleteModal.loading') : t('deleteModal.button')}
            </button>
          </div>
        </div>
      </div>
    );
  }