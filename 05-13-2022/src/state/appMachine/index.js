import { createContext } from 'react'
import { createMachine, assign, actions, useMachine } from 'xstate'
import signInWithCredentials from 'functions/user/signInWithCredentials'
import changeUserPassword from 'functions/user/changeUserPassword'
import { setSuccess, setWarning, setError } from 'functions/setReply'
import { setLocalStorage } from 'functions/localStorage'

const [state, send, service] = useMachine(appMachine);

// app global context
export const AppMachineContext = createContext()

// app machine to prepare the global app context
export const appMachine = createMachine({
  id: 'app',
  preserveActionOrder: true,
  initial: 'init',
  context: {
    userInfo: undefined,
    inProgress: false
  },

  states: {
    init: {},

    auth: {
      states: {
        gettingUser: {
          entry: assign({ inProgress: true}),
          invoke: {
            id: 'getUser',   
            src: doSignInWithCredentials,                        
            onDone:{
              //target: 'validatingUser',
              actions: () => console.log('validatingUser'),
              actions: actions.send('MY_EVENT_NAME', { to: context => context.sendTo })
              //actions: assign({ userInfo: (context, event) => event.data })
            },
            onError: {
              target: 'failed'
            }          
          }        
        // gettingUser
        },
        changingUserPassword: {
          
        // changingUserPassword
        },
        validatingUser: {
          DENEME: 
            {     
              target: 'success',
              //actions: (context, event) => console.log(context, event.data.status),
              cond: (context, event) => context.userInfo.status === 'ok'
            },
          
        },
        storingToken: {
          entry: assign({ inProgress: true}),
          invoke: {
            id: 'storeToken',   
            src: doStoreToken,            
            onDone: [
              {     
                target: 'success',
                //cond: (context, event) => event.data.status === 'ok'
              },
              {
                target: 'failed'
              }
            ],
            onError: {
              target: 'failed'
            }          
          }        
        // storingToken
        },
        success: {          
          entry: () => console.log('success'),
          type: 'final'
        // success  
        },
        accountIsExpired : {
          entry: assign({ inProgress: false}),
          type: 'final'
        // accountIsExpired
        },
        shouldChangePassword: {
          entry: assign({ inProgress: false}),
          type: 'final'
        // shouldChangePassword
        },
        warning : {
          entry: assign({ inProgress: false}),
          type: 'final'
        // warning
        },
        error: {
          entry: assign({ inProgress: false}),
          type: 'final'
        // error
        },        
        failed: {          
          entry: assign({ inProgress: false}),
          type: 'final'
        // failed
        }
      // auth states
      } 
    // auth end   
    }

  // main state
  },

  on: {
    SIGN_IN_WITH_CREDENTIALS: {
      target: 'auth.gettingUser'
    },
    CHANGE_USER_PASSWORD: {
      target: 'auth.changingUserPassword'
    }
  } 

})

// sign in with credentials
async function doSignInWithCredentials(context, event) {  
  try {
    const { email, password, rememberMe } = event

    const signInWithCredentialsResult = await signInWithCredentials(email, password)    

    return {
      ...signInWithCredentialsResult,
      clientRememberMe: rememberMe
    }
  } catch (error) {
    return setError(error)   
  }
}

// change user password
async function doChangeUserPassword(context, event) {
  try {
    const { token, newPassword, rememberMe } = event

    const changeUserPasswordResult = await changeUserPassword(token, newPassword)

    return {
      ...changeUserPasswordResult,
      clientRememberMe: rememberMe
    }
  } catch (error) {
    return setError(error)
  }
}

// set token Local storage
async function doStoreToken(context, event) {
  try {        
    console.log('aaa')
    let rememberMe = event.data.clientRememberMe && event.data.user.Can_Be_Remembered
    
    return setLocalStorage('token', event.data.token, rememberMe)
  } catch (error) {

    return setError(error)
  }
}