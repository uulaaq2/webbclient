import { createMachine, interpret, assign } from 'xstate'
import getUserWithCredentials from 'functions/user/getUserWithCredentials'
import getUserWithToken from 'functions/user/getUserWithToken'
import { setLocalStorage } from 'functions/localStorage';
import { setError, setSuccess, setWarning } from 'functions/setReply';

export const authMachine = createMachine({
  id: 'authMachine',
  preserveActionOrder: true,
  initial: 'pending',
  context: {
    userInfo: {
      status: ''
    },
    signInType: '',
    clientRememberMe: false,
    inProgress: false
  },

  states: {

    pending: {      
      on: {
        SIGN_IN: {
          target: 'gettingUserInfo'        
        },
        FAIL: {
          target: 'finished'
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
      exit: [
              assign({ signInType: (context, event) => event.data.signInType }),      
              assign({ clientRememberMe: (context, event) => event.data.clientRememberMe }),
              assign({ userInfo: (context, event) => event.data.userInfo })            
            ]
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
      entry: assign({ inProgress: false }),     
      always: {
        target: 'finished'
      }
    },    

    shouldChangePassword: {
      always: {
        target: 'finished'
      }
    },

    warning: {
      entry: assign({ inProgress: false }),     
      always: {
        target: 'finished'
      }
    },

    error: {
      entry: assign({ inProgress: false }),
      always: {
        target: 'finished'
      }
    },

    fail: {
      entry: assign({ inProgress: false }),
      always: {        
        target: 'finished'
      }
    },    

    finished: {
      on: {
        RESET: {
          target: 'pending'
        }
      }
    },
    
    clearingContext: {
      always: {
        actions: (context) => doClearContext(context),
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
    const { email = undefined, password = undefined, rememberMe = undefined, token = undefined } = event
    const signInType = email ? 'credentials' : 'token'    
    let getUserResult
    let rememberMeTemp = rememberMe

    if (signInType === 'credentials') {
      getUserResult = await getUserWithCredentials(email, password)
    } else {
      rememberMeTemp = true
      if (token) {
        getUserResult = await getUserWithToken(token)
      } 
    }    

    return {
      userInfo: getUserResult || { ...context },
      signInType,
      clientRememberMe: rememberMeTemp || false
    }
  } catch (error) {
    return {
      userInfo: setError(error)
    }
  }
}

// store token, depending on config storeType
async function doStoreToken(context, event) {
  try {
    if (context.signInType === 'token') {
      return setSuccess()
    }


    const { clientRememberMe = false } = context
    const { token = '' } = context.userInfo    
    const { Can_Be_Remembered = false } = context.userInfo.user    

    const setTokenResult = await setLocalStorage('token', token, clientRememberMe && Can_Be_Remembered)

    return setTokenResult
  } catch (error) {
    return setError(error)
  }
}

// clear context
function doClearContext(context) {
  context = {
    userInfo: {
      status: ''
    },
    inProgress: false
  }  

  console.log(context)
}