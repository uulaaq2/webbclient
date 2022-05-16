import { createMachine, interpret, assign } from 'xstate'
import getUser from 'functions/user/getUser'
import { setLocalStorage } from 'functions/localStorage';
import { setError } from 'functions/setReply';

export const authMachine = createMachine({
  id: 'authMachine',
  preserveActionOrder: true,
  initial: 'pending',
  context: {
    userInfo: undefined,
    inProgress: false
  },

  states: {

    pending: {
     
      on: {
        SIGN_IN: {
          target: 'gettingUserInfo'        
        }
      }
    },    

    gettingUserInfo: {      
      entry: assign({ inProgress: true }),
      invoke: {
        id: 'getUser',
        src: doGetUser,
        onDone: {
          target: 'validatingUser'
        },
        onError: {
          target: 'error'
        }
      },
      exit: assign({ userInfo: (context, event) => event.data })
    },

    validatingUser: {
      always: [
        {
          target: 'settingToken',          
          cond: (context, event) => context.userInfo.status === 'ok'
        },
        {
          target: 'accountIsExpired',
          cond: (context, event) => context.userInfo.status === 'accountIsExpired'
        },
        {
          target: 'shouldChangePassword',
          cond: (context, event) => context.userInfo.status === 'shouldChangePassword'
        },        
        {
          target: 'warning',
          cond: (context, event) => context.userInfo.status === 'warning'
        },
        {
          target: 'error',
          cond: (context, event) => context.userInfo.status === 'error'
        },
        {
          target: 'fail'
        }
      ]      
    },

    accountIsExpired: {
      always: {
        target: 'finish'
      }
    },

    shouldChangePassword: {
      always: {
        target: 'finish'
      }
    },

    settingToken: {
      invoke: {
        id: 'storeToken',
        src: doStoreToken,
        onDone: {
          target: 'finish'
        }
      }
    },

    warning: {
      always: {
        target: 'finish'
      }
    },

    error: {
      always: {
        target: 'finish'
      }
    },

    fail: {
      always: {        
        target: 'finish'
      }
    },    

    finish: {
      entry: assign({ inProgress: false }),      
      actions: () => console.log('aaa'),
      type: 'final'
    }

  }
  
})

// Interpret the machine, and add a listener for whenever a transition occurs.
const service = interpret(authMachine).onTransition((state) => {
  console.log(state.value)
})

// Start the service
service.start()

// functions

async function doGetUser(context, event) {
  try {
    const { email, password, rememberMe } = event

    const user = await getUser(email, password)

    return {
      ...user,
      clientRememberMe: rememberMe
    }
  } catch (error) {
    return setError(error)
  }
}

async function doStoreToken(context, event) {
  try {
    const { token, clientRememberMe } = context.userInfo
    const { Can_Be_Remembered } = context.userInfo.user    

    const setTokenResult = await setLocalStorage('token', token, clientRememberMe && Can_Be_Remembered)

    return setTokenResult
  } catch (error) {
    return setError(error)
  }
}