import { createMachine, interpret, assign } from 'xstate'
import getUserWithCredentials from 'functions/user/getUserWithCredentials'
import getUserWithToken from 'functions/user/getUserWithToken'
import { setLocalStorage } from 'functions/localStorage';
import { setError, setSuccess, setWarning } from 'functions/setReply';
import getUser from './../../functions/user/getUserWithCredentials';
import changeUserPassword from './../../functions/user/changeUserPassword';

export const authMachine = createMachine({
  id: 'authMachine',
  preserveActionOrder: true,
  initial: 'waiting',
  context: {
    userInfo: {
      status: ''
    },
    signInType: '',
    clientRememberMe: false,
    inProgress: false
  },

  states: {

    waiting: {      
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
        SIGN_IN: {
          target: 'gettingUserInfo',          
          cond: (context) => context.userInfo.status !== 'ok'
        }
      }
    },
    
    clearingContext: {
      always: {
        actions: (context) => doClearContext(context),
        target: 'waiting'
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
    const { type = '', email = undefined, password = undefined, rememberMe = undefined, token = undefined } = event        
    let signInType    
    let getUserResult
    let rememberMeTemp = rememberMe

    if (type === 'signInWithCredentials') {
      signInType = 'credentials'
      getUserResult = await getUserWithCredentials(email, password)
    }
    
    if (type === 'signInWithToken') {
      signInType = 'token'
      rememberMeTemp = true
      if (token) {
        getUserResult = await getUserWithToken(token)
      } 
    }

    if (type === 'changeUserPassword') {
      signInType = 'credentials'      
      rememberMeTemp = rememberMe || (context.userInfo.status !== '' ? context.clientRememberMe : undefined)
      getUserResult = await changeUserPassword(token, password)
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