import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleCreateForm = () => setShowCreateForm((prev) => !prev);

  return (
    <AppContext.Provider value={{ showCreateForm, toggleCreateForm,setShowCreateForm, searchTerm, setSearchTerm }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);