import { useEffect } from 'react';
import { useRouter } from 'next/router';

// 创建一个静态页面作为备份，当动态路由失败时使用
export default function AboutPage() {
  const router = useRouter();
  
  useEffect(() => {
    // 重定向到app目录中正确的about页面
    router.push('/en/about');
  }, [router]);
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>Loading About Page...</h1>
    </div>
  );
}

// 生成静态页面
export const getStaticProps = async () => {
  return {
    props: {},
    revalidate: 60, // 每60秒重新验证一次
  };
}; 