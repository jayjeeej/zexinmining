import { useLanguage } from "../contexts/LanguageContext";

// 简单的双语文本类型
export type BilingualText = {
  zh: string;
  en: string;
};

// 创建一个组件使用的 hook，返回当前语言的文本值
export function useT() {
  const { isZh } = useLanguage();
  
  // 返回当前语言的文本
  return (text: BilingualText): string => {
    return isZh ? text.zh : text.en;
  };
}

// 创建一个函数用于嵌套的多语言对象
export function createI18nObject<T extends Record<string, BilingualText>>(obj: T) {
  const useTranslations = () => {
    const { isZh } = useLanguage();
    
    const result: Record<string, string> = {};
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = isZh ? obj[key].zh : obj[key].en;
      }
    }
    
    return result as { [K in keyof T]: string };
  };
  
  return useTranslations;
}

// 示例用法
// const useHomeTranslations = createI18nObject({
//   title: { zh: "首页", en: "Home" },
//   description: { zh: "描述", en: "Description" }
// });
// 然后在组件中: const { title, description } = useHomeTranslations(); 