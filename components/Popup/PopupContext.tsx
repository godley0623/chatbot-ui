import React, { createContext, useContext, useState, ReactNode } from 'react';

type Popup = {
    hidden: boolean,
    icon: string,
    text: string
}
interface PopupState {
  popupValue: Popup;
  updatePopupValue: (value: Popup) => void;
}

const PopupStateContext = createContext<PopupState | undefined>(undefined);

interface PopupStateProviderProps {
  children: ReactNode;
}

export const PopupStateProvider: React.FC<PopupStateProviderProps> = ({
  children,
}) => {
  const [popupValue, setPopupValue] = useState({hidden: true, icon: "", text: ""});

  const updatePopupValue = (value: Popup) => {
    setPopupValue(value);
  };

  const contextValue: PopupState = {
    popupValue,
    updatePopupValue,
  };

  return (
    <PopupStateContext.Provider value={contextValue}>
      {children}
    </PopupStateContext.Provider>
  );
};

export const usePopupState = (): PopupState => {
  const context = useContext(PopupStateContext);
  if (!context) {
    throw new Error('usePopupState must be used within a PopupStateProvider');
  }
  return context;
};
