import { apiClient } from '@/lib/api-client';
import { Task } from "@/types/common";
import { getTranslations, type Locale } from '@/lib/translations';

// 任務卡片組件
export default function TaskCard({ 
    task, 
    onUpdate, 
    onEdit, 
    onDelete,
    locale = 'zh'
  }: { 
    task: Task; 
    onUpdate: () => void;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
    locale?: Locale;
  }) {
    const { t } = getTranslations(locale);
    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case 'HIGH': return 'text-red-600 bg-red-50';
        case 'URGENT': return 'text-red-800 bg-red-100';
        case 'MEDIUM': return 'text-yellow-600 bg-yellow-50';
        case 'LOW': return 'text-green-600 bg-green-50';
        default: return 'text-gray-600 bg-gray-50';
      }
    };
  
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'COMPLETED': return 'text-green-700 bg-green-100';
        case 'IN_PROGRESS': return 'text-blue-700 bg-blue-100';
        case 'PENDING': return 'text-gray-700 bg-gray-100';
        case 'CANCELLED': return 'text-red-700 bg-red-100';
        default: return 'text-gray-700 bg-gray-100';
      }
    };
  
    const getStatusText = (status: string) => {
      switch (status) {
        case 'COMPLETED': return t('taskCard.status.completed');
        case 'IN_PROGRESS': return t('taskCard.status.inProgress');
        case 'PENDING': return t('taskCard.status.pending');
        case 'CANCELLED': return t('taskCard.status.cancelled');
        default: return status;
      }
    };
  
    const getPriorityText = (priority: string) => {
      switch (priority) {
        case 'HIGH': return t('taskCard.priorities.high');
        case 'URGENT': return t('taskCard.priorities.urgent');
        case 'MEDIUM': return t('taskCard.priorities.medium');
        case 'LOW': return t('taskCard.priorities.low');
        default: return priority;
      }
    };
  
    const handleStatusUpdate = async (newStatus: string) => {
      try {
        const response = await apiClient.updateTask(task.id, { status: newStatus });
        if (response.success) {
          onUpdate();
        }
      } catch (error) {
        console.error(t('taskCard.updateError'), error);
      }
    };
  
    return (
      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-3 gap-5">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-3">{task.title}</h3>
            {task.description && (
              <p className="text-base rounded-lg bg-gray-100 text-gray-600 mb-3 p-4 w-fit">{task.description}</p>
            )}
            <div className="flex items-center flex-wrap gap-5 text-sm">
              <span className="text-gray-500">{t('dashboard.tasks.group')}: {task.family.name}</span>
              <span className="text-gray-500">{t('dashboard.tasks.category')}: {task.category}</span>
              {task.points > 0 && (
                <span className="text-primary-600 font-medium">🏆 {t('common.points')}: {task.points}</span>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            <div className="flex space-x-2 mb-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                {getPriorityText(task.priority)}
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                {getStatusText(task.status)}
              </span>
            </div>
            {/* 編輯和刪除按鈕 */}
            <div className="flex space-x-1">
              <button
                onClick={() => onEdit(task)}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                title={t('taskCard.editTask')}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(task)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                title={t('taskCard.deleteTask')}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
  
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {task.assignedTo ? (
              <div className="flex items-center space-x-2">
                {/* <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold text-xs">
                    {task.assignedTo.name.charAt(0).toUpperCase()}
                  </span>
                </div> */}
                <span>{t('dashboard.tasks.assignedTo')} {task.assignedTo.name}</span>
              </div>
            ) : (
              <span className="text-orange-600">{t('dashboard.tasks.unassigned')}</span>
            )}
            
            {task.dueDate && (
              <span>{t('dashboard.tasks.dueDate')}：{new Date(task.dueDate).toLocaleDateString(locale === 'zh' ? 'zh-TW' : 'en-US')}</span>
            )}
          </div>
  
          {task.status !== 'COMPLETED' && task.status !== 'CANCELLED' && (
            <div className="flex space-x-2">
              {task.status === 'PENDING' && (
                <button
                  onClick={() => handleStatusUpdate('IN_PROGRESS')}
                  className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xl font-medium rounded-md transition-colors"
                >
                  {t('dashboard.tasks.start')}
                </button>
              )}
              {task.status === 'IN_PROGRESS' && (
                <button
                  onClick={() => handleStatusUpdate('COMPLETED')}
                  className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 text-xl font-medium rounded-md transition-colors"
                >
                  {t('dashboard.tasks.complete')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }