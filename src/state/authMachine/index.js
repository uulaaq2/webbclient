import { createMachine, interpret, send } from 'xstate';

export const authMachine = createMachine({
  id: 'authMachine',
  preserveActionOrder: true,
  initial: 'init',
  context: {
    userInfo: undefined,
    inProgress: false
  },

  states: {
    init: {
      on: {
        onA: {
          actions: () => console.log(' A')
        },
        onB: {
         target: 'abc'
        }
      }
    },
    abc: {
      always: {
        actions: () => console.log('always')
      },
      on: {
        onC: {
            actions: () => console.log('C')
        }
      }
    },
    ccc: {
      on: {
        onD: {
          actions: () => console.log('D'),
        }
      }
    },
    ddd: {
      on: {
        onE: {
          actions: () => console.log('E')
        }
      }
    }

  }
  
})

// Interpret the machine, and add a listener for whenever a transition occurs.
const service = interpret(authMachine).onTransition((state) => {
  console.log(state.value)
})

// Start the service
service.start()