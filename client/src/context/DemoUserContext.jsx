import React, { createContext, useContext, useState, useEffect } from 'react';

const DemoUserContext = createContext(null);

export const DemoUserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('travelease_demo_user');
      return stored ? JSON.parse(stored) : { email: 'traveler@travelease.com', name: 'Demo Explorer' };
    } catch {
      return { email: 'traveler@travelease.com', name: 'Demo Explorer' };
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginRedirectAction, setLoginRedirectAction] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('travelease_demo_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('travelease_demo_user');
    }
  }, [user]);

  const login = (email, name = '') => {
    const cleanEmail = email.trim().toLowerCase();
    const displayName = name.trim() || cleanEmail.split('@')[0];
    const newUser = { email: cleanEmail, name: displayName };
    setUser(newUser);
    setIsLoginModalOpen(false);
    if (loginRedirectAction) {
      loginRedirectAction();
      setLoginRedirectAction(null);
    }
    return newUser;
  };

  const logout = () => {
    setUser(null);
  };

  const openLoginModal = (onSuccessAction = null) => {
    if (onSuccessAction) setLoginRedirectAction(() => onSuccessAction);
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setLoginRedirectAction(null);
  };

  return (
    <DemoUserContext.Provider
      value={{
        user,
        isAuthenticated: !!user?.email,
        login,
        logout,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </DemoUserContext.Provider>
  );
};

export const useDemoUser = () => {
  const context = useContext(DemoUserContext);
  if (!context) {
    throw new Error('useDemoUser must be used within a DemoUserProvider');
  }
  return context;
};
