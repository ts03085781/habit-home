# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Information

- **Project Name**: HabitHome (habit-home)
- **Description**: 智能家務分配工具，專為情侶、室友和家庭設計 | Smart household task allocation tool designed for couples, roommates, and families
- **Repository Status**: Git repository initialized
- **Technology Stack**: Next.js 15, TypeScript, Tailwind CSS, React 18

## Development Commands

```bash
# 開發模式 | Development server
npm run dev

# 構建項目 | Build for production
npm run build

# 啟動生產服務器 | Start production server
npm run start

# 代碼檢查 | Lint code
npm run lint

# 類型檢查 | Type check
npm run type-check
```

## Project Structure

```
habitHome/
├── src/
│   └── app/
│       ├── layout.tsx      # 根佈局組件 | Root layout component
│       ├── page.tsx        # 首頁組件 | Home page component
│       └── globals.css     # 全局樣式 | Global styles
├── package.json            # 項目配置和依賴 | Project configuration and dependencies
├── tsconfig.json          # TypeScript 配置 | TypeScript configuration
├── tailwind.config.ts     # Tailwind CSS 配置 | Tailwind CSS configuration
├── postcss.config.mjs     # PostCSS 配置 | PostCSS configuration
├── next.config.js         # Next.js 配置 | Next.js configuration
└── .eslintrc.json        # ESLint 配置 | ESLint configuration
```

## Architecture

- **Frontend Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for rapid UI development
- **Build Tool**: Next.js built-in bundler
- **Code Quality**: ESLint for code linting

## Development Guidelines | 開發指南

1. 使用 TypeScript 進行開發，確保類型安全 | Use TypeScript for development to ensure type safety
2. 遵循 Next.js App Router 的最佳實踐 | Follow Next.js App Router best practices
3. 使用 Tailwind CSS 進行樣式設計 | Use Tailwind CSS for styling
4. 運行 `npm run lint` 和 `npm run type-check` 確保代碼質量 | Run `npm run lint` and `npm run type-check` to ensure code quality
5. 提交前確保所有測試通過 | Ensure all tests pass before committing

## Current Status | 目前狀態

✅ 項目初始化完成 | Project initialization completed
✅ 基礎開發環境配置完成 | Basic development environment configuration completed
✅ 首頁界面創建完成 | Home page interface creation completed
🚧 正在進行 MVP 功能開發 | Currently developing MVP features

---

**項目已成功初始化並配置了完整的開發環境！ | Project has been successfully initialized with a complete development environment!**