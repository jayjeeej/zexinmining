'use client';

import React from 'react';
import Link, { LinkProps } from 'next/link';
import { useNavigation } from '../contexts/NavigationContext';

type NavigationLinkProps = LinkProps & {
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export default function NavigationLink({
  href,
  children,
  className,
  onClick,
  ...props
}: NavigationLinkProps) {
  const { startNavigation } = useNavigation();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // 允许默认的onClick处理
    if (onClick) {
      onClick(e);
    }

    // 如果事件已被阻止默认行为，不进行拦截
    if (e.defaultPrevented) {
      return;
    }

    // 如果按下了修饰键或者是外部链接，不进行拦截
    if (
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      (typeof href === 'string' && href.startsWith('http'))
    ) {
      return;
    }
    
    e.preventDefault();
    startNavigation(typeof href === 'string' ? href : href.pathname || '');
  };

  return (
    <Link
      href={href}
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
} 