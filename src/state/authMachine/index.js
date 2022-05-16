import { createMachine, interpret, assign } from 'xstate'
import getUser from 'functions/user/getUser'
import { setLocalStorage } from 'functions/localStorage';
import { setError } from 'functions/setReply';

export const authMachine = createMachine({
  id: 'authMachine',
  preserveActionOrder: true,
  initial: 'pending',
  context: {
    userInfo: {
      status: ''
    },
    inProgress: false
  },

  states: {

    pending: {
     
      on: {
        SIGN_IN: {
          target: 'gettingUserInfo'        
        },
        CLEAR_CONTEXT: {
          target: 'clearingContext'
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
          target: 'warning',          
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
          target: 'error',
          cond: (context, event) => context.userInfo.status !== 'ok'
        },
        {
          target: 'settingToken',          
          cond: (context, event) => context.userInfo.status === 'ok'
        }
      ]      
    },

    settingToken: {
      invoke: {
        id: 'storeToken',
        src: doStoreToken,
        onDone: [
          {
            target: 'success',
            cond: (context, event) => event.data.status === 'ok'
          },
          {
            target: 'warning',
            cond: (context, event) => event.data.status === 'warning'
          },
          {
            target: 'error',
            cond: (context, event) => event.data.status === 'error'
          }
        ]
      }
    },
    
    success: {
      always: {
        target: 'finish'
      }
    },    

    shouldChangePassword: {
      always: {
        target: 'finish'
      }
    },

    warning: {
      entry: assign({ inProgress: false }),     
      always: {
        target: 'finish'
      }
    },

    error: {
      entry: assign({ inProgress: false }),
      always: {
        target: 'finish'
      }
    },

    fail: {
      entry: assign({ inProgress: false }),
      always: {        
        target: 'finish'
      }
    },    

    finish: {
      on: {
        SIGN_IN: {
          target: 'gettingUserInfo'        
        }
      }
    },
    
    clearingContext: {
      always: {
        actions: (context) => clearContext(context),
        target: 'pending'
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

// functions


// get user
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

// store token, depending on config storeType
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

// clear context
function clearContext(context) {
  context = {
    userInfo: {
      status: ''
    },
    inProgress: false
  }  

  console.log(context)
}