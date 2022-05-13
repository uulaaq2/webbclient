import React, { createContext } from 'react'
import { useInterpret } from '@xstate/react'
import { authMachine } from 'state/authMachine'

export const GlobalStateContext = createContext({});

export const GlobalStateProvider = (props) => {
  const authService = useInterpret(authMachine);

  return (
    <GlobalStateContext.Provider value={{ authService }}>
      {props.children}
    </GlobalStateContext.Provider>
  );
};