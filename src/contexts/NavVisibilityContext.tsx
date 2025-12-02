import React, { createContext, useContext, useState } from 'react';

interface NavVisibilityContextType {
  showNav: boolean;
  setShowNav: (show: boolean) => void;
}

const NavVisibilityContext = createContext<NavVisibilityContextType | undefined>(undefined);

export function NavVisibilityProvider({ children }: { children: React.ReactNode }) {
  const [showNav, setShowNav] = useState(true);

  return (
    <NavVisibilityContext.Provider value={{ showNav, setShowNav }}>
      {children}
    </NavVisibilityContext.Provider>
  );
}

export function useNavVisibility() {
  const context = useContext(NavVisibilityContext);
  if (context === undefined) {
    throw new Error('useNavVisibility must be used within a NavVisibilityProvider');
  }
  return context;
}