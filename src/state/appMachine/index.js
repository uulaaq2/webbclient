import { createContext } from 'react';
import { createMachine } from 'xstate';

export const AppMachineContext = createContext()
export const appMachine = createMachine({
  id: 'app',
  initial: 'init',
  context: {
    user: undefined
  },
  states: {
    init: {},

    auth: {
      start: {},
      success: {},
      fail: {}
    }
  }
})