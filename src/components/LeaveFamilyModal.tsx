import { useState } from "react";
import { apiClient } from '@/lib/api-client';
import { Family } from '@/types/common';

interface LeaveFamilyModalProps {
  family: Family;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LeaveFamilyModal({ family, onClose, onSuccess }: LeaveFamilyModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLeaveFamily = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.leaveFamily(family.id);
      if (response.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.error || '退出群組失敗');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : '退出群組失敗');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-red-100 rounded-lg mr-3">
            <span className="text-red-600 text-xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">退出群組</h2>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            您確定要退出群組 <span className="font-semibold text-gray-900">&ldquo;{family.name}&rdquo;</span> 嗎？
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-800 text-sm">
              ⚠️ 退出後您將無法再訪問該群組的任務和資訊，除非重新加入。
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors disabled:opacity-50"
          >
            取消
          </button>
          <button
            onClick={handleLeaveFamily}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? '處理中...' : '確認退出'}
          </button>
        </div>
      </div>
    </div>
  );
}
