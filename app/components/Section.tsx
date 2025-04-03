import { ReactNode } from 'react';

// 页面区块组件
const Section = ({ 
  children, 
  className = "", 
  bgColor = "bg-white" 
}: { 
  children: ReactNode;
  className?: string;
  bgColor?: string;
}) => (
  <section className={`${bgColor} py-16 ${className} w-full`}>
    <div className="container mx-auto px-4 w-full max-w-[1200px]">
      {children}
    </div>
  </section>
);

export default Section; 