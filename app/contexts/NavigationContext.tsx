'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface NavigationContextType {
  isNavigating: boolean;
  startNavigation: (href: string) => void;
  completeNavigation: () => void;
  cancelNavigation: () => void;
  pendingUrl: string | null;
}

const NavigationContext = createContext<NavigationContextType>({
  isNavigating: false,
  startNavigation: () => {},
  completeNavigation: () => {},
  cancelNavigation: () => {},
  pendingUrl: null
});

export const useNavigation = () => useContext(NavigationContext);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const router = useRouter();
  const currentPathname = usePathname();

  const startNavigation = useCallback((href: string) => {
    // 如果是锚点导航或当前页面，不拦截
    if (href.startsWith('#') || (href === currentPathname)) {
      router.push(href);
      return;
    }
    
    setIsNavigating(true);
    setPendingUrl(href);
  }, [router, currentPathname]);

  const completeNavigation = useCallback(() => {
    if (pendingUrl) {
      router.push(pendingUrl);
      setIsNavigating(false);
      setPendingUrl(null);
    }
  }, [pendingUrl, router]);

  const cancelNavigation = useCallback(() => {
    setIsNavigating(false);
    setPendingUrl(null);
  }, []);

  return (
    <NavigationContext.Provider 
      value={{ 
        isNavigating, 
        startNavigation, 
        completeNavigation, 
        cancelNavigation,
        pendingUrl
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
} 