import {notFound} from 'next/navigation';
import {ReactNode} from 'react';

type Props = {
  children: ReactNode;
  params: Promise<{locale: string}>;
};

export function generateStaticParams() {
  return [{locale: 'en'}, {locale: 'zh'}];
}

export async function generateMetadata({params}: Props) {
  const {locale} = await params;
  const isZh = locale === 'zh';
  
  return {
    title: isZh ? "HabitHome - 智能家務分配工具" : "HabitHome - Smart Chore Distribution Tool",
    description: isZh 
      ? "為情侶、室友和家庭設計的公平家務分配平台" 
      : "Fair chore distribution platform designed for couples, roommates, and families",
    keywords: isZh 
      ? "家務分配, 家庭管理, 任務分配, 情侶工具" 
      : "chore distribution, household management, task allocation, couple tools",
    authors: [{ name: "HabitHome Team" }],
    viewport: "width=device-width, initial-scale=1",
  };
}

export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;
  
  // Validate that the incoming locale parameter is valid
  if (!['en', 'zh'].includes(locale)) {
    notFound();
  }

  return children;
}