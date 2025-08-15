// Translation messages for validation
export const validationMessages = {
  en: {
    email: {
      invalid: 'Please enter a valid email address',
      required: 'Email is required'
    },
    password: {
      minLength: 'Password must be at least 6 characters',
      maxLength: 'Password cannot exceed 100 characters',
      required: 'Password cannot be empty'
    },
    name: {
      required: 'Name cannot be empty',
      maxLength: 'Name cannot exceed 50 characters'
    },
    confirmPassword: {
      mismatch: 'Password confirmation does not match'
    },
    refreshToken: {
      required: 'Refresh token cannot be empty'
    },
    family: {
      nameRequired: 'Family name cannot be empty',
      nameMaxLength: 'Family name cannot exceed 50 characters',
      descriptionMaxLength: 'Description cannot exceed 200 characters'
    },
    inviteCode: {
      required: 'Invite code cannot be empty'
    },
    task: {
      titleRequired: 'Task title cannot be empty',
      titleMaxLength: 'Task title cannot exceed 100 characters',
      descriptionMaxLength: 'Task description cannot exceed 500 characters',
      pointsMin: 'Points cannot be negative',
      pointsMax: 'Points cannot exceed 1000',
      categoryRequired: 'Task category cannot be empty',
      categoryMaxLength: 'Task category cannot exceed 50 characters',
      priorityInvalid: 'Priority must be one of LOW, MEDIUM, HIGH, or URGENT',
      familyIdRequired: 'Family ID cannot be empty',
      assignedToRequired: 'Assigned user ID cannot be empty'
    }
  },
  zh: {
    email: {
      invalid: '請輸入有效的電子郵件地址',
      required: '電子郵件為必填項'
    },
    password: {
      minLength: '密碼至少需要6個字符',
      maxLength: '密碼不能超過100個字符',
      required: '密碼不能為空'
    },
    name: {
      required: '姓名不能為空',
      maxLength: '姓名不能超過50個字符'
    },
    confirmPassword: {
      mismatch: '密碼確認不匹配'
    },
    refreshToken: {
      required: 'Refresh token不能為空'
    },
    family: {
      nameRequired: '家庭名稱不能為空',
      nameMaxLength: '家庭名稱不能超過50個字符',
      descriptionMaxLength: '描述不能超過200個字符'
    },
    inviteCode: {
      required: '邀請碼不能為空'
    },
    task: {
      titleRequired: '任務標題不能為空',
      titleMaxLength: '任務標題不能超過100個字符',
      descriptionMaxLength: '任務描述不能超過500個字符',
      pointsMin: '積分不能為負數',
      pointsMax: '積分不能超過1000',
      categoryRequired: '任務類別不能為空',
      categoryMaxLength: '任務類別不能超過50個字符',
      priorityInvalid: '優先級必須是 LOW, MEDIUM, HIGH, 或 URGENT 之一',
      familyIdRequired: '家庭ID不能為空',
      assignedToRequired: '被分配用戶ID不能為空'
    }
  }
};

export type Locale = 'en' | 'zh';

export function getValidationMessages(locale: Locale = 'en') {
  return validationMessages[locale];
}