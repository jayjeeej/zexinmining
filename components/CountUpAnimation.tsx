'use client';

import React, { useEffect, useRef } from 'react';

interface CountUpAnimationProps {
  end: number;
  duration?: number;
  suffix?: string;
  className?: string;
  triggerOnce?: boolean;
}

/**
 * 使用CSS动画实现计数器效果的组件
 * 避免使用状态更新，从而减少不必要的重新渲染
 */
export default function CountUpAnimation({
  end,
  duration = 1000,
  suffix = '%',
  className = '',
  triggerOnce = true
}: CountUpAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationTriggered = useRef<boolean>(false);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && (triggerOnce ? !animationTriggered.current : true)) {
          animationTriggered.current = true;
          containerRef.current?.classList.add('animate-count');
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(containerRef.current);
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [triggerOnce]);
  
  // 初始化显示0
  const initialValue = 0;
  
  return (
    <div 
      ref={containerRef} 
      className={`count-up-animation ${className}`}
      data-end={end}
      data-suffix={suffix}
    >
      <style jsx>{`
        .count-up-animation {
          position: relative;
        }
        
        .count-up-animation::before {
          content: "${initialValue}${suffix}";
          visibility: visible;
        }
        
        .count-up-animation.animate-count::before {
          animation: countUpAnimation ${duration}ms forwards ease-out;
        }
        
        @keyframes countUpAnimation {
          0% { content: "${initialValue}${suffix}"; }
          10% { content: "${Math.round(end * 0.1)}${suffix}"; }
          20% { content: "${Math.round(end * 0.2)}${suffix}"; }
          30% { content: "${Math.round(end * 0.3)}${suffix}"; }
          40% { content: "${Math.round(end * 0.4)}${suffix}"; }
          50% { content: "${Math.round(end * 0.5)}${suffix}"; }
          60% { content: "${Math.round(end * 0.6)}${suffix}"; }
          70% { content: "${Math.round(end * 0.7)}${suffix}"; }
          80% { content: "${Math.round(end * 0.8)}${suffix}"; }
          90% { content: "${Math.round(end * 0.9)}${suffix}"; }
          100% { content: "${end}${suffix}"; }
        }
      `}</style>
    </div>
  );
} 