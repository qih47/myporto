import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('EN'); // Default: English

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'EN' ? 'ID' : 'EN'));
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
