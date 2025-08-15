
import { useState } from "react";
import { Family } from '@/types/common'
import { apiClient } from '@/lib/api-client';
import { getTranslations, type Locale } from '@/lib/translations';

// 創建任務彈窗組件
export default function CreateTaskModal({ families, onClose, onSuccess, locale = 'zh' }: { 
    families: Family[]; 
    onClose: () => void; 
    onSuccess: () => void;
    locale?: Locale;
  }) {
    const { t } = getTranslations(locale);
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      points: 0,
      category: '',
      priority: 'MEDIUM' as const,
      familyId: families[0]?.id || '',
      assignedToId: '',
      dueDate: ''
    });
    const [selectedFamily, setSelectedFamily] = useState<Family | null>(families[0] || null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
  
    const handleFamilyChange = (familyId: string) => {
      const family = families.find(f => f.id === familyId);
      setSelectedFamily(family || null);
      setFormData({ ...formData, familyId, assignedToId: '' });
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');
  
      try {
        const response = await apiClient.createTask({
          ...formData,
          points: Number(formData.points),
          dueDate: formData.dueDate || undefined,
          assignedToId: formData.assignedToId || undefined
        });
        
        if (response.success) {
          onSuccess();
          onClose();
        } else {
          setError(response.error || t('taskModal.errors.createFailed'));
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : t('taskModal.errors.createFailed'));
      } finally {
        setIsLoading(false);
      }
    };
  
    const commonCategories = [
      { key: 'cleaning', label: t('taskModal.categories.cleaning') },
      { key: 'laundry', label: t('taskModal.categories.laundry') },
      { key: 'cooking', label: t('taskModal.categories.cooking') },
      { key: 'shopping', label: t('taskModal.categories.shopping') },
      { key: 'maintenance', label: t('taskModal.categories.maintenance') },
      { key: 'petCare', label: t('taskModal.categories.petCare') },
      { key: 'garden', label: t('taskModal.categories.garden') },
      { key: 'other', label: t('taskModal.categories.other') }
    ];
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="text-gray-600 bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{t('taskModal.create.title')}</h3>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
  
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 任務標題 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('taskModal.fields.titleRequired')}
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder={t('taskModal.placeholders.title')}
                required
              />
            </div>
  
            {/* 任務描述 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('taskModal.fields.description')}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder={t('taskModal.placeholders.description')}
                rows={3}
              />
            </div>
  
            {/* 群組選擇 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('taskModal.fields.group')}
              </label>
              <select
                value={formData.familyId}
                onChange={(e) => handleFamilyChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
              >
                {families.map((family) => (
                  <option key={family.id} value={family.id}>
                    {family.name}
                  </option>
                ))}
              </select>
            </div>
  
            {/* 分配給成員 */}
            {selectedFamily && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('taskModal.fields.assignTo')}
                </label>
                <select
                  value={formData.assignedToId}
                  onChange={(e) => setFormData({ ...formData, assignedToId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="">{t('taskModal.fields.assignLater')}</option>
                  {selectedFamily.members.map((member: any) => (
                    <option key={member.user.id} value={member.user.id}>
                      {member.user.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
  
            {/* 任務分類和積分 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('taskModal.fields.category')}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="">{t('taskModal.fields.selectCategory')}</option>
                  {commonCategories.map((category) => (
                    <option key={category.key} value={category.label}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('taskModal.fields.points')}
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="0"
                />
              </div>
            </div>
  
            {/* 優先級和截止日期 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('taskModal.fields.priority')}
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="LOW">{t('taskModal.priorities.low')}</option>
                  <option value="MEDIUM">{t('taskModal.priorities.medium')}</option>
                  <option value="HIGH">{t('taskModal.priorities.high')}</option>
                  <option value="URGENT">{t('taskModal.priorities.urgent')}</option>
                </select>
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('taskModal.fields.dueDate')}
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
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
                disabled={isLoading || !formData.title.trim() || !formData.category || !formData.familyId}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                {isLoading ? t('taskModal.create.loading') : t('taskModal.create.button')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }